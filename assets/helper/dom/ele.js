// 匹配类选择器 .demo
const regClass = /^(?:[\w\-_]+)?\.([\w\-_]+)/
	
// 匹配ID选择器 #demo
const regId = /^(?:[\w\-_]+)?#([\w\-_]+)/
	
// 匹配标签选择器 div
const regTag = /^([\w\*\-_]+)/
	
// 获取选择器
const getName = (selector,regular) => (selector.match(regular) || [ null, null ])[1]

// 获取 dom
const getElement = (selector, context) => {
		
	if(!context.nodeType) return false;	
	
	// body对象
	if (selector === 'body') return document.body;
	
	// 获取选择器名
	let IdName    = getName(selector,regId),
		TagName   = getName(selector,regTag),
		ClassName = getName(selector,regClass);
	
	// ID 对象 #test
	if (IdName) return document.getElementById(IdName);

	let nodes = context.getElementsByClassName(ClassName);

	// Tag和ClassName 对象 div.test
	if (ClassName && TagName) return nodes.fliter(el=>el.tagName.toLowerCase() == TagName)
		
	// ClassName 对象 .test
	if (ClassName) return nodes;
	
	// Tag 对象 div
	if (TagName) {
		var node = context.getElementsByTagName(TagName);
		if(node.length) return node
	}

	// 文本对象
	return [(context||document).createTextNode(selector)];
}

export default getElement
