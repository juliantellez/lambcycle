import * as path from 'path';
import * as PeerDepsExternalsPlugin from 'peer-deps-externals-webpack-plugin';

const INPUT_DIR = path.resolve(__dirname, '../../src');
const OUTPUT_DIR = path.resolve(__dirname, '../../dist');

const LAMBCYCLE = path.resolve(INPUT_DIR, 'main.ts');
const PLUGIN_JOI = path.resolve(INPUT_DIR, 'Plugins/Joi/main.ts');

const webpackConfig = {
    target: 'node',
    mode: 'production',
    entry: {
        main: LAMBCYCLE,
        joiPlugin: PLUGIN_JOI,
    },
    output: {
        path: OUTPUT_DIR,
        filename: '[name].js',
        libraryTarget: 'umd'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    },
    plugins: [
        new PeerDepsExternalsPlugin(),
    ]
};

export default webpackConfig;
