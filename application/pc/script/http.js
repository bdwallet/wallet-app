import axios from 'axios'
import 'url-search-params-polyfill';

let cancel;
const CancelToken = axios.CancelToken;
axios.defaults.baseURL = process.env.BASE_API

//设置默认请求头
axios.defaults.headers = {
    'X-Requested-With': 'Hz-Pc-Request'
}
axios.defaults.timeout = 5000

// respone拦截器
axios.interceptors.response.use(
	response => {
		let data = response.data
		let statusCode = response.status

		if (statusCode === 200) {
			if('string'== typeof data || !data.hasOwnProperty('status')){
				return Promise.reject({message:'程序出错！'});
			}
			// 成功
			let $status = parseFloat(data.status);
			if($status<=0){
				return Promise.reject(data);
			}
			// 成功
			return Promise.resolve(data);
		}
		return Promise.reject({message:'服务器连接失败！'});
	},
	error =>{
		if(error.status)
			return Promise.reject(error)
		else
			return Promise.reject({message:'服务器连接失败！'});
	}
);
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
	//get请求
const	get = function(url,params={}) {
		//判断拦截短时发布问题
		params.noCache=timeMaps();
		return new Promise((resolve,reject) => {
			let cancelToken = new CancelToken(c => cancel = c);
			axios({
				method: 'get',
				url,
				params,
				cancelToken
			}).then(res => resolve(res)).catch(error=>reject(error));
		});
	};
	//post请求
const	post = function(url,data={},params={}) {		

		params.noCache=timeMaps();
		return new Promise((resolve,reject) => {
			let cancelToken = new CancelToken(c => cancel = c);
			data = serializeArray(data);
			axios({
				method: 'post',
				url,
				params,
				data,
				cancelToken
			}).then(res => {
				return resolve(res);
			}).catch(error=>reject(error));
		});
	};
export default {
	get,post
};