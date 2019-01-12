import * as path from 'path';
import * as PeerDepsExternalsPlugin from 'peer-deps-externals-webpack-plugin';
import * as webpack from 'webpack';

const INPUT_DIR = path.resolve(__dirname, '../../src');
const OUTPUT_DIR = path.resolve(__dirname, '../../dist');

const LAMBCYCLE = path.resolve(INPUT_DIR, 'main.ts');
const PLUGINS = path.resolve(INPUT_DIR, 'Plugins');

const PLUGIN_JOI = path.resolve(PLUGINS, 'Joi/main.ts');
const PLUGIN_BODY_PARSER = path.resolve(PLUGINS, 'BodyParser/main.ts');

const addTrailing = (condition: boolean) => (fileName: string) =>
    condition ? `${fileName}.min` : fileName;

const webpackConfig = (environment): webpack.Configuration => {
    const production = environment && environment.production;
    const mode = production ? 'production' : 'development';
    const isMinified = addTrailing(production);

    return {
        mode,
        target: 'node',
        entry: {
            [isMinified('main')]: LAMBCYCLE,
            [isMinified('plugin-joi')]: PLUGIN_JOI,
            [isMinified('plugin-body-parser')]: PLUGIN_BODY_PARSER
        },
        output: {
            path: OUTPUT_DIR,
            filename: '[name].js',
            libraryTarget: 'commonjs'
        },
        devtool: 'source-map',
        resolve: {
            extensions: ['.ts', '.js']
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
        plugins: [new PeerDepsExternalsPlugin()]
    };
};

export default webpackConfig;
