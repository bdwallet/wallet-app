
const DEBUG = process.env.NODE_ENV !== 'production';
import Vue from 'vue';

Vue.config.debug = debug;
Vue.config.devtools = debug;
Vue.config.productionTip = debug;

import Assets from '~assets';
import Global from '~script/global';
import Api from '~script/api';
import Ajax from '~script/http';
import Dialog from '~components/compDialog/index.js';
import Backdrop from '~components/backdrop'; //仅消息页用到

const isApp = Global.isApp;
const HZ_DEVICE = {
    other:0,
    wx:1,
    android:2,
    ios:3,
};
let Device = HZ_DEVICE.other;

const Initialize = function(){
    if(navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1)
        Device = HZ_DEVICE.wx;
    else if(isApp){
        if(plus.os.name == "iOS")
            Device = HZ_DEVICE.ios;
        else
            Device = HZ_DEVICE.android;
    }
}