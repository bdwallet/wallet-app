
import jweixin from '~script/jweixin-1.2.0.js';//微信JS-SDK
import store from '~script/store';
const shareFunc = function(conf) {
  let imgUrl = conf && conf.imgUrl || '',
  title = conf && conf.title || '',
  desc = conf && conf.desc || '',
  link = conf && conf.link || '',
  circleFunction = conf && conf.circleFunction || function() {},
  friendFunction = conf && conf.friendFunction || function() {},
  errorFunction = conf && conf.errorFunction || function(d) {};

  Ajax.post(Api.apply.get_signature, {
    str_url: conf.href
  }).then(res => {
    //处理用户未读消息状态更新
    store.commit('changeHaveMessage',{
      status:res.data.message_num > 0
    });

    jweixin.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: Global.appid, // 必填，公众号的唯一标识
      timestamp: res.data.timestamp, // 必填，生成签名的时间戳
      nonceStr: res.data.noncestr, // 必填，生成签名的随机串
      signature: res.data.signature, // 必填，签名
      jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', ] // 必填，需要使用的JS接口列表
    });
    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    jweixin.ready(function() {
      jweixin.onMenuShareTimeline({
        title, // 分享标题
        link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl,// 分享图标
        success: function() {
          // 用户点击了分享后执行的回调函数
          circleFunction();
        },
      });
      jweixin.onMenuShareAppMessage({
        title, // 分享标题
        desc, // 分享描述
        link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl,// 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function() {
          // 用户点击了分享后执行的回调函数
          friendFunction();
        }
      });
    });
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    jweixin.error(function(res) {
      errorFunction(res);
    });
  }).catch(err => {});
};

/* begin禁用微信分享功能 */
const onBridgeReady = function () {
  WeixinJSBridge.call('hideOptionMenu');
}

const shareDisable = function(){
  if (typeof WeixinJSBridge == "undefined") {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
      document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
  } else {
    onBridgeReady();
  }
}
/* end禁用微信分享功能 */

const WxShare = function(route,conf){
  if(isDebug) return false;
  if(route&&route.query.code){
    if(route.name == 'article'){
      window.location.href = route.path + '?pro='+route.query.pro;
    }else{
      window.location.href = route.path;
    }
    return false
  }
  shareFunc(conf);
  return false;
  if (route && route.meta.isShare) {
    shareFunc(conf)
  }else{
    //禁用微信分享功能
    //shareDisable();
  }
}

export default WxShare;