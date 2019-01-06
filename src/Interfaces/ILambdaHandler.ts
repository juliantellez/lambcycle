/**
 * ILambdaHandler:
 *  - if it returns a promise or uses an async func,
 *    the middleware will defer and evaluate its response.
 *  - if the lambda handler returns undefined,
 *    the middleware will assume that a callback was made
 *    and will wait for resolution.
 *  - any other return will be the response of the handler.
 */

import { Callback, Context } from 'aws-lambda';

type ILambdaHandler<TEvent = any> = (
    event: TEvent,
    context: Context,
    callback?: Callback<any> | any
) => any;

export default ILambdaHandler;
