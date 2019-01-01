const OBJECT = 'object';
const FUNCTION = 'function';

const isPromise = promise =>
    promise &&
    typeof promise === OBJECT &&
    typeof promise.then === FUNCTION &&
    typeof promise.catch === FUNCTION;

export default isPromise;
