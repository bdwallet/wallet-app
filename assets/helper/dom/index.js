import query from './query';
import extend from './extend';
const dom = (selector, context) => new dom.fn.init(selector, context);
dom.fn = dom.prototype = Object.assign(extend,{
	constructor: dom,
	init(selector, context){
		var result = query(selector, context);
		this.length = 0;
		this.selector = result.selector;
		this.context  = result.context;
		[].push.apply(this, result.elements);
		return this;
	}
});
dom.fn.init.prototype = dom.fn;
export default dom
