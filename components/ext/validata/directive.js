function addClass(el, cls) {
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) {
        return el.classList.add(c);
      });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = ' ' + el.getAttribute('class') + ' ';
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

function removeClass(el, cls) {
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) {
        return el.classList.remove(c);
      });
    } else {
      el.classList.remove(cls);
    }
  } else {
    var cur = ' ' + el.getAttribute('class') + ' ';
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    el.setAttribute('class', cur.trim());
  }
}





var Directive = {
  bind: function bind(el, binding, _ref) {
    var context = _ref.context;

    var hasValidata = binding.modifiers.parent ? Boolean(context.$parent.$options.validata) : Boolean(context.$options.validata);
	var infoClass = el.getAttribute('validata-info-class') || 'info';
    var errorClass = el.getAttribute('validata-error-class') || 'error';
	var successClass = el.getAttribute('validata-success-class') || 'success';

    if (!hasValidata) return;

    var vm = binding.modifiers.parent ? context.$parent : context;

    el.addEventListener('focus', function () {
      removeClass(el, errorClass);
    }, true);

    el.addEventListener('blur', function () {
      var err = vm.$validata.$errors[binding.value];
      if (err) {
        addClass(el, errorClass);
		
        vm.$emit('validata-error', binding.value, err);
      } else {
        removeClass(el, errorClass);
        vm.$emit('validata-success', binding.value);
      }
    }, true);
  },
  unbind: function unbind(el) {
    el.removeEventListener('blur',null,true);
    el.removeEventListener('focus',null,true);
  }
};

export default Directive
