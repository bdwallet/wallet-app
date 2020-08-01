<template>
	<div class="HZ-main">
		<app-welcome v-if="$global.isApp" />
		<div class="index main-box" :class="{showFooter}">
			<app-titlebar v-if="$global.isApp" />
			<!-- <transition name="pageview" mode="in-out"> -->
			<keep-alive exclude="detail,search,write,write-exchange,extlevaluation,acts,login,select,invite,activity-detail,answer,report,hotlist,notify,comment,summary">
				<router-view></router-view>
			</keep-alive>
			<!-- </transition> -->
			<layout-footer v-show="showFooter" />
		</div>
		<!-- 浮动发布按钮 -->
		<comp-buttontool />
		<!-- 程序错误提示框 systemDialog == 1 -->
		<div class="wxcode-dialog2" v-if="systemDialog == 1" @click="$store.commit('systemStatus', 0)">
			<div class="wxcode-box" :style="{'background-image':`url(${$assets.proWxcodeBg3})`}" @click.stop>
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
						<div class="zhiwen-img"><i class="icon icon-zhiwenrenzheng"></i></div>
						<div class="zhiwen-text">长按识别二维码</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 系统维护、升级提示框 systemDialog == 2 、 3 -->
		<div class="layout-system" v-if="systemDialog == 2 || systemDialog == 3">
			<img :src="systemDialog == 2 ? $assets.systemSafeguard : $assets.systemUpdate" />
			<span>服务升级中，请稍后再访问...</span>
    	</div>
	</div>
</template>

<script>
	import layoutFooter from '~layout/layoutFooter';
	import compButtontool from '~components/compTools/compButtontool';
	export default {
		name:'index',
		components: {
			layoutFooter,
			compButtontool
		},
		data() {
			return {
				level: 0, //用户等级标识，3为超级请审员
			}
		},
		computed: {
			showFooter() {
				if (Global.isApp)
					return /concern|recommend|ratings|disclosures|prolist|notify|user-main|announce-main/.test(this.$route.name);
				else
					return this.$route.meta.nav;
			},
			//控制程序出错弹框
			systemDialog() {
				return this.$store.getters.systemDialog;
			}
		},
		mounted() {
			//为IOS设备保存首次进入时的href
			setTimeout(() => {
				this.$store.commit('saveHref', {
					href: location.href
				});
			}, 500);
			// 获取是否有未读消息 更改Footerbar相应状态
			// 检测用户异常状态
			Service.GetMessages();
		},
		updated() {
            // console.log("in index => App.vue => updated");
			if (this.$route.name !== 'invite-share') {
				Dialog.hide(); //只为处理Dialog.message()这类弹框;
				Backdrop.Clear(); //关闭所有弹框及背景遮罩
			}
			//待优化 切换页面后，删除上传时创建的DOM 用户点击上传图片后，不选择图片，直接点取消，会留下DOM占用内存空间 class="ext-uploader"

			// 获取是否有未读消息 更改Footerbar相应状态
			// 检测用户异常状态
			Service.GetMessages();

			//获取用户数据及最新状态
			Ajax.post(Api.apply.get_user_currency).then(res => {
				if (res.data.status == 1) {
					//更新本地localstore数据 用户数据及各状态
					Service.Update(res.data.user_data);
				}
			});
		},
	}
</script>

<style lang="less">
	@import "../../assets/css/config";
	.HZ-main {
		width: 100%; //overflow: hidden; //添加后postion:sticky会失效
		// overflow-x: hidden;
	}
	.index {
		transition: all .2s ease;
	}
	.showFooter {
		padding-bottom: @tab-height;
	}
	.wxcode-dialog2 {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 11;
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
						.icon {
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
    .layout-system{
        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
		display: flex;
		flex-direction: column;
        justify-content: center;
        align-items: center;
		background: #FAFBFC;
		z-index:999;
		font-size: .75rem;
		color:#333;
		img{
			width: 6.5rem;
			height: 6.5rem;
			margin-bottom: 2.5rem;
		}
    }
</style>
