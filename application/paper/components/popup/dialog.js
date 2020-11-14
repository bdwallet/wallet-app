import "./style";
import Vue from 'vue'
import {createElement} from '~script/utils'

import Alert from './Alert'
import Confirm from './Confirm'
import Tip from './Tip'
import Pannel from './Pannel'

let _vm

class Dialog {
  show(type, options) {
    let rnd = Math.random().toString(36).substring(3, 6)
    let marker = `von-${type}-${rnd}`
    createElement(marker)
    let selector = `[${marker}]`

    let comp;
    switch(type){
      case 'alert': comp = Alert;
      break;
      case 'confirm': comp = Confirm;
      break;
      case 'tip': comp = Tip;
      break;
      case 'pannel': comp = Pannel;
      break;
      default: comp = Alert;
      break;
    }
    _vm = new Vue(comp).$mount(selector)

    _vm.$el.setAttribute('von-dialog', '')
    return _vm.show(options)
  }

  alert(options) {
    return this.show('alert', options)
  }

  confirm(options) {
    return this.show('confirm', options)
  }

  tip(options){
    return this.show('tip', options)
  }

  pannel(options){
    return this.show('pannel', options)
  }

  hide() {
    if (_vm) _vm.hide()
  }
}

export default new Dialog()
