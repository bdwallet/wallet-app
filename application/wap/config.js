const isPro = process.env.NODE_ENV === 'production';
function resolve(path){
	return require('path').resolve(__dirname, `./${path}`)
}
module.exports = {
	// 静态文件目录
	statics : 'static',
	
	entrys:'page',
	
	// 入口文件
	entryJs : 'main.js',
	
	entryTpl : 'index.html',

	// 静态文件相对路径
	publics : '', //isPro ? '/' : '',

	// 调试端口
	devport : 8082,
	
	// 自动打开浏览器
	autoOpenBrowser : false,
	
	// 本地API
	devBase:'"/api"',
	
	// 线上API
	proBase:'"/"',
		
	//自动解析确定的拓展名,使导入模块时不带拓展名
	resolveExt : ['.js', '.vue', '.json', '.css', '.less'],
	
	proxyTable: {},
	
	rules:[],
	
	copys:[],
	
	// 创建import或require的别名
	resolveAlias : { 
	  	'~'    : resolve(''),
		'~components' : resolve('components'),
		'~appcomps' : resolve('appcomps'),
		'~script' : resolve('script'),
		'~layout' : resolve('layout'),
	  	'~assets' : resolve('assets'),
	  	'~css' : resolve('assets/css'),
		'~script' : resolve('script'),
		'~json' : resolve('json'),
	},
	// 需要提取到dll的库
	dlls:[
		'url-search-params-polyfill',
	],
	
	// 不打包的公共库
	externals: {},
	
	// 图片大于配置则不生成base64
	imglimit:10000,
	
	// 字体大于配置则不生成base64
	fontlimit:10000,
	
	// 是否生成SourceMap
	sourceMap : false,
	
	// 是否生成gZip文件
	gzip : false,
	
	// 需要生成gzip压缩文件后缀
	gzipExt : ['js', 'css'],
	
	// // 生成js文件规则
	// jsname:'js/[name].[hash].[ext]',
	
	// // 生成css文件规则
	// cssname:'css/[name].[hash].[ext]',
	
	// 生成js文件规则
	jsname:'js/[name].[ext]?nocache=[hash]',
	
	// 生成css文件规则
	cssname:'css/[name].[ext]?nocache=[hash]',
	
	// 生成images文件规则
	imgname:'images/[name].[hash:7].[ext]',
	
	// 生成fonts文件规则
	fontname:'fonts/[name].[hash:7].[ext]',

	minify: {
		removeComments: true, // 移除注释
		collapseWhitespace: false, // 移除空格
		removeAttributeQuotes: false // 移除属性的引号
	}
}