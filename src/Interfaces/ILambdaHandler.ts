import { Callback, Context } from 'aws-lambda';

type ILambdaHandler = (
    event: object,
    context: Context,
    callback?: Callback<any> | any
) => void | Promise<void>;

export default ILambdaHandler;
