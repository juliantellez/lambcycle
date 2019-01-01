import { Callback, Context } from 'aws-lambda';

import ILifeCyclePlugins from './ILifeCyclePlugins';

interface IWrapper {
    (
        lambdaEvent: object,
        lambdaContext: Context,
        lambdaCallback: Callback
    ): any;
    context: Context;
    callback: Callback;
    plugins: ILifeCyclePlugins;
    register: any;
    event: any;
    error: any;
    response: any;
}

export default IWrapper;
