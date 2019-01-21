import { assert } from 'chai';
import * as Joi from 'joi';

import ILambdaHandler from '../../Interfaces/ILambdaHandler';
import lambcycle from '../../main';
import contextMock from '../../Mocks/Lambda/Context';

import ErrorTypes from './ErrorTypes';
import JoiPlugin from './main';

interface IContext {
    handler: ILambdaHandler;
}

describe('Plugin: Joi', () => {
    const context: IContext = {
        handler: () => null
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
            const value = err.type;
            const expected = ErrorTypes.REQUEST_BODY_NOT_FOUND;

            assert.equal(value, expected);
        };

        await middleware(lambdaEvent, contextMock, lambdaCallback);
    });

    it(`should throw at ${ErrorTypes.INVALID_SCHEMA}`, async () => {
        const schema = Joi.object().keys({
            foo: Joi.string().required()
        });
        schema['isJoi'] = false;

        const middleware = lambcycle(context.handler).register([
            JoiPlugin(schema)
        ]);

        const lambdaEvent = {
            body: []
        };

        const lambdaCallback = err => {
            const value = err.type;
            const expected = ErrorTypes.INVALID_SCHEMA;

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
            const value = err.type;
            const expected = ErrorTypes.VALIDATION_ERROR;

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
