import { Callback } from 'aws-lambda';
import { assert } from 'chai';

import lambcycle from '../middleware';
import customError from '../Utils/customError';
import randomTimeout from '../Utils/randomTimeout';

import executeHandler from './executeHandler';

describe('ExecuteHandler', () => {
    it('should support async handlers', async () => {
        const handleError = () => null;
        const response = {
            foo: 'baz'
        };
        const lambdaHandler = async () => {
            await randomTimeout();

            return response;
        };

        const wrapper = lambcycle(lambdaHandler);

        await executeHandler(lambdaHandler, wrapper, handleError);

        const value = wrapper.response;
        const expected = response;

        assert.deepEqual(value, expected);
    });

    it('should support promise handlers', async () => {
        const handleError = () => null;
        const response = {
            foo: 'baz'
        };
        const lambdaHandler = async () => {
            return randomTimeout().then(() => response);
        };

        const wrapper = lambcycle(lambdaHandler);

        await executeHandler(lambdaHandler, wrapper, handleError);

        const value = wrapper.response;
        const expected = response;

        assert.deepEqual(value, expected);
    });

    it('should support callback handlers', async () => {
        const handleError = () => null;
        const response = {
            foo: 'gizmo'
        };
        const lambdaHandler = (event, context, callback) => {
            randomTimeout().then(() => callback(null, response));
        };

        const wrapper = lambcycle(lambdaHandler);

        await executeHandler(lambdaHandler, wrapper, handleError);

        const value = wrapper.response;
        const expected = response;

        assert.deepEqual(value, expected);
    });

    it('should support sync handlers', async () => {
        const handleError = () => null;
        const response = {
            foo: 'mood'
        };
        const lambdaHandler = () => response;

        const wrapper = lambcycle(lambdaHandler);

        await executeHandler(lambdaHandler, wrapper, handleError);

        const value = wrapper.response;
        const expected = response;

        assert.deepEqual(value, expected);
    });

    it('should handle async errors', async () => {
        const error = customError('foo');
        const handleError: Callback = err => {
            const value = err;
            const expected = error;

            assert.deepEqual(value, expected);
        };

        const lambdaHandler = async () => {
            await randomTimeout();
            throw error;
        };

        const wrapper = lambcycle(lambdaHandler);

        await executeHandler(lambdaHandler, wrapper, handleError);
    });

    it('should handle promise errors', async () => {
        const error = customError('foo');
        const handleError: Callback = err => {
            const value = err;
            const expected = error;

            assert.deepEqual(value, expected);
        };

        const lambdaHandler = () => {
            return randomTimeout().then(() => {
                throw error;
            });
        };

        const wrapper = lambcycle(lambdaHandler);

        await executeHandler(lambdaHandler, wrapper, handleError);
    });

    it('should handle callback errors', async () => {
        const error = customError('foo');
        const handleError: Callback = err => {
            const value = err;
            const expected = error;

            assert.deepEqual(value, expected);
        };

        const lambdaHandler = (_, __, callback) => {
            callback(error);
        };

        const wrapper = lambcycle(lambdaHandler);

        await executeHandler(lambdaHandler, wrapper, handleError);
    });

    it('should handle sync errors', async () => {
        const error = customError('foo');
        const handleError: Callback = err => {
            const value = err;
            const expected = error;

            assert.deepEqual(value, expected);
        };

        const lambdaHandler = () => {
            throw error;
        };

        const wrapper = lambcycle(lambdaHandler);

        await executeHandler(lambdaHandler, wrapper, handleError);
    });

    it('should handle errors asynchronously', async () => {
        let handleErrorCalled: boolean = false;
        const error = customError('foo');

        const handleError: Callback = async err => {
            await randomTimeout();
            const value = err;
            const expected = error;
            handleErrorCalled = true;
            assert.deepEqual(value, expected);
        };

        const lambdaHandler = () => {
            throw error;
        };

        const wrapper = lambcycle(lambdaHandler);

        await executeHandler(lambdaHandler, wrapper, handleError);

        assert.isTrue(handleErrorCalled);
    });
});
