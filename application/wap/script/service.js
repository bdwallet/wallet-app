
//import Vue from 'vue';
import Store from './store';
// import Cookier from '~script/cookier';
import LocalStore from './localStore';
import Ajax from '~script/http';
import Api from '~script/api';
import Global from '~script/global';
import Dialog from '~components/compDialog/index.js';
import dater from "~script/dater";

/****用户输入文字字数计算方法******
 **（英文、字母两个字符算1个字；
 **中文一个字符算1个字。*/
String.prototype.gblen = function() {
	let __len = 0;
	for (let i = 0; i < this.length; i++) {
		if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
			__len += 2;
		} else {
			__len += 1;
		}
	}
	return Math.ceil(__len);
}

// const DEBUG = process.env.NODE_ENV !== 'production';
const DEFAULT_USERINFO = {
    "user_photo":Global.noavatar,
    "user_openid":null,
    "user_id":null,
    "user_tel":null,
    "user_nickname":null,
    "level":null,
    "integral":null,
    "user_name":null,
    "user_job":null,
    "login_account":null,
    "user_unionid":null,
    "user_is_attention":null,
    "user_deviceid":null,
    "user_located_item_id":null
};
const InvitePWD = ['HSCFT67YQJ',
                'Z8UYT54RED',
                'TXCFN678UH',
                'P2QWASDFGH',
                'VGYUHBNJ89',
                'PKCDLMN987',
                '4RFVGTYHBN',
                'QWASPX4567'];
//let isReady = { status:false };
let userInfo = undefined;

// ———————————————————————— 微信登录 START —————————————————————————— //
//微信授权获取Code
const GetWXCode = function(href){
    href = href || location.href;
	let appid = Global.appid, //此为正式公众号ID
	response_type = "code",
	scope = "snsapi_userinfo";
	let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${href}&response_type=${response_type}&scope=${scope}#wechat_redirect`; //&state=${encodeURIComponent(location.hash)}
	window.location.href = url;
};

//H5 微信登录
const WXLogin = function(code,handle){
	if (code) {
		Ajax.post(Api.apply.user_login, {
		    phone:code,
            scene:2
		}).then(res => {
        let s = res.data.status;
			if(s == 1){
                Logining(res.data.user_data);
                setTimeout(() => {
                    handle && handle(1);
                 }, 0);
			} else {
				Dialog.alert({
					title: '系统消息',
					content: res.message,
					btns: ['好']
				})
			}
		}).catch(err => {
            if(err.status == -10005) { //微信未注册
				handle && handle(err.data.data);
			}else{
                Dialog.alert({
                    title: '系统消息',
                    content: err.message,
                    btns: ['好']
                }).then(() => {
                    if(err.status != -10008)
                        GetWXCode(location.origin + location.pathname);

                });
            }
		});
	} else {
		GetWXCode();
	}
};


/**
 *   APP获取登录授权服务与APP登录
 */

// 获取AAPP微信授权，拿取微信个人信息
const GetAppWxServices = (type) =>{
    type = type || 1;
    return new Promise((resolve, reject) =>{
        plus.oauth.getServices(res =>{
            let auth = null;
            for (const i in res){
                if (res[i].id === 'weixin'){
                    auth = res[i];
                    break;
                }
            }
            if(type === 1){
                if(!auth.authResult){
                    auth.login(() =>{
                        // 获取登录操作结果
                        auth.getUserInfo(() =>{
                            resolve(WxDate(auth.userInfo));
                        }, () =>{
                            mui.toast("获取用户信息失败");
                            reject()
                        });
                    }, ()=>{
                        mui.toast("登录认证失败");
                        reject()
                    })
                }else{
                    //已经登录认证
                    resolve(WxDate(auth.userInfo));
                }
            }else{
                if (auth.authResult) {
                    auth.logout(() =>{
                        resolve()
                    }, () =>{
                        reject()
                    });
                } else {
                    resolve()
                }
            }
        }, () =>{
            reject()
        });
    })
};

// 微信APP登录返回数据 -》 精简代码
const WxDate = (params) => {
    return {
        deviceid: plus.device.uuid || 1,
        openid: params.openid,
        unionid: params.unionid,
        nickname: params.nickname,
        headimgurl: params.headimgurl
    }
};

