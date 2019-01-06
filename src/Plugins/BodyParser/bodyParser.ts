import ParsingOption from './Constants/ParsingOption';
import jsonParser from './json';

const bodyParser = {
    [ParsingOption.JSON]: jsonParser
};

export default bodyParser;
