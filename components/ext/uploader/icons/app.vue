<template>
  <svg class="icon-svg" viewBox="0 0 1024 1024" :width="width||30" :height="height||30" xmlns="http://www.w3.org/2000/svg">
    <path :d="_name()"/>
  </svg>
</template>

<script>
import d from './d';
export default {
	name:'extEditorIcon',
	props: {
		name:String,
		width:Number,
		height:Number
	},
	methods:{
		_name(){
			return d[this.name] || d['defaults']
		}
	}
}
</script>



