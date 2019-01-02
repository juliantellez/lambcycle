import IPluginHookFunction from './IPluginHookFunction';

interface IPlugin {
    onRequest?: IPluginHookFunction;
    onAuth?: IPluginHookFunction;
    onPreHandler?: IPluginHookFunction;
    onPostHandler?: IPluginHookFunction;
    onPreResponse?: IPluginHookFunction;
    onError?: IPluginHookFunction;
}

export default IPlugin;
