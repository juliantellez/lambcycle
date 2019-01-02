import { Callback } from 'aws-lambda';

import IWrapper from './IWrapper';

type IPluginHookFunction = (
    wrapper: IWrapper,
    options: object,
    handleError?: Callback
) => void;

export default IPluginHookFunction;
