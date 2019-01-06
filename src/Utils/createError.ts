interface IError {
    type: string;
    source?: Error;
    details?: string | string[];
}

const createError = (errorEvent: IError) => {
    return errorEvent;
};

export default createError;
