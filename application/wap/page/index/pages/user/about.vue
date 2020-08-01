<template>
	<div class="user-about">
		<div class="conitem-bg1">
			<div class="textbox">
				<img :src="$assets.logo2" class="logo"/>
				<p class="en">Black Diamond Rating</p>
				<p class="cn">上黑钻评级 知项目好坏</p>
				<p class="desc">黑钻评级是全球首家“评审团”式区块链评级社区。我们期望通过社区化的评级报告，加深用户对区块链的理解和认知，为热爱区块链项目的用户提供一个更专业、权威的发展交流平台</p>
			</div>
			<div class="image1"><img :src="$assets.conitemImg1" /></div>
		</div>
		<comp-about />
		<div class="HZPJ-footer">
			<div class="copyright">
				<div class="logo-box">
					<img class="logo" :src="$assets.logo2" />
					<img class="logo-text" :src="$assets.logoTextFoot" />
				</div>
				<div class="weixin">
					<img :src="$assets.kefuewm" />
					<div class="text">
						<h3>微信咨询</h3>
						<p>商务小姐姐微信号：jiukou0920</p>
					</div>
				</div>
			</div>
			<div class="info">
				<div class="tel"><span>Tell: 0851-84849564</span><span>Email: contact@heizuan.com</span></div>
				<p class="record">CopyRight@贵阳黑钻科技有限公司 <br class="wap-show" />2019 All Right Reserved.黔ICP备18004892号-1</p>
			</div>
		</div>
		
	</div>
</template>

<script>
	import compAbout from '~components/compAbout';

	export default {
		name: "user-about",
		components: {
			compAbout
		},
		data() {
			return {}
		},
		activated() {
			Share.Ready({
				desc: "全球首家“评审团”式区块链评级社区，带您多角度解析600+项目",
				link: location.href,
			});
		}
	}
</script>

<style lang="less" scoped>
	@import "../../../../assets/css/config.less";
	
	.conitem-bg1{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #1b191c;
		color: #fff;
		width: 100%;
		height: 100vh;
		.textbox{
			position: relative;
			z-index: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.logo{
				width: 4rem;
			}
			.en{
				font-size: .6rem;
				margin-top: .5rem;
			}
			.cn{
				font-size: 1.2rem;
			}
			.desc{
				margin-top: 6.2rem;
				padding: 0 1.5rem;
				text-align: justify;
			}
		}
		.image1{
			position: absolute;
			opacity: .3;
			z-index: 0;
			img{
				width: 100%;
			}
		}
	}

	.HZPJ-footer{
		background-color: #1b191c;
		padding: 2rem .75rem;
		.copyright{
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			font-size: .6rem;
			color: #fff;
			.logo-box{
				display: flex;
				align-items: center;
				img{
					display: inline-block;
					font-size: 0;
					&.logo{
						display: block;
						width: 2rem;
					}
					&.logo-text{
						display: block;
						width: 3.65rem;
						margin-left: .4rem;
					}
				}
				
			}
			.weixin{
				display: flex;
				align-items: center;
				img{
					display: block;
					width: 1.8rem;
					height: 1.8rem;
				}
				.text{
					height: 100%;
					margin-left: .4rem;
					font-weight: 300;
					line-height: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
				}
			}
		}
		.info{
			margin-top: 1.25rem;
			text-align: center;
			color: #fff;
			.tel{
				display: flex;
				justify-content: space-between;
				font-size: .7rem;
			}
			.record{
				font-size: .6rem;
				margin-top: .7rem;
			}
		}
	}

</style>

