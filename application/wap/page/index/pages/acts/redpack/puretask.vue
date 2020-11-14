<template>
	<div class="redpack-eostask redpack-puretask">
		<act-panel class="eostask">
			<div class="eos-header">
				<div class="sprites-pjlogo-eosbg4"></div>
				<div class="mul">×</div>
				<div class="sprites-pjlogo-eosbg5"></div>
			</div>
			<div class="sprites-pjlogo-eosbg6"></div>
			<div class="content">
				<ul>
					<li>
						<div class="form">
							<input type="text" v-model="code" placeholder="请填写Pureland验证码" name="">
							<div class="checkbtn" @click="check_JT">提交</div>
						</div>
					</li>
					<li>
						<div class="title">领取方法：</div>
						<div class="col">
							<div class="num">
								<div class="inner">1</div>
							</div>
							<div>关注Pureland微信公众号</div>
						</div>
						<div class="col">
							<div class="num">
								<div class="inner">2</div>
							</div>
							<div>按照指引填写ETH钱包地址</div>
						</div>
						<div class="col">
							<div class="num">
								<div class="inner">3</div>
							</div>
							<div>获得验证码</div>
						</div>
						<div class="col">
							<div class="num">
								<div class="inner">4</div>
							</div>
							<div style="height: 1.1rem">返回黑钻评级校验验证码，成功即可获得抽卡机会</div>
						</div>
					</li>
				</ul>
				<img class="hzpjcode" :src="$assets.redpackPurecode">
				<p class="attentxt">关注Pureland公众号,瓜分海量PLD!</p>
			</div>
			<div class="sprites-home-btn2" @click="$router.push(`/acts/${$route.params.id}/redpack/activity`)"></div>
		</act-panel>
	</div>
</template>
<script>
	import actPanel from './actPanel';
	export default {
		name: 'redpack-puretask',
		components: {
			actPanel
		},
		data() {
			return {
				code: '',
			}
		},
		methods: {
			check_JT() {
				if (this.code == '') return false;
				let params = {
					auth_code: this.code,
				}
				this.$ajax.post(this.$api.apply.check_JT, params).then(res => {
					if (res.status == 1 && res.data.status == 1) {
						this.$rpdialog.rpalert({
							title: '校验成功',
							content: `获得抽卡机会`,
							okText: '确认'
						}).then(res => {
							this.$emit('getChanceList');
							this.$router.replace("activity");
						});
					}else if(res.data.status==2){
						this.$rpdialog.rpalert({
							title: '账号已经绑定过',
							content: '请填写正确的验证码并重新校验',
							okText: '确认'
						}).then(res => {
							});
					}else {
						this.$rpdialog.rpalert({
							title: '校验失败',
							content: '请填写正确的验证码并重新校验',
							okText: '确认'
						}).then(res => {

						});
					}
				}).catch(err => {
					this.$rpdialog.rpalert({
							title: '校验失败',
							content: '请填写正确的钱包账号并重新校验',
							okText: '确认'
						}).then(res => {
							});
				})
			},
			share() {
				Share.Ready({
					imgUrl: this.$rpshare.sharelogo,
					title: '关注Pureland微信公众号赢福卡,还能瓜分海量PLD!',
					desc: this.$rpshare.getdesc(this.$route.params.id),
					link: location.href,
				});
			},
		},
		mounted() {
			setTimeout(()=>{
				this.share();
			})
		}
	}
</script>