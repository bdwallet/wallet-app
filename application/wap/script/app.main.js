///APP主类

import Vue from 'vue';
import LocalStore from './localStore';
import Global from '~script/global';
import Ajax from '~script/http';
import Mui from 'vue-awesome-mui';
import store from '~script/store';
import Service from '~script/service';
import {timeout} from '~script/utils';

Vue.use(Mui);

const API = {
    get_version: `${Global.host}/app/index.php?c=update`, // get 获取应用更新
    unread_messages: `${Global.host}/app/index.php?c=user&a=getMessage`,  //获取是否还有未读消息
};

// 安装包下载
const Download = url =>{
    plus.nativeUI.showWaiting("软件更新中，请稍后...");
    console.log("软件更新中，请稍后...")
    let task = plus.downloader.createDownload( url, { filename:'_doc/download/'},( d, s ) => {
        // 下载完成
        if ( s == 200 ) {
            console.log("软件下载完成")
            plus.nativeUI.closeWaiting();
            plus.runtime.install(d.filename, {}, () => {
                console.log("软件更新完成")
                plus.runtime.restart(); //安装完成后重启
            }, (DOMException) => {
                console.log("安装错误：" + JSON.stringify(DOMException));
            });
        } else {
            mui.toast('版本更新失败:' + s,{duration: 300});
        }
    });
    task.start();
};

import appShare from '~appcomps/appShare';
import {createElement} from '~script/utils';
class AppShare {
    constructor() {
        this._vm = undefined;
        if (!document.querySelector('#app-comp-share')) {
            createElement('#app-comp-share');
            this._vm = new Vue(appShare);
            this._vm.$mount('#app-comp-share');
        }
    }
    //显示遮罩
    Show(type, img) {
        this._vm.Show(type, img);
    }
}

let DEVICE = "";  //iOS Android
let DEVICEID = "";  //iOS Android
let VERSION = undefined; //APP版本
let APPID = "HBuilder"; //APP应用的标识 未打包时为HBuilder 正式为H569DEDB7

import Uploader from '~script/app.uploader.js';
class HZApp{
    constructor(){
        this.PlusReadys(() => {
            this.Install();
        });
        this.mainPage = ["disclosures","ratings","recommend","concern","user-main","prolist","announce-main"];
        this.sonPage = ["hotlist","hot-main","coins-main","newbie-main"];
        
        this.Uploader = Uploader;
        this.Share = new AppShare();
        // console.log("Current Page => " + location.href);
    }

    PlusReadys(handle){
        if(window.plus){
            handle();
        }else{
            document.addEventListener('plusready', () => {
                handle();
            }, false);
        }
    }

    //初始化APP 进行相关的准备设置
    Install(){
        console.log("PlusReadys ::: in Install() uuid=>>"+ plus.device.uuid);
        //判断设备系统
        DEVICE = plus.os.name;
        DEVICEID = plus.device.uuid || 1;
        //获取当前应用版本号
        plus.runtime.getProperty(plus.runtime.appid,inf => {
            VERSION = inf.version;
        });

        //软件键盘弹出样式模式
        plus.webview.currentWebview().setStyle({
            softinputMode: "adjustResize",
            //softinputNavBar:'none',
        });

        plus.screen.lockOrientation("portrait-primary"); //

        //设置状态栏字体颜色
        plus.navigator.setStatusBarStyle('dark');

        //隐藏滚动条
        plus.webview.currentWebview().setStyle({scrollIndicator:'none'});

        this.SetCookie();

        //mui初始化 设置物理返回按键
        this.KeyBack();

        // 更新
        // onPlusReadys();


        // setTimeout(() => {
        //     let all = plus.webview.all();
        //     for(let i =0;i<all.length;i++){
        //         console.log("总窗口数："+all.length+"|第"+i+"个窗口的ID："+all[i].id);
        //     }
        //     console.log("当前窗口的ID："+plus.webview.currentWebview().id);
        // }, 1000);
    }

    //检测APP更新数据 是否需要更新
    CheckUpdate(handle){
        this.PlusReadys(() => {
            //plus.nativeUI.showWaiting("检测更新111111...");
            // setTimeout(() => {
            //     plus.nativeUI.closeWaiting();
            //     console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            // }, 3000);
            
            Ajax.get(API.get_version).then( res => {
                //console.log("···in HZApp.CheckUpdate Ajax=> " + JSON.stringify(res));
                //plus.nativeUI.closeWaiting();
                if(res.status == 200) {
                    if(res.version && res.version != VERSION){ //需要更新
                        let ps = {
                            title:"发现新版本",
                            version: "V"+res.version,
                            isforce: res.isforce,
                            okText: '立即更新',
                            content: res.version_desc,
                        };
                        if(DEVICE == "Android"){ // 安卓系统
                            if(res.android == 2){ //下载apk升级
                                Dialog.update(ps).then(() =>{
                                    Download(res.apk_url);// 安卓安装包下载
                                });
                            }else if(res.android == 3){ // wgt差量升级
                                Download(res.wgt_url);
                            }
                        } else { // 苹果系统
                            if(res.ios == 2){//下载升级
                                Dialog.update(ps).then(() =>{
                                    plus.runtime.openURL( `${Global.host}/down.html` );
                                });
                            } else if(res.ios == 3) { // wgt差量升级
                                Download(res.wgt_url)
                            }
                        }
                    }else{
                        handle && handle(); //不需要更新
                    }
                }else{
                    mui.toast("检测跟新失败，退出APP重试",{duration: 300});
                }
            }).catch((err) => {
                //plus.nativeUI.closeWaiting();
                mui.toast("亲，你的网络有点故障哦~",{duration: 300});
            });
        });
        
    }


