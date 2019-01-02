import { Callback } from 'aws-lambda';

import IWrapper from '../Interfaces/IWrapper';

import executePlugin from './executePlugin';

const executePlugins = async (
    lifeCyclePlugins: any[],
    wrapper: IWrapper,
    handleError: Callback
) => {
    for (const index in lifeCyclePlugins) {
        await executePlugin(lifeCyclePlugins[index], wrapper, handleError);
    }
};

export default executePlugins;