// 微信APP登录授权成功后，获取用户信息
const APPWXGetUserInfo = function(ps,success,error){
    Ajax.post(Api.apply.user_login,{
        unionid: ps.unionid,
        deviceid: ps.deviceid,
        scene: 4
    }).then(res =>{
        console.log("user_login => res =>" + JSON.stringify(res));
        if (res.data.status == 1) {
            Logining(res.data.user_data);
            success && success(1);
        }else if (res.data.status == -10005) {
            success && success(ps)
        }else{
            error && error(res);
        }
    }).catch(err =>{
        console.log("user_login => err =>" + JSON.stringify(err));
    });
};
// ———————————————————————— 微信登录 START —————————————————————————— //


// ———————————————————————— 检验类处理函数 START —————————————————————————— //

/***
  检验用户是否登录
  用法：
  CheckLogin([url]).then(() => {
    // do anything for success
  });
***/
const CheckLogin = function(to){
    return new Promise((resolve) => {
        if(isLogin()){
            resolve();
        } else {
            let url = "/login";
            if(to)
                url += `?url=${to}`;
            else
                url += `?url=${location.pathname + location.search}`;
            Router.push(url);
        }
    });
};

/***
  接口检验用户level
  用法：
  CheckLevel(targetLevel).then(() => {
    // do anything for success
  }).catch(() => {
    // do anything for fail
  });
***/
const CheckLevel = function(targetLevel) {
    return new Promise((resolve, reject) => {
        let level = LocalStore.get(Global.localStores.level);
        targetLevel = targetLevel || 3;
        if (level) {
            if(level == targetLevel)
                resolve();
            else
                reject();
        } else {
            Ajax.post(Api.apply.check_level).then(res => {
                if (res.status == 1) {
                    level = res.data.level;
                    LocalStore.set(Global.localStores.level, level, 60);
                    if(level == targetLevel)
                        resolve();
                    else
                        reject();
                }else{
                    reject();
                }
            }).catch(err => {
                reject();
            });
        }
    });
};

/***
  检验用户是否关注 type:1 为请求接口检验， type:0 为本地数据检验
  用法：
  CheckAttention().then(() => {
    // do anything for success
  }).catch(() => {
    // do anything for fail
  });
***/
const CheckAttention = function(type){
  // return new Promise((resolve, reject) => {
  //   if(type){
  //     Ajax.get(Api.apply.is_user_attention).then(res => {
  //       if (res.status == 1) {
  //         let info = Store.getters.userInfo;
  //         info.user_is_attention = res.data.user_is_attention;
  //         Store.commit('update', info);
  //       }
  //     });
  //   }else{
  //     let is_attention = Store.getters.userInfo.user_is_attention == 1 ? true : false;
  //     if(is_attention)
  //       resolve();
  //     else{
  //       Store.commit('changeShowWxcode', {
  //         status: true
  //       });
  //       reject();
  //     }
  //   }
  // });
};

/***
  检验用户是否绑定手机号
  点赞、发评级、评论等敏感操作时进行检验
***/
const CheckBind = function(){
    return new Promise((resolve) => {
        let tel = Store.getters.userInfo.user_tel;
        if(tel){
            resolve();
        }else{
            let url = location.pathname + location.search;
            let i = url.indexOf('url=');
            if( i != -1 ){
                url = url.substr(i+4);
            }
            setTimeout(()=>{//延时300 解决首页轮播图不渲染bug
                Router.push(`/user/setup/bind?url=${url}`);
            },300);
        }
    });
};

//检测该项目用户是否发布过评级
const CheckGrade = function(type,id) {
    return new Promise((resolve, reject) => {
        Ajax.post(Api.apply.check_grade, {
            id,type
        }).then(res => { //0未发布过 1可以追评 2追评时间未到 3等级不够LV5 4评级未通过审核
            if (res.data.status == 0 || res.data.status == 1) {
                resolve(res);
            } else {
                reject(res);
            }
        });
    });
};

//检测该用户已实名认证
const CheckRealName = function(){
    return new Promise((resolve, reject) => {
        let info = Store.getters.userInfo.idcert_info;
        if(info && info.idcert_status == 1){//-1未提交认证 0审核中 1审核通过 2审核失败
            resolve();
        }else{
            reject();
        }
    });
};

// ———————————————————————— 检验类处理函数 END —————————————————————————— //
// ———————————————————————— 业务类 START —————————————————————————— //

/***
  更新用户登录状态
***/
const Logining = function(info){
    //console.log(" ========= >  in Service.js => Logining");
    Update(info);
    Store.commit("changeRefreshCon", true); //更新关注列表
};

