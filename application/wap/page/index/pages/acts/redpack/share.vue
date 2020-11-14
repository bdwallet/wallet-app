<template>
	<div class="redpack-share">
		<act-panel class="mycards">
			<div class="info">
				<div class="user-photo">
					<img :src="giftdata.user_photo" alt="">
				</div>
				<div class="user-name">{{giftdata.user_name}}</div>
				<p>在黑钻评级获得了一份超级大奖</p>
				<div class="sprites-award-bg">{{giftdata.prize_name}}</div>
				<div class="code">
					<img :src="$assets.redpackHzpj" alt="">
					<div>
						<p>关注黑钻评级 发现更多惊喜</p>
						<p>上黑钻评级 知项目好坏</p>
					</div>
				</div>
			</div>
		</act-panel>
		<div class="sprites-yellow-bgbtn" @click="$router.push('/')">发现更多精彩</div>
	</div>
</template>
<script>
	import actPanel from './actPanel';
	export default {
		name: 'redpack-share',
		components: {
			actPanel,
		},
		data() {
			return {
				giftdata: {}
			}
		},
		methods: {
			share() {
				let sharetitle = ([`厉害skr人,${this.giftdata.prize_name}已到手,开启锦鲤人生。`, `好嗨哦，抽到${this.giftdata.prize_name},感觉人生已经到达了高潮!`][parseInt(Math.random() * 2)]); //*** 改成礼品
				Share.Ready({
					imgUrl: this.$rpshare.sharelogo,
					title: sharetitle,
					desc: this.$rpshare.getdesc(this.$route.params.id),
					link: location.href,
				});
			},
			get_user_gift() {
				let params = {
					user_id: this.$route.params.awarduserId,
				};
				this.$ajax.get(this.$api.apply.get_user_gift, params).then(res => {
					if (res.status == 1) {
						this.giftdata = res.data.giftData;
						this.share();
					} else {
						this.$router.push(`/acts/${this.$route.params.id}/redpack/activity`);
					}
				}).catch(err => {
					this.$router.push(`/acts/${this.$route.params.id}/redpack/activity`);
				})
			}
		},
		mounted() {
			this.get_user_gift();
		}
	}
</script>