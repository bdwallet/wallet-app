import axios from 'axios'
import 'url-search-params-polyfill';
import store from '~script/store';
import Dialog from '~components/compDialog/index.js';
import Global from '~script/global';
import Api from '~script/api';

var applyCount = 0;
var applyList = new Object();

let cancel;
const CancelToken = axios.CancelToken;
axios.defaults.headers = {'X-Requested-With': 'Hz-Pc-Request'}; //设置默认请求头
axios.defaults.timeout = 5000; // 请求超时
axios.defaults.baseURL = process.env.BASE_API;

// request拦截器
axios.interceptors.request.use(
	config => {
		// console.log(config.url);
		applyList[getAction(config.url)] = config; //记录请求地址
		// console.log(applyList);
		return config;
	},
	error => {
		console.log("request error!");
		Promise.reject(error);
	}
)
// respone拦截器
axios.interceptors.response.use(
	response => {
		delete applyList[getAction(response.config.url)]; //移除请求地址
		let data = response.data;
		let statusCode = response.status;
		if (statusCode === 200) {
			//程序错误提示框
			if('string'== typeof data || !data.hasOwnProperty('status')){
				!Global.isApp && store.commit('systemStatus', 1);
				return false;
			}
			// 成功
			let s = parseFloat(data.status);
			if(s<=0){
				// 系统维护、升级提示框
				if(s==-10099){
					let v = 0;
					if(data.status == -2) v = 2; //系统维护
					else v = 3; //系统升级
					// ['staut'=>-1] 升级
					// -2  维护
					store.commit('systemStatus', v);
					return false;
				}
				// 未登录
				else if(s==-10006){
					// 登录操作
					setTimeout(() => {
						Dialog.tip('登录已过期,请重新登录');
					}, 500);
					Service.LoginOut();
					return false;
				}
				return Promise.reject(data)
			}
			// 多端登录
			if(data.data && data.data.status == -10013 && store.getters.userInfo.user_id){
				setTimeout(() => {
					Dialog.alert("该帐号已在其它终端登录，请注意帐号安全");
				}, 500);
				Service.LoginOut(0);
			}
			// 成功
			return Promise.resolve(data);
		}
		return Promise.reject({message:'服务器连接失败！'});
	},
	error =>{
		//console.log("error =>",{error});
		if(error.code && error.code == "ECONNABORTED"){
			//console.log("请求超时",error.config.url);
			// cancel('APPLY CANCEL','中断请求');
			// return excepHandle();
			error.config.timeout = error.config.timeout + 2000;
			return axios(gainConfig(error.config));
		} else if (error.message == "APPLY CANCEL"){ //主动中断请求
			return excepHandle();
		} else if (error.message == "Network Error"){ //断网
			return excepHandle();
		} else
			return Promise.reject({message:'服务器连接失败！'});
	}
);

//请求异常处理方案
const excepHandle = function(){
	return new Promise((r,e)=> {});
}

//获取请求地址内的方法名
const getAction = function(url){
	let act = url.substr(url.indexOf('?act=') + 5);
	return act || new Date().getTime(); //异常处理 防止act为空
}

 //开发模式处理接口代理重复问题
const gainConfig = function(config){
	if(process.env.NODE_ENV !== 'production'){
		config.url = config.url.replace(process.env.BASE_API,'');
	}
	return config;
}

//处理部分手机value为undefined时报错问题
const undefinedToString = v => {
	if(v == undefined)
		v = '';
	return v;
}

const serializeArray = (object={}) => {
	//console.log("in http.js => post 111 |" + JSON.stringify(object));
	var params = new URLSearchParams();
	for(var key in object){
		var value = object[key];
		//console.log("in http.js => post +> key:" + key + "| value:" + value);
		if(Array.isArray(value)){
			key = key+'[]';
			value.forEach(v=>params.append(key,undefinedToString(v)));
		}else{
			params.append(key,undefinedToString(value));
		}
	}
	return params;
}

const creat = function(type,url,params={},data={}){
	//拦截短时重复请求
	// let arr = [Api.apply.upload_img,Api.apply.upload_base_img]; //允许上传图片重覆请求
	// console.log(arr,url);
	if(getAction(url) in applyList){ // && !arr.includes(url)
		//console.log("_______________重覆请求！");
		//console.log("重覆的URL：" + url);
		return new Promise((res,rej)=>{});
	}
	//console.log(url);
	//处理请求缓存问题
	params.noCache = new Date().getTime();
	let cancelToken = new CancelToken(c => cancel = c);
	let config = {
		method:type,
		url,
		params,
		cancelToken
	};
	if(type == 'post'){
		data = serializeArray(data);
		config.data = data;
	}
	return axios(config);
}

export default {
	get: function(url,params={}) {
		return creat('get',url,params);
	},
	post: function(url,data={},params={}) {
		return creat('post',url,params,data);
	},
	list:applyList
};
