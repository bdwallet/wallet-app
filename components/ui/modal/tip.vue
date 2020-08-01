<template>
	<div v-show="tipVisible" class="ui-message-tip" :class="maskClass" >
		<i class="icon" :class="icon"></i><span class="msg" >{{text}}</span>
	</div>
</template>
<script>
export default {
	props: {
		text: String,
		type: String
	},
	data(){
		return {
			visible:false,
			tipVisible:false,
			maskClass:[]
		}
	},
	watch:{
		visible(state){
			this.maskClass=[this.type];
			if(state){
				this.maskClass.push('ui-message-tip-in');
				this.tipVisible = state
				setTimeout(()=>this.visible=false, 3000);
			}else{
				this.maskClass.push('ui-message-tip-out')
				setTimeout(()=>this.$destroy(), 1000);
			}
		}
	},
	computed: {
		icon(){
			let name = 'info';
			if(this.type=='error'){
				name = 'error'
			}else if(this.type=='success'){
				name = 'success'
			}
			return `icon-${name}`
		}
	},
	mounted() {
		document.body.appendChild(this.$el);
		this.visible = true;
	},
	beforeDestroy() {
		document.body.removeChild(this.$el);
	}
};
</script>
<style lang="less">
//@import "../style/inc/config";
//@import "../style/inc/color";
.ui-message-tip {
	position: fixed;
	top: 76px;
	left: 50%;
	min-width: 50px;
	height: 36px;
	line-height: 36px;
	font-size: 12px;
	padding: 0 20px;
	color: #444;
	transform: translate(-50%,0);
	z-index: 99999;
	border-radius: 3px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.18);

	.icon {
		font-size: 16px;
		margin-right: 8px;
	}

	&.primary{
  	background-color: #def4ff;
		.icon{
			color:#0099cc;
		}
	}
	&.error{
  	background-color: #ffe9e7;
		.icon{
			color:#ea1d38;
		}
	}
	&.success{
  	background-color: #eeffde;
		.icon{
			color:#3daf2c;
		}
	}
	
	&.ui-message-tip-in{
		animation:0.5s ease-out backwards;
		animation-name:ui-message-tip-in;
	}
	&.ui-message-tip-out{
		animation:0.5s ease-in forwards;
		animation-name:ui-message-tip-out;
	}
	@keyframes ui-message-tip-in{
		0%{
			opacity:0;
			transform:translate(-50%,-10px);
		}
		100%{
			opacity:1;
			transform:translate(-50%,0);
		}
	}
	@keyframes ui-message-tip-out{
		0%{
			opacity:1;
			transform:translate(-50%,0);
		}
		100%{
			opacity:0;
			transform:translate(-50%,-10px);
		}
	}
}
</style>