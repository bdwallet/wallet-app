<template>
	<div class="redpack-eostask">
		<act-panel class="eostask">
			<div class="eos-header">
				<div class="sprites-pjlogo-eosbg3"></div>
				<div class="mul">×</div>
				<div class="sprites-pjlogo-eosbg5"></div>
			</div>
			<div class="sprites-pjlogo-eosbg7"></div>
			<p class="header-title">每天前50名通过黑钻平台成功下载并导入账号送20 oct</p>
			<div class="content">
				<ul>
					<li>
						<div class="title">我有账号</div>
						<p>填写EOS钱包绑定账号并校验成功即可</p>
						<div class="form">
							<input type="text" v-model="code" placeholder="请输入钱包账号" name="">
							<div class="checkbtn" @click="check_EOS">校验</div>
						</div>
					</li>
					<li>
						<div class="title">我还没有账号</div>
						<p>下载EOS钱包绑定账号，在返回校验即可</p>
						<div class="downbtn" @click="$service.OpenUrl('https://pocketeos.com?channel=hzpj')">下载</div>
						<p @click="$service.OpenUrl('https://bihu.com/article/1479236724')"><i class="icon icon-bangzhuzhongxin"></i> EOS钱包绑定账号教程</p>
					</li>
				</ul>
			</div>
			<div class="sprites-pjlogo-eosbg2"></div>
			<div class="sprites-pjlogo-eosbg1"></div>
		</act-panel>
		<div class="sprites-pjlogo-eosbg"></div>
		<div class="sprites-home-btn1" @click="$router.push(`/acts/${$route.params.id}/redpack/activity`)"></div>
	</div>
</template>
<script>
	import actPanel from './actPanel';
	export default {
		name: 'redpack-eostask',
		components: {
			actPanel
		},
		data() {
			return {
				code: '',
			}
		},
		methods: {
			check_EOS() {
				if (this.code == '') return false;
				let params = {
					eos_account: this.code,
				}
				this.$ajax.post(this.$api.apply.check_EOS, params).then(res => {
					if (res.status == 1 && res.data.status == 1) {
						this.$rpdialog.rpalert({
							title: '校验成功',
							content: '获得抽卡机会',
							okText: '确认'
						}).then(res => {
							this.$emit('getChanceList');
							this.$router.push('activity');
						});
					} else if (res.data.status == 2) {
						this.$rpdialog.rpalert({
							title: '账号已经绑定过',
							content: '请填写正确的钱包账号并重新校验',
							okText: '确认'
						}).then(res => {});
					} else {
						this.$rpdialog.rpalert({
							title: '校验失败',
							content: '请填写正确的钱包账号并重新校验',
							okText: '确认'
						}).then(res => {});
					}
				}).catch(err => {
					this.$rpdialog.rpalert({
						title: '校验失败',
						content: '请填写正确的钱包账号并重新校验',
						okText: '确认'
					}).then(res => {});
				})
			},
			share() {
				let sharetitle = (['这辈子都不会下载钱包的。艾玛，真香！', '下载EOS钱包得福卡,暴富就是现在。'][parseInt(Math.random() * 2)]);
				Share.Ready({
					imgUrl: this.$rpshare.sharelogo,
					title: sharetitle,
					desc: this.$rpshare.getdesc(this.$route.params.id),
					link: location.href,
				});
			},
		},
		mounted() {
			setTimeout(() => {
				this.share();
			})
		}
	}
</script>