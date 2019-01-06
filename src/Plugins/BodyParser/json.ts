import * as contentType from 'content-type';

import IWrapper from '../../Interfaces/IWrapper';
import createError from '../../Utils/createError';

import ContentType from './Constants/ContentType';
import ErrorTypes from './Constants/ErrorTypes';
import RequestHeaders from './Constants/RequestHeaders';
import toLowerCaseShallow from './Utils/toLowerCaseShallow';

const jsonParser = (handler: IWrapper) => {
    const { event: request } = handler;

    if (!request.headers) {
        throw createError({
            type: ErrorTypes.BODY_PARSER_REQUEST_HEADERS_MISSING
        });
    }

    let content;
    request.headers = toLowerCaseShallow(request.headers);

    try {
        content = contentType.parse(handler.event);
    } catch (e) {
        throw createError({
            type:
                ErrorTypes.BODY_PARSER_REQUEST_HEADERS_CONTENT_TYPE_KEY_INVALID,
            details: RequestHeaders.CONTENT_TYPE,
            source: e
        });
    }

    if (content.type !== ContentType.APPLICATION_JSON) {
        throw createError({
            type:
                ErrorTypes.BODY_PARSER_REQUEST_HEADERS_CONTENT_TYPE_VALUE_INVALID,
            details: content.type
        });
    }

    try {
        request.body = JSON.parse(request.body);
    } catch (e) {
        throw createError({
            type: ErrorTypes.BODY_PARSER_JSON_PARSE_FAILED,
            details: e
        });
    }
};

export default jsonParser;
