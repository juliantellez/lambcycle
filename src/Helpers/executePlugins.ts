import { Callback } from 'aws-lambda';

import PluginType from '../Constants/PluginType';
import IWrapper from '../Interfaces/IWrapper';

import executePlugin from './executePlugin';

const executePlugins = async (
    lifeCyclePlugins: any[],
    wrapper: IWrapper,
    handleError: Callback,
    pluginType?: string
) => {
    for (const index in lifeCyclePlugins) {
        if (pluginType !== PluginType.ERROR && wrapper.error) return;

        await executePlugin(lifeCyclePlugins[index], wrapper, handleError);
    }
};

export default executePlugins;
