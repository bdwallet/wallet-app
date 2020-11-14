<template>
	<div class="layout-header">
		<!-- 关注浮框 -->
		<div v-if="showFollowPannel" class="fixed followPannl">
			<div class="follow-left left">
				<div class="follow-logo left" :style="{'background-image':`url(${$assets.proFollowLogo})`}"></div>
				<div class="follow-desc left">
					<p class="p1">关注黑钻评级公众号,立领50黑钻</p>
					<p class="p2">上黑钻评级,知项目好坏</p>
				</div>
			</div>
			<div class="follow-btn right" @click.stop="openDialog(true)">立即关注</div>
		</div>
		<!-- 二维码弹框 -->
		<div v-show="showDialog" class="wxcode-dialog" @click="openDialog(false)">
			<div class="wxcode-box" :style="{'background-image':`url(${$assets.proWxcodeBg2})`}" @click.stop>
				<ul class="reasons">
					<li>
						<div class="point"></div>
						<div>随时查看600+项目评级</div>
					</li>
					<li>
						<div class="point"></div>
						<div>成为超级评审员，发评级赚黑钻</div>
					</li>
					<li>
						<div class="point"></div>
						<div>参与社区共建，共享平台分红</div>
					</li>
					<li>
						<div class="point"></div>
						<div>新用户关注，立领50黑钻</div>
					</li>
				</ul>
				<div class="wxcode">
					<div class="wxcode-img"><img src="https://heizuan.oss-cn-shenzhen.aliyuncs.com/images/hzpjewm.jpg" /></div>
					<div class="zhiwen">
						<div class="zhiwen-img"><i class="icon icon-zhiwenrenzheng"></i></div>
						<div class="zhiwen-text">长按识别二维码</div>
					</div>
				</div>
			</div>
			<div class="wxcode-close-btn" @click="openDialog(false)">
				<i class="icon icon-dianji"></i>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "layoutHeader",
		components: {},
		data() {
			return {
				showFollowPannel:true
			}
		},
		computed: {
			showDialog() {
				return this.$store.getters.showWxcode;
			}
		},
		methods: {
			//去关注点击事件
			AttentionClickEvent() {},
			openDialog(status) {
				this.$store.commit('changeShowWxcode', {status});
			}
		},
		mounted() {}
	}
</script>

<style lang="less">
	@import "../assets/css/config";
	.followPannl {
		top: 0;
		z-index: 9;
		display: flex;
		height: 2.5rem;
		padding: 0 .75rem;
		background: rgba(0, 0, 0, .6);
		align-items: center;
		justify-content: space-between;
		.follow-left {
			display: flex;
		}
		.follow-logo {
			width: 1.7rem;
			height: 1.7rem;
			border: .025rem solid #5a5a5a;
			border-radius: .2rem;
			background-size: cover;
			background-repeat: no-repeat;
		}
		.follow-desc {
			margin-left: .3rem;
			line-height: 1.4;
			color: #fff;
			.p1 {
				line-height: 1.6;
				font-size: .6rem;
			}
			.p2 {
				font-size: .55rem;
				font-weight: 300;
			}
		}
		.follow-btn {
			text-align: right;
			padding: .3rem .45rem;
			background: #5682FF;
			border-radius: .1rem;
			line-height: 1;
			font-size: .6rem;
			color: #fff;
		}
	}
	.wxcode-dialog {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 8;
		background: rgba(0, 0, 0, .4);
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		.wxcode-box {
			text-align: center;
			width: 14rem;
			height: 16.55rem;
			background-size: 100% 100%;
			background-position: center center;
			.reasons{
				margin-top:4.35rem;
				li{
					display: flex;
					margin-top:.75rem;
					flex-direction:row;
					align-items: center;
					padding-left:1.6rem;
					font-size: .7rem;
					line-height: 1;
					color:@color-dec;
					.point{
						width: .2rem;
						height: .2rem;
						margin-right:.7rem;
						border-radius: 50%;
						background: #FFB400;
						box-shadow: 0 0 0 .1rem rgba(255,180,0,.4);
					}
				}
			}
			.wxcode{
				display: flex;
				align-items: center;
				padding-top:1.7rem;
				padding-left:1.5rem;
				.wxcode-img{
					width: 4.85rem;
					height:4.85rem;
					font-size: 0;
					line-height: 1;
					img{
						display: block;
						width: 100%;
						height: 100%;
					}
				}
				.zhiwen{
					margin-left:2rem;
					.zhiwen-img{
						width: 2.25rem;
						height: 2.25rem;
						line-height: 1;
						.icon{
							font-size:2.25rem;
							color:@color-dec;
						}
					}
					.zhiwen-text{
						margin-top:.5rem;
						font-size: .7rem;
						color:@color-dec;
					}
				}
			}
		}
		.wxcode-close-btn {
			display: none;
			margin-top: 30px;
			cursor: pointer;
			.icon {
				line-height: 1;
				font-size: 30px;
				color: #fff;
			}
		}
	}
</style>