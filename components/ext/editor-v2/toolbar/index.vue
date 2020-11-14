<template>
	<div class="actionbar" ref="actionbar" :class="{'is-fixed':actionbarIsFixed}" :style="{width}">
		<li v-for="(v,k,i) in menus" :key="k" :class="{current:v.isCurrent}" :ref="k" class="button-item">
			<button class="button" type="button"  :title="v.title" :ref="`btn-${k}`">
			<icon :name="v.icon"/>
			</button>
		</li>
	</div>
</template>

<script>
	import icon from './icons';
	export default {
		name: 'editorToolbar',
		components: {
			icon
		},
		props: {
			editor:Object
		},
		data(){
			return {
				actionbarIsFixed:false,
			}
		},
		computed: {
			width(){
				return this.editor.containerWidth+'px'
			},
			menus(){
				return this.editor.menus
			}
		},
		mounted() {
			this.bindEvent()
			// 工具栏浮动
			this.addActionbarFixed();
		},
		methods:{
			bindEvent(){
				let eventTypes = ['click','mouseenter','mouseleave']
				let menus = this.menus
				for(var key in menus){
					let menu = menus[key]
					let element = this.$refs[key][0]
					let btnEl = this.$refs[`btn-${key}`][0]
					if(menu.init){
						menu.el = element
						menu.init.call(menu,this)
					}
					eventTypes.forEach(eventType=>{
						let handle = menu[eventType]
						handle && btnEl.addEventListener(eventType, e=>{
							handle.call(menu,e)
						}, false)
					})
				}
			},
			// 工具条浮动
			addActionbarFixed(){
				function getElementTop(element){
		　　　　var actualTop = element.offsetTop;
		　　　　var current = element.offsetParent;

		　　　　while (current !== null){
		　　　　　　actualTop += current.offsetTop;
		　　　　　　current = current.offsetParent;
		　　　　}

		　　　　return actualTop;
		　　}

				this.actionbarWidth = this.editor.containerWidth;
				let beforeScrollTop = document.body.scrollTop||document.documentElement.scrollTop;
				let actionbar = this.$refs.actionbar
				let defaultTop=getElementTop(actionbar)

				window.addEventListener('scroll', (e) => {
					let afterScrollTop = document.body.scrollTop||document.documentElement.scrollTop,
						delta = afterScrollTop - beforeScrollTop,
						top = getElementTop(actionbar);
						if(delta > 0){
							if(afterScrollTop>top){
								this.actionbarIsFixed = true
							}
						}else{

							if(afterScrollTop<=top+defaultTop){
								this.actionbarIsFixed = false
							}
						}
					setTimeout( ()=>beforeScrollTop = afterScrollTop, 250)
				}, true)
			},
		}
	}
</script>
	