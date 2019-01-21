enum EventLifeCycle {
    ON_REQUEST = 'onRequest',
    ON_PRE_HANDLER = 'onPreHandler',
    ON_HANDLER = 'onHandler',
    ON_POST_HANDLER = 'onPostHandler'
}

enum PluginLifeCycleHooks {
    ON_REQUEST = 'onRequest',
    ON_PRE_HANDLER = 'onPreHandler',
    ON_POST_HANDLER = 'onPostHandler',
    ON_PRE_RESPONSE = 'onPreResponse',
    ON_ERROR = 'onError'
}

export { EventLifeCycle, PluginLifeCycleHooks };
