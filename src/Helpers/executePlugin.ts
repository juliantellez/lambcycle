import { Callback } from 'aws-lambda';

import IWrapper from '../Interfaces/IWrapper';

const executePlugin = async (
    plugin: (wrapper: IWrapper, cb: Callback) => void,
    wrapper: IWrapper,
    handleError: Callback
) => {
    try {
        await plugin(wrapper, handleError);
    } catch (err) {
        handleError(err);
    }
};

export default executePlugin;
