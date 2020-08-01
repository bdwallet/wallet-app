<template>
  <svg class="editor-icon" viewBox="0 0 1024 1024" :width="18" :height="16" xmlns="http://www.w3.org/2000/svg">
    <path :d="_name()"/>
  </svg>
</template>

<script>
import d from './d';
export default {
	name:'extEditorIcon',
	props: {
		name:String
	},
	methods:{
		_name(){
			
			return d[this.name] || d['defaults']
		}
	}
}
</script>



