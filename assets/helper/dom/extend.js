function hasClass(className, node) {
	return new RegExp("(\\s|^)" + className + "(\\s|$)").test(node.className);
}
export default {
	each(fn){
		let els = Array.prototype.slice.call(this);
		els.forEach((el,i)=>{
			fn && fn.call(this,el,i)
		});
		return this;
	},
	on(eventType,handler){
		return this.each((el,i)=>{
			el["handlerMap"] = {};
			el["handlerMap"][eventType] = handler;
			document.addEventListener ? el.addEventListener(eventType, handler) :el.attachEvent("on" + eventType, handler);
		})
	},
	off(eventType,handler){
		return this.each((el,i)=>{
			let handler = el["handlerMap"][eventType];
			document.removeEventListener ? el.removeEventListener(eventType, handler) :el.detachEvent("on" + eventType, handler);
			delete ele["handlerMap"][eventType];
		})
	},
	find(selector){
		var els = [];
		this.each((el,i)=>{
			el = el.nodeType == 1 ? el :el[0];
			els.push(this.constructor(selector, el));
		});
		return this.constructor(els[0]);
	},
	eq(i) {
		return this.constructor([ this[i] ]);
	},
	first() {
		return this.eq(0);
	},
	last() {
		return this.eq(this.length - 1);
	},
	attr(key, value) {
		return value ? this.each( el=> {
			el.setAttribute(key, value);
		}) :this[0].getAttribute(key);
	},
	html(val) {
		return val ? this.each( el=> {
			el.innerHTML = val;
		}) :this[0].innerHTML;
	},
	text(val) {
		return val ? this.each( el=> {
			el.innerText = val;
		}) :this[0].innerText;
	},
	val(val) {
		return val ? this.each( el=> {
			el.value = val;
		}) :this[0].value;
	},
	css(prop, value) {
		if (value == undefined) {
			if ("object" === typeof prop) {
				this.each(el=> {
					for (var k in prop) el.style[k] = prop[k];
				});
			} else {
				return this.length > 0 ? w.getComputedStyle ? w.getComputedStyle(this[0])[prop] :this[0].currentStyle[prop] :undefined;
			}
		} else {
			this.each( el=> {
				el.style[prop] = value;
			});
		}
		return this;
	},
	hasClass(className) {
		return hasClass(className, this[0]);
	},
	addClass:function(className) {
		return this.each(el => {
			if (!hasClass(className,el)) {
				el.className = [ el.className, className ].join(' ').replace(/(^\s+)|(\s+$)/g, '');
			}
		});
	},
	removeClass:function(className) {
		return this.each(el=> {
			if (hasClass(className,el)) {
				el.className = el.className.replace(new RegExp("(\\s|^)" + className + "(\\s|$)", "g"), " ").replace(/(^\s+)|(\s+$)/g, "");
			}
		});
	},
}


