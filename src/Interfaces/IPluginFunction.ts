import IWrapper from './IWrapper';

type IPluginFunction = (wrapper: IWrapper, options?: object) => void;

export default IPluginFunction;
