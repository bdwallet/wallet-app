const debug = process.env.NODE_ENV !== 'production';
import Global from '~script/global';
import babelpolyfill from 'babel-polyfill';
//import rem from '~script/rem';
import Vue from 'vue';
// 静态资源
import Assets from '~assets';
// API接口
import Api from '~script/api';
// Ajax请求类
import Ajax from '~script/http';
import App from './App';
import '~css/base';

Vue.config.debug = debug;
Vue.config.devtools = debug;
Vue.config.productionTip = debug;
Vue.prototype.$api = window.Api = Api;
Vue.prototype.$ajax = window.Ajax = Ajax;
Vue.prototype.$assets = Assets;
Vue.prototype.$global = window.Global = Global;

// import WxShare from '~script/WxShare';

import FastClick from 'fastclick' //处理移动端点击300ms延迟
FastClick.attach(document.body)

import store from '~script/store';
new Vue({
	store,
	render: h => h(App)
}).$mount('#app')