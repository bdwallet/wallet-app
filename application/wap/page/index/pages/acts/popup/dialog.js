import "./style";
import Vue from 'vue'
import {createElement} from '~script/utils'

import Alert from './Alert'
import Rpalert from './Rpalert'

let _vm

class Dialog {
  show(type, options) {
    let rnd = Math.random().toString(36).substring(3, 6)
    let marker = `comp-${type}-${rnd}`
    createElement(marker)
    let selector = `[${marker}]`

    let comp;
    switch(type){
      case 'rpalert': comp = Rpalert;
      break;
      default: comp = Alert;
      break;
    }
    _vm = new Vue(comp).$mount(selector)

    _vm.$el.setAttribute('comp-dialog', '')
    return _vm.show(options)
  }

  alert(options) {
    return this.show('alert', options)
  }

  rpalert(options){
    return this.show('rpalert', options)
  }

  hide() {
    if (_vm) _vm.hide()
  }
}

export default new Dialog()
