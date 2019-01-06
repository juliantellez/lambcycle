import { Callback } from 'aws-lambda';

import ILambdaHandler from '../Interfaces/ILambdaHandler';
import IWrapper from '../Interfaces/IWrapper';
import isPromise from '../Utils/isPromise';

const executeHandler = async (
    lambdaHandler: ILambdaHandler,
    wrapper: IWrapper,
    handleError: Callback
) => {
    if (wrapper.error) return;

    const addResponseToWrapper = (response: any) => {
        wrapper.response = response;
    };

    const createCallbackPromise = () => {
        let handlerCallback: Callback;
        const handlerPromise = new Promise(resolve => {
            handlerCallback = (error, response) => {
                if (error) {
                    throw error;
                } else {
                    resolve(response);
                }
            };
        });

        return {
            // @ts-ignore
            handlerCallback,
            handlerPromise
        };
    };

    try {
        const {
            handlerCallback,
            handlerPromise: callbackPromise
        } = createCallbackPromise();

        const responseReference = lambdaHandler(
            wrapper.event,
            wrapper.context,
            handlerCallback
        );

        if (isPromise(responseReference)) {
            const response = await responseReference;

            return addResponseToWrapper(response);
        } else if (responseReference === void 0) {
            // Assumes a callback was used
            const response = await callbackPromise;

            return addResponseToWrapper(response);
        } else {
            // call is synchronous

            return addResponseToWrapper(responseReference);
        }
    } catch (error) {
        await handleError(error);
    }
};

export default executeHandler;
