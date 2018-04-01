const webpack = require('webpack');
const path = require('path');

const isdev = (process.env.NODE_ENV || 'development') === 'development';
let libFileName = "dispachito" + (isdev ? ".js" : ".min.js");

module.exports = {
    entry: './src/index.ts',
    mode: isdev ? 'development' : 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        filename: libFileName,
        path: path.resolve(__dirname, 'dist'),
        library: 'dispachito',
        libraryTarget: 'umd',
        umdNamedDefine: true
    }
};