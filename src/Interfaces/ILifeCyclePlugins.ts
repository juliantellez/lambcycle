import IWrapper from './IWrapper';

type IPluginHookList = Array<(wrapper: IWrapper, options: object) => void>

interface ILifeCyclePlugins {
    onRequest: IPluginHookList;
    onAuth: IPluginHookList;
    onPreHandler: IPluginHookList;
    onPostHandler: IPluginHookList;
    onPreResponse: IPluginHookList;
    onError: IPluginHookList;
}

export default ILifeCyclePlugins;
