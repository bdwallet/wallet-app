<template>
	<div class="apply-success">
		<div class="verfy-success">
			<div class="celebrate" :style="{'backgroundImage':'url('+$assets.applicaSuccess+')'}">
			</div>
			<div class="btnbox">
				<div class="btn send" @click="Publish" >发评级赚黑钻</div>
				<div class="btn invite" @click="invite">邀请好友</div>
			</div>
			<div class="blackzoom" v-show="showblackzoom" @click="invite">
				<div class="blackbg"></div>
				<div class="blacktxt">
					<i class="icon icon-jiantou"></i>
					<div class="tip" :style="{'backgroundImage': 'url('+$assets.downOval+')'}">
						邀请好友申请超级评审员,共享黑钻评级分红权
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default {
		name: 'apply-success',
		components:{},
		data(){
			return{
				showblackzoom: false,
			}
		},
		computed: {
			bannedType() { //账号异常状态 1正常  -1冻结账号  -2禁言  -3不能获取奖励   -4答题 -5禁止提现和赞赏
                return this.$store.getters.bannedType;
            }
		},
		methods:{
			invite(){
				this.showblackzoom = !this.showblackzoom;
			},
			Publish(){
				if(this.bannedType.indexOf(-2) != -1){ //禁言
					Dialog.alert('很抱歉，您目前行为受限，无法进行相应操作。');
				}else {
					this.$router.push('/select/2/0');
				}
			}
		},
		mounted(){
			Share.Ready({
				title: `${this.$store.getters.userInfo.user_nickname}邀请你加入黑钻超级评审团，共享平台分红权益`,
				desc: '黑钻超级评审员火热招募中，仅限1000席！',
				link: this.$global.application,
			});
		}
	}
</script>