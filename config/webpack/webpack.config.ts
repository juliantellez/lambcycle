import * as path from 'path';

const ENTRY_FILE = path.resolve(__dirname, '../../src/main.ts');
const OUTPUT_DIR = path.resolve(__dirname, '../../dist');

const webpackConfig = {
    mode: 'production',
    entry: ENTRY_FILE,
    output: {
        path: OUTPUT_DIR,
        filename: '[name].js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            {
                test: /\.(ts)?$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    }
};

export default webpackConfig;
