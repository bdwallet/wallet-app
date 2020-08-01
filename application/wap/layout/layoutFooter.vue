<template>
	<div class="layout-footer">
		<ul class="tab" ref="tabs">
			<router-link tag="li" v-for="item in $global.nav" :key="item" :to="item.to">
				<i :class="`sprites-tab-${item.flag}`"></i>
				<!-- <i :class="['icon',item.icon]">
					<div v-show="item.flag=='notify' && $store.getters.haveMessage" class="spot"></div>
					<div v-show="item.flag=='store'" class="spot txt">交易所</div>
				</i> -->
				<p>{{item.title}}</p>
			</router-link>
		</ul>
	</div>
</template>

<script>
	export default {
		name: "layoutFooter",
	};
</script>

<style lang="less">
	@import "../assets/css/config";
	.layout-footer {
		//处理IOS X上，底部遮挡问题
		@media only screen and (min-width: 375px) and (min-height: 800px) and (-webkit-device-pixel-ratio: 3) {
			padding-bottom: 1rem;
		}
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 5;
		background: rgba(255,255,255,.98);
		.tab {
			display: -webkit-flex;
			display: flex;
			max-width: 768px;
			height: @tab-height;
			margin: 0 auto;
			border-top: 0.025rem solid @color-border-main;
			align-items: center;
			justify-content: center;
			li {
				display: flex;
				flex-direction: column;
				align-items: center;
				-webkit-flex: 1;
				flex: 1;
				padding-top: .4rem;
				font-size: 0.5rem;
				color: @color-dec;
				text-align: center;
				// p{
				// 	transition: .2s all ease-in;
				// 	transform: scale(1);
				// }
				&.current {
					color: @color-sub;
					i{
						background-position-y: 0;
					}
					// p{
					// 	transform: scale(0);
					// }
				}
			}
		}
	}
</style>
