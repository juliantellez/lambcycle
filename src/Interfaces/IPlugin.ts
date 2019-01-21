import IPluginHookFunction from './IPluginHookFunction';

interface IPlugin {
    onRequest?: IPluginHookFunction;
    onPreHandler?: IPluginHookFunction;
    onPostHandler?: IPluginHookFunction;
    onPreResponse?: IPluginHookFunction;
    onError?: IPluginHookFunction;
}

export default IPlugin;
