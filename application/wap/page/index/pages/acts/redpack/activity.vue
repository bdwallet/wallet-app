<template>
	<div class="redpack-activity">
		<act-panel class="mycards">
			<transition name="collected-txt" mode="out-in">
				<div v-if="!isCollected" class="sprites-activity-txt1" key="collecting"></div>
				<div v-else class="sprites-activity-txt3" key="collected"></div>
			</transition>
			<transition name="collected-card" mode="out-in">
				<div v-if="!isCollected" id="collecting" class="cards-box" key="collecting">
					<div class="card" :class="typeChance['1']?'sprites-copybook11':'sprites-copybook6'">
						<div class="num" v-if="typeChance['1']">{{typeChance['1']}}</div>
					</div>
					<div class="card" :class="typeChance['2']?'sprites-copybook10':'sprites-copybook4'">
						<div class="num" v-if="typeChance['2']">{{typeChance['2']}}</div>
					</div>
					<div class="card" :class="typeChance['3']?'sprites-copybook8':'sprites-copybook1'">
						<div class="num" v-if="typeChance['3']">{{typeChance['3']}}</div>
					</div>
					<div class="card" :class="typeChance['4']?'sprites-copybook9':'sprites-copybook3'">
						<div class="num" v-if="typeChance['4']">{{typeChance['4']}}</div>
					</div>
					<div class="card" :class="typeChance['5']?'sprites-copybook12':'sprites-copybook7'">
						<div class="num" v-if="typeChance['5']">{{typeChance['5']}}</div>
					</div>
				</div>
				<div v-else class="cards-box" key="collected">
					<div class="card sprites-luckydoll1"></div>
					<div class="card sprites-copybook13"></div>
					<div class="card sprites-copybook5"></div>
					<div class="card sprites-copybook2"></div>
					<div class="card sprites-luckydoll2"></div>
				</div>
			</transition>
			<div v-if="!isCollected" class="chance">{{proChance.length>0?`剩余${proChance.length}次机会`:"完成任务获取机会"}}</div>
			<div v-if="!isCollected" class="getbtn" :class="proChance.length>0?'sprites-activity-btn1':'sprites-gray-btn'" @click="openChance">抽五福卡</div>
			<div v-else class="getbtn sprites-activity-btn1" @click="openGift">{{timeOut?"去开奖":`开奖倒计时：${dateTimeText}`}}</div>
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
					<div class="pro-txt">勤写评级接财神,财运亨通（{{proInfo['3']}}/3）</div>
					<div @click="proInfo['3']>=3?'return false;': getChance(3)" class="pro-btn" :class="{'ok':proInfo['3']>=3}">{{proInfo['3']==3?"已完成":"去完成"}}</div>
				</li>
				<li class="pro">
					<div class="pro-icon sprites-icon-login"></div>
					<div class="pro-txt">点赞请财神,财源广进（{{proInfo['2']}}/1）</div>
					<div @click="proInfo['2']>=1?'return false;':getChance(2)" class="pro-btn" :class="{'ok':proInfo['2']>=1}">{{proInfo['2']==1?"已完成":"去完成"}}</div>
				</li>
				<li class="pro">
					<div class="pro-icon sprites-icon-write"></div>
					<div class="pro-txt">每日登录得财神 ,家财万贯（{{proInfo['1']}}/1）</div>
					<div class="pro-btn" :class="{'ok':proInfo['1']>=1}">{{proInfo['1']>=1?"已完成":"去完成"}}</div>
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
					<div @click="bountytask['5']>=1?'return false;':getChance(5)" class="pro-btn" :class="{'ok':bountytask['5']>=1}">{{bountytask['5']>=1?"已完成":"去完成"}}</div>
				</li>
				<li class="pro">
					<div class="pro-icon sprites-icon-down2"></div>
					<div class="pro-txt">下载eos钱包绑定账号 +3</div>
					<div @click="bountytask['6']>=1?'return false;':getChance(6)" class="pro-btn" :class="{'ok':bountytask['6']>=1}">{{bountytask['6']>=1?"已完成":"去完成"}}</div>
				</li>
				<li class="pro">
					<div class="pro-icon sprites-attention-btn"></div>
					<div class="pro-txt">关注Pureland公众号 +3</div>
					<div @click="bountytask['7']>=1?'return false;':getChance(7)" class="pro-btn" :class="{'ok':bountytask['7']>=1}">{{bountytask['7']>=1?"已完成":"去完成"}}</div>
				</li>
			</ul>
		</act-panel>
		<div class="home-nav">
			<div class="homebtn sprites-icon-backhome" @click="$router.push('/')"></div>
			<div class="sharebtn sprites-yellow-smbtn" @click="showshare(true)">邀请好友一起唤财神</div>
		</div>
		<shareblack v-show="showshareStatus" @showshare="showshare"></shareblack>
		<openbag v-if="openbagStatus" @close="closeopenbag" :cardtxt="cardtxt"></openbag>
	</div>
