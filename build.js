
/**
 * webpack & vue builder
 * Copyright 2018/4/16 YuJinbao
 * Released under the MIT License
 * Mail timywei@vip.qq.com
 */
 
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const ora = require('ora')
const opn = require('opn')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const merge = require('webpack-merge')
const rm = require('rimraf')
const AssetsPlugin = require('assets-webpack-plugin');//编译后的文件加hash值防止缓存
const CopyWebpackPlugin = require('copy-webpack-plugin') 
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const packageConfig = require('./package.json')

// 检查依赖包
!(function(){
	let semver = require('semver')
	let shell = require('shelljs')
	let versionRequirements = [{
		name: 'node',
		currentVersion: semver.clean(process.version),
		versionRequirement: packageConfig.engines.node
	}]
	
	function exec (cmd) {
		return require('child_process').execSync(cmd).toString().trim()
	}

	if (shell.which('npm')) {
		versionRequirements.push({
			name: 'npm',
			currentVersion: exec('npm --version'),
			versionRequirement: packageConfig.engines.npm
		})
	}
	
	let warnings = []
	for (let i = 0; i < versionRequirements.length; i++) {
		let mod = versionRequirements[i]
		if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
			warnings.push(mod.name + ': ' +chalk.red(mod.currentVersion) + ' should be ' +chalk.green(mod.versionRequirement))
		}
	}

	if (warnings.length) {
		console.log('')
		console.log(chalk.yellow('要使用此模板，必须更新以下模块:'))
		console.log()
		for (let i = 0; i < warnings.length; i++) {
			let warning = warnings[i]
			console.log('  ' + warning)
		}
		console.log()
		process.exit(1)
	}
})();

// 获取命令参数
const process_envs = (()=>{
	let argvs = process.argv,len = argvs.length,action = argvs[len-2],app = argvs[len-1];
	return {action,app}
})();
const ENV_ACT = process_envs.action;
const ENV_APP = process_envs.app;
process.env.NODE_ENV = (()=>{
	let maps = {
		pro:'production',
		dll:'production',
		dev:'development'
	}
	return maps[ENV_ACT]
})();

const isPro = process.env.NODE_ENV === 'production';

// 定义目录
const DIR_ROOT        =  __dirname; // 根
const DIR_APP         =  path.resolve(DIR_ROOT, 'application',ENV_APP); // 应用
const DIR_COMPONENTS  =  path.resolve(DIR_ROOT, 'components');// 公共组件
const DIR_COMPILED    =  path.resolve(DIR_ROOT, 'compiled');// 编译
const DIR_APP_DIST    =  path.resolve(DIR_COMPILED, 'dist',ENV_APP);// 应用编译
const DIR_APP_DLL     =  path.resolve(DIR_COMPILED, 'dll',ENV_APP);// 应用dll
const DIR_ASSETS      =  path.resolve(DIR_ROOT, 'assets');// 公共静态资源目
const dllMapPath      =  path.resolve(DIR_APP_DLL, 'dll.map.json');// 应用dll模块映射

// 检查模块
if(!fs.existsSync(DIR_APP)){
	console.log(chalk.red(`模块"${ENV_APP}"不存在！`))
	process.exit();
}

// 将路径配置注入process.env
process.env.NODE_ENV_CFG_ROOT = DIR_ROOT
process.env.NODE_ENV_CFG_APP = DIR_APP
process.env.NODE_ENV_CFG_COMPONENTS = DIR_COMPONENTS
process.env.NODE_ENV_CFG_COMPILED = DIR_COMPILED
process.env.NODE_ENV_CFG_APP_DIST = DIR_APP_DIST
process.env.NODE_ENV_CFG_APP_DLL = DIR_APP_DLL
process.env.NODE_ENV_CFG_ASSETS = DIR_ASSETS

// 读取用户配置文件
const customConfigPath = path.resolve(DIR_APP, 'config.js');

if(!fs.existsSync(customConfigPath)){
	console.log(chalk.red(`模块"${ENV_APP}"的配置文件不存在！`))
	process.exit();
}


