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
            type: ErrorTypes.BODY_PARSER_MISSING_REQUEST_HEADERS
        });
    }

    let content;
    request.headers = toLowerCaseShallow(request.headers);

    try {
        content = contentType.parse(handler.event);
    } catch (e) {
        throw createError({
            type: ErrorTypes.BODY_PARSER_HEADERS_CONTENT_TYPE_INVALID,
            details: RequestHeaders.CONTENT_TYPE,
            source: e
        });
    }

    if (content.type !== ContentType.APPLICATION_JSON) {
        throw createError({
            type: ErrorTypes.BODY_PARSER_JSON_INVALID_CONTENT_TYPE,
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
