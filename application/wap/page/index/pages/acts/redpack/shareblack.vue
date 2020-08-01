<template>
	<div class="redpack-black" @click="$emit('showshare',false)">
		<div class="shareblack" :style="{'backgroundImage':`url(${$assets.redpackShareBg})`}" >
				<div class="tip">tips:多多分享会提升中奖概率哦!</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'redpackBlack',
		data(){
			return{
			}
		},
		methods:{
		},
		mounted(){

		}
	}
</script>
<style lang="less">
	.redpack-black{
		width: 100vw;
		height: 100vh;
		color: #FFCE76;
		.shareblack{
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 23;
			background-color: rgba(0,0,0,0.75);
			background-size: 100% 26.4rem;
			background-repeat: no-repeat;
			.tip{
				position: absolute;
				width: 100%;
				bottom: 1.3rem;
				text-align: center;
				font-size: 0.7rem;
			}
		}
	}
</style>