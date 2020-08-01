import Validata from './validata'
import Directive from './directive'


function install (Vue, opts) {
	var name = arguments.length <= 1 || arguments[1] === undefined ? 'validata' : arguments[1];
    Validata(Vue, opts)
    return Vue.directive(name, Directive);
}


/* istanbul ignore next */
if (typeof window !== 'undefined' && window.Vue) {
  if (!install.installed) install(window.Vue)
}

var index = { install: install, Directive: Directive };

module.exports = index;