// 配置
const config = (function(){
	let custom = fs.existsSync(customConfigPath) ? require(customConfigPath) : {};
	let port = custom.devport || 8080;
	let configs = {
		// 静态文件目录
		statics : 'static',
		
		entrys:'pages',
		
		// 入口文件
		entryJs : 'main.js',
		
		entryTpl : 'index.html',
		
		jsname:'js/[name].[hash].[ext]',
	
		cssname:'css/[name].[hash].[ext]',
		
		imgname:'images/[name].[hash:7].[ext]',
		
		fontname:'fonts/[name].[hash:7].[ext]',
		
		imglimit:10000,
	
		fontlimit:10000,

		// 不编译的文件目录
		publics : '',
		
		// 是否生成SourceMap
		sourceMap : false,
		
		// 是否生成gZip文件
		gzip : false,
		
		// 生成gzip文件后缀
		gzipExt : ['js', 'css'],
		
		// 调试端口
		devport : port,
		
		// 自动打开浏览器
		autoOpenBrowser : false,
		
		// 本地API
		devBase:`http://localhost:${port}`,
		
		// 线上API
		proBase:`http://localhost:${port}`,
			
		//自动解析确定的拓展名,使导入模块时不带拓展名
		resolveExt : ['.js', '.vue', '.json', '.css', '.less', '.scss'],
		
		proxyTable: {},
		
		rules:[],
		
		copys:[],
		
		// 创建import或require的别名
		resolveAlias : { 
			'vue$'    : 'vue/dist/vue.esm.js',
			'@' : DIR_ROOT,
			'@assets'     : DIR_ASSETS,
			'@helper'     : path.resolve(DIR_ASSETS, 'helper'),
			'@components' : DIR_COMPONENTS,
			'@ext'        : path.resolve(DIR_COMPONENTS, 'ext'),
			'@ui'         : path.resolve(DIR_COMPONENTS, 'ui')
		},
		// 需要提取到dll的库
		dlls:[
			'babel-polyfill',
			'vue/dist/vue.esm.js',
			'vue-router',
			'vuex',
			'store'
		],
		// 不打包的公共库
		externals: {},
		minify: {
			removeComments: true, // 移除注释
			collapseWhitespace: true, // 移除空格
			removeAttributeQuotes: false // 移除属性的引号
		},
		spinnerFrames: [
			"( ●    )",
			"(  ●   )",
			"(   ●  )",
			"(    ● )",
			"(     ●)",
			"(    ● )",
			"(   ●  )",
			"(  ●   )",
			"( ●    )",
			"(●     )"
		],
		bundleAnalyzerReport:process.env.npm_config_report
	}
	
	function mergeArray(o1,o2){
		o2.forEach(o=>{
			if(!o1.includes(o)) o1.push(o)
		})
		return o1
	};
	let rules = mergeArray(configs.rules,custom.rules);
	let gzipExt = mergeArray(configs.gzipExt,custom.gzipExt);
	let resolveAlias = Object.assign(configs.resolveAlias,custom.resolveAlias)
	let dlls = mergeArray(configs.dlls,custom.dlls)
	let externals = Object.assign(configs.externals,custom.externals)
	configs = Object.assign(configs,custom);
	
	let _process = {
		NODE_ENV: `"${process.env.NODE_ENV}"`,
		BASE_API: configs[ENV_ACT+'Base']
	}
		
	configs = Object.assign(configs,{gzipExt,resolveAlias,dlls,externals,rules,_process});
	return configs;
})();