/***
  退出登录
***/
const LoginOut = function(jump){
    userInfo = undefined;
    let ls = Global.localStores;
    for(let item in ls){
        LocalStore.remove(ls[item]); //移除LocalStore数据
    }
    LocalStore.remove('user');
    LocalStore.remove('cookie');
    Store.commit('update',undefined);
    Store.commit("changeRefreshCon", true); //更新关注列表
    Ajax.post(Api.apply.user_logout);
    if(Global.isApp && Global.isPro){
        HZApp.RemoveCookie(); //删除APP所有Cookie信息
        HZApp.UpdateMainViewStoreData("Service.Init();console.log('in evalJS(LoginOut)');");//更新主窗口store数据
        HZApp.Back();//关闭当前窗口
        return;
    } else if(jump != 0){
        CheckLogin(Router.fullPath);
    }
};

/***
  滑动验证获取短信
  type: 必须 //01登录/注册 2用户找回密码 3手机绑定 4换绑验证原手机 5换绑验证新手机
  phone: 可选 手机号
***/
const Proving = function(type,phone){
    return new Promise(resolve => {
        Dialog.proving(type,phone).then(code => {
            Ajax.post(Api.apply.check_validate, {phone,code,type}).then(r => {
                resolve(r);
            }).catch(err => {
                Dialog.alert(err.message);
            });
        });
    });
};

/***
  更新本地用户数据缓存
  info: 用户数据
***/
const Update = function(info){
    let oldInfo = LocalStore.get('user');
    userInfo = Object.assign({},oldInfo,info);
    LocalStore.set("user",userInfo,604800);
    Store.commit('update', userInfo);
    //如果是APP端，需要将cookie信息储存于localStore内
    if(Global.isApp && Global.isPro){
        HZApp.SaveCookie();
        HZApp.UpdateMainViewStoreData("Service.Init();console.log('in evalJS(Logining)');");
    }
};

//登录状态
const isLogin = function(){
    userInfo = Store.getters.userInfo;
    return userInfo && userInfo.user_id;
};

//获取注册邀请码
const GetInviteCode = function(){
    let str = `${Store.getters.userInfo.user_id}`;
    let leng = str.length;
    for (let i=leng;i<8;i++){
        str = '0' + str;
    }
    let code = '';
    for (let i=0;i<8;i++){
        code += InvitePWD[i].charAt(str.charAt(i));
    }
    return code;
};


//校验邀请码
const CheckInviteCode = function(code){
    if(code.length != 8){
        return false;
    }
    for(let i=0; i<8;i++){
        let c = code.charAt(i);
        let index = InvitePWD[i].indexOf(c);
        if(index == -1){
            return false;
        }
    }
    return true;
};

//获取消息中心数据 && 检测用户异常状态
const GetMessages = function(){
    Ajax.post(Api.apply.unread_messages).then(res => {
        let data = res.data;
        //处理用户未读消息状态更新
        if(data.count > 0){
            Store.commit('changeHaveMessage', {
                status: 1
            });
        } else {
            Store.commit('changeHaveMessage',false);
        }
        if(data.banned){
            //账号异常状态  1正常  -1冻结账号  -2禁言  -3不能获取奖励   -4答题  -5禁止提现和赞赏
            Store.commit("changeBannedType", data.banned);
            if(data.banned.indexOf(-4) != -1){
                // 答题
                let answer = document.querySelector(".answer-dialog");
                if(!answer){
                    setTimeout(() => {
                        Dialog.alert({
                            title: '检测到您的账号存在异常行为，请先完成人机测试。题目虽简单，但也请认真回答。若答题错误，将扣除未来5天的日常奖励【每日签到、点赞、分享、爆料、评论】，并有可能被冻结账号',
                            btns: ['去答题'],
                            backdropClick: 0
                        }).then(res => {
                            Dialog.answer();
                        }).catch(err => {});
                    }, 0);
                }
            }else if(data.banned.indexOf(-1) != -1){
                // 冻结账号
                Dialog.alert({
                    title: '账号异常冻结提醒',
                    content: '很遗憾，您的账号因异常行为，已冻结。可添加微信客服：jiukou0920，了解冻结原因并解除',
                    btns: ['知道了']
                }).then(res => {
                    LoginOut(0);
                });
            }
        }else{
            //账号异常状态  1正常  -1冻结账号  -2禁言  -3不能获取奖励   -4答题  -5禁止提现和赞赏
            Store.commit("changeBannedType", [1]);
        }
    });
}

