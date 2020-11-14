import RULES from './rules'
let Vue

function check (rule, field, value, isArray) {
  if (Array.isArray(rule)) {
    return rule.map(item =>
        check.call(this, item, field, value, true)
      ).indexOf(false) === -1
  }

  const $rules = this.$validata.$rules
  const $errors = this.$validata.$errors
  const regex = 'string' == typeof rule ? $rules[rule] :  ( 'string' == typeof rule.test ? $rules[rule.test] : rule)

  if (!regex || !regex.test) {
    console.warn('[validata] rule does not exist: ' + (rule.test || rule))
    return
  }
  regex.message = rule.message || regex.message

  const valid = 'function' == typeof regex.test ? regex.test.call(this, value) : regex.test.test(value)

  if (!isArray) {
    const oldError = $errors[field]

    if (valid) {
      Vue.delete($errors, field)
    } else if (!oldError) {
      Vue.set($errors, field, regex.message)
    }
  } else {
    const error = $errors[field] || []
    const oldError = error.indexOf(regex.message)

    if (valid) {
      oldError > -1 && error.splice(oldError, 1)
      if (!error.length) Vue.delete($errors, field)
    } else if (oldError < 0) {
      error.push(regex.message)
      Vue.set($errors, field, error)
    }
  }

  const hasError = Boolean(Object.keys($errors).length)
  this.$validata.error = hasError

  return valid
}

function init () {
  const rules = this.$options.validata

  /* istanbul ignore next */
  if (!rules) return

  this.$validata = new Validata(this)
  Object.keys(rules).forEach(field =>
    this.$watch(field, value => check.call(this, rules[field], field, value))
  )
}

const bailRE = /[^\w.$]/
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  } else {
    const segments = path.split('.')
    return function (obj) {
      for (let i = 0; i < segments.length; i++) {
        if (!obj) return
        obj = obj[segments[i]]
      }
      return obj
    }
  }
}

const Validata = function (_vm) {
  this.vm = _vm
  Vue.util.defineReactive(this, '$errors', {})
  Vue.util.defineReactive(this, 'error', false)
  Vue.util.defineReactive(this, 'emit', ()=>{})
}

Validata.prototype.check = function (fields) {
  const vm = this.vm
  const rules = vm.$options.validata
  const parse = Vue.util.parsePath || parsePath

  fields = fields || Object.keys(rules)

  return fields.map(field =>
    check.call(vm, rules[field], field, parse(field)(vm._data))
  ).indexOf(false) === -1
}

Validata.prototype.clear = function () {
  this.$errors = {}
  return this
}

export default function (_Vue, opts) {
  Vue = _Vue
  Validata.prototype.$rules = Object.assign({}, RULES, opts)
  Vue.mixin({ created: init })
}
