import { assert } from 'chai';

import ILambdaHandler from '../../Interfaces/ILambdaHandler';
import lambcycle from '../../main';
import lambdaContextMock from '../../Mocks/Lambda/Context';

import ContentType from './Constants/ContentType';
import ErrorTypes from './Constants/ErrorTypes';
import ParsingOption from './Constants/ParsingOption';
import RequestHeaders from './Constants/RequestHeaders';
import bodyParserPlugin from './main';

describe('Plugin: bodyParser', () => {
    it('should support JSON body parser', async () => {
        const body = {
            foo: 'baz',
            gizmo: 'mood'
        };

        const handler: ILambdaHandler = event => {
            const value = event.body;
            const expected = body;

            assert.deepEqual(value, expected);

            return event.body;
        };

        const bodyParserConfig = {
            type: ParsingOption.JSON,
            options: {}
        };

        const middleware = lambcycle(handler).register([
            bodyParserPlugin(bodyParserConfig)
        ]);

        const lambdaEvent = {
            headers: {
                [RequestHeaders.CONTENT_TYPE]: ContentType.APPLICATION_JSON
            },
            body: JSON.stringify(body)
        };

        const lambdaCallback = (_, response) => {
            const value = response;
            const expected = body;

            assert.deepEqual(value, expected);
        };

        await middleware(lambdaEvent, lambdaContextMock, lambdaCallback);
    });

    it('should throw on invalid parsing types', async () => {
        const handler: ILambdaHandler = () => null;

        const bodyParserConfig = {
            type: ParsingOption.JSON,
            options: {}
        };

        // @ts-ignore
        bodyParserConfig['type'] = 'foo';

        const middleware = lambcycle(handler).register([
            bodyParserPlugin(bodyParserConfig)
        ]);

        await middleware({}, lambdaContextMock, e => {
            // @ts-ignore
            const value = e.type;
            const expected = ErrorTypes.BODY_PARSER_OPTION_TYPE_INVALID;

            assert.equal(value, expected);
        });
    });

    it('should support Raw body parser');
    it('should support Text body parser');
    it('should support URL-encoded form body parser');
});
