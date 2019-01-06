import { Callback, Context } from 'aws-lambda';

import ILifeCyclePlugins from './ILifeCyclePlugins';
import IPluginManifest from './IPluginManifest';

interface IWrapper {
    <TEvent = any>(
        lambdaEvent: TEvent,
        lambdaContext: Context,
        lambdaCallback: Callback
    ): any;
    context: Context;
    callback: Callback;
    plugins: ILifeCyclePlugins;
    event: any;
    error: any;
    response: any;
    register(plugins: IPluginManifest[]): IWrapper;
}

export default IWrapper;
