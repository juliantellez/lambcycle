import IPlugin from './IPlugin';

interface IPluginManifest {
    plugin: IPlugin;
    config?: object;
}

export default IPluginManifest;
