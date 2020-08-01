export const replaceHtmlSymbol = html => {
    return html ? html.replace(/</gm, '&lt;').replace(/>/gm, '&gt;').replace(/"/gm, '&quot;').replace(/(\r\n|\r|\n)/g, '<br/>'):''
}

export const creatNode = (tag,html) => {
  let node = document.createElement(tag)
  if(html && html !=''){
    //兼容IE 防止script标签
    node.innerText = html;
  }
	return node
}

export const pasteText = e => {
    e.preventDefault();
    let text;
    
    let clipboardData = (e.originalEvent || e).clipboardData;
    if(clipboardData){
    	text = clipboardData.getData('text/plain') || "";
	    if (text !== "") return document.execCommand('insertText', false, text);
    }
    text = window.clipboardData.getData("text")||'';
    if (text !== "") {
      if (window.getSelection) {
        var node = creatNode('span',text);
        window.getSelection().getRangeAt(0).insertNode(node);
      } else {
        document.selection.createRange().pasteHTML(text);
      }
    }
}
export const getElementsByJson = element => {
  let result = []
  let children = Array.prototype.slice.call(element.childNodes || []) 
  children.forEach(el => {
      let res
      let nodeType = el.nodeType



      // 文本节点
      if (nodeType === 3) {
          res = replaceHtmlSymbol(el.textContent)
      }

      // 普通 DOM 节点
      if (nodeType === 1) {
          res = {
          	tagName:el.nodeName.toLowerCase()
          }
          let attrData = []
          let attrList = attrList = Array.prototype.slice.call(el.attributes || [])
          attrList.forEach(attr=>{
          	let name = attr.name;
            let value = attr.value;
            attrData.push({name, value})
          })
          res.attributes = attrData
          // children（递归）
          res.children = getElementsByJson(el)
      }
      result.push(res)
  })
  return result
}


function parseHTML(html) {
  var div = document.createElement("div"), ele = [];
  div.innerHTML = html;
  ele = div.childNodes;
  div = null;
  return ele.length == 1 ? ele :ele;
};

function toEments(ele) {
  if(!ele) return [];
  if (ele instanceof dom) {
    return ele
  }
  if(ele.nodeType){
    return [ele]
  }
  if(ele instanceof HTMLCollection || ele instanceof NodeList || ele instanceof Array){
    return ele
  }
  return parseHTML(ele)
};

function hasClass(className, node) {
  return new RegExp("(\\s|^)" + className + "(\\s|$)").test(node.className);
}

function dom(selector){
  let elements = toEments(selector) ;
  [].push.apply(this, elements);
  return this
}

dom.prototype = {
    constructor: dom,
    // 类数组，forEach
    forEach (fn) {
        let i
        for (i = 0; i < this.length; i++) {
            let elem = this[i]
            let result = fn.call(elem, elem, i)
            if (result === false) break
        }
        return this
    },
    eq:function(i) {
      return new dom(this[i]);
    },
    children(){
      return $(this[0].childNodes)
    },
    first:function() {
      return this.eq(0);
    },
    last:function() {
      return this.eq(this.length - 1);
    },
    append(children) {
        let $children = $(children);
        return this.forEach(elem => {
            $children.forEach(child => {
                elem.appendChild(child)
            })
        })
    },
    prepend(elem) {
        var firstChild;
        elem = toEments(elem);
        return this.forEach(function(node) {
            firstChild = node.firstChild;
            elem.forEach(function(ele) {
                node.insertBefore(ele,firstChild);
            })
        });
    },
    remove () {
        return this.forEach(elem => {
            if (elem.remove) {
                elem.remove()
            } else {
                let parent = elem.parentElement
                parent && parent.removeChild(elem)
            }
        })
    },
    nodeName() {
      return this[0].nodeName
    },
    tagName(){
      return this[0].tagName
    },
    addClass(className) {
        return this.forEach(ele=> {
          if (!hasClass(className,ele)) {
            ele.className = [ ele.className, className ].join(' ').replace(/(^\s+)|(\s+$)/g, '');
          }
        });
      },
      removeClass(className) {
        return this.forEach(ele=>  {
          if (hasClass(className,ele)) {
            ele.className = ele.className.replace(new RegExp("(\\s|^)" + className + "(\\s|$)", "g"), " ").replace(/(^\s+)|(\s+$)/g, "");
          }
        });
      },
    text(val) {
        if (!val) {
          return this[0].innerHTML.replace(/<.*?>/g, () => '')
        } else {
          return this.forEach(elem =>elem.innerText = val)
        }
    },
    parent() {
        return $(this[0].parentElement)
    },
    is (elem) {
      return this[0] === (elem.nodeType==1 ? elem : elem[0])
    },

    insertBefore: function (selector) {
        let $referenceNode = $(selector)
        let referenceNode = $referenceNode[0]
        if (!referenceNode) {
            return this
        }
        return this.forEach(elem => {
            let parent = referenceNode.parentNode
            parent.insertBefore(elem, referenceNode)
        })
    },
    insertAfter(selector) {
        let $referenceNode = $(selector)
        let referenceNode = $referenceNode[0]
        if (!referenceNode) return this
        return this.forEach(elem => {
            let parent = referenceNode.parentNode
            if (parent.lastChild === referenceNode) {
                parent.appendChild(elem)
            } else {
                parent.insertBefore(elem, referenceNode.nextSibling)
            }
        })
    }
}
export const $ = selector => new dom(selector)