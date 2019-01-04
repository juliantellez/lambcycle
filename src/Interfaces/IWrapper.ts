import { Callback, Context } from 'aws-lambda';

import ILifeCyclePlugins from './ILifeCyclePlugins';
import IPluginManifest from './IPluginManifest';

interface IWrapper {
    (
        lambdaEvent: object,
        lambdaContext: Context,
        lambdaCallback: Callback
    ): any;
    context: Context;
    callback: Callback;
    plugins: ILifeCyclePlugins;
    register(plugins: IPluginManifest[]): IWrapper;
    event: any;
    error: any;
    response: any;
}

export default IWrapper;
