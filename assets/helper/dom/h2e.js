var rtagname = /<([\w:]+)/,
	regParse = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
	wrapMap = {
		option   : [1, '<select multiple="multiple">', '</select>'],
		legend   : [1, '<fieldset>', '</fieldset>'],
		thead    : [1, '<table>', '</table>'],
		tr       : [2, '<table><tbody>', '</tbody></table>'],
		td       : [3, '<table><tbody><tr>', '</tr></tbody></table>'],
		col      : [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
		area     : [1, '<map>', '</map>'],
		_default : [0, '', '']
	},
	nodeNames = 'abbr article aside audio bdi canvas data datalist details figcaption figure footer '
			  + 'header hgroup mark meter nav output progress section summary time video',
	
	safeFragment = createFragment(document);
			
function createFragment(context) {
	var list = nodeNames.split(' '), frag = context.createDocumentFragment();
	if (frag.createElement) {
		for (;list.length;) {
			frag.createElement(list.pop());
		}
	}
	return frag;
}

function merge(first, second) {
	var i = first.length, j = 0;
	if (typeof second.length === "number") {
		for (var l = second.length; j < l; j++) {
			first[i++] = second[j];
		}
	} else {
		while (second[j] !== undefined) {
			first[i++] = second[j++];
		}
	}
	first.length = i;
	return first;
}

function parseHTML(html, context){
	var frag, elem, div, tag, wrap, depth,
	ret = [], context = context || document;
	
	if(!html && html!==''){
		return [];
	}
	
	// 简单标签 <div></div>
	var parsed = regParse.exec( html )
	if ( parsed ) {
		return [ context.createElement( parsed[1] ) ];
	}
	
	// 文本对象
	var isText = !/<|&#?\w+;/.test(html);
	if (isText) {
		return [ context.createTextNode( html ) ];
	} 
	
	
	//#document-fragment
	frag = (context === document && safeFragment) || createFragment(context);
	
	// 创建一个div, 并将其插入到文档碎片中
	div = context.createElement('div');
	frag.appendChild(div);
	
	/* 
		除了area,br,col,embed,hr,img,input,link,meta,param这些标签外,
		将开始标签末尾加入斜杠的标签转换为开始和结束标签
	*/
	html = html.replace(/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, "<$1></$2>");

	// 获取标签元素
	tag = (rtagname.exec(html) || ['', ''])[1].toLowerCase();
	
	// 获取最外层元素的包裹元素,并将元素包裹在其中
	wrap = wrapMap[tag] || wrapMap._default;
	depth = wrap[0];	
	div.innerHTML = wrap[1] + html + wrap[2];
	
	// 如果元素的包裹深度大于1,div重新赋值为元素最近的包裹元素(即:包含第一层包裹元素)
	while (depth--){
		div = div.lastChild;
	}
						
	// 获取已经处理完毕的div子节点集合(nodeList对象)
	elem = div.childNodes;
	
	// 在下一次循环处理字符串数组项前,清除处理创建过的div元素
	div.parentNode.removeChild(div);
	
	// 如果elem为DOM节点(文本节点)
	if (elem.nodeType) {
		ret.push(elem);
	} else {		
		merge(ret, elem);
	}	
	elem = div = frag = null;
			
	return ret;
}

export default parseHTML;