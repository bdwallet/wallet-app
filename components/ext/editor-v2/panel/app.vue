<template>
	<div class="editor-panel" v-if="visible">
		<component :is="component" class="panel-item" :class="name" :button="button" :editor="button.editor"></component>
	</div>
</template>

<script>
	export default {
		name: 'editorPanel',
		data(){
			return{
				visible:false,
				keyPrefix: 'editor-panel-'
			}
		},
		computed:{
			component(){
				return this.$options.config.component
			},
			button(){
				return this.$options.config.button
			},
			name(){
				return this.keyPrefix + this.button.constructor.name;
			}
		},
		methods: {
      show(){
      	this.visible = true
      },
      close(){
      	this.visible = false
      },
      getTarget(ele,target){
      	if(!ele || ele === document) return false;
			  return ele === target ? true : this.getTarget(ele.parentNode,target);
      },
      bindClose(){
      	document.addEventListener('click',e=>{
					let isBtn = this.getTarget(e.target,this.button.el)
					let isPanel = this.getTarget(e.target,this.$el)
					!isBtn && this.close()
				},false)
      }
		},
		mounted() {
			this.bindClose();
			let button = this.$options.config.button.el
			button.appendChild(this.$el)
		}
	}
</script>