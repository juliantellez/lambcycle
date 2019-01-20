interface IError {
    type: string;
    source?: Error;
    details?: any;
}

const createError = (errorEvent: IError) => {
    return errorEvent;
};

export default createError;
