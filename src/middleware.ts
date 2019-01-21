import { Callback, Context } from 'aws-lambda';

import ErrorTypes from './Constants/ErrorTypes';
import {
    EventLifeCycle,
    PluginLifeCycleHooks
} from './Constants/PluginLifeCycle';
import executeHandler from './Helpers/executeHandler';
import executePlugins from './Helpers/executePlugins';
import ILambdaHandler from './Interfaces/ILambdaHandler';
import ILifeCyclePlugins from './Interfaces/ILifeCyclePlugins';
import IPluginHookFunction from './Interfaces/IPluginHookFunction';
import IPluginManifest from './Interfaces/IPluginManifest';
import IWrapper from './Interfaces/IWrapper';
import callOnce from './Utils/callOnce';
import createError from './Utils/createError';

const evenLifeCycleList = Object['values'](EventLifeCycle);
const ASSERT_ERROR = true;

const middleware = (lambdaHandler: ILambdaHandler) => {
    const plugins: ILifeCyclePlugins = {
        onRequest: [],
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
            const lambdaCallbackOnce = callOnce(lambdaCallback);

            const executeLambdaCallback = () => {
                if (wrapper.response) {
                    lambdaCallbackOnce(null, wrapper.response);
                } else {
                    const error = wrapper.hasHandledError
                        ? createError({
                              type: ErrorTypes.ERROR_HANDLER,
                              details: {
                                  description:
                                      'Error handled, but no response has been supplied',
                                  error: wrapper.error
                              }
                          })
                        : wrapper.error;

                    lambdaCallbackOnce(error);
                }
            };

            const errorHandler: Callback = callOnce(async (error: Error) => {
                wrapper.error = error;

                if (!wrapper.plugins.onError.length) return;

                await executePlugins(
                    wrapper.plugins.onError,
                    wrapper,
                    pluginError => lambdaCallbackOnce(pluginError),
                    ASSERT_ERROR
                );

                wrapper.hasHandledError = true;
            });

            for (const index in evenLifeCycleList) {
                const cycle = evenLifeCycleList[index];

                if (cycle === EventLifeCycle.ON_HANDLER) {
                    await executeHandler(lambdaHandler, wrapper, errorHandler);
                } else {
                    await executePlugins(
                        wrapper.plugins[cycle],
                        wrapper,
                        errorHandler
                    );
                }
            }

            await executePlugins(
                wrapper.plugins.onPreResponse,
                wrapper,
                errorHandler,
                ASSERT_ERROR
            );

            executeLambdaCallback();
        }
    );

    wrapper.plugins = plugins;
    wrapper.register = register;

    return wrapper;
};

export default middleware;
