const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const WebpackAssetsManifest = require('webpack-assets-manifest');

module.exports = merge(common, {
	mode: 'production',
	output: {
		path: path.resolve(__dirname,'dist'),
		filename: '[name].[contenthash].js',
		clean: true,
		// assetModuleFilename: '[name][ext]'
	},
	module: {
		rules: 
		[
			// ====== Images Rule =======
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/,
				type: 'asset/resource',
			}
		]
	},
	plugins: [
		new WebpackAssetsManifest({
			output: path.resolve(__dirname,'dist/asset-manifest.json'),
			transform(assets, manifest) {
				return {
					files: assets
				}
			}
		}),
		new HtmlWebpackPlugin({
			title: 'Nivas',
			favicon: './src/assets/images/logos/logo192.png',
			filename: 'index.html',
			template: './src/templates/index.html',
			chunks: ['home'],
			'meta': {
				'author': 'Devontae Reid',
				'og:title': 'Nivas',
				'twitter:title': 'Nivas',

				'og:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',
				'twitter:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',

				'description': 'Backend & Frontend Developer, Engineer, & Theologian',
				'og:description': 'Backend & Frontend Developer, Engineer, & Theologian',
				'twitter:description': 'Backend & Frontend Developer, Engineer, & Theologian',

				'twitter:card': 'summary_large_image',
				'twitter:site': '@_yodev_',

				'og:url': 'https://www.devontaereid.com',
				'og:type': 'website'
				// 'theme-color': '#4285f4'
				// Will generate: <meta name="theme-color" content="#4285f4">
			}
		}),
		new HtmlWebpackPlugin({
			title: 'Nivas | Properties',
			favicon: './src/assets/images/logos/logo192.png',
			filename: 'properties/index.html',
			template: './src/templates/index.html',
			chunks: ['properties'],
			'meta': {
				'author': 'Devontae Reid',
				'og:title': 'Nivas | Properties',
				'twitter:title': 'Nivas | Properties',

				'og:image': '../images/idea.png',
				'twitter:image': '../images/idea.png',

				'description': 'List of Devontae\'s Projects',
				'og:description': 'List of Devontae\'s Projects',
				'twitter:description': 'List of Devontae\'s Projects',

				'twitter:card': 'summary_large_image',
				'twitter:site': '@_yodev_',

				'og:url': 'https://www.devontaereid.com/projects',
				'og:type': 'website'
				// 'theme-color': '#4285f4'
				// Will generate: <meta name="theme-color" content="#4285f4">
			}
		}),
		new HtmlWebpackPlugin({
			title: 'Nivas | Contact',
			favicon: './src/assets/images/logos/logo192.png',
			filename: 'contact/index.html',
			template: './src/templates/index.html',
			chunks: ['contact'],
			'meta': {
				'author': 'Devontae Reid',
				'og:title': 'Nivas | Contact',
				'twitter:title': 'Nivas | Contact',

				'og:image': '../images/notepad.png',
				'twitter:image': '../images/notepad.png',

				'description': 'Articles & Notes from Devontae Reid',
				'og:description': 'Articles & Notes from Devontae Reid',
				'twitter:description': 'Articles & Notes from Devontae Reid',

				'twitter:card': 'summary_large_image',
				'twitter:site': '@_yodev_',

				'og:url': 'https://www.devontaereid.com/articles',
				'og:type': 'website'
				// 'theme-color': '#4285f4'
				// Will generate: <meta name="theme-color" content="#4285f4">
			}
		})
	]
})