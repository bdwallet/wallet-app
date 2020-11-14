const debug = process.env.NODE_ENV !== 'production';

import babelpolyfill from 'babel-polyfill';
import rem from '~script/rem';
import FastClick from 'fastclick' //处理移动端点击300ms延迟
FastClick.attach(document.body);

import Vue from 'vue';
Vue.config.debug = debug;
Vue.config.devtools = debug;
Vue.config.productionTip = debug;


// 配置
import Global from '~script/global';
Vue.prototype.$global = window.Global = Global;
// 静态资源
import Assets from '~assets';
Vue.prototype.$assets = window.Assets = Assets;

// API接口
import Api from '~script/api';
Vue.prototype.$api = window.Api = Api;

// Ajax请求类
import Ajax from '~script/http';
Vue.prototype.$ajax = window.Ajax = Ajax;

// 弹框类
import Dialog from '~components/compDialog/index.js';
Vue.prototype.$dialog = window.Dialog = Dialog;

import Backdrop from '~components/backdrop'; //使用时，一定要把点击遮罩需要处理的业务传入 否则点击遮罩无效
Vue.prototype.$backdrop = window.Backdrop = Backdrop;

// VUEX
import store from '~script/store';
import App from './App';
import '~css/base';

//加载APP所需资源 START   ******发布H5版本时 注掉此内容********
// import HZApp from  '~script/app.main.js';
// let hzapp = new HZApp();
// window.HZApp = hzapp;
// if(Global.isApp){
// 	let comps = {
// 		appTitlebar:require('~appcomps/appTitlebar'),
// 		appWelcome:require('~appcomps/appWelcome'),
// 	};
// 	for(let i in comps){
// 		let comp = comps[i];
// 		Vue.component(comp.name, comp);
// 	}
// }
//加载APP所需资源 END

import Router from 'vue-router';
import routes from './routes';

Vue.use(Router);

// 路由守卫
const router = new Router({
	linkActiveClass:'current',
	mode: debug?'hash':'history',
	routes,
});
window.Router = router;

import Service from '~script/service';
Vue.prototype.$service = window.Service = Service;

import {timeout} from '~script/utils';

router.beforeEach((to, from, next) => {
	let s = true;
	if(Global.isApp && Global.isPro){
		s = hzapp.Open(to,from,next);
	}
	if(s){
		let t = 0;
		if(to.name == 'login')
			t = 200; // 处理登录页底部微信登陆按钮上移问题

		timeout(t).then(() => { //welcome图片异步才能显示 why?
			document.title = to.meta.title;
			document.keywords = to.meta.keywords;
			document.description = to.meta.description;

			//校验是否需要登录
			if(to.meta && to.meta.auth){
				Service.CheckLogin(to.fullPath).then(next);
			}else{
				next();
			}
		});
	}
});

import share from '~script/share';
Service.onReady(function(){
	window.Share = share;
	window._vm = new Vue({
		router,
		store,
		render: h => h(App)
	}).$mount('#app');
});
