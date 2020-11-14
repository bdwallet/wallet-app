function command(editor) {
    this.editor = editor
}
command.prototype = {
  constructor: command,
  do(name,value){
    let editor = this.editor

    // 禁用状态不可用
    if(editor.disabled) return

    // 恢复光标位置
    if(editor.selection.getRange()){
      editor.selection.restore()
    }

    // 插入前检查是否有焦点
    if(!editor.isFocused){
        //此方法在chrome下不运行 在IE内核下运行导致点击导航栏上滑现象,故此时去掉
        if((document.documentMode || +(navigator.userAgent.match(/MSIE (\d+)/) && RegExp.$1))==0){
          //非ie内核
          editor.focus()
        }    
    }

    // 执行扩展和原生方法
  	let _name = `_${name}`
    if (this[_name]) {
      this[_name](value)
    } else {
      this._execCommand(name, value)
    }

    editor.selection.saveRange()
    editor.selection.restore()

    // 触发监听队列
    editor.trigger('cmd',{name,value})
  },
  styleWithCSS(){
		document.execCommand('styleWithCSS', null, true)
	},
	_insertHTML(html){
    const range = this.editor.selection.getRange()

    if (this.supported('insertHTML')) {
        // W3C
        this._execCommand('insertHTML', html)
    } else if (range.insertNode) {
        // IE
        let node = document.createElement('span')
        node.innerHTML = html;
        range.deleteContents()
        range.insertNode(node)
        node =null
    } else if (range.pasteHTML) {
        // IE <= 10
        range.pasteHTML(html)
    } 
	},
	_insertElement: function (el) {
	  let range = this.editor.selection.getRange()
	    if (range.insertNode) {
	      range.deleteContents()
	      range.insertNode(el)
	    }
	},
	_execCommand(name, value) {
    document.execCommand(name, false, value)
  },
  value: function (name) {
    return document.queryCommandValue(name)
	},
	state: function (name) {
    return document.queryCommandState(name)
  },
  supported: function (name) {
    return document.queryCommandSupported(name)
  }
}
export default command