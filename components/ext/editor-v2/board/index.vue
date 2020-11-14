<template>
	<div
		class="content" 
		ref="content" 
		spellcheck="false" 
		:contenteditable="!disabled" 
		:placeholder="placeholder"
		@click="onClick"
		@focus="onFocus" 
		@blur="onBlur" 
		@input="onChanged" 
		@keydown="onKeydown" 
		@keyup="onKeyup" 
		@paste="onPaste" 
		v-html="content" >
	</div>
</template>

<script>
	import { $, pasteText, getElementsByJson } from '../util'
	let isIE11 = true;
	export default {
		name: 'editorBoard',
		props: {
			editor:Object
		},
		data() {
			return{
				isEmpty:true,
				html:'',
				text:'',
			}
		},
		computed:{
			//是否禁用
			disabled(){
				return this.editor.disabled
			},
			// 占位
			placeholder(){
				return this.editor.placeholder
			},
			content(){
				let content = this.editor.content;
				if(!content || content==''){
					content = '<p><br/></p>'
				}
				if(this.editor.paragraph){
					content = this.formatHtml(content)
				}
				return content
			}
		},
		methods:{
			// 格式化默认内容,将标签替换为P
			formatHtml(content){
				content = content.trim();
				let html = '';
				let proxy = $(`<div>${content}</div>`);
				let tree = proxy.children()
				tree.forEach( node => {
					let tagName = node.tagName && node.tagName.toLowerCase()
					if(!tagName){//创建一个DIV容器，过虑用户输入的标签
						let _divBox = document.createElement('div');
						_divBox.innerText = node.textContent;
						html+= `<p>${_divBox.innerHTML}</p>`;
					}else{
						if(tagName=='p' || /^h/i.test(tagName)){
							html+= node.outerHTML
						}else if(tagName=='div'){
							html+= `<p>${node.innerHTML}</p>`
						}else{
							html+= `<p>${node.outerHTML}</p>`
						}
					}
				})
				return html
			},
			// 复制纯文本
			onPaste:pasteText,

			checkParagraph(){
				if(!this.editor.paragraph) return true;
				let cmdVal = this.editor.cmd.value('FormatBlock');
				let el = this.editor.selection.getRangeElem();
				let fixIe = el && (el.tagName=='P'||/^h/i.test(el.tagName));
				return cmdVal==='p' || /^h/i.test(cmdVal) || fixIe;
			},
			// 回车自动添加首行段落
			fixParagraphEmpty(){
				if(this.checkParagraph(1))return;
				let first = this.$el.firstChild;
				if(first && (first.tagName=='P'||/^h/i.test(first.tagName)))return
				let p = $('<p>&#8203;</br></p>');
				if(this.isEmpty){
					$(this.$el).append(p)
				}else{
					let el = this.$el.firstChild;
					let content = el.innerHTML||el.textContent;
					p = $(`<p>${content}</p>`);
					$(this.$el).prepend(p)
					$(el).remove()
				}
			},
			// 回车自动转换段落
			fixParagraph(){
				if(this.checkParagraph(2))return;
				let el = this.editor.selection.getRangeElem();
				
				if(!el || el==this.$el){
					let range = this.editor.selection.getDefaultRange()
					el = this.editor.selection.getRangeElem(range)
				}
				let p = $('<p>&#8203;</br></p>')
        p.insertBefore(el)
        // 重设光标
        let selection = this.editor.selection;
        selection.createRangeByElem(p[0], true)
        selection.restore()
        $(el).remove()
			},
			// 修正清空
			fixEmpty(e){
				let html = this.$el.innerHTML.toLowerCase().trim();
				if (!html || html === '<br>' || html===''){
					let p = $('<p><br/></p>')
					this.$el.innerHTML = p.outerHTML;
					this.editor.selection.createRangeByElem(p[0], false, true)
					this.editor.selection.restore()
				}				
			},
			// 修正tab
			fixTab(e){
				let keyCode = e.which;
				let isTab = keyCode==9;
				if(isTab){
					this.editor.cmd.do('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;')
					e.preventDefault();
				}
			},
			// 点击
			onClick(e){
				let img = e.target;
				if(img.tagName=='IMG'){
					$(img).addClass('current')
					this.editor.selection.createRangeByElem(img)
          this.editor.selection.restore()
				}else{
					this.removeImageCurrent()
				}
				this.editor.trigger('click',e)
			},
			removeImageCurrent(){
				let imgs = $(this.$el.getElementsByTagName('img'))
				imgs.forEach(img=>$(img).removeClass('current'))
			},
			// 聚焦
			onFocus(e){
				let onFocus = this.editor.onFocus
				onFocus && onFocus()
				this.editor.isFocused = true
				this.editor.trigger('focus',e)
			},
			// 失焦
			onBlur(e){
				this.onChanged();//兼容IE9+,Edge  失焦后获取一下文章内容
				this.removeImageCurrent()
				let onBlur = this.editor.onBlur
				onBlur && onBlur()
				this.editor.isFocused = false
				this.editor.trigger('blur',e)
			},
			// 内容改变
			onChanged(){
				isIE11 = false;
				this.html = this.$el.innerHTML.replace('<script>','&lt;script&gt;');
				this.html = this.html.replace('<\/script>','&lt;\/script&gt;');//过虑script标签
				this.text = this.$el.innerText;
				this.json = getElementsByJson(this.$el);
				this.fixEmpty();
				this.editor.trigger('changed',{
					html:this.formatHtml(this.html),//处理新增内容也全部替换为P标签
					//html:this.html,
					text:this.text,
					json:this.json
				})
				//this.editor.selection.restore()
			},
			// 键盘按下
			onKeydown(e){
				if(e.which==8) {
					let html = this.$el.innerHTML.toLowerCase().trim();
					if (html === '<p><br></p>')return e.preventDefault()
				}
				this.fixTab(e)
				this.editor.trigger('keydown',e)
			},
			// 键盘松开
			onKeyup(e){
				//兼容IE9+
				if(isIE11){
					this.onChanged();
					isIE11 = true;
				}
				if(e.which==8) {
					let html = this.$el.innerHTML.toLowerCase().trim();
					if (!html || html === '<br>' || html==''){
						let p = $('<p><br/></p>')
						this.$el.innerHTML = p[0].outerHTML;
						this.editor.selection.createRangeByElem(p[0], false, true)
        		this.editor.selection.restore()
					}
				}

				// 修正首行换行，排除退格删除
				//if(e.which!==8) this.fixParagraphEmpty(e);
				// 修正回车换行
				//if(e.which==13) this.fixParagraph();


				this.editor.trigger('keyup',e)
			},
			focus(){
				this.$el.focus()
			},
			blur(){
				this.$el.blur()
			}
		},
		mounted() {
			// 插入内容时修正段落<p>
			//this.editor.on('cmd',()=>this.fixParagraphEmpty())
			// 是否默认聚焦
			this.editor.focused && this.focus()
			// 是否默认失焦
			this.editor.blurd && this.blur()
		}
	}
</script>