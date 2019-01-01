const FUNCTION = 'function';
const ASYNC_FUNCTION = 'AsyncFunction';

const isAsync = (asyncFunc: (...args: any[]) => any) =>
    asyncFunc &&
    typeof asyncFunc === FUNCTION &&
    asyncFunc[Symbol.toStringTag] === ASYNC_FUNCTION;

export default isAsync;
