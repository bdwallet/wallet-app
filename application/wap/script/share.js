
import jweixin from '~script/jweixin-1.2.0.js';//微信JS-SDK
import Global from '~script/global';
import Assets from '~assets';
import browser from '~script/browser';//识别设备
import store from '~script/store';


let DEFAULT_SHARE_PARAMS = {
    title: Global.shareTitle,
    desc: Global.shareDesc,
    link: Global.home,
    imgUrl: Assets.logo,
    pictures: [], //APP分享图片时
    href: "", // App分享链接

};
let SUFFIX = '?x-oss-process=image/resize,m_lfit,h_80,w_80'; //图片压缩后缀
class Share {
    constructor(){
        this.shareParams = DEFAULT_SHARE_PARAMS;
        this.success = undefined;
        this.error = undefined;

        // app 分享属性
        this.shares = null;
        this.sweixin = null;
        this.sqq = null;
    }

    //初始化分享参数
    Ready(opts,success,error){
        opts = opts || DEFAULT_SHARE_PARAMS;
        this.shareParams = Object.assign(this.shareParams, opts);
        this.success = success;
        this.error = error;
        if(!Global.isApp && Global.isPro){
            setTimeout(() => {
                this.H5Share();
            }, 1000);
        }
    }

    //H5端微信分享配置
    H5Share(){
        let self = this;
        //IOS 微信端分享，必须为首次进入时的href地址
        let store_href = store.getters.href || location.href;
        let str_url = (browser == "IOS") ? store_href : location.href;
        let title = this.shareParams.title,
            desc = this.shareParams.desc,
            link = this.shareParams.link,
            imgUrl = this.shareParams.imgUrl + SUFFIX;
        Ajax.post(Api.apply.get_signature, {str_url:str_url}).then(res => {
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
                    success: function(){
                        self.Success();
                    },
                });
                jweixin.onMenuShareAppMessage({
                    title, // 分享标题
                    desc, // 分享描述
                    link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl,// 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function(){
                        self.Success();
                    },
                });
            });
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            jweixin.error(this.Error);
        }).catch(err => {});
    }

    //H5分享成功回调
    Success(){
        this.success && this.success();
        Ajax.post(Api.apply.mission_share).then(res=>{
            if(res.data.status){
                Dialog.other("分享成功",res.data.hzt,"")
            }else{
                Dialog.tip("分享成功");
            }
        }).catch(() => {});
    }

    //H5分享失败回调
    Error(err){
        // @todo
    }

    //APP触发分享
    OnShare(scene){
        let href = location.pathname;
        // 更新分享服务
        plus.share.getServices((s) =>{
            this.shares ={};
            for(const i in s){
                let t = s[i];
                this.shares[t.id] = t;
            }
            this.sweixin = this.shares['weixin'];
            this.sqq = this.shares['qq'];
            let msg = {};
            if(this.shareParams.type){
                // 分享图片参数
                msg = {
                    type: this.shareParams.type,
                    pictures: [this.shareParams.pictures], //分享图片
                    extra:{
                        scene:scene
                    }
                };
            }else{
                // 分享网页参数
                msg = {
                    title: this.shareParams.title,
                    href: Global.host + (this.shareParams.href ? this.shareParams.href : href),
                    content: this.shareParams.desc,
                    pictures: [this.shareParams.imgUrl], //分享图片
                    thumbs: [this.shareParams.imgUrl],
                    extra:{
                        scene:scene
                    }
                };
            }
            if(this.sweixin || this.sqq){
                if(!scene){
                    this.Share(this.sqq,msg)
                }else{
                    this.Share(this.sweixin,msg,scene)
                }
            }
        },() =>{});
    }
    // 分享
    Share(srv, msg, button){
        if(!srv) return;
        button && ( msg.extra.scene = button );
        // 发送分享
        if(srv.authenticated){
            this.doShare(srv, msg);
        }else{
            srv.authorize(() =>{
                this.doShare(srv, msg);
            },() =>{});
        }
    }
    // 发送分享
    doShare(srv, msg){
        srv.send(msg, () =>{
            this.Success()
        }, () =>{
            this.Error()
        });
    }

}

export default new Share();
