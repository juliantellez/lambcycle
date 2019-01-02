import IWrapper from './IWrapper';
import { Callback } from 'aws-lambda';

type IPluginHookFunction = (
    wrapper: IWrapper,
    options: object,
    handleError?: Callback
) => void;

export default IPluginHookFunction;
