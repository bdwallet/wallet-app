<template>
	<div class="popup-container" :class="{'popup-showing active': state == 1, 'popup-showing popup-hidden': state == 2}">
		<div class="redpack-dialog">
			<div class="main" :style="{'backgroundImage':`url(${$assets.redpackDialog})`}">
				<div class="title" v-if="title" v-text="title" ></div>
				<div class="content" v-if="content" v-text="content"></div>
				<div class="btn sprites-activity-btn1" @click="onOk(true)" v-html="okText"></div>
				<i class="icon icon-dianji closebtn" @click="onOk(false)"></i>
			</div>
		</div> 
	</div>
</template>
<script>
	import mixin from './mixin'
	export default {
		mixins: [mixin],
		data(){
			return{
				title: '',
        content: '',
        okText: 'ok',
        state: 0 // 0: hidden, 1: showing, 2: active
			}
		},
		methods:{
		}
	}
	
</script>
<style lang="less" scoped>
	.redpack-dialog{
		pointer-events: auto;
		position: relative;
		display: flex;
    align-items: center;
    justify-content: center;
		.main{
			position: relative;
			top: -3.0rem;
			width: 15.9rem;
			height: 16.8rem;
			background-size: 100% 100%;
			background-repeat: no-repeat;
			.closebtn{
				position: absolute;
				bottom: -2.0rem;
		    left: 50%;
		    transform: translateX(-50%);
				font-size: 1.5rem;
				color: #fff;
			}
			.title{
				margin-top: 4.75rem;
				font-size: 1.4rem;
				text-align: center;
				font-weight: 600;
				color: #99211B;
			}
			.content{
				width: 12.0rem;
				margin: 1.65rem auto 0;
				font-size: 0.9rem;
				text-align: center;
				line-height: 1.25rem;
				color: #9F522E;
			}
			.btn{
				position: absolute;
				left: 2.125rem;
				bottom: 1.675rem;
				color: #FAD393;
				font-size: 0.8rem;
				text-align: center;
				line-height: 2.125rem;
			}
		}
	}
</style>