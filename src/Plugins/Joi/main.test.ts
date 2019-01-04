import * as Joi from 'joi';
import { assert } from 'chai';

import JoiPlugin from './main';
import lambcycle from '../../main';
import ILambdaHandler from '../../Interfaces/ILambdaHandler';
import IWrapper from '../../Interfaces/IWrapper';
import contextMock from '../../Mocks/Lambda/Context';
import ErrorTypes from './ErrorTypes';

interface IContext {
    handler: ILambdaHandler;
}

describe.only('Plugin: Joi', () => {
    const context: IContext = {
        handler: event => null
    };

    it('should validate request from schema', async () => {
        const schema = Joi.object().keys({
            foo: Joi.string().required()
        });

        const middleware = lambcycle(context.handler).register([
            JoiPlugin(schema)
        ]);

        const lambdaEvent = {
            body: {
                foo: 'baz'
            }
        };

        const lambdaCallback = err => {
            assert.isNull(err);
            assert.isNull(middleware.error);
        };

        await middleware(lambdaEvent, contextMock, lambdaCallback);
    });

    it(`should throw at ${ErrorTypes.REQUEST_BODY_NOT_FOUND}`, async () => {
        const schema = Joi.object().keys({
            foo: Joi.string().required()
        });

        const middleware = lambcycle(context.handler).register([
            JoiPlugin(schema)
        ]);

        const lambdaEvent = {};

        const lambdaCallback = err => {
            const value = err.type
            const expected = ErrorTypes.REQUEST_BODY_NOT_FOUND
            
            assert.equal(value, expected);
        };

        await middleware(lambdaEvent, contextMock, lambdaCallback);
    });

    it(`should throw at ${ErrorTypes.VALIDATION_ERROR}`, async () => {
        const schema = Joi.object().keys({
            foo: Joi.string().required()
        });

        const middleware = lambcycle(context.handler).register([
            JoiPlugin(schema)
        ]);

        const lambdaEvent = {
            body: []
        };

        const lambdaCallback = err => {
            const value = err.type
            const expected = ErrorTypes.VALIDATION_ERROR

            assert.equal(value, expected);
        };

        await middleware(lambdaEvent, contextMock, lambdaCallback);
    });

    it('should support body of type string', async () => {
        const schema = Joi.string();

        const middleware = lambcycle(context.handler).register([
            JoiPlugin(schema)
        ]);

        const lambdaEvent = {
            body: '[],foo,{}'
        };

        const lambdaCallback = err => {
            assert.isNull(err);
            assert.isNull(middleware.error);
        };

        await middleware(lambdaEvent, contextMock, lambdaCallback);
    });

    it('should support body of type array', async () => {
        const schema = Joi.array();

        const middleware = lambcycle(context.handler).register([
            JoiPlugin(schema)
        ]);

        const lambdaEvent = {
            body: []
        };

        const lambdaCallback = err => {
            assert.isNull(err);
            assert.isNull(middleware.error);
        };

        await middleware(lambdaEvent, contextMock, lambdaCallback);
    });
});
