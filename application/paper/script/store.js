const isPro = process.env.NODE_ENV === 'production';
//在非生产环境下，使用严格模式
const strict = process.env.NODE_ENV !== 'production';
import Vue from 'vue';
import Vuex from 'vuex';
import localStore from '~script/localStore';
import cookier from '~script/cookier';
import parameter from '~script/parameter';

//获取本地数据
const userInfo = localStore.get('user') || {};
Vue.use(Vuex);

// 状态
const state ={
	userInfo,
	href:"",
	showWxcode:false,//是否显示关注二维码
	showWxcodeDialog:false,//是否显示程序错误提示框
};

// 类似于computed
const getters = {
	//获取用户登录状态
	isLogin(state){
		let islogin = false;
		if(state.userInfo && state.userInfo.user_id && state.userInfo.user_openid && cookier.getCookie("user_info")){
			islogin = true;
		}
		return islogin;
	},
	userInfo(state){
		let info = state.userInfo;
		if(!info.user_photo || info.user_photo==''){
				info.user_photo=Global.noavatar;
		}
		return info;
	},
	showWxcode(state){
		return state.showWxcode;
	},
	showWxcodeDialog(state){
		return state.showWxcodeDialog;
	},
	href(state){
		return state.href;
	},
};

// this.$store.commit('login',params)
const mutations = {
	//用户登录操作函数
	login(state,params){
	  isPro && getUserInfo(state,params);
	},
	//改变关注二维码显示状态
	changeShowWxcode(state,params){
		state.showWxcode = params.status;
	},
	//改变程序错误提示框显示状态
	changeShowWxcodeDialog(state,params){
		state.showWxcodeDialog = params.status;
	},
	//保存第一次进入网址 用于IOS分享配置
	saveHref(state,params){
		state.href = params.href;
	},
};

// this.$store.dispatch('handle',params)
const actions = {
	handle(params){
		
	}
};

const getWeixinCode = function(href){
	let appid = Global.appid, //此为正式公众号ID
	response_type = "code",
	scope = "snsapi_userinfo";
	let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${href}&response_type=${response_type}&scope=${scope}#wechat_redirect`; //&state=${encodeURIComponent(location.hash)}
	window.location.href = url;
};
const getUserInfo = function(state,params){
	let code = parameter('code', location.href);
	if (code) {
		Ajax.post(Api.apply.get_userinfo, {
			code
		}).then(res => {
			if(res.status == 1){
				let info = Object.assign({},state.userInfo,res.data);
				state.userInfo = info;
				localStore.set("user",info);
				params.next && params.next();
			}else{
				Dialog.alert({
					title: '系统消息',
					content: res.message,
					okText: '好'
				}).then(() => {
					getWeixinCode(location.origin + location.pathname);
				});
			}
		}).catch(err => {
				Dialog.alert({
					title: '系统消息',
					content: err.message,
					okText: '好'
				}).then(() => {
					getWeixinCode(location.origin + location.pathname);
				});
		});
	} else {
		getWeixinCode(location.href);
	}
}

export default new Vuex.Store({strict, state, getters, mutations, actions});