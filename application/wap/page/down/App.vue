<template>
	<div class="down">
		<div class="down-wrap">
			<div class="btn-group">
				<div class="btn btn-gradual" @click="Down(0)">iOS下载</div>
				<div class="btn btn-gradual" @click="Down(1)">Android下载</div>
			</div>
			<a href="https://d.xiumi.us/board/v5/2t9yp/146835153">查看iOS安装教程</a>
		</div>
		<div class="down-top"></div>
		<comp-about />
		<div class="down-bottom"></div>
		<div class="share" v-show="showShare" @click="showShare=false">
			<div class="blacktxt">
				<i class="icon icon-jiantou"></i>
				<div class="tip" :style="{'backgroundImage': 'url('+$assets.downOval+')'}">
					微信中无法直接下载，点击右上角选择“在浏览器中打开”即可下载
				</div>
			</div>
			<div class="blackzoom"></div>
		</div>
	</div>
</template>

<script>
	import compAbout from '~components/compAbout';
	import share from '~script/share';
	export default {
		name: 'down',
		components: {
			compAbout
		},
		data() {
			return {
				isWeiXin: false,
				AndroidUrl: '',
				IOSUrl: '',
				showShare: false,
			}
		},
		methods: {
			//判断是否是微信浏览器的函数
			WeiXin() {
				//window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
				var ua = window.navigator.userAgent.toLowerCase();
				//通过正则表达式匹配ua中是否含有MicroMessenger字符串
				if (ua.match(/MicroMessenger/i) == 'micromessenger') {
					this.isWeiXin = true;
				} else {
					this.isWeiXin = false;
				}
			},
			Down(type) {
				if (!this.isWeiXin) {
					if (type) //android
						location.href = this.AndroidUrl;
					else {//ios
						location.href = this.IOSUrl;
						setTimeout(() => {
							alert("点击“安装”后，APP已开始下载。可点击home键回到主页查看下载进度");
						}, 3000);
					}
				} else {
					this.showShare = true;
				}
			},
			getDownurl() {
				this.$ajax.get('/app/index.php?c=update&a=download').then(res => {
					if (res.status == 1) {
						this.AndroidUrl = res.data.url;
						this.IOSUrl = res.data.iosurl;
					}
				})
			},
		},
		mounted() {
			this.WeiXin();
			this.getDownurl();
			share.Ready({
				title: "黑钻评级送你225黑钻新人礼包，下载APP即刻领取",
				desc: "注册成功邀请好友再领300黑钻",
				link: location.href,
			});
			
		}
	}
</script>

<style lang="less" scoped>
	@import "../../assets/css/config.less";
	.down {
		.down-wrap{
			width: 100%;
			padding: .5rem 1.8rem;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 2;
			background: #577EE1;
			.btn-group{
				display: flex;
				justify-content: space-between;
			}
			a{
				display: block;
				width: 7rem;
				text-align: center;
				color: #fff;
				font-size: .65rem;
				margin-top: .5rem;
				line-height: 1;
			}
		}
		.down-top{
			position: relative;
			width: 100%;
			height: 100vh;
			background: url('@{hosturl}dowmload-img.jpg') no-repeat center;
			background-size: cover;
		}
		.down-bottom{
			height: 10rem;
			background: url('@{hosturl}dowmload-img1.jpg') no-repeat center;
			background-size: cover;
		}
		.btn{
			display: inline-block;
			width: 7rem;
			padding: .45rem 0;
			text-align: center;
			color: #fff;
			font-size: .8rem;
			line-height: 1.4;
			border-radius: 1.2rem;
			&.btn-red{
				background: #FF6666;
				box-shadow: 0 .25rem .3rem #FFB9B9;
			}
			&.btn-gradual{
				color: #5682FF;
				background: linear-gradient(90deg,rgba(255,255,255,1) 0%,rgba(222,221,255,1) 100%);
				box-shadow: 0 .25rem .3rem #446BCD;
			}
		}
		.share {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			.blackzoom {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: rgba(0, 0, 0, 0.75);
			}
			.blacktxt {
				position: absolute;
				z-index: 2;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				text-align: right;
				.icon {
					margin-top: 0.6rem;
					margin-right: 1.125rem;
					font-size: 2.9rem;
					color: #fff;
				}
				.tip {
					display: flex;
					align-items: center;
					position: relative;
					left: 0.4rem;
					width: 12.75rem;
					height: 4.4rem;
					margin: 0 auto;
					padding: 0 0.5rem 0 0.725rem;
					font-size: 0.75rem;
					line-height: 1.05rem;
					color: #fff;
					border-radius: 0.075rem solid;
					background-size: 100% 100%;
				}
			}
		}
		
	}
</style>