// 工具
const utils = (function(){

	function assetsPath(_path) {
		return path.posix.join(config.statics, _path)
	}
	
	// 样式加载
	function cssLoaders(options) {
		options = options || {}
		var cssLoader = {
			loader: 'css-loader',
			options: {
				minimize: isPro,
				sourceMap: options.sourceMap
			}
		}

		function generateLoaders (loader, loaderOptions) {
			var loaders = [cssLoader]
			if (loader) {
				loaders.push({loader: loader + '-loader',options: Object.assign({}, loaderOptions, {sourceMap: options.sourceMap})})
			}

			if (options.extract) {
				return ExtractTextPlugin.extract({use: loaders,fallback: 'vue-style-loader'})
			} else {
				return ['vue-style-loader'].concat(loaders)
			}
		}

		
		return {
			css: generateLoaders(),
			postcss: generateLoaders(),
			less: generateLoaders('less'),
			 sass: generateLoaders('sass', { indentedSyntax: true }),
			 scss: generateLoaders('sass'),
			stylus: generateLoaders('stylus'),
			styl: generateLoaders('stylus')
		}
	}

	function styleLoaders(options) {
		var output = []
		var loaders = cssLoaders(options)
		for (var extension in loaders) {
			var loader = loaders[extension]
			output.push({test: new RegExp('\\.' + extension + '$'),use: loader})
		}
		return output
	}

	// 获取入口文件
	function getEntries(globPath) {
		var entries = {}
		glob.sync(globPath).forEach(function (entry) {
			var basename = path.basename(path.dirname(entry))
			entries[basename] = entry
		});
		return entries;
	}
	
	return {assetsPath,cssLoaders,styleLoaders,getEntries}
})();




const loaderRules =  {
	vue:{
		test: /\.vue$/,
		loader: 'vue-loader',
		options: {
		loaders: utils.cssLoaders({
				sourceMap: config.sourceMap,
				extract: isPro
			})
		}
	},
	js:{
		test: /\.js$/,
		loader: 'babel-loader',
		exclude: /node_modules/
	},
	html:{
		test: /\.(html|ejs|tpl)(\?.*)?$/,
		exclude: /node_modules/,
		loader: 'ejs-loader'
	},
	css:{
		test: /\.(css|less|scss)(\?.*)?$/,
		use: ExtractTextPlugin.extract({
			fallback: "vue-style-loader",
			use: ['css-loader', 'less-loader','sass-loader']
		})
	},
	images:{
		test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
		loader: 'url-loader',
		options: {
			limit: config.imglimit,
			name: utils.assetsPath(config.imgname)
		}
	},
	fonts:{
		test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
		loader: 'url-loader',
		options: {
			limit: config.fontlimit,
			name: utils.assetsPath(config.fontname)
		}
	}
}


const baseWebpackConfig = (function(){
	let modules = utils.getEntries(`${DIR_APP}/${config.entrys}/**/${config.entryJs}`);

	return {
		entry: modules,
  
		// 排除公共库
		externals: config.externals, 
		
		// 配置webpack输出路径和命名规则
		output: { 
			// webpack输出的目标文件夹路径（例如：/dist）
			path: DIR_APP_DIST,  
			
			// webpack输出bundle文件命名格式，基于文件的md5生成Hash名称的script来防止缓存
			filename: '[name].js', 
			
			 // 编译输出的发布路径(判断是正式环境或者开发环境等)
			publicPath: config.publics
		},
		resolve: {
			//自动解析确定的拓展名,使导入模块时不带拓展名
			extensions: config.resolveExt, 
			
			// 创建import或require的别名，一些常用的，路径长的都可以用别名
			alias: config.resolveAlias 
		},
  
		// 指向生成dll的manifest.json
		plugins: [
			new webpack.DllReferencePlugin({
				context: __dirname,
				manifest: path.resolve(DIR_APP_DLL, 'dll.manifest.json')
			}),
		],
		module: {
			rules: [loaderRules.vue,loaderRules.js,loaderRules.html,loaderRules.images,loaderRules.fonts,...config.rules]
		}
	}
})();




const ACTIONS = {};


