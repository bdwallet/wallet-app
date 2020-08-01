<template>
	<div class="editor" :class="{disabled}" ref="main" :style="{width:width}">
		<editor-toolbar :editor="editor" ref="toolbar"></editor-toolbar>
		<editor-board :editor="editor" ref="board" :class="editorClass"></editor-board> 
	</div>
</template>

<script>
	import editorToolbar from './toolbar';
	import editorBoard from './board';
	import actions from './actions';
	import selection from './selection';
	import command from './command';
	
	export default {
		name: 'extEditor',
		components: {
			editorToolbar,
			editorBoard,
		},
		props: {
			// 宽
			width: {
				type: String,
				default: '100%'
			},
			placeholder: {
				type: String,
				default: '请输入内容...'
			},
			editorClass: {
				type: String,
				default: 'typography'
			},
			paragraph: {
				type: Boolean,
				default: true
			},
			// 是否禁用
			disabled: {
				type: Boolean,
				default: false
			},
			// 是否自动聚焦
			focused: {
				type: Boolean,
				default: false
			},
			onBlur:Function,
			onFocus:Function,
			changed: Function,
			content: String,
			uploadBase:String,
			toolbar:{
				type:Array,
				default:[]
			}
		},
		data(){
			return{
				containerWidth:0,
				html:'',
				tool:null,
				board:null,
				cmd:null,
				selection:null,
				panel:null,
				actions:null,
				menus:null,
				editor:null,
				isFocused:false,
				handlers:{},
				upImgstatus: 0
			}
		},
		watch: {
			'upImgstatus': function(val){
				this.$emit('upImgstatus',val)
			}
		},
		methods: {
			on(handler,fn){
				handler && handler.split(' ').forEach(handler=>{
					if(!this.handlers[handler]) this.handlers[handler] = []
					this.handlers[handler].push(fn);
				})
			},
			trigger(handler,value){
				if(this.handlers[handler])this.handlers[handler].forEach(fn=>fn(value))
			},
			focus(){
				this.board.focus()
			},
			currentToobar(){
				this.selection.saveRange()
				this.actions.current()
			},
			init(){
				this.containerWidth = this.$refs.main.clientWidth
				this.tool      = this.$refs.toolbar
				this.board     = this.$refs.board
				// 触发初始化事件
				this.$emit('init',{
					el:this.$el,
					append:(html)=>{
						this.content+=html
					},
					empty:()=>{
						this.content = ''
					},
					disable:()=>{
						this.disabled = true
					},
					enable:()=>{
						this.disabled = false
					}
				})
			}
		},
		created(){
			this.html      = this.content
			this.cmd       = new command(this)
			this.selection = new selection(this)
			this.actions   = new actions(this)
			this.menus     = this.actions.menus
			this.editor = this
			//window.editor = this;//测试用 
		},
		mounted() {
			if(!!window.ActiveXObject)this.on(' keyup cmd',(e)=>this.board.onChanged(e))
			this.on('click focus blur changed keyup keydown',this.currentToobar)
			this.on('changed',this.changed)
			this.$nextTick(()=>this.init())
		}
	}
</script>
<style lang="less" src="./style.less"></style>