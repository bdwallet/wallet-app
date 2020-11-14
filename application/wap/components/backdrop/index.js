import Vue from 'vue'
import App from './App'
import {createElement} from '~script/utils'

class Backdrop {
  constructor() {
    this._vm = undefined
    if (!document.querySelector('#comp-backdrop')) {
      createElement('#comp-backdrop')
    }
    
    this._vm = new Vue(App);
    this._vm.$mount('#comp-backdrop');
  }
  //显示遮罩
  show(callback) {
    this._vm.show(callback)
  }

  //隐藏遮罩 如果被show多次，则不隐藏
  hide() {
    if (this._vm) {
      this._vm.hide();
    }
  }
  
  //隐藏遮罩 被show多次也始终隐藏
  Clear(){
    this._vm.Clear();
  }
}

export default new Backdrop()