// 编译打包dll
ACTIONS.dll = () =>{
	process.noDeprecation = true;
	
	let spinner = ora({
		text:`正在构建"${ENV_APP}"模块的dll文件，请稍等...`,
		color:'magenta',
		spinner : {
			"interval": 80,
			"frames": config.spinnerFrames
		}
	}).start();
	
	let moduleConfig = merge(baseWebpackConfig, {
		module: {
			rules: utils.styleLoaders({ sourceMap: config.sourceMap })
		}
	})
	
	let module = moduleConfig.module;
	
	
	
	let dllConfig = {
		entry: {
			dll: config.dlls
		},
		output: {
			path: DIR_APP_DLL,
			filename: config.jsname.replace('[hash]','[chunkhash]').replace('[ext]','js'),
			library: '[name]_library'
		},
		plugins: [
			// dll文件模块映射
			new webpack.DllPlugin({
				path: path.join(DIR_APP_DLL, '[name].manifest.json'),
				name: '[name]_library',
				context: __dirname // 执行的上下文环境
			}),
			// 提取css
			new ExtractTextPlugin({filename: config.cssname.replace('[hash]','[contenthash]').replace('[ext]','css')}),
			// 压缩
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false
				},
				sourceMap: true
			}),
			// 生成文件映射
			new AssetsPlugin({
				path: DIR_APP_DLL,
				filename: 'dll.map.json'
			}),
			new webpack.DefinePlugin({
				'process.env': config._process
			})
		],
		module,
		
		
		devtool: config.sourceMap?'#source-map':false
	};
	
	// gzip压缩
	if (config.gzip) {
		var CompressionWebpackPlugin = require('compression-webpack-plugin');
		
		var compression = new CompressionWebpackPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp('\\.(' +config.gzipExt.join('|') +')$'),
			threshold: 10240,
			minRatio: 0.8
		})
		dllConfig.plugins.push(compression)
	}


	// 清空目录后再重新打包
	rm(DIR_APP_DLL, err => {
		if (err) throw err
		webpack(dllConfig, function (err, stats) {
			spinner.stop()
			if (err) throw err
			process.stdout.write(stats.toString({
				colors: true,
				modules: false,
				children: false,
				chunks: false,
				chunkModules: false
			}) + '\n\n')

			console.log(chalk.magenta(`>  "${ENV_APP}"模块的dll文件编译完成.\n`))
			console.log(chalk.magenta(`>  提示: 编译的文件需要手动引入到模板文件.\n`))
		})
	});
	return dllConfig
};

function getDllPath(path){
	let ret;
	if(path && path!=''){
		ret = '';
		if(config.publics && config.publics !=''){
			ret+= config.publics +'/'
		}
		if(config.statics && config.statics !=''){
			ret+= config.statics +'/'
		}
		ret+= path
	}
	return ret;
}