</template>

<script>
	import actPanel from './actPanel';
	import openbag from './openbag';
	import shareblack from './shareblack';
	import localStore from '~script/localStore';
	export default {
		name: 'redpack-activity',
		components: {
			actPanel,
			openbag,
			shareblack,
		},
		props: {
			chanceList: {
				type: Object,
				default: {}
			},
			proInfo: { //任务进度
				type: Object,
				default: {}
			},
			bountytask:{
				type: Object,
				default:{}
			}
		},
		data() {
			return {
				typeChance: [], //机会详情及奖品列表
				giftData: {}, //礼品信息容器
				proChance: [], //剩余机会总数
				cardtxt: -1, //获奖type
				openbagStatus: false,
				showshareStatus: false,
				//卡片是否集齐标识
				isCollected: false,
				timeOut: false,
				timer: {
					days: 8,
					hours: 8,
					minutes: 8,
					seconds: 8,
				},
			}
		},
		computed: {
			dateTimeText() {
				if (this.timer.days > 0) return `${this.timer.days}天${this.timer.hours}小时${this.timer.minutes}分${this.timer.seconds}秒`;
				else if (this.timer.hours > 0) return `${this.timer.hours}小时${this.timer.minutes}分${this.timer.seconds}秒`;
				else if (this.timer.minutes > 0) return `${this.timer.minutes}分${this.timer.seconds}秒`;
				else return `${this.timer.seconds}秒`;
			}
		},
		watch: {
			"chanceList": function(value) {
				value&&this.init(value);
			},
		},
		methods: {
			//打开礼物
			openGift() {
				if (!this.timeOut) return false;
				Ajax.post(this.$api.apply.open_gift, {
					gift_id: this.giftData.gift_id
				}).then(res => {
					if (res.status == 1) {
						this.$emit('getChanceList');
						setTimeout(()=>{
							this.$router.replace("awardgot");
						})
					} else { //打开过
					}
				}).catch(err => { //活动未开始
				});
			},
			//打开抽卡面板进行抽奖
			openChance() {
				//this.openbagStatus = true;
				if (this.proChance.length > 0) {
					this.openbagStatus = true;
					Ajax.post(this.$api.apply.open_chance, {
						chance_id: this.proChance[0].chance_id
					}).then(res => {
						if (res.status == 1) {
							setTimeout(() => {
								if (this.typeChance[res.data.chance_type]) {
									this.typeChance[res.data.chance_type] = parseInt(this.typeChance[res.data.chance_type]) + 1;
								} else {
									this.typeChance[res.data.chance_type] = 1;
								}
								this.proChance.splice(0, 1);
							}, 500);
							this.cardtxt = parseInt(res.data.chance_type);
						}
					});
				}
			},
			//获得新卡片后业务处理函数
			getNewCard() {
				if (this.cardtxt == 0) return;
				if (this.checkIsCollected()) { //已集齐
					//集齐动效
					this.collectedAnimation();
					//集齐卡片后创建礼品
					Ajax.post(this.$api.apply.add_gift, {
					}).then(res => {
						if (res.status == 1) {}
					}).catch(err => {});
				} else { //未集齐动效
					this.unCollectedAnimation();
				}
			},
			//获得新卡片集齐动效
			collectedAnimation() {
				let cards = document.getElementById("collecting").getElementsByClassName("card");
				let interval = undefined,
					index = 0;
				cards[this.cardtxt - 1].style.animation = 'swing2 .2s ease 0s infinite';
				interval = setInterval(() => {
					if (index == this.cardtxt - 1) index++;
					if (index > 4) clearInterval(interval);
					else {
						cards[index].style.animation = 'swing2 .2s ease 0s infinite';
						index++;
					}
				}, 370);
				setTimeout(() => {
					this.$emit('getChanceList');
					this.isCollected = this.checkIsCollected();
				}, 2500);
			},
			//获得新卡片未集齐动效
			unCollectedAnimation() {
				let cards = document.getElementById("collecting").getElementsByClassName("card");
				let card = cards[this.cardtxt - 1];
				card.style.animation = 'swing 2s ease 0s 1';
				setTimeout(() => {
					card.style = "";
				}, 2100);
			},
			//校验卡片是否集齐
			checkIsCollected() {
				let bool = this.typeChance["1"] && this.typeChance["2"] && this.typeChance["3"] && this.typeChance["4"] && this.typeChance["5"];
				return bool;
			},
			//跳转到任务目标页面
			getChance(type) {
				if (type == 2) { //点赞任务
					this.$router.push("/");
				} else if (type == 3) { //发评级任务
					//校验用户是否为超级评审员
					let level = localStore.get(Global.localStores.level);
					if (level) {
						level == 3 ? this.$router.push("/select/2/0") : this.$router.push("/user/application");
					} else {
						this.$ajax.post(this.$api.apply.check_level).then(res => {
							if (res.status == 1) {
								level = res.data.level;
								localStore.set(Global.localStores.level, res.data.level, 60);
								//判断是否关注公众号
								if (this.$store.getters.userInfo.user_is_attention != 1) {
									this.$store.commit('changeShowWxcode', {
										status: true
									});
								} else {
									level == 3 ? this.$router.push("/select/2/0") : this.$router.push("/user/application");
								}
							}
						});
					}
				} else if (type == 5) { //下载app任务
					$service.OpenUrl('/down.html')
				} else if (type == 6) { //eos 任务
					this.$router.push(`/acts/${this.$route.params.id}/redpack/eostask`);
				} else if (type == 7) { //pure 任务
					this.$router.push(`/acts/${this.$route.params.id}/redpack/puretask`);
				}
			},
			//关闭抽卡动效弹框
			closeopenbag() {
				let div = document.getElementsByClassName('openbg-main')[0];
				div.style.transition = 'all .2s';
				div.style.transform = 'scale(0)';
				setTimeout(() => {
					this.openbagStatus = false;
					this.getNewCard();
				}, 250);
			},
			//分享蒙版显隐
			showshare(val) {
				this.showshareStatus = val;
			},
			//开奖倒计时
			countdown(activity_time) {
				//let date = '2019/02/18 18:00:00';
				let start = activity_time.gift_start_time;
				let now = activity_time.current_time;
				let interval = setInterval(() => {
					now += 1;
					let surplus = start - now;
					if (surplus >= 0) {
						let days = parseInt(surplus / 3600 / 24);
						surplus = surplus - days * 24 * 3600;
						let hours = parseInt(surplus / 3600);
						surplus = surplus - hours * 3600;
						let minutes = parseInt(surplus / 60);
						surplus = surplus - minutes * 60;
						this.timer.days = days;
						this.timer.hours = hours;
						this.timer.minutes = minutes;
						this.timer.seconds = surplus;
					} else {
						clearInterval(interval);
						this.timeOut = true;
					}
				}, 1000);
			},
			share(status) {
				let receiveSatus = status ? (['搞到这一笔,猪年啥都能佩奇!', '领了这一笔 我也学波叔先玩7年'][parseInt(Math.random()*2)]):(['C位出道,黑钻评级集福了解一下!', '盘它!老板欠你的年终奖让我们来发!'][parseInt(Math.random()*2)]); //是否集齐
				Share.Ready({
					imgUrl: this.$rpshare.sharelogo,
					title: receiveSatus,
					desc: this.$rpshare.getdesc(this.$route.params.id),
					link: location.href,
				});
			},
			init(obj) {
				//判断礼物是否存在
				if (obj.giftData && obj.giftData.length !== 0) {
					if (obj.giftData.gift_open > 0) { //判断礼物已经被打开
						localStore.set(Global.localStores.awardgot, 1, 864000);
						this.$router.replace("awardgot");
					} else { //判断礼物未被打开 等待开奖
						this.isCollected = true;
						this.giftData = obj.giftData;
						this.countdown(obj.activity_time);
						this.share(true);
					}
				} else {//集卡中
					this.typeChance = obj.typeChance;
					this.proChance = obj.openChance;
					this.countdown(obj.activity_time);
					this.share(false);
				}
			}
		},
		beforeCreate() {
			let awardgot = localStore.get(Global.localStores.awardgot);
			if (awardgot == 1) {
				this.$router.replace("awardgot");
			}
		},
		mounted() {
			this.chanceList.activity_time&&this.init(this.chanceList);
		}
	}
</script>