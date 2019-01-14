enum PreHandlerLifeCycleHooks {
    ON_REQUEST = 'onRequest',
    ON_PRE_HANDLER = 'onPreHandler'
}

enum PostHandlerLifeCycleHooks {
    ON_POST_HANDLER = 'onPostHandler',
    ON_PRE_RESPONSE = 'onPreResponse'
}

enum PluginLifeCycleHooks {
    ON_REQUEST = 'onRequest',
    ON_PRE_HANDLER = 'onPreHandler',
    ON_POST_HANDLER = 'onPostHandler',
    ON_PRE_RESPONSE = 'onPreResponse',
    ON_ERROR = 'onError'
}

export {
    PluginLifeCycleHooks,
    PreHandlerLifeCycleHooks,
    PostHandlerLifeCycleHooks
};