ACTIONS.dev = () =>{

	process.noDeprecation = true
	
	let dllMap={};
	
	if(fs.existsSync(dllMapPath)){
		dllMap = require(dllMapPath);
	}else{
		console.log(chalk.red(`> 编译错误，请先编译"${ENV_APP}"模块的dll文件 - npm run dll ${ENV_APP} \n`));
		process.exit();
	}

	// 调试端口
	var port = process.env.PORT || config.devport
	// 是否自动打开浏览器
	var autoOpenBrowser = !!config.autoOpenBrowser
	// API代理
	// https://github.com/chimurai/http-proxy-middleware
	var proxyTable = config.proxyTable
	
	
	let devConfig = (function(){
		// 添加热更新
		Object.keys(baseWebpackConfig.entry).forEach(function (name) {
			baseWebpackConfig.entry[name] = ['webpack-hot-middleware/client?noInfo=true&reload=true'].concat(baseWebpackConfig.entry[name])
		})


		let thisConfig = merge(baseWebpackConfig, {
			module: {
				rules: utils.styleLoaders({ sourceMap: config.sourceMap })
			},
			devtool: '#cheap-module-eval-source-map',
			
			plugins: [
				new webpack.DefinePlugin({
					'process.env': config._process
				}),
				new webpack.HotModuleReplacementPlugin(),
				new webpack.NoEmitOnErrorsPlugin(),
				new FriendlyErrorsPlugin()
			]
		})
		
		let modules = utils.getEntries(`${DIR_APP}/${config.entrys}/**/${config.entryTpl}`);

		for(let mod in modules) {
			// 配置生成的html文件，定义路径等
			let conf = {
				filename: mod + '.html',
				template: modules[mod], //模板路径
				inject: true,
				env:process.env.NODE_ENV,
				dll:{
					js:getDllPath(dllMap.dll.js),
					css:getDllPath(dllMap.dll.css)
				},
				// 允许跳过某些chunks
				excludeChunks: Object.keys(modules).filter(item => item != mod)
			}
			// 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
			thisConfig.plugins.push(new HtmlWebpackPlugin(conf))
		}
		return thisConfig;
	})();




	var app = express()
	var compiler = webpack(devConfig)

	var devMiddleware = require('webpack-dev-middleware')(compiler, {
		publicPath: devConfig.output.publicPath,
		quiet: true
	})

	var hotMiddleware = require('webpack-hot-middleware')(compiler, {
		log: () => {}
	})

	compiler.plugin('compilation', function (compilation) {
		compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
			hotMiddleware.publish({ action: 'reload' })
			cb()
		})
	})

	
	Object.keys(proxyTable).forEach(function (context) {
		var options = proxyTable[context]
		if (typeof options === 'string') {
			options = { target: options }
		}
		app.use(proxyMiddleware(options.filter || context, options))
	})


	app.use(require('connect-history-api-fallback')())

	app.use(devMiddleware)

	app.use(hotMiddleware)

	var staticPath = path.posix.join('/',config.statics, config.publics)
	app.use(staticPath, express.static(DIR_APP_DLL))

	var uri = 'http://localhost:' + port

	var _resolve
	var readyPromise = new Promise(resolve => {
		_resolve = resolve
	})


	var spinner = ora({
		text:`正在编译"${ENV_APP}"模块的调试环境，请稍等...`,
		color:'green',
		spinner : {
			"interval": 80,
			"frames": config.spinnerFrames
		}
	}).start();


	devMiddleware.waitUntilValid(() => {
		spinner.stop()
		console.log(chalk.green(`> "${ENV_APP}"模块的调试环境编译完成！\n`))
		console.log(chalk.yellow(`> Listening at ${uri}\n`))
		
		// 自动打开浏览器
		if (autoOpenBrowser) opn(uri)
		_resolve()
	})

	var server = app.listen(port)
	
	return {
		ready: readyPromise,
		close: () => {
			server.close()
		}
	}
};

