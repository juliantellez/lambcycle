import { assert } from 'chai';

import toLowerCaseShallow from './toLowerCaseShallow';

describe('ToLowerCaseShallow', () => {
    it('should reduce obj to lowercase', () => {
        const obj = {
            FOO: 'BAZ',
            MOOD: 'gizmo'
        };

        const output = toLowerCaseShallow(obj);

        // @ts-ignore
        assert.exists(output.foo);
        // @ts-ignore
        assert.exists(output.mood);

        // @ts-ignore
        const value = output.foo;
        const expected = 'baz';

        assert.equal(value, expected);
    });

    it('should jump non string values', () => {
        const obj = {
            FOO: 'BAZ',
            MOOD: 'gizmo',
            GAMMA: {}
        };

        const output = toLowerCaseShallow(obj);

        // @ts-ignore
        assert.exists(output.foo);
        // @ts-ignore
        assert.exists(output.mood);

        // @ts-ignore
        const value = output.foo;
        const expected = 'baz';

        assert.equal(value, expected);
    });
});
