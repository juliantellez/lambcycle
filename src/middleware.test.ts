import { Callback } from 'aws-lambda';
import { assert } from 'chai';

import ILambdaHandler from './Interfaces/ILambdaHandler';
import IWrapper from './Interfaces/IWrapper';
import lambcycle from './main';
import contextMock from './Mocks/Lambda/Context';
import customError from './Utils/customError';
import randomTimeout from './Utils/randomTimeout';

describe('middleware', () => {
    describe('wrapper', () => {
        it('should create a handler wrapper', () => {
            const funcHandler = () => void 0;

            const wrapper = lambcycle(funcHandler);
            assert.isFunction(wrapper);

            assert.property(wrapper, 'plugins');
            assert.property(wrapper, 'register');
        });

        it('should be able to register plugin functions', () => {
            const funcHandler = () => void 0;

            const wrapper = lambcycle(funcHandler).register([
                {
                    plugin: {
                        onRequest: () => null
                    }
                }
            ]);

            const value = wrapper.plugins.onRequest;
            const expected = 1;

            assert.lengthOf(value, expected);
        });

        it('should be able to pass configuration to plugins declaratively', () => {
            const funcHandler = () => void 0;

            const pluginManifest = {
                plugin: {
                    onAuth: (_, config: object) => config
                },
                config: {
                    string: 'foo',
                    number: 1,
                    func: () => null
                }
            };

            const wrapper = lambcycle(funcHandler).register([pluginManifest]);

            assert.lengthOf(wrapper.plugins.onAuth, 1);

            const value = pluginManifest.config;
            const expected: any = wrapper.plugins.onAuth[0](wrapper, {});

            assert.deepEqual(value, expected);
        });

        it('should execute plugins synchronously', async () => {
            const wrapperHook: string[] = [];

            const pluginManifest = {
                plugin: {
                    onRequest: () => {
                        wrapperHook.push('onRequest');
                    },
                    onAuth: () => {
                        wrapperHook.push('onAuth');
                    },
                    onPreHandler: () => {
                        wrapperHook.push('onPreHandler');
                    },
                    onPostHandler: () => {
                        wrapperHook.push('onPostHandler');
                    },
                    onPreResponse: () => {
                        wrapperHook.push('onPreResponse');
                    }
                }
            };

            const funcHandler = () => null;
            const wrapper = lambcycle(funcHandler).register([pluginManifest]);

            await wrapper({}, contextMock, () => {
                const value = wrapperHook;
                const expected = [
                    'onRequest',
                    'onAuth',
                    'onPreHandler',
                    'onPostHandler',
                    'onPreResponse'
                ];

                assert.deepEqual(value, expected);
            });
        });

        it('should execute plugins asynchronously', async () => {
            const wrapperHook: string[] = [];

            const pluginManifest = {
                plugin: {
                    onRequest: async () => {
                        await randomTimeout(5);
                        wrapperHook.push('onRequest');
                    },
                    onAuth: async () => {
                        await randomTimeout(5);
                        wrapperHook.push('onAuth');
                    },
                    onPreHandler: () => {
                        return randomTimeout(5)
                            .then(() => randomTimeout(5))
                            .then(() => {
                                wrapperHook.push('onPreHandler');

                                return randomTimeout(2);
                            });
                    },
                    onPostHandler: async () => {
                        await randomTimeout(2);
                        wrapperHook.push('onPostHandler');
                    },
                    onPreResponse: async () => {
                        await randomTimeout(3);
                        wrapperHook.push('onPreResponse');
                    }
                }
            };

            const funcHandler = () => null;
            const wrapper = lambcycle(funcHandler).register([pluginManifest]);

            await wrapper({}, contextMock, () => {
                const value = wrapperHook;
                const expected = [
                    'onRequest',
                    'onAuth',
                    'onPreHandler',
                    'onPostHandler',
                    'onPreResponse'
                ];

                assert.deepEqual(value, expected);
            });
        });

        it('should allow a mix of sync and async plugins', async () => {
            const wrapperHook: string[] = [];

            const pluginManifest = {
                plugin: {
                    onRequest: () => {
                        wrapperHook.push('onRequest');
                    },
                    onAuth: async () => {
                        await randomTimeout();
                        wrapperHook.push('onAuth');
                    },
                    onPreHandler: () => {
                        return randomTimeout()
                            .then(() => randomTimeout())
                            .then(() => {
                                wrapperHook.push('onPreHandler');

                                return randomTimeout();
                            });
                    },
                    onPostHandler: async () => {
                        await randomTimeout();
                        wrapperHook.push('onPostHandler');
                    },
                    onPreResponse: () => {
                        wrapperHook.push('onPreResponse');

                        return randomTimeout(15);
                    }
                }
            };

            const funcHandler = () => null;
            const wrapper = lambcycle(funcHandler).register([pluginManifest]);

            await wrapper({}, contextMock, () => {
                const value = wrapperHook;
                const expected = [
                    'onRequest',
                    'onAuth',
                    'onPreHandler',
                    'onPostHandler',
                    'onPreResponse'
                ];

                assert.deepEqual(value, expected);
            });
        });

        it('should allow plugins to invoke the error handler', async () => {
            const pluginError = new Error('foo');

            const pluginManifest = {
                plugin: {
                    onRequest: (_, __, handleError: Callback) => {
                        handleError(pluginError);
                    }
                }
            };

            const funcHandler = () => null;
            const wrapper = lambcycle(funcHandler).register([pluginManifest]);

            await wrapper({}, contextMock, error => {
                const value = error;
                const expected = pluginError;
                assert.deepEqual(value, expected);
            });
        });

        it('should pass errors to error plugins', async () => {
            const errorValue = [customError('foo'), customError('baz')];

            const errorExpected: Error[] = [];

            const pluginManifest = {
                plugin: {
                    onPreHandler: () => {
                        return randomTimeout(10)
                            .then(() => randomTimeout(10))
                            .then(() => {
                                throw errorValue[0];
                            });
                    },
                    onPostHandler: async () => {
                        await randomTimeout(20);
                        throw errorValue[1];
                    },
                    onError: async (innerWrapper: IWrapper) => {
                        await randomTimeout();
                        errorExpected.push(innerWrapper.error);
                    }
                }
            };

            const funcHandler = () => null;
            const wrapper = lambcycle(funcHandler).register([pluginManifest]);

            await wrapper({}, contextMock, () => {
                const value = errorValue;
                const expected = errorExpected;

                assert.deepEqual(value, expected);
                assert.deepEqual(errorValue, errorExpected);
            });
        });

        it('should accept a callback type lambdaHandler', async () => {
            const handlerResponse = {
                foo: 'baz'
            };
            const funcHandler: ILambdaHandler = (_, __, callback) => {
                callback(null, handlerResponse);
            };

            const wrapper = lambcycle(funcHandler);

            await wrapper({}, contextMock, (_, response) => {
                const value = response;
                const expected = handlerResponse;

                assert.deepEqual(value, expected);
            });
        });

        it('should accept a async type lambdaHandler', async () => {
            const handlerResponse = {
                foo: 'baz'
            };
            const funcHandler = async () => {
                return await randomTimeout().then(() => handlerResponse);
            };

            const wrapper = lambcycle(funcHandler);

            await wrapper({}, contextMock, (_, response) => {
                const value = response;
                const expected = handlerResponse;

                assert.deepEqual(value, expected);
            });
        });

        it('should accept a promise type lambdaHandler', async () => {
            const handlerResponse = {
                foo: 'baz'
            };
            const funcHandler = () => {
                return randomTimeout().then(() => handlerResponse);
            };

            const wrapper = lambcycle(funcHandler);

            await wrapper({}, contextMock, (_, response) => {
                const value = response;
                const expected = handlerResponse;

                assert.deepEqual(value, expected);
            });
        });

        it('should accept a sync type lambdaHandler', async () => {
            const handlerResponse = {
                foo: 'baz'
            };

            const funcHandler = () => handlerResponse;

            const wrapper = lambcycle(funcHandler);

            await wrapper({}, contextMock, (_, response) => {
                const value = response;
                const expected = handlerResponse;

                assert.deepEqual(value, expected);
            });
        });

        it('should catch async errors in handler', async () => {
            const handlerError = customError('foo');
            const funcHandler = async () => {
                return await randomTimeout().then(() => {
                    throw handlerError;
                });
            };

            const wrapper = lambcycle(funcHandler);

            await wrapper({}, contextMock, error => {
                const value = error;
                const expected = handlerError;

                assert.deepEqual(value, expected);
            });
        });

        it('should catch promise errors in handler', async () => {
            const handlerError = customError('foo');
            const funcHandler = () => {
                return randomTimeout(100).then(() => {
                    throw handlerError;
                });
            };

            const wrapper = lambcycle(funcHandler);

            await wrapper({}, contextMock, error => {
                const value = error;
                const expected = handlerError;

                assert.deepEqual(value, expected);
            });
        });

        it('should catch callback errors in handler', async () => {
            const handlerError = customError('foo');
            const funcHandler = (_, __, callback) => {
                callback(handlerError);
            };

            const wrapper = lambcycle(funcHandler);

            await wrapper({}, contextMock, error => {
                const value = error;
                const expected = handlerError;

                assert.deepEqual(value, expected);
            });
        });

        it('should catch sync errors in handler', async () => {
            const handlerError = customError('foo');
            const funcHandler = () => {
                throw handlerError;
            };

            const wrapper = lambcycle(funcHandler);

            await wrapper({}, contextMock, error => {
                const value = error;
                const expected = handlerError;

                assert.deepEqual(value, expected);
            });
        });

        it('should handle handler errors asynchronously', async () => {
            const handlerError = customError('foo');

            const errorHandlers: string[] = [];
            const reporter = {
                plugin: {
                    onError: async () => {
                        await randomTimeout();
                        errorHandlers.push('reporter');
                    }
                }
            };

            const logger = {
                plugin: {
                    onError: async () => {
                        await randomTimeout();
                        errorHandlers.push('logger');
                    }
                }
            };

            const funcHandler = () => {
                throw handlerError;
            };
            const wrapper = lambcycle(funcHandler).register([reporter, logger]);

            await wrapper({}, contextMock, () => {
                const value = errorHandlers;
                const expected = ['reporter', 'logger'];

                assert.deepEqual(value, expected);
            });
        });
    });

    describe('register', () => {
        it('should throw if no plugin is supplied', () => {
            const funcHandler = () => null;

            assert.throws(() => lambcycle(funcHandler).register([]));
        });
        it('should throw if plugin hook does not exist', () => {
            const funcHandler = () => null;

            const logger = {
                plugin: {}
            };

            assert.throws(() => lambcycle(funcHandler).register([logger]));
        });
        it('should throw if plugin hook name is invalid', () => {
            const funcHandler = () => null;

            const logger = {
                plugin: {}
            };

            logger.plugin['foo'] = () => null;

            assert.throws(() => lambcycle(funcHandler).register([logger]));
        });
    });
});
