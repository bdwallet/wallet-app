<template>
	<div class="user-main">
		<div class="headInfo">
			<!-- 已登录 -->
			<div v-if="isLogin" class="login" @click="gohomepage">
				<comp-avatar :src="userInfo.user_photo" :level="userInfo.level" size="130" :border="0" :itemid="userInfo.user_located_item_id" />
				<div class="userdata">
					<comp-level :username="userInfo.user_name" :value="userInfo.user_level" align="start" />
					<ul>
						 <!-- @click.stop="GoList('ratings')" -->
						<li>
							<div class="num">{{userInfo.user_grade_hot_num||0}}</div>
							<div class="category">热门评级</div>
						</li>
						<li @click.stop="GoList('contact/bans-list')">
							<div class="num">{{userInfo.by_attention_num||0}}</div>
							<div class="category">粉丝</div>
						</li>
						<li @click.stop="GoList('contact/concern-list')">
							<div class="num">{{userInfo.attention_num||0}}</div>
							<div class="category">关注</div>
						</li>
					</ul>
				</div>
				<div class="gohomepage">
					<i class="icon icon-shouhui"></i>
				</div>
			</div>
			<!-- 未登录 -->
			<div v-else class="loginout" @click="$router.push('/login')">
				<img :src="$assets.avatar" />
				<div class="login-btn">立即登录</div>
			</div>
			<div class="user-setting" @click.stop="$router.push('/user/setup/main')">
				<i class="icon icon-shezhi"></i>
			</div>
		</div>
		<div class="comp-item-list item-list">
			<div class="grade">
				<router-link v-if="isLogin" to="/user/wallet">
					<div class="comp-item-wrap item-wrap"><span>钱包</span>
						<div class="comp-item-right">查看黑钻余额 <i class="icon icon-shouhui"></i></div>
					</div>
				</router-link>
				<router-link to="/user/task">
					<div class="comp-item-wrap item-wrap"><span>任务中心</span>
						<div class="comp-item-right">赚黑钻，升级 <i class="icon icon-shouhui"></i></div>
					</div>
				</router-link>
				<router-link to="/user/nodegift">
					<div class="comp-item-wrap item-wrap"><span>每日锦鲤</span>
						<div class="comp-item-right"><span style="color: #F76260;">幸运大奖，节点尊享</span> <i class="icon icon-shouhui"></i></div>
					</div>
				</router-link>
				<router-link to="/user/level">
					<div class="comp-item-wrap item-wrap"><span>用户等级</span>
						<div class="comp-item-right">享特权<i class="icon icon-shouhui"></i></div>
					</div>
				</router-link>
			</div>
			<div class="grade">
				<router-link :to="{path: '/user/collect', query: {uid: userInfo.user_id}}" v-if="isLogin">
					<div class="comp-item-wrap item-wrap"><span>我的收藏</span>
						<div class="comp-item-right"><i class="icon icon-shouhui"></i></div>
					</div>
				</router-link>
				<router-link to="/invite/main">
					<div class="comp-item-wrap item-wrap"><span>邀请好友</span>
						<div class="comp-item-right"><span style="color: #F76260;">300黑钻/人</span> <i class="icon icon-shouhui"></i></div>
					</div>
				</router-link>
				<router-link to="/user/authentication">
					<div class="comp-item-wrap item-wrap"><span>实名认证</span>
						<div class="comp-item-right"><span :style="{color: label!='已认证'?'#F76260':'inherit'}">{{label}}</span> <i class="icon icon-shouhui"></i></div>
					</div>
				</router-link>
				<router-link to="/user/application">
					<div class="comp-item-wrap item-wrap"><span>成为超级评审员</span>
						<div class="comp-item-right">火热招募中<i class="icon icon-shouhui"></i></div>
					</div>
				</router-link>
			</div>
			<div class="grade">
				<a href="http://m.12377.cn/c/nonTort.html?val=0104&path=nonTort" target="_blank">
					<div class="comp-item-wrap item-wrap"><span>网信办举报入口</span>
						<div class="comp-item-right"><i class="icon icon-shouhui"></i></div>
					</div>
				</a>
				<router-link to="/user/help/main?tab=11">
					<div class="comp-item-wrap item-wrap"><span>帮助与反馈</span>
						<div class="comp-item-right"><i class="icon icon-shouhui"></i></div>
					</div>
				</router-link>
				<a href="/down.html" v-if="!$global.isApp">
					<div class="comp-item-wrap item-wrap"><span>APP下载</span>
						<div class="comp-item-right"><i class="icon icon-shouhui"></i></div>
					</div>
				</a>
				<router-link to="/user/about">
					<div class="comp-item-wrap item-wrap"><span>关于黑钻评级</span>
						<div class="comp-item-right"><i class="icon icon-shouhui"></i></div>
					</div>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
	import compAvatar from '~components/compAvatar';
	import compLevel from '~components/compLevel';
	export default {
		name: "user-main",
		components: {
			compAvatar,
			compLevel
		},
		// data() {
		// 	return {
		// 		integral: {}
		// 	}
		// },
		computed: {
			isLogin() {
				return (this.userInfo && this.userInfo.user_id) ? 1 : 0;
			},
			userInfo() {
				return this.$store.getters.userInfo;
			},
			//点赞数
			user_grade_like_num() {
				let likenum = this.userInfo.user_grade_like_num;
				return likenum > 1000 ? (likenum / 1000).toFixed(1) + 'K' : likenum;
			},
			//实名认证状态方案
			label() {
				let s = this.userInfo.idcert_info;
				s = s && s.idcert_status;
				//-1未提交认证 0审核中 1审核通过 2审核失败
				if (s == 0) {
					return '认证中';
				} else if (s == 1) {
					return '已认证';
				} else if (s == 2) {
					return '认证失败';
				} else {
					return '认证领取200黑钻';
				}
			}
		},
		methods: {
			GoList(listname) {
				this.$router.push({
					path: `/user/${listname}/${this.userInfo.user_id}`,
					query: {
						name: this.userInfo.user_name,
						bans: this.userInfo.by_attention_num || 0
					}
				})
			},
			//获取用户数据
			// getUserIntegral() {
			// 	this.$ajax.post(this.$api.apply.get_user_currency).then(res => {
			// 		if (res.data.status == 1) {
			// 			this.integral = Object.assign({}, res.data.user_data);
			// 			//更新本地localstore数据 用户level与user_level
			// 			Service.Update(this.integral);
			// 		}
			// 	});
			// },
			gohomepage() {
				this.$router.push(`/user/homepage/${this.userInfo.user_id}`);
			},
		},
		activated() {
			//this.getUserIntegral();
			//更新用户实名认证状态
			// let s = this.userInfo.idcert_info && this.userInfo.idcert_info.idcert_status;
			// if (s == 0 || s == 2 || s == undefined) {
			// 	Ajax.get(Api.apply.get_idcert).then(res => {
			// 		let d = res.data;
			// 		this.$service.Update({
			// 			idcert_info: d
			// 		});
			// 	});
			// }
			setTimeout(() => {
				Share.Ready();
			});
		}
	}
</script>
