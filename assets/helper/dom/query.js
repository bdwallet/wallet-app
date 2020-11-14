import fliter from './fliter';

const query = (selector, context) => {

	// 选择器
	var selector = selector || document;
	
	//  DOM 节点上下文
	var context  = context  || document; 
	
	// 如果选择器是 window或document
	if(selector === window || selector === document) context = selector
	
	// 转换字符串
	if('number' == typeof selector) selector = selector + '';
	var elements = selector
	
	// 字符串
	if('string' == typeof selector) elements = fliter(selector, context);	
	
	// dom对象
	if(elements.nodeType) elements = [elements]
	
	// 转换为真数组
	elements = Array.prototype.slice.call(elements);
	return {elements, selector, context};
}

export default query
