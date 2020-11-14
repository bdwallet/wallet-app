import Directive from './directive'

function install (Vue, opts) {
	var name = arguments.length <= 1 || arguments[1] === undefined ? 'extLoading' : arguments[1];

    return Vue.directive(name, Directive);
}

if (typeof window !== 'undefined' && window.Vue) {
  if (!install.installed) install(window.Vue)
}

var index = { install: install, Directive: Directive };

module.exports = index;


