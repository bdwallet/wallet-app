import Vue from 'vue'
import App from './App'
import {createElement} from '~script/utils'

class Backdrop {
  constructor() {
    this._vm = undefined
  }

  show(allowTouchMove) {
    if (!document.querySelector('[von-backdrop]')) {
      createElement('von-backdrop')
    }

    this._vm = new Vue(App)
    this._vm.$mount('[von-backdrop]')

    setTimeout(() => {
      this._vm.show(allowTouchMove)
    })

    return new Promise((resolve) => {
      setTimeout(() => {
        this._vm.show(allowTouchMove)
        resolve()
      })
    })
  }

  hide(allowTouchMove) {
    if (this._vm) {
      this._vm.hide(allowTouchMove).then(() => {
        this._vm.$destroy()
      })
    }
  }

  getState() {
    return this._vm ? this._vm.getState() : 0
  }
}

export default new Backdrop()
