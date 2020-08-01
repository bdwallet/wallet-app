<template>
	<div class="redpack-awardgot">
		<act-panel class="award">
			<div class="sprites-activity-txt4"></div>
			<div class="sprites-award-bg">{{giftData.prideData&&giftData.prideData.prize_name}}</div>
			<div class="redemptioncode">
				<div>兑奖码</div>
				<div>{{giftData.gift_uuid}}</div>
			</div>
			<div class="coderule">
				<p>1、请关注“黑钻评级”公众号后，回复客服二字，添加客服微信，凭兑奖码兑奖（五个工作日内有效，过期作废）</p>
				<p>2、兑奖码请妥善保管，因外泄造成的冒领概不负责</p>
			</div>
		</act-panel>
		<act-panel class="strategy">
			<div class="sprites-activity-txt2"></div>
			<div class="pro-title">
				<div class="left-icon"></div>
				<div class="center">每日任务</div>
				<div class="right-icon"></div>
			</div>
			<ul class="pros-box">
				<li class="pro">
					<div class="pro-icon sprites-icon-like"></div>
					<div class="pro-txt">勤写评级接财神,财运亨通（1/3）</div>
					<div class="pro-btn" :class="'ok'">财神到</div>
				</li>
				<li class="pro">
					<div class="pro-icon sprites-icon-login"></div>
					<div class="pro-txt">点赞请财神,财源广进（0/1）</div>
					<div  class="pro-btn" :class="'ok'">福临门</div>
				</li>
				<li class="pro">
					<div class="pro-icon sprites-icon-write"></div>
					<div class="pro-txt">每日登录得财神 ,家财万贯（1/1）</div>
					<div class="pro-btn" :class="'ok'">阖家欢</div>
				</li> 
			</ul>
			<div class="pro-title">
				<div class="left-icon"></div>
				<div class="center">赏金任务</div>
				<div class="right-icon"></div>
			</div>
		<ul class="pros-box">
			<li class="pro">
				<div class="pro-icon sprites-icon-down1"></div>
				<div class="pro-txt">下载黑钻评级安卓版app并绑定手机号+3</div>
				<div  class="pro-btn" :class="'ok'">财神到</div>
			</li>
			<li class="pro">
				<div class="pro-icon sprites-icon-down2"></div>
				<div class="pro-txt">下载eos钱包绑定账号 +3</div>
				<div class="pro-btn" :class="'ok'">福临门</div>
			</li>
			<li class="pro">
				<div class="pro-icon sprites-attention-btn"></div>
				<div class="pro-txt">关注Pureland公众号 +3</div>
				<div class="pro-btn" :class="'ok'">阖家欢</div>
			</li>
		</ul> 
		</act-panel>
		<act-panel class="mycards">
			<div class="sprites-activity-txt3"></div>
			<div class="atten" v-if="false">将于2月11日 18:00开奖，请静候佳音</div>
			<div class="cardlist">
				<div class="sprites-luckydoll1"></div>
				<div class="sprites-copybook13"></div>
				<div class="sprites-copybook5"></div>
				<div class="sprites-copybook2"></div>
				<div class="sprites-luckydoll2"></div>
			</div>
		</act-panel>
		<div class="home-nav">
			<div class="homebtn sprites-icon-backhome" @click="$router.push('/')"></div>
			<div class="sharebtn sprites-yellow-smbtn"  @click="showshare(true)">猪年开门红，把财运传递给小伙伴</div>
		</div>
		<shareblack v-show="showshareStatus" @showshare="showshare"></shareblack>
	</div>
</template>
<script>
	import actPanel from './actPanel';
	import shareblack from './shareblack';
	export default {
		name: 'redpack-awardgot',
		components: {
			actPanel,
			shareblack,
		},
		data() {
			return {
				showshareStatus: false,
				giftData:{},
			}
		},
		props: {
			chanceList: {
				type: Object,
				default: {}
			}
		},
		watch: {
			"chanceList": function(value) {
				if(value&&value.giftData&&value.giftData.prideData&&value.giftData.prideData.prize_name){
					this.init(value);
				}else if(value.giftData.gift_id&&value.giftData.gift_open==1){
					this.$emit('getChanceList');
				}else{
					this.$router.replace("activity");
				}
			},
		},
		methods:{
			showshare(val){
				this.showshareStatus = val;
			},
			share(){
					let sharetitle = ([`厉害skr人,${this.giftData.prideData.prize_name}已到手,开启锦鲤人生。`,`好嗨哦，抽到${this.giftData.prideData.prize_name},感觉人生已经到达了高潮!`][parseInt(Math.random()*2)]);//*** 改成礼品
					Share.Ready({
						imgUrl: this.$rpshare.sharelogo,
						title: sharetitle,
						desc: this.$rpshare.getdesc(this.$route.params.id),
						link: `${this.$global.host}/acts/${this.$route.params.id}/redpack/share/${this.$store.getters.userInfo.user_id}`,
					});
			},
			init(value){
				if(value.giftData.gift_open==1){
					this.giftData = value.giftData;
					this.share();
				}else{
					this.$router.push(`/acts/${this.$route.params.id}/redpack/activity`);
				}
			}
		},
		mounted(){
			this.chanceList&&this.chanceList.giftData&&(this.chanceList.giftData.gift_open==1)&&this.init(this.chanceList);
		}
	}
</script>