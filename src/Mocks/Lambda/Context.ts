import { Context } from 'aws-lambda';

const context: Context = {
    callbackWaitsForEmptyEventLoop: true,
    functionName: '',
    functionVersion: '',
    invokedFunctionArn: '',
    memoryLimitInMB: Math.random(),
    awsRequestId: '',
    logGroupName: '',
    logStreamName: '',
    getRemainingTimeInMillis: () => Math.random(),
    done: () => void 0,
    fail: () => void 0,
    succeed: () => void 0
};

export default context;
