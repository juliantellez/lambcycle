import { assert } from 'chai';

import HandlerWrapperMock from '../../Mocks/Middleware/WrapperHandler';

import jsonParser from './json';

let handler;

describe('Body Parser: json', () => {
    beforeEach(() => {
        handler = HandlerWrapperMock;
    });
    it('should check for content type', () => {
        assert.throws(() => jsonParser(handler));

        handler.event = {
            headers: {}
        };

        assert.throws(() => jsonParser(handler));
    });
    it('should check for valid content type headers', () => {
        handler.event = {
            headers: {
                'content-type': 'foo'
            }
        };
        assert.throws(() => jsonParser(handler));
    });
    it('should check for content-type: application json', () => {
        const keys = ['CONTENT-TYPE', 'Content-Type', 'content-type'];

        const values = [
            'APPLICATION/JSON',
            'Application/Json',
            'application/json'
        ];

        const body = {
            foo: 'baz'
        };

        keys.map((key, index) => {
            handler.event = {
                headers: {
                    [key]: values[index]
                },
                body: JSON.stringify(body)
            };

            jsonParser(handler);

            const value = handler.event.body;
            const expected = body;

            assert.deepEqual(value, expected);
        });
    });
    it('should throw if content-type is not application/json', () => {
        const body = {
            foo: 'baz'
        };

        handler.event = {
            headers: {
                'content-type': 'foo/baz'
            },
            body: JSON.stringify(body)
        };

        assert.throws(() => jsonParser(handler));
    });
    it('should throw if there is a parsing error', () => {
        handler.event = {
            headers: {
                'content-type': 'application/json'
            },
            body: {}
        };
        assert.throws(() => jsonParser(handler));

        handler.event = {
            headers: {
                'content-type': 'application/json'
            },
            body: '{]'
        };

        assert.throws(() => jsonParser(handler));
    });

    it('should throw if body is undefined', () => {
        handler.event = {
            headers: {
                'content-type': 'application/json'
            },
            body: ''
        };
        assert.throws(() => jsonParser(handler));

        handler.event = {
            headers: {
                'content-type': 'application/json'
            },
            body: void 0
        };

        assert.throws(() => jsonParser(handler));
    });
});
