import { Callback } from 'aws-lambda';

import ILambdaHandler from '../Interfaces/ILambdaHandler';
import IWrapper from '../Interfaces/IWrapper';
import isAsync from '../Utils/isAsync';
import isPromise from '../Utils/isPromise';

const executeHandler = async (
    lambdaHandler: ILambdaHandler,
    wrapper: IWrapper,
    handleError: Callback
) => {
    const addResponseToWrapper = (response: any) => {
        wrapper.response = response;
    };

    const tryHandler = async () => {
        try {
            const response = await lambdaHandler(
                wrapper.event,
                wrapper.context
            );

            addResponseToWrapper(response);
        } catch (error) {
            handleError(error);
        }
    };

    const handlerCallback: Callback = (error, response) =>
        error ? handleError(error) : addResponseToWrapper(response);

    if (isAsync(lambdaHandler)) {
        await tryHandler();
    } else {
        const handlerRef = lambdaHandler(
            wrapper.event,
            wrapper.context,
            handlerCallback
        );
        if (isPromise(handlerRef)) {
            await tryHandler();
        }
    }
};

export default executeHandler;