    //更新窗口store数据 handle需要执行的方法字符串 index all:所有窗口 数字为倒数第N个
    UpdateMainViewStoreData(handle,index){
        let all = plus.webview.all(); //开发环境下 IOS默认2个窗口 Android只有一个 正式发布都只有一个
        //console.log("当前窗口的ID："+plus.webview.currentWebview().id);
        //this.Alert("all.length =>"+all.length);
        if(index){
            all[all.length - index].evalJS(handle);
        }else{
            for(let i =0;i<all.length;i++){
                //console.log("总窗口数："+all.length+"|第"+i+"个窗口的ID："+all[i].id);
                if(Global.appScenc != 1 && i == 0 && DEVICE == 'iOS') continue;
                //console.log("i => " + i + " ||| " + all[i].id + "| DEVICE:" + DEVICE);
                all[i].evalJS(handle);
            }
        }
    }

    //将cookie信息储存于localStore内
    SaveCookie(){
        let c = this.GetCookie();
        LocalStore.set("cookie",c,3600*24*7);
    }
    //将localStore内的cookie信息写入
    SetCookie(){
        let c = LocalStore.get("cookie");
        if(c){
            let t = new Date();
            t = t.getTime();
            t += 3600*24*7;
            c += `;expires=${new Date(t).toString()};path=/`;
            plus.navigator.setCookie( Global.host, c );
        }
    }
    //获取Cookie信息
    GetCookie(){
        return plus.navigator.getCookie(Global.host);
    }
    //删除所有Cookie信息
    RemoveCookie(){
        LocalStore.remove('cookie');
        plus.navigator.removeAllCookie();
    }
    //跳转页面
    Open(to,from,next){
        // console.log(`to:${to.fullPath},from:${from.fullPath},host:${Global.host}`)
        // console.log("--------------from:---------------")
        // for(let obj in from){
        //     console.log(obj+":"+from[obj]);
        // }
        // console.log("--------------to:---------------")
        // for(let obj in to){
        //     console.log(obj+":"+to[obj]);
        // }
        // console.log("--------------END---------------")
         //登录成功以后 直接关闭后退
        if(from.name == 'login' && to.name != "protocol" && to.name != "user-setup-pwd"){
            this.Back();
            return false;
        }
        //APP新开窗口处理方法
		if(from.fullPath != '/' && this.mainPage.indexOf(to.name) == -1){ //判断是否需要新开窗口 这些为一级页面
		    if(this.sonPage.indexOf(from.name) == -1) { //判断是否需要新开窗口 这些为二级页面 主要解决页面上存在TAB切换
                let view = plus.webview.open(`/index.html#${to.fullPath}`, to.name, "", "slide-in-right", 300);
                //检测答题状态 更新上一个窗口答题状态
                view.addEventListener("popGesture", e => {
                    if (e.result) {
                        this.UpdateMainViewStoreData("Service.GetMessages();", 1);
                    }
                }, false);
                return false;
            }
        }

        let path = location.hash.replace('#',''); //只有create的新窗口进来时才有数据
        //初始进入的时候处理方法
        //console.log("path => " + path);
		if(path){
			location.hash = '';
			next({path});
            return false;
        } else if(to.name != 'recommend') { //所有页面都不能异步 否则会自动跳转到首页
		    	document.title = to.meta.title;
		    	document.keywords = to.meta.keywords;
		    	document.description = to.meta.description;

		    	//校验是否需要登录
		    	if(to.meta && to.meta.auth){
                    Service.CheckLogin(to.fullPath).then(next);
		    	}else{
		    		next();
		    	}
            return false;
        }
        return true;
    }
    //后退 对就H5里的 router.go(-1)
    Back(){
        let all = plus.webview.all();
        //alert("in Back() => all.length:"+all.length);
        let can = 1;
        if(Global.appScenc != 1){ //不是正式环境 IOS默认多一个窗口
            if(DEVICE == 'iOS' && all.length <= 2) can = 0; //IOS
            if(DEVICE == 'Android' && all.length < 2) can = 0; //Android
        }else{
            if(all.length < 2) can = 0;
        }
        let answer = document.querySelector(".answer-dialog");
        if(can && !answer) //如果正在答题，则禁止返回
            plus.webview.currentWebview().close("slide-out-right");
        // if(isReload)
        //     //setTimeout(() => {
        //         console.log(all[all.length-2].id);
        //         all[all.length-2].reload();
        //     //}, 300);
    }
    //物理按键 返回
    KeyBack(){
        if(DEVICE == 'Android'){
            let timeout = 0;
            let route = vm.$route;
            let all = plus.webview.all();
            mui.back = () =>{
                if(all.length > 1){
                    this.Back();
                } else if(this.mainPage.indexOf(route.name) == -1){ //不是主页，需要返回
                    this.Back();
                } else if (!timeout) {
                    timeout = 1; //记录第一次按下回退键的时间
                    mui.toast('再按一次将退出应用'); //给出提示
                    setTimeout(function () {
                        timeout = 0
                    },1000);
                } else {
                    plus.runtime.quit();
                }
            }
        }
    }
    //重新渲染本页面 对应H5里的 router.replace()
    Reload(path,i){
        if(i == undefined) i = 1;
        else i = 2;
        let all = plus.webview.all();
        let index = all.length-i; //需要选择倒数第2个窗口
        let target = all[index];
        target.loadURL(`/index.html#${encodeURI(path)}`);
        if(i > 1){
            this.Back();
        }
    }
    //图片预览
    ImagePreview(imgList,index){
        plus.nativeUI.previewImage(imgList,{
            current: index,
            indicator: "number"
        });
    }
    //用于测试
    Alert(msg){
        if(store.getters.userInfo.user_id == 489){
            alert(msg);
        }
    }
}

export default HZApp;
