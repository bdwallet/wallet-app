import "./style";
import Vue from 'vue';
import dialog from './dialog';
import message from './message';
import action from './action';
import other from './other';
import proving from './proving';
import paypwd from './paypwd';
import reward from './reward';
import answer from './answer';
import mask from './mask';
import datePicker from './datepicker';
import loading from './loading';

// 更新相关弹窗
import Update from './Update'
import NewComes from './NewComes'

import {createElement} from '~script/utils';
let _vm;

class Dialog {
    init(type, comp) {
        let rnd = Math.random().toString(36).substring(3, 6);
        let marker = `comp-${type}-${rnd}`;
        createElement(marker);
        if (_vm && type == 'message') _vm.$destroy();//先关闭其它message弹框
        _vm = new Vue(comp).$mount(`[${marker}]`);
        _vm.$el.setAttribute('comp-dialog', '');
    }
    show(options, time, type) {
        if(!options) return;
        type = type || 'tip';
        this.init(type, dialog);
        if (typeof(options) == 'string' || typeof(options) == 'number')
            options = {
                content: options
            };
        if(type != "tip" && options && options.showBackdrop == undefined) //所有tip弹框不需要遮罩
            options.showBackdrop = true;
        options.type = type;
        options.time = time || 0;
        return _vm.show(options);
    }
    action(btns) {
        this.init("action", action);
        _vm.show(btns);
    }
    other(con,num,desc) {
        this.init("other", other);
        return _vm.show({con,num,desc});
    }
    msg(options, e) {
        this.init("message", message);
        if (typeof(options) == 'string')
            options = {
                content: options
            };
        // options.mark = "left";
        _vm.show(options, e)
    }
    alert(options, time) {
        if (typeof(options) == 'string') {
            let con = options;
            options = {
                title: con,
                btns: ['知道了']
            };
        }
        //针对去答题会多弹框单独处理，后期优化
        if(_vm && _vm.btns && _vm.btns[0] == "去答题" && options.btns[0] == "去答题") return {};
        return this.show(options, time, 'alert');
    }
    confirm(options, time) {
        return this.show(options, time, 'confirm');
    }
    success(options, timer) {
        timer = timer || 2000;
        if (typeof(options) == 'string') {
            let con = options;
            options = {
                content: con,
                icon: 'icon-wancheng'
            };
        }
        return this.show(options, time, 'success');
    }
    warning(options, timer) {
        timer = timer || 2000;
        if (typeof(options) == 'string') {
            let con = options;
            options = {
                content: con,
                icon: 'icon-gantanhao'
            };
        }
        return this.show(options, time, 'warning');
    }
    tip(options, timer) {
        timer = timer || 2000;
        return this.show(options, timer, 'tip');
    }
    pannel(options, time) {
        // if (options.close == undefined)
        //     options.close = true;
        return this.show(options, time, 'pannel');
    }
    /***
    滑动验证获取短信
    type: 必须 //01登录/注册 2用户找回密码 3手机绑定 4换绑验证原手机 5换绑验证新手机
    phone: 可选 手机号
    ***/
    proving(type,phone){
        this.init("proving", proving);
        return _vm.show(type,phone);
    }

    /**
     *  @desc
     *      支付密码弹窗
     */
    paypwd(phone){
        this.init("paypwd", paypwd);
        return _vm.show(phone)
    }
    /* 赞赏 */
    reward(give_num){
        this.init("reward", reward);
        return _vm.show(give_num);
    }
    /* 答题 */
    answer(){
        this.init("answer", answer);
        return _vm.show();
    }

    mask(options){
        this.init("mask", mask);
        return _vm.show(options);
    }


    // 更新弹窗
    update(options){
        this.init("update", Update);
        return _vm.show(options)
    }

    // 每次更新过后提示新人奖励100黑钻
    newComes(){
        this.init("newComes", NewComes);
        return _vm.show()
    }
    
    // 日期选择器
    datePicker(options) {
        this.init("datePicker", datePicker);
        return _vm.show(options)
    }
    
    // 加载中
    loading() {
        this.init("loading", loading);
        return _vm.show()
    }
    
    getState() {
        return _vm ? _vm.getState() : 0
    }

    
    
    hide(type) {
        if (_vm) {
            _vm.hide(type);
            _vm = undefined;
        }
    }
}
export default new Dialog();
