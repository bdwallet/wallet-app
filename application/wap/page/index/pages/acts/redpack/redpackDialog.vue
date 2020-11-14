<template>
	<div class="redpack-dialog">
		<div class="main" :style="{'backgroundImage':`url(${$assets.redpackDialog})`}">
			<div class="title">每日登录有奖</div>
			<div class="content">
				恭喜你完成登录任务，获得1次抽卡机会
			</div>
			<div class="btn sprites-activity-btn1">完成更多任务，抽取大奖</div>
		</div>
	</div>
</template>
<style lang="less" scoped>
	.redpack-dialog{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
    align-items: center;
    justify-content: center;
		background-color: rgba(0,0,0,0.75);
		.main{
			position: relative;
			top: -3.0rem;
			width: 15.9rem;
			height: 16.8rem;
			background-size: 100% 100%;
			background-repeat: no-repeat;
			.title{
				margin-top: 4.75rem;
				font-size: 1.4rem;
				text-align: center;
				font-weight: 600;
				color: #99211B;
			}
			.content{
				width: 12.7rem;
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