import IPluginManifest from '../../Interfaces/IPluginManifest';
import createError from '../../Utils/createError';

import bodyParser from './bodyParser';
import ErrorTypes from './Constants/ErrorTypes';
import ParsingOption from './Constants/ParsingOption';
import IPluginConfig from './Interfaces/IPluginConfig';

const validate = (config: IPluginConfig) => {
    if (!Object['values'](ParsingOption).includes(config.type)) {
        return createError({
            type: ErrorTypes.BODY_PARSER_OPTION_FORBIDDEN,
            details: 'one of json|raw|text|urlencoded'
        });
    }
};

const bodyParserPlugin = (config: IPluginConfig) => {
    const pluginManifest: IPluginManifest = {
        plugin: {
            onRequest: handler => {
                const error = validate(config);
                if (error) {
                    throw error;
                }

                const parser: any = bodyParser[config.type];
                parser(handler);
            }
        }
    };

    return pluginManifest;
};

export default bodyParserPlugin;
