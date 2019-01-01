import IPluginFunction from './IPluginFunction';

interface IPlugin {
    onRequest?: IPluginFunction;
    onAuth?: IPluginFunction;
    onPreHandler?: IPluginFunction;
    onPostHandler?: IPluginFunction;
    onPreResponse?: IPluginFunction;
    onError?: IPluginFunction;
}

export default IPlugin;
