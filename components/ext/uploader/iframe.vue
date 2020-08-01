<template>
	<iframe :name="name" style="display:none"  ref="iframe"/>
</template>

<script>
export default {
	name:'uploadIframe',
	props: {
		name:{
			type: String,
			default: 'extUploadIframe'
		}
	},
	mounted() {
		let iframe = this.$el;
		iframe.addEventListener('load',()=>{
			var responseText = iframe.contentDocument.body.textContent;
			if(responseText && responseText!=''){
				var responseData = JSON.parse(responseText) || {};
				this.$emit('iframeReload',responseData)
			}
		})
	}
}
</script>