//关注、取消关注
//id:用户编号
//Att：关注成功后回调
//UnAtt：取消关注成功后回调
const UpdateAtt = function(ids,Att,UnAtt){
    CheckLogin().then(() => {
        CheckBind().then(() => {
            let params = {}; //批量关注 user_ids  单个关注  user_id
            if(typeof(ids) == 'object'){
                params.user_ids = ids;
            }else{
                params.user_id = ids;
            }
            Ajax.post(Api.apply.update_att, params).then(res => {
                let attention_num = +Store.getters.userInfo.attention_num;
                if (res.data.status == 1) { //关注
                    Store.commit("changeRefreshCon", true);
                    Store.commit("update", { //更新个人主页关注数
                        attention_num: ++attention_num
                    });
                    Att && Att();
                } else if (res.data.status == 2) { //取消关注
                    Store.commit("changeRefreshCon", true);
                    Store.commit("update", {
                        attention_num: --attention_num
                    });
                    UnAtt && UnAtt();
                } else {
                    Dialog.tip(res.message);
                }
            }).catch(err => {
                Dialog.alert(err.message);
            })
        })
    })
}

// ———————————————————————— 业务类 END —————————————————————————— //
// ———————————————————————— 工具类 START —————————————————————————— //
/***
  跳转
***/
const OpenUrl = function(url) {
    let reg = /^(http:\/\/|https:\/\/|\/\/)|\.\S/;
    url = url.replace("https://","").replace("wx.heizuan.com","");
    console.log(`OpenUrl:${url}`);
    if(url.search(reg) !== -1){
		if(Global.isApp){
            if(plus.os.name === "Android"){
                plus.runtime.openWeb(url)
            }else {
                plus.runtime.openURL(url);
            }
		} else {
			window.location.href = url;
		}
    } else {
        if(url.indexOf("summary") >= 0){ //对于年终盘点特殊处理 公司解散 待优化
            CheckLogin().then(() => {
                Router.push(url);
            });
        } else {
            Router.push(url);
        }
    }
};

// 图片预览
const ImagePreview = (imgList, Imgurl, index) => {
    if(Global.isApp){
        HZApp.ImagePreview(imgList, index);
    } else {
        WeixinJSBridge.invoke("imagePreview", {
            "urls": imgList,
            "current": Imgurl
        });
    }
};

/***
  交易所评级分数转换为评价
 ***/
const GetEvaluate = (score) => {
    let Score = score * 3;
    if (Score>= 24) return '优质';
    else if (Score>= 18 && Score <= 23) return '不错';
    else if (Score>= 11 && Score <= 17) return '一般';
    else if (Score>= 1 && Score <= 10) return '较差';
};


/***
  获取自定义数字
***/
const GetNumb = function(num) {
    num += '';
    let span = document.createElement('span');
    for(let k=0;k<num.length;k++){
        let i = document.createElement('i');
        i.classList = `icon icon-n${num.charAt(k)}`;
        span.appendChild(i);
    }
    return span.outerHTML;
};

/***
  日期格式转换
***/
const Dater = function(date,format){
    return dater(date).format(format || Global.dateFormat);
};

// ———————————————————————— 工具类 END —————————————————————————— //

const Init = function(){
    //获取本地数据并更新Store
    userInfo = LocalStore.get('user') || DEFAULT_USERINFO;
    //console.log("in Init ==> info ====>" + JSON.stringify(userInfo));
    Store.commit('update',userInfo);
    //console.log("user_id ===>> " + Store.getters.userInfo.user_id);
};

//Service 业务处理完成后回调
const onReady = function(anything){
    Init();
    anything();
};

export default {
    Init,
    onReady,
    GetWXCode,
    WXLogin,
    GetAppWxServices,
    APPWXGetUserInfo,
    Logining,
    LoginOut,
    isLogin,
    GetInviteCode,
    GetMessages,
    UpdateAtt,
    CheckInviteCode,
    CheckLogin,
    CheckLevel,
    CheckAttention,
    CheckGrade,
    CheckBind,
    CheckRealName,
    OpenUrl,
    Proving,
    Update,
    GetNumb,
    GetEvaluate,
    Dater,
    ImagePreview
}
