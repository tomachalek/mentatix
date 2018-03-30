const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const mkpath = (p) => path.resolve(__dirname, './', p);

module.exports = {
    entry: {
        index: mkpath('ts/index.ts')
    },
    output: {
        filename: 'index.js',
        chunkFilename: 'common.js',
        path: mkpath('dist'),
        libraryTarget: 'var',
        library: '[name]Page'

    },
    resolve: {
        modules: [
            'node_modules'
        ],
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.jsx', '.js', '.json', '.css']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                  ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            emitFile: false,
                            name: '../img/[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
        ]
    },
    externals: [],
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: 'common'
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "style.css",
            chunkFilename: "style.css"
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, './html'),
                to: path.resolve(__dirname, './dist')
            }
        ])
    ]
};
