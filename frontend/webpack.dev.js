const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');

module.exports = merge(common,{
	mode: 'development',
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname,'dev'),
		filename: '[name].js',
		clean: true,
	},
	devServer: {
		 historyApiFallback:{
			  index:'dev/index.html'
		 },
	},
	
});