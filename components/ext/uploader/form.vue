<template>
	<form :action="url" method="POST" :name="name" enctype="multipart/form-data" :target="target">
		<input type="file" accept="image/*" :name="field" ref="files" style="display:none" @change="change"  />
		<input v-for="(v,k,i) in extData" type="text" :name="k" :value="v" :key="i" style="display:none"/>
	</form>
</template>

<script>
import icon from './icons';

export default {
	name:'uploadIframe',
	components: {
        icon
    },
	data(){
		return {
			extData:{}
		}
	},
	props: {
		name:{
			type: String,
			default: 'extUploadForm'
		},
		target:{
			type: String,
			default: 'extUploadIframe'
		},
		data:{
			type: Object,
			default: {}
		},
		url:{
			type: String,
			default: ''
		},
		field:{
			type: String,
			default: 'file'
		}
	},
	methods: {
		submit(info) {
			if(info){
				this.submitBase64(info)
			}
			setTimeout(()=>{
				this.$el.submit();
			},0)	
		},
		submitBase64(info){
			this.$refs.files.type = 'text'
			this.$refs.files.value = info.image;
			this.extData = {
				crop:true,
				width:info.area.width,
				height:info.area.height
			}
		},
		change(e){
			this.$emit('selectFile',this.$refs.files.files)
		},
		selectFile(){
			this.$refs.files.click();
		}
	},
	mounted() {
		this.extData = this.data;
		this.selectFile()
	}
}
</script>