import { assert } from 'chai';

import callOnce from './callOnce';

describe('callOnce', () => {
    it('should call the supplied function once', () => {
        let counter = 0;
        const fn = () => (counter += 1);

        const wrappedFunction = callOnce(fn);

        wrappedFunction();
        wrappedFunction();

        const value = counter;
        const expected = 1;

        assert.equal(value, expected);
    });

    it('should pass arguments from wrapper', () => {
        let addition = 0;
        const add = (arg1: number, arg2: number) => {
            addition = arg1 + arg2;
        };

        const wrappedFunction = callOnce(add);

        wrappedFunction(10, 20);
        wrappedFunction(100, 200);

        const value = addition;
        const expected = 30;

        assert.equal(value, expected);
    });
});
