import * as bodyParser from 'body-parser';

import ParsingOption from '../Constants/ParsingOption';

interface IPluginConfig {
    type: ParsingOption;
    options: bodyParser.OptionsJson &
        bodyParser.OptionsText &
        bodyParser.OptionsUrlencoded;
}

export default IPluginConfig;
