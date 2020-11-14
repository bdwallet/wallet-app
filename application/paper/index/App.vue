<template>
	<div class="paper" :style="{'background-image':`url(${$assets.paperMainBg})`}">
		<div class="paper-main">
			<keep-alive include="archives,ranking">
				<router-view />
			</keep-alive>
			<!-- 关注二维码 -->
			<div class="sharecode" v-show="showDialog">
				<div class="sharebg" :style="{'backgroundImage': 'url('+$assets.paperDialogBg+')'}">
					<img :src="$assets.rcode">
					<p class="first">长按识别二维码</p>
					<p>关注黑钻评级</p>
					<p class="last">为金镰刀得主疯狂打call</p>
					<i class="iconfont icon-close" @click="$store.commit('changeShowWxcode', {status:false});"></i>
				</div>
				<div class="blackzoom"></div>
			</div>
		</div>
		<!-- 二维码弹框 -->
		<div v-show="showWxcodeDialog" class="wxcode-dialog" @click="$store.commit('changeShowWxcodeDialog', {status:false});">
			<div class="wxcode-box" :style="{'background-image':`url(${$assets.wxcodeBg})`}" @click.stop>
				<ul class="reasons">
					<li>
						<div>不好意思，让您看到我们系统脆弱的一面</div>
					</li>
					<li>
						<div>请添加客服微信，我们将立即协助您解决问题</div>
					</li>
				</ul>
				<div class="wxcode">
					<div class="wxcode-img"><img src="https://heizuan.oss-cn-shenzhen.aliyuncs.com/h5images/kefucode.png" /></div>
					<div class="zhiwen">
						<div class="zhiwen-img"><i class="iconfont icon-zhiwenrenzheng"></i></div>
						<div class="zhiwen-text">长按识别二维码</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 点赞动效 -->
		<div class="like-icon" id="like-icon"></div>
	</div>
</template>

<script>
	const name = 'main';
	export default {
		name,
		components: {},
		data() {
			return {}
		},
		computed: {
			showDialog() {
				return this.$store.getters.showWxcode;
			},
			userInfo(val) {
				return this.$store.getters.userInfo;
			},
			showWxcodeDialog(){
				return this.$store.getters.showWxcodeDialog;
			}
		},
		methods: {
			get_is_user_attention() {
				let params = {
					open_id: this.$store.getters.userInfo.user_openid || 'olKD-072VYpkItF37cUHdQWf3y9s',
				}
				this.$ajax.get(this.$api.apply.is_user_attention, params).then(res => {
					if (res.status == 1) {
						if (res.data.user_is_attention != this.userInfo.user_is_attention) {
							let userInfo = this.$store.getters.userInfo;
							userInfo.user_is_attention = res.data.user_is_attention;
							this.$store.commit("update", {
								userInfo
							})
						}
					}
				}).catch(err => {
					this.$dialog.alert({
						title: '系统消息',
						content: err.message,
						okText: '知道了'
					});
				})
			}
		},
		beforeMount() {},
		mounted() {
			this.$store.commit('saveHref', {
				href: location.href
			});
			this.get_is_user_attention();
		},
		updated() {},
	}
	window.doLikeAnimation = function(e) {
		let div = document.getElementById("like-icon");
		let div2 = document.createElement("div");
		div.style.display = "flex";
		let img = new Image();
		img.src = "https://heizuan.oss-cn-shenzhen.aliyuncs.com/paper/icon-like.png";
		img.onload = function() {
			div.appendChild(img);
			setTimeout(() => {
				img.style.transform = "scale(1)";
			}, 50);
			setTimeout(() => {
				let X = e.x - div.offsetLeft - div.clientWidth / 2;
				let Y = e.y - div.offsetTop - div.clientWidth / 2;
				div.style.transform = `translate(${X}px,${Y}px) scale(0)`;
			}, 800);
			setTimeout(() => {
				div2.style.width =
					div2.innerText = "+1";
				div2.className = "like-text";
				div2.style.top = `${e.y-20}px`;
				div2.style.left = `${e.x-20}px`;
				document.body.appendChild(div2);
			}, 1100);
			setTimeout(() => {
				document.body.removeChild(div2);
				div.style = null;
				div.removeChild(img);
			}, 2000);
		}
	}
