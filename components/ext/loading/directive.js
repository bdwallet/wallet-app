import Vue from 'vue'
import App from './app';
const LoadingConstructor = Vue.extend(App)

// 用于控制Loading的出现与消失
const toggleLoading = (el, binding) => {
	if(binding.value) { 
		Vue.nextTick(() => {
			// 如果是全屏
			if (binding.modifiers.fullscreen) { 
				el.originalPosition = document.body.style.position;
				el.originalOverflow = document.body.style.overflow;
				// 插入dom
				insertDom(document.body, el, binding); 
			} else {
				el.originalPosition = el.style.position;
				// 如果非全屏，插入元素自身
				insertDom(el, el, binding); 
			}
		})
	} else {
		if (el.domVisible) {
			el.instance.$on('after-leave', () => {
				el.domVisible = false;
				if (binding.modifiers.fullscreen && el.originalOverflow !== 'hidden') {
					document.body.style.overflow = el.originalOverflow;
				}
				if (binding.modifiers.fullscreen) {
					document.body.style.position = el.originalPosition;
				} else {
					el.style.position = el.originalPosition;
				}
			});
			el.instance.visible = false;
		}
	}
}

// 插入dom的逻辑
const insertDom = (parent, el, binding) => { 
	if(!el.domVisible) {
		Object.keys(el.loadingStyle).forEach(property => {
			el.loading.style[property] = el.loadingStyle[property];
		});
		if(el.originalPosition !== 'absolute') {
			parent.style.position = 'relative'
		}
		if (binding.modifiers.fullscreen) {
			parent.style.overflow = 'hidden'
		}
		el.domVisible = true;
		// 插入的是el.loading而不是el本身
		parent.appendChild(el.loading) 
		Vue.nextTick(() => {
			el.instance.visible = true;
		});
		el.domInserted = true;
	}
}


var Directive = {
	bind: (el, binding) => {
		// 实例化一个loading
		const loading = new LoadingConstructor({ 
			el: document.createElement('div'),
			data: {
				// 通过loading-text属性获取loading的文字
				text: el.getAttribute('loading-text'), 
				fullscreen: !!binding.modifiers.fullscreen 
			}
		})
		// el.instance是个Vue实例
		el.instance = loading; 
		
		// el.loading的DOM元素是loading.$el
		el.loading = loading.$el; 
		el.loadingStyle = {};
		toggleLoading(el, binding);
	},
	update: (el, binding) => {
		el.instance.setText(el.getAttribute('loading-text'))
		if(binding.oldValue !== binding.value) {
			toggleLoading(el, binding)
		}   
	},
	// 解绑
	unbind: (el, binding) => { 
		if(el.domInserted) {
			if(binding.modifiers.fullscreen) {
				document.body.removeChild(el.loading);
			}else {
				el.loading && el.loading.parentNode && el.loading.parentNode.removeChild(el.loading);
			}
		}
	}
};

export default Directive
