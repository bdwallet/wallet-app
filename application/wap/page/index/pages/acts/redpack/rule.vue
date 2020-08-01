<template>
	<div class="redpack-rule">
		<div class="content-box">
			<div class="rule-bg">
				<div class="sprites-frame-bg4"></div>
				<div class="sprites-frame-bg3"></div>
				<div class="sprites-frame-bg1 ruleleft"></div>
				<div class="sprites-frame-bg1 ruleright"></div>
				<div class="sprites-frame-bg5"></div>
				<div class="sprites-frame-bg6"></div>
			</div>
			<div class="content">
				<div class="title">集五福活动规则</div>
				<div class="rulelist">
					<p>活动奖励：<br>
							1. 一等奖  现金红包1688元 + 代币大礼包<br>
							2. 二等奖  现金红包666  元+  代币大礼包<br>
							3. 三等奖  现金红包68元 +  代币大礼包<br>
							4. 四等奖  现金红包18元 +  代币大礼包<br>
							5. 五等奖  代币大礼包
					</p>
					<p>
						代币大礼包包含:GAT（Bit.cc）、OCT（欧链）、PLD（净土计划）TSC、MMDA 及ntt（ExNow）<br>
						感谢以上四位赞助商的鼎力支持!
					</p>
					<p>
						活动时间: <br>
						2019年2月1日-2019年2月15日
					</p>
 					<p>
 					  活动内容:<br>
						1. 活动期间,用户可通过做任务抽取福卡,获得活动奖励。<br>
						任务说明： <br>    
						① 每日任务：每日完成以下任务可获得抽卡机会,每天至多获得6次。<br>
						登录：每日首次登录可获得1次抽福卡机会；<br>
						点赞：每日点赞一篇评级或爆料，可获得1次抽福卡机会；<br>
						评级：撰写一篇评级可获得1次抽福卡机会（每日最多获得3次）；<br>
						隐藏彩蛋：每日可通过发现隐藏彩蛋获得1次额外机会。<br>
						② 赏金任务：每完成一个赏金任务即可增加3次机会，共可获得9次。<br>
						下载黑钻评级APP并绑定手机号;<br>
						下载eos钱包并绑定账号;<br>
						关注Pureland微信公众号,填写ETH钱包地址。<br>
					</p>
					<p>
						2. 活动将于2月14日12:00截止抽卡，届时所有抽卡次数将清零。
					</p>
					<p>
						3. 每人只可集齐1套卡片，集齐后，黑钻评级将于2019年2月15日10:00进行开奖。
					</p>
					<p>
						4. 活动期间，所有评级与爆料都采用后置审核制，评级必须为原创，严禁抄袭、复制、灌水等行为，如因违反相关规则被发现或举报，经官方人员查实，将对违规评审员处以警告并驳回对应评级，情节严重者将取消领奖资格。与此同时，对于检举者将发放100黑钻奖励。
					</p>
					<p>
						5. 获得奖品的用户，请于5个工作日内关注黑钻评级公众号联系客服，凭兑奖码换取奖品。若因非官方的原因造成兑奖码泄露，黑钻评级概不负责。若超期奖品未兑换，视为自动放弃领奖机会,不予补发。
					</p>
					<p>
						6. 本次活动最终解释权归黑钻评级所有。
					</p>
					<p>
						特别说明：为避免不正当手段获取抽卡机会，活动期间，黑钻评级将下线评级删除入口。若用户通过不正当手段获得奖励，黑钻评级有权撤销奖励。
					</p>
				</div>
			</div>
			<div class="btn sprites-activity-btn1" @click="showRule">知道了</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default {
		name: 'redpack-rule',
		data(){
			return{
			}
		},
		methods:{
			showRule(){
				this.$emit('closeRule',false);
			}
		}
	}
</script>
<style lang="less">
	@import "../../../../../assets/css/config";
	.redpack-rule{
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 99;
		font-size: 15px;
		color: #333333;
		background-color: rgba(0,0,0,0.75);
		.content-box{
			position: absolute;
			left:0.75rem;
			right:0.75rem;
			top:0.75rem;
			bottom:2.75rem;
			padding: 1.0rem 0.75rem 4.5rem;
			border-radius: 0.45rem;
			background-color: #FFE9E0;
			.rule-bg{
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				&>div{
					position: absolute;
				}
				.sprites-frame-bg4{
					left: 0;
					top: 0.475rem;
				}
				.sprites-frame-bg3{
					left: 1.85rem;
					top: 0.475rem;
				}
				.ruleleft{
					left: 0.75rem;
					top: 0.475rem;
					transform: rotate(180deg);
				}
				.ruleright{
					right: 0;
					top: 1.3rem;
				}
				.sprites-frame-bg5{
					left: 0.325rem;
					bottom: 0.4rem;
				}
				.sprites-frame-bg6{
					right: 0.325rem;
					bottom: 0.4rem;
					transform: rotate(90deg);
				}
			}
			.content{
				position: relative;
				z-index: 2;
				height: 100%;
				text-align: justify;
				overflow: auto;
				-webkit-overflow-scrolling: touch;
				.title{
					color: #99211B;
					text-align: center;
					line-height: 1.55rem;
					font-size: 26px;
					letter-spacing: 0.05rem;
					font-weight: bold;
				}
				.rulelist{
					margin-top: 0.5rem;
				  word-break: break-word;
				  p{
				  	margin-bottom: 10px;
				  }
				}
			}
			.btn{
				position: absolute;
				width: 12.075rem;
				height: 2.1rem;
				line-height: 2.1rem;
				color: #FFFFFF;
				font-size: 0.95rem;
				text-align: center;
			  left: 50%;
			  bottom: 1.0rem;
	      transform: translateX(-50%);
			}
		}
	}
</style>