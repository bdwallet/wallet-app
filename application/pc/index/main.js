const debug = process.env.NODE_ENV !== 'production';
window.isDebug = debug;
import babelpolyfill from 'babel-polyfill';
import rem from '~script/rem';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
// 静态资源
import Assets from '~assets';
// 配置
import Global from '~script/global';
// API接口
import Api from '~script/api';
// Ajax请求类
import Ajax from '~script/http';
// VUEX
import store from '~script/store';
import App from './App';
import '~css/common';

Vue.config.debug = debug;
Vue.config.devtools = debug;
Vue.config.productionTip = debug;
Vue.prototype.$global = window.Global = Global;
Vue.prototype.$api = window.Api = Api;
Vue.prototype.$ajax = window.Ajax = Ajax;
Vue.prototype.$assets = window.Assets = Assets;

import browser from '~script/browser'; //识别设备
Vue.prototype.$browser = window.browser = browser;

import FastClick from 'fastclick' //处理移动端点击300ms延迟
FastClick.attach(document.body)

import Router from 'vue-router';
import routes from './routes';

Vue.use(Router)

Vue.use(VueI18n);
const i18n = new VueI18n({
	silentTranslationWarn: true,
	locale: localStorage.getItem('locale') || 'cn',
	fallbackLocale: 'dev',
	messages: {
		cn: require('./language/cn'),
		en: require('./language/en')
	},
});

Vue.prototype.$lang = (val, params) => {
	const obj = params || {}; // 对象类型
	const language = i18n.messages.cn.language;
	const key = Object.keys(language).find(item => language[item] === val);
	return key ? i18n.t(`language[${key}]`, obj) : val;
}

// 路由守卫
const router = new Router({
	linkActiveClass: 'current',
	mode: debug ? 'hash' : 'history',
	//mode: 'history',
	routes,

	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			return {
				x: 0,
				y: 0
			}
		}
	}
});

router.beforeEach((to, from, next) => {
	document.title = to.meta.title;
	document.keywords = to.meta.keywords;
	document.description = to.meta.description;
	next();
});

window.vm = new Vue({
	router,
	store,
	i18n,
	render: h => h(App)
}).$mount('#app')