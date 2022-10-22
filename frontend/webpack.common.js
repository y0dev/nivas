const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin }= require('clean-webpack-plugin');

module.exports = {
	entry: {
		home:[
			path.resolve(__dirname,'src/home.js'),
		],
		props: [
			path.resolve(__dirname,'src/properties.js'),
		],
		contact:[
			path.resolve(__dirname,'src/contact.js'),
		]
	},
	resolve: {
		modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
		alias: {
			react: path.resolve('./node_modules/react')
		}
	},
	module: {
		rules: 
		[
			// ====== HTML Rule =======
			// {
			// 	test: /\.html$/,
			// 	use: ['html-loader']
			// },
			//===== Styling Rule ======
			{
				test: /\.css/,
				use: 
				[
					'style-loader',
					'css-loader'
				]
			},
			// ===== Node Rule =======
			{
				test: /\.(ts|tsx|js|jsx)$/,
				use: 
				[
					'babel-loader'
				]
			},
			// ===== JSON Rule =====
			{ test: /\.json$/, type: 'json' },
			// ====== Images Rule =======
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/,
				type: 'asset',
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'images',
						limit: 8192,
						mimetype: "image/png",
						encoding: true,
					},
				}
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: 'Nivas',
			// favicon: './src/assets/images/logos/logo192.png',
			filename: 'index.html',
			template: './src/templates/index.html',
			chunks: ['home'],
			'meta': {
				'author': 'Devontae Reid',
				'og:title': 'Nivas',
				'twitter:title': 'Nivas',

				// 'og:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',
				// 'twitter:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',

				// 'description': 'Backend & Frontend Developer, Engineer, & Theologian',
				// 'og:description': 'Backend & Frontend Developer, Engineer, & Theologian',
				// 'twitter:description': 'Backend & Frontend Developer, Engineer, & Theologian',

				// 'twitter:card': 'summary_large_image',
				// 'twitter:site': '@_yodev_',

				'og:url': 'https://www.devontaereid.com',
				'og:type': 'website'
				// 'theme-color': '#4285f4'
				// Will generate: <meta name="theme-color" content="#4285f4">
			}
		}),
		new HtmlWebpackPlugin({
			title: 'Nivas | Properties',
			// favicon: './src/assets/images/logos/logo192.png',
			filename: 'properties/index.html',
			template: './src/templates/index.html',
			chunks: ['props'],
			'meta': {
				'author': 'Devontae Reid',
				'og:title': 'Nivas | Properties',
				'twitter:title': 'Nivas | Properties',

				// 'og:image': '../images/idea.png',
				// 'twitter:image': '../images/idea.png',

				// 'description': 'List of Devontae\'s Projects',
				// 'og:description': 'List of Devontae\'s Projects',
				// 'twitter:description': 'List of Devontae\'s Projects',

				// 'twitter:card': 'summary_large_image',
				// 'twitter:site': '@_yodev_',

				'og:url': 'https://www.devontaereid.com/projects',
				'og:type': 'website'
				// 'theme-color': '#4285f4'
				// Will generate: <meta name="theme-color" content="#4285f4">
			}
		}),
		new HtmlWebpackPlugin({
			title: 'Nivas | Contact',
			// favicon: './src/assets/images/logos/logo192.png',
			filename: 'contact/index.html',
			template: './src/templates/index.html',
			chunks: ['contact'],
			'meta': {
				'author': 'Devontae Reid',
				'og:title': 'Nivas | Contact',
				'twitter:title': 'Nivas | Contact',

				// 'og:image': '../images/notepad.png',
				// 'twitter:image': '../images/notepad.png',

				// 'description': 'Articles & Notes from Devontae Reid',
				// 'og:description': 'Articles & Notes from Devontae Reid',
				// 'twitter:description': 'Articles & Notes from Devontae Reid',

				// 'twitter:card': 'summary_large_image',
				// 'twitter:site': '@_yodev_',

				// 'og:url': 'https://www.devontaereid.com/articles',
				// 'og:type': 'website'
				// 'theme-color': '#4285f4'
				// Will generate: <meta name="theme-color" content="#4285f4">
			}
		})
	]
}