ACTIONS.pro = () =>{
	process.noDeprecation = true;
	
	let dllMap={};
	if(fs.existsSync(dllMapPath)){
		dllMap = require(dllMapPath);
	}else{
		console.log(chalk.red(`> 编译错误，请先编译"${ENV_APP}"模块的dll文件 - npm run dll ${ENV_APP} \n`));
		process.exit();
	}
	let distDir = path.join(DIR_APP_DIST,config.statics);

		
	let proConfig = (function(){
		let thisConfig = merge(baseWebpackConfig, {
			module: {
				// 配置样式文件的处理规则，使用styleLoaders
				rules: utils.styleLoaders({
					sourceMap: config.sourceMap,
					extract: true
				})
			},
			// 开启source-map，生产环境下推荐使用cheap-source-map或source-map，后者得到的.map文件体积比较大，但是能够完全还原以前的js代码
			devtool: config.sourceMap ? '#source-map' : false,
			output: {
				path: DIR_APP_DIST, // 编译输出目录
				filename: utils.assetsPath(config.jsname.replace('[hash]','[chunkhash]').replace('[ext]','js')), // 编译输出文件名格式
				chunkFilename: utils.assetsPath(config.jsname.replace('[hash]','[chunkhash]').replace('[name]','[id]').replace('[ext]','js')) // 没有指定输出名的文件输出的文件名格式
			},
			plugins: [
				// http://vuejs.github.io/vue-loader/en/workflow/production.html
				// 位于开发环境下
				new webpack.DefinePlugin({
					'process.env': config._process
				}),
				
		
				// 压缩js代码
				new webpack.optimize.UglifyJsPlugin({
					compress: {
						warnings: false
					},
					sourceMap: true
				}),


				// 抽离css文件
				new ExtractTextPlugin({
					filename: utils.assetsPath(config.cssname.replace('[hash]','[contenthash]').replace('[ext]','css'))
				}),
	   
				new OptimizeCSSPlugin({
					cssProcessorOptions: {
						safe: true
					}
				}),

				// https://github.com/ampedandwired/html-webpack-plugin
				// 源文件，路径相对于本文件所在的位置
		
				new webpack.optimize.CommonsChunkPlugin({
					name: 'vendor',
					minChunks: function (module, count) {
						return (module.resource && /\.js$/.test(module.resource) &&module.resource.indexOf(path.join(__dirname, 'node_modules')) === 0)
					}
				}),
				// webpack 3.x 提供了一个新的功能：Scope Hoisting，又译作“作用域提升”。只需在配置文件中添加一个新的插件，就可以让 Webpack 打包出来的代码文件更小、运行的更快。只针对es6的模块化有效
				new webpack.optimize.ModuleConcatenationPlugin(),
		
		
				// 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
				new webpack.optimize.CommonsChunkPlugin({
					name: 'manifest',
					chunks: ['vendor']
				}),

				// 复制dll文件
				new CopyWebpackPlugin([
					{
						from: path.join(DIR_APP_DLL,'js', '*.*'),
						to: path.join(distDir, 'js'),
						flatten: true
					},
					{
						from: path.join(DIR_APP_DLL,'css', '*.*'),
						to: path.join(distDir, 'css'),
						flatten: true
					}
				]) 
			]
		});
	
		// gzip压缩
		if (config.gzip) {
			var CompressionWebpackPlugin = require('compression-webpack-plugin');
			var compression = new CompressionWebpackPlugin({
				asset: '[path].gz[query]',
				algorithm: 'gzip',
				test: new RegExp('\\.(' +config.gzipExt.join('|') +')$'),
				threshold: 10240,
				minRatio: 0.8
			})
			thisConfig.plugins.push(compression)
		}

		if (config.bundleAnalyzerReport) {
			var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
			thisConfig.plugins.push(new BundleAnalyzerPlugin())
		}

		var modules = utils.getEntries(`${DIR_APP}/${config.entrys}/**/${config.entryTpl}`);
		
		for(var mod in modules) {
			// 配置生成的html文件，定义路径等
			var conf = {
				filename: mod + '.html',
				template: modules[mod], //模板路径
				inject: true,
				env:process.env.NODE_ENV,
				dll:{
					js:getDllPath(dllMap.dll.js),
					css:getDllPath(dllMap.dll.css)
				},
				minify: config.minify,
				chunksSortMode: 'dependency',
				// 允许跳过某些chunks
				excludeChunks: Object.keys(modules).filter(item => item != mod)
			}
			// 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
			thisConfig.plugins.push(new HtmlWebpackPlugin(conf))
		}
		
		return thisConfig
	})();
	
	var spinner = ora({
		text:	`正在编译"${ENV_APP}"模块的生产环境，请稍等...`,
		color:'green',
		spinner : {
			"interval": 80,
			"frames": config.spinnerFrames
		}
	}).start();

	// 清空目录后再重新打包
	rm(distDir, err => {
		if (err) throw err
		webpack(proConfig, function (err, stats) {
			spinner.stop()
			if (err) throw err
			process.stdout.write(stats.toString({
				colors: true,
				modules: false,
				children: false,
				chunks: false,
				chunkModules: false
			}) + '\n\n')

			console.log(chalk.magenta(`>  "${ENV_APP}"模块的生产环境编译完成.\n`))
			console.log(chalk.magenta(`>  请访问"${DIR_APP_DIST}"查看项目.\n`))
		})
	});
}

ACTIONS[ENV_ACT]();