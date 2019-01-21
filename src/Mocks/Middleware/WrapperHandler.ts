import IWrapper from '../../Interfaces/IWrapper';
import context from '../Lambda/Context';

const HandlerWrapper: IWrapper = () => {
    //
};
HandlerWrapper.context = context;
HandlerWrapper.event = {};
HandlerWrapper.callback = () => null;
HandlerWrapper.plugins = {
    onRequest: [],
    onPreHandler: [],
    onPostHandler: [],
    onPreResponse: [],
    onError: []
};
HandlerWrapper.register = () => HandlerWrapper;
HandlerWrapper.error = void 0;
HandlerWrapper.hasHandledError = void 0;
HandlerWrapper.response = void 0;

export default HandlerWrapper;
