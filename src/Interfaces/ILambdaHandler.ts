import { Callback, Context } from 'aws-lambda';

type ILambdaHandler = (event: object, context: Context, cb?: Callback) => void;

export default ILambdaHandler;
