import axios from 'axios'
import 'url-search-params-polyfill';

import Ui from '@ui';


let cancel
const CancelToken = axios.CancelToken;
axios.defaults.baseURL = process.env.BASE_API

//设置默认请求头
axios.defaults.headers = {
    'X-Requested-With': 'Hz-Pc-Request'
}
axios.defaults.timeout = 5000

// request拦截器
axios.interceptors.request.use(
	config => config,
	error => Promise.reject(error)
)

// respone拦截器
axios.interceptors.response.use(
	response => {
		let data = response.data
		let status = response.status
		if (status === 200) {
			if('string'== typeof data || !data.hasOwnProperty('status')){
				return Promise.reject({message:'程序出错！'})
			}
			let $status = parseFloat(data.status);
			if($status<=0){
				if($status==-30001){
					//console.log('未登录');
				}
				
				return Promise.reject(data)
			}
			return Promise.resolve(data);
		} else {
			return Promise.reject({message:'服务器连接失败！'});
		}
	},
	error =>Promise.reject(error)
)

const serializeArray = (object={}) => {
	var params = new URLSearchParams();
	for(var key in object){
		var value = object[key];
		if(Array.isArray(value)){
			key = key+'[]';
			value.forEach(v=>params.append(key,v))
		}else{
			params.append(key,value)
		}
	}
	return params;
}

function timeMaps(){
	return new Date().getTime();
}


export default {
	//get请求
	get (url,params={}) {
		params.noCache=timeMaps();
		return new Promise((resolve,reject) => {
			let cancelToken = new CancelToken(c => {
				cancel = c
			})
			axios({
				method: 'get',
				url,
				params,
				cancelToken
			}).then(res => resolve(res)).catch(error=>reject(error));
		})
	},
	//post请求
	post (url,data={},params={}) {
		params.noCache=timeMaps();
		return new Promise((resolve,reject) => {
			let cancelToken = new CancelToken(c => {
				cancel = c
			})
			data = serializeArray(data);
			axios({
				method: 'post',
				url,
				params,
				data,
				cancelToken
			}).then(res => resolve(res)).catch(error=>reject(error));
		})
	}
}