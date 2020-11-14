<template>
	<div class="redpack">
		<redpackRule @closeRule="closeRule" v-show="showRule"></redpackRule>
		<div v-if="showHeader" class="common-header" :style="{'backgroundImage':`url(${$assets.redpackHeader})`}">
			<div class="background"><img :src="$assets.redpackHeader"></div>
			<div class="rule-btn" @click="closeRule(true)">活动规则</div>
		</div>
		<div class="redpack-main" :style="{'backgroundImage':`url(${$assets.redpackMainBg})`}">
			<div v-if="showHeader&&false" class="time time-share" :class="$route.name=='redpack-share'?'time-share':''">
				<div class="sprites-rptitle-left" v-show="false"></div>
				<div>活动时间：2019年2月1日—2月15日</div>
				<div class="sprites-rptitle-right" v-show="false"></div>
			</div>
			<div v-if="showHeader" class="advspace">
				<div class="sprites-rptitle-right"></div>
				<div class="txt">特别鸣谢：</div>
				<div class="sprites-pjlogo-oracle"></div>
				<div class="sprites-pjlogo-exnow"></div>
				<div class="sprites-pjlogo-pure"></div>
				<div class="sprites-pjlogo-bitcc"></div>
				<div class="sprites-rptitle-left"></div>
			</div>
			<router-view :pro-info="proInfo" :bountytask="bountytask" :chance-list="chanceList" @getChanceList='getChanceList' />
		</div>
		<transition name="shard">
			<div v-show="showShardPig" class="shard-animate-box">
				<img class="shard-pig" :src="$assets.redpackSharePig">
				<img class="shard-text" :src="$assets.redpackShareText">
			</div>
		</transition>
	</div>
</template>

<script>
	import redpackRule from './rule';
	import localStore from '~script/localStore';
	export default {
		name: 'redpack',
		components: {
			redpackRule,
		},
		data() {
			return {
				showRule: false,
				chanceList: {}, //机会、礼物、开奖时间等数据
				proInfo: {},
				bountytask:{},
			}
		},
		computed: {
			showHeader() {
				return !(this.$route.name == 'redpack-eostask' || this.$route.name == 'redpack-puretask');
			},
			showShardPig(){
				return this.$store.getters.showShardPig;
			}
		},
		methods: {
			closeRule(val) {
				this.showRule = val;
			},
			//获取抽卡次数及我的卡片数据
			getChanceList(val) {
				Ajax.get(this.$api.apply.get_chance_list).then(res => {
					//判断活动是否已经结束相关
					let currunt = res.data.activity_time.current_time, //当前时间
						 chance_end_time = res.data.activity_time.chance_end_time, //任务结束时间
						 activity_end_time = res.data.activity_time.activity_end_time;//整个活动结束时间
					if(activity_end_time<=currunt){
						this.$router.replace("actend");
					}else if(currunt >= chance_end_time && res.data.giftData.length == 0) {
						this.$router.replace("awardloss");
					} else {
						this.chanceList = res.data;
						for(let i=0;i<res.data.chanceData.length;i++){
							this.bountytask[res.data.chanceData[i].chance_event] = res.data.chanceData[i].count_event;
						}
					}
				}).catch(err => {
					if (err.status == -30003) { //活动已结束
						this.$router.replace("actend");
					}
				});
			}
		},
		beforeMount(){
			let id = this.$route.params.id;
			let localId = localStore.get(Global.localStores.business);
			if(!localId){
				if(id > 0){
					localStore.set(Global.localStores.business,id,2592000);
				}
			}
		},
		mounted() {
			//登录任务并获取任务数据
			Ajax.post(this.$api.apply.add_chance, {
				chance_event: 1
			}).then(res => {
				if (res.status == 1) {
					this.$rpdialog.rpalert({
						title: '每日登录有奖',
						content: '恭喜你完成登录任务，获得1次抽卡机会',
						okText: '完成更多任务，抽取大奖'
					});
				}
				this.proInfo = res.data;
				this.getChanceList();
			}).catch(err => {
				if (err.status == -30003) { //兑换已过期
					this.getChanceList();
				} else if (err.status == -30002) {
					Service.Login();
				}
			});
		}
	}
</script>

<style lang="less" src="./style.less">

</style>