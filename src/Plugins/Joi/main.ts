import * as Joi from 'joi';

import IPluginManifest from '../../Interfaces/IPluginManifest';
import createError from '../../Utils/createError';

import ErrorTypes from './ErrorTypes';

const joiPlugin = (schema: Joi.Schema) => {
    const pluginManifest: IPluginManifest = {
        plugin: {
            onRequest: handler => {
                const { body } = handler.event;
                if (!body) {
                    throw createError({
                        type: ErrorTypes.REQUEST_BODY_NOT_FOUND
                    });
                }
                if (!schema.isJoi) {
                    throw createError({
                        type: ErrorTypes.INVALID_SCHEMA
                    });
                }
                const { error } = Joi.validate(body, schema);

                if (error) {
                    throw createError({
                        type: ErrorTypes.VALIDATION_ERROR,
                        source: error,
                    });
                }
            }
        }
    };

    return pluginManifest;
};

export default joiPlugin;