</script>

<style lang="less">
	@import "../assets/css/config";
	.paper {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
		/* 用于 ios5+ */
		background-repeat: no-repeat;
		background-position: center center;
		background-size: 100% 100%;
		.paper-main {
			position: relative;
			top: 0;
			left: 0;
			width: 100%;
			height: auto;
			.user-card {
				display: flex;
				flex-shrink: 0;
				flex-direction: column; //margin-bottom: .2rem;
				overflow: hidden;
				transition: all .5s; //animation :moveToCenter 2s infinite;
				.score {
					padding: .35rem 0 0 .35rem;
					line-height: 1;
					font-size: .6rem;
					color: #4B1802;
				}
				.avatar {
					line-height: 1;
					margin: 0 auto;
				  display: flex;
			    justify-content: center;
			    align-items: center;
					img {
						width: 3.1rem;
						height: 4.1rem;
					}
				}
				.name {
					display: flex;
					height: 1.6rem;
					padding: 0 .4rem;
					justify-content: center;
					align-items: center;
					text-align: center;
					line-height: 1.2;
					font-size: .5rem;
					color: #4B1802;
				}
			}
		}
		.sharecode {
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			width: 100%;
			height: 100vh;
			z-index: 999;
			.blackzoom {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: black;
				opacity: 0.3;
				z-index: -1;
			}
			.sharebg {
				position: relative;
				width: 15.7rem;
				height: 20.7rem;
				margin: 2.0rem 2.55rem 0;
				padding-top: 5.8rem;
				background-size: 100% 100%;
				font-size: 0.8rem;
				color: #4B1802;
				p {
					width: 13.6rem;
					text-align: center;
					&.first {
						margin-top: 1.2rem;
					}
					&.last {
						color: #B54A1C;
					}
				}
				.icon-close {
					position: absolute;
					font-size: 1.6rem;
					color: #fff;
					bottom: -2.8rem;
					left: 6.0rem;
				}
				img {
					display: block;
					width: 7.8rem;
					height: 7.8rem;
					margin-left: 2.9rem;
				}
			}
		}
		.wxcode-dialog {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 999;
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
				.reasons {
					height: 6rem;
					margin-top: 4rem;
					overflow: hidden;
					li {
						display: flex;
						margin-top: .75rem;
						flex-direction: row;
						align-items: center;
						padding: 0 1.8rem;
						text-align: left;
						font-size: .7rem;
						line-height: 1.4;
						color: @color-dec;
					}
				}
				.wxcode {
					display: flex;
					align-items: center;
					padding-top: 1rem;
					padding-left: 1.5rem;
					.wxcode-img {
						width: 4.85rem;
						height: 4.85rem;
						font-size: 0;
						line-height: 1;
						img {
							display: block;
							width: 100%;
							height: 100%;
						}
					}
					.zhiwen {
						margin-left: 2rem;
						.zhiwen-img {
							width: 2.25rem;
							height: 2.25rem;
							line-height: 1;
							.iconfont {
								font-size: 2.25rem;
								color: @color-dec;
							}
						}
						.zhiwen-text {
							margin-top: .5rem;
							font-size: .7rem;
							color: @color-dec;
						}
					}
				}
			}
		}
		.animate {
			opacity: 0;
		}
		.like-icon {
			position: fixed;
			top: e("calc(50% - 1.3rem)");
			left: e("calc(50% - 1.3rem)"); //display: flex;
			display: none;
			width: 2.6rem;
			height: 2.6rem;
			align-content: center;
			justify-content: center;
			line-height: 1;
			font-size: 0;
			transition: all .2s ease-out;
			img {
				width: 100%;
				height: 100%;
				line-height: 1;
				font-size: 0;
				transition: all .3s cubic-bezier(.4, 1.2, .6, 3);
				transform: scale(0);
			}
		}
	}
	.like-text {
		position: fixed;
		display: flex;
		width: 2rem;
		height: 1rem;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-size: 1rem;
		color: #DEAE87;
		animation: liketextshow 1s;
	}
	@keyframes liketextshow {
		from {
			transform: translateY(0);
			opacity: 1;
		}
		to {
			transform: translateY(-2rem);
			opacity: 0;
		}
	}
</style>
