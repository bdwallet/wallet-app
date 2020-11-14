# 黑钻评级前端开发文档
------
> * 使用nodejs 自动构建打包的单页面应用
> * 技术栈 `nodejs` `vue2` `vuex` `vue-router` `webpack` `axios` `Mock` `Less` `ES6`


# 安装
------

``` shell
# 安装nodejs
https://nodejs.org

# 转至项目根目录
cd your path ...

# 安装依赖
npm install

# 编译dll
npm run dll appName

# 调试项目
npm run dev appName

# 编译打包
npm run pro appName
```

# 调试
------

1. 本地安装nginx或apache支持（可使用phpstudy）
2. 避免跨域，请将测试服务器API代理至本地
3. phpstudy配置
server {
        listen 8080;
        #server_name  xxx.xxx.com;
        location / {
            proxy_pass http://localhost:8080;
            proxy_redirect default;
        }
        location /api {
            rewrite  ^/api/(.*)$ /$1 break;
            proxy_pass   http://dev.heizuan.com; //测试服务器
        }
}

# 项目结构
------

root
|-- application // 项目文件
|   |-- doc //公共组件文档
|   |   |-- ...
|   |-- pc // 黑钻评级官网端应用
|   |   |-- assets // 静态资源
|   |   |-- components // 项目组件
|   |   |-- pages // 业务页面
|   |   |   |-- index // 首页（静态页面）
|   |   |   |-- user // 会员中心（单页）
|   |   |   |-- ... 
|   |   |-- script
|   |   |-- config // 编译配置
|   |   |-- ...
|   |-- wap // 黑钻评级H5/APP应用
|   |   |-- appcomps // APP端组件
|   |   |-- assets // 静态资源
|   |   |-- components // 公用组件
|   |   |-- layout // 公用局部视图
|   |   |-- pages // 业务页面
|   |   |   |-- down // APP下载页
|   |   |   |-- index // 项目入口
|   |   |   |-- pro // 三方合作落地页
|   |   |   |-- ... 
|   |   |-- script // 公用业务、工具类
|   |   |-- config // 编译配置
|   |   |-- README.md // 项目说明文档   **运行必读** ******
|   |   |-- ...
|   |-- APP // Hbuilder打包APP项目
|   |   |-- static // 打包项目编译成功后的项目文件
|   |   |-- unpackage // APP打包资源目录
|   |   |-- index.html // 打包项目编译成功后的入口文件
|   |   |-- manifest.json // Hbuilder项目配置文件
|   |   |-- ...
|   |-- paper // 人物评级应用
|   |   |-- assets // 静态资源
|   |   |-- components // 项目组件
|   |   |-- index // 项目入口
|   |   |-- script
|   |   |-- config // 编译配置
|   |   |-- ...
|-- assets // 公共静态资源
|-- compiled // 编译文件目录
|-- components // 前“黑钻财经”项目公共组件 **已废弃**
|-- documents // 文档资料及其他
|-- node_modules // node模块
|-- .babelrc // ES6编译配置
|-- build.js // 项目编译器
|-- package.json // 依赖模块元数据
|-- README.md  // 说明文档


# 开发规则
------

1.  请勿将项目源码分享和外泄
2.  请勿擅自修改和删除项目配置文件、组件、UI
3.  请使用ES6、ES7语法,使用 `const` 和 `let` 代替 `var`, 使用箭头函数
4.  请使用Less编写样式,颜色、尺寸等参数请调用全局配置
5.  敏感语义化的样式请在独立组件内添加 `scoped`,避免污染全局样式。
6.  请使用组件标签，请勿擅自添加和使用其他组件。
7.  修改和保存文件请清除文件BOM头
8.  开发或修改之前请保持代码同步，先更新再提交
9.  提交版本请注释功能或更新内容
10. 请勿提交`compiled` `node_modules`