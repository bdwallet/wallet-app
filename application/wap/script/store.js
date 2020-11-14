const isPro = process.env.NODE_ENV === 'production';
//在非生产环境下，使用严格模式
const strict = process.env.NODE_ENV !== 'production';

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// 状态
const state ={
	userInfo:{},
	handle:null,
	href:"",
	haveMessage:false,//是否有未读消息
	//showWxcode:false,//是否显示关注二维码
	systemDialog:0,//是否显示系统提示框 1：程序错误提示框 2：系统维护 3：系统升级
	cashOutTab:0, //提现页面的TAB 0：社区提现 1：充值提
	bannedType: [], //账号异常状态 1正常  -1冻结账号  -2禁言  -3不能获取奖励   -4答题
	refreshCon: false, // 当关注列表发生变化、登录、登出时，需要刷新关注列表
	refreshCollect: false, //收藏列表是否需要刷新
};

// 类似于computed
const getters = {
	userInfo(state){
		return state.userInfo;
	},
	href(state){
		return state.href;
	},
	haveMessage(state){
		return state.haveMessage;
	},
	// showWxcode(state){
	// 	return state.showWxcode;
	// },
	systemDialog(state){
		return state.systemDialog;
	},
	cashOutTab(state){
		return state.cashOutTab;
	},
	bannedType(state){
		return state.bannedType;
	},
	refreshCon(state){
		return state.refreshCon;
	},
	refreshCollect(state){
		return state.refreshCollect;
	}
};

// this.$store.commit('update',params)
const mutations = {
	//更新用户数据操作函数
	update(state,params){
		let info = {};
		if(params)
			info = Object.assign({},state.userInfo,params);
		state.userInfo = info;
	},
	//保存第一次进入网址 用于IOS分享配置
	saveHref(state,params){
		state.href = params.href;
	},
	//改变未读消息状态
	changeHaveMessage(state,status){
		state.haveMessage = status;
	},
	//改变关注二维码显示状态
	// changeShowWxcode(state,status){
	// 	state.showWxcode = status;
	// },
	//改变程序错误提示框显示状态
	systemStatus(state,v){
		state.systemDialog = v;
	},
	changeCashOutTab(state,tab){
		state.cashOutTab = tab;
	},
	changeBannedType(state,v){
		state.bannedType = v;
	},
	changeRefreshCon(state, v){
		state.refreshCon = v;
	},
	changeRefreshCollect(state, v){
		state.refreshCollect = v;
	}
};

// this.$store.dispatch('handle',params)
const actions = {
	handle(params){
		
	}
};

export default new Vuex.Store({strict, state, getters, mutations, actions});