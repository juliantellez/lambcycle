import { Callback, Context } from 'aws-lambda';

import ErrorTypes from './Constants/ErrorTypes';
import {
    PluginLifeCycleHooks,
    PostHandlerLifeCycleHooks,
    PreHandlerLifeCycleHooks
} from './Constants/PluginLifeCycle';
import PluginType from './Constants/PluginType';
import executeHandler from './Helpers/executeHandler';
import executePlugins from './Helpers/executePlugins';
import ILambdaHandler from './Interfaces/ILambdaHandler';
import ILifeCyclePlugins from './Interfaces/ILifeCyclePlugins';
import IPluginHookFunction from './Interfaces/IPluginHookFunction';
import IPluginManifest from './Interfaces/IPluginManifest';
import IWrapper from './Interfaces/IWrapper';
import callOnce from './Utils/callOnce';
import createError from './Utils/createError';

const preHandlerHookList = Object['values'](PreHandlerLifeCycleHooks);
const postHandlerHookList = Object['values'](PostHandlerLifeCycleHooks);

const middleware = (lambdaHandler: ILambdaHandler) => {
    const plugins: ILifeCyclePlugins = {
        onRequest: [],
        onAuth: [],
        onPreHandler: [],
        onPostHandler: [],
        onPreResponse: [],
        onError: []
    };

    const register = (pluginsManifest?: IPluginManifest[]): IWrapper => {
        if (!pluginsManifest || !pluginsManifest.length) {
            throw createError({
                type: ErrorTypes.REGISTER_NO_PLUGINS_PRESENT
            });
        }

        pluginsManifest.forEach(pluginManifest => {
            const plugin = Object.keys(pluginManifest.plugin);

            if (!plugin || !plugin.length) {
                throw createError({
                    type: ErrorTypes.REGISTER_PLUGIN_DOES_NOT_HAVE_HOOKS
                });
            }

            Object.keys(pluginManifest.plugin).forEach(key => {
                if (Object['values'](PluginLifeCycleHooks).includes(key)) {
                    const currentPlugin = pluginManifest.plugin[key];
                    const { config: pluginConfig } = pluginManifest;

                    // bind workaround
                    const passConfigToPlugin = (
                        innerPlugin: IPluginHookFunction
                    ) => (config = {}) => (
                        innerWrapper: IWrapper,
                        handleError: Callback
                    ) => innerPlugin(innerWrapper, config, handleError);

                    const lifeCycleMethod = passConfigToPlugin(currentPlugin)(
                        pluginConfig
                    );

                    plugins[key].push(lifeCycleMethod);
                } else {
                    throw createError({
                        type: ErrorTypes.REGISTER_PLUGIN_HOOK_IS_INVALID,
                        details: [
                            `${key} is not a valid hook`,
                            'see PluginLifeCycleHooks'
                        ]
                    });
                }
            });
        });

        return wrapper;
    };

    const wrapper = <IWrapper>(
        async function(
            lambdaEvent: object,
            lambdaContext: Context,
            lambdaCallback: Callback
        ): Promise<void> {
            wrapper.event = lambdaEvent;
            wrapper.context = lambdaContext;
            wrapper.error = null;
            wrapper.response = null;

            const executeLambdaCallback = callOnce(() =>
                lambdaCallback(wrapper.error, wrapper.response)
            );

            const errorHandler: Callback = callOnce(async (error: Error) => {
                wrapper.error = error;

                await executePlugins(
                    wrapper.plugins.onError,
                    wrapper,
                    lambdaCallback,
                    PluginType.ERROR
                );

                return executeLambdaCallback();
            });

            for (const index in preHandlerHookList) {
                await executePlugins(
                    wrapper.plugins[preHandlerHookList[index]],
                    wrapper,
                    errorHandler
                );
            }

            await executeHandler(lambdaHandler, wrapper, errorHandler);

            for (const index in postHandlerHookList) {
                await executePlugins(
                    wrapper.plugins[postHandlerHookList[index]],
                    wrapper,
                    errorHandler
                );
            }

            return executeLambdaCallback();
        }
    );

    wrapper.plugins = plugins;
    wrapper.register = register;

    return wrapper;
};

export default middleware;
