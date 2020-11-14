<template>
	<div class="apply-form" :style="{'paddingTop': paddingTop}" v-show="!loading">
		<div class="topTip" ref="topTip">
			<div class="tip" v-show="!isError">
				<i class="icon icon-gantanhao"></i> 为了提高你的申请通过率，请填写真实有效的信息
			</div>
			<div class="errtip" v-show="isError">
				<p class="err-title"><i class="icon icon-gantanhao"></i><span>审核未通过，请重新提交资料</span></p>
				<p class="err-reason">原因：{{apply_refuse_reson}}</p>
			</div>
		</div>
		<div class="wechat">
			<div class="title">微信号</div>
			<input type="text" v-model="wechat" placeholder="为了便于与您联系,请填写本人微信号" maxlength="20">
		</div>
		<div class="prove">
			<div class="title">证明图片（{{imgLen}}/4）</div>
			<comp-uploader ref="uploader" @uploaded="uploaded" />
		</div>
		<div class="content">
			<div class="content-item">
				<div class="content-title">20万币资证明: </div>
				<p>
					需提供个人真实的币圈资产截图,必要时请自行对敏感信息进行处理。
				</p>
			</div>
			<div class="content-item">
				<div class="content-title">2年币圈经验证明: </div>
				<p>
					需提供个人真实的2年币圈经验证明截图,例如:带有注册日期的交易所账号截图、个人发表的带有时间的区块链内容相关截图等
				</p>
			</div>
		</div>
		<div class="subbox">
			<div :class="['submit', showSub?'active':'']" @click.stop="submit" v-show="!isError">
				提交审核
			</div>
			<div class="err-submit" v-show="isError">
				<div :class="['submit', (showSub&&changing)?'active':'']" @click.stop="submit">
					重新提交
				</div>
				<div class="submit goback" @click="$router.push({path:'/user/main'})">
					返回个人中心
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import compUploader from '~components/compUploader';
	export default {
		name: 'apply-form',
		components: {
			compUploader
		},
		data() {
			return {
				wechat: '',
				paddingTop: 0,
				isError: false,
				imgArray: [],
				loading: true,
				apply_refuse_reson: '',
				requestStatus: true,
				change: false,
				defaultwechat: '',
			}
		},
		computed: {
			imgLen(){ //图片数
				return this.imgArray.length;
			},
			showSub() { //提交按钮状态
				return this.imgLen && this.wechat;
			},
			changing() { //判断图片是否修改过 防止在未通过审核修改时，未进行修改就提交
				return (this.wechat != this.defaultwechat) || this.change;
			}
		},
		methods: {
			uploaded(imglist, ischange) {
				if (ischange == 'change') {
					this.change = true;
				}
				this.imgArray = imglist;
			},
			submit() {
				if (!this.requestStatus||!this.changing) return false;
				if (!this.wechat || !/^[A-Za-z0-9_\-]+$/ig.test(this.wechat)) {
					this.$dialog.tip('请填写正确格式的微信号');
					return false;
				} else if (this.imgArray.length <= 0) {
					this.$dialog.tip('请至少上传一张图片');
					return false;
				}
				let params = {
					imgs: this.imgArray,
					wx_code: this.wechat,
				}
				this.requestStatus = false;
				this.$ajax.post(this.$api.apply.save_user_apply, params).then(res => {
					if (res.status == 1) {
						this.$router.push({
							path: '/apply/verify'
						})
					}
					this.requestStatus = true;
				}).catch(err => {
					this.requestStatus = true;
				})
			},
			getApplication() {
				this.$ajax.get(this.$api.apply.get_user_apply).then(res => {
					// 审核状态:  0:未审核/审核中,1:审核通过,-1:未通过
					if (res.status == 1) {
						if (!res.data.apply_data) {
							this.loading = false;
							return false;
						} else if (res.data.apply_data.apply_status == -1) {
							//审核未通过
							this.isError = true;
							this.apply_refuse_reson = res.data.apply_data.apply_refuse_reson;
							this.wechat = res.data.apply_data.apply_wx_code;
							this.defaultwechat = res.data.apply_data.apply_wx_code;
							this.imgArray = res.data.apply_data.apply_img;
							this.$refs.uploader.initImglist(this.imgArray);
						} else if (res.data.apply_data.apply_status == 0) {
							if (res.data.apply_data.apply_wx_code) {
								//审核中
								this.$router.push({
									path: '/apply/verify'
								})
							}
						} else if (res.data.apply_data.apply_status == 1) {
							//审核成功
							this.pathname = '/apply/success';
						}
					} else {
						this.$dialog.alert({
							title: '系统消息',
							content: '未知错误',
							btns: ['知道了']
						});
					}
					this.loading = false;
				}).catch(err => {
					this.loading = false;
					this.$dialog.alert({
						title: '系统消息',
						content: '未知错误',
						btns: ['知道了']
					});
				})
			},
			checkLevel() {
				if (this.$store.getters.userInfo.level == 3) {
					this.pathname = '/apply/success';
					if(Global.isApp && Global.isPro){
						HZApp.Reload(this.pathname)
					} else {
						this.$router.replace(this.pathname);
					}
					// setTimeout(() => {
					// 	this.$dialog.alert({
					// 		title: '系统消息',
					// 		content: '您也是超级评审员',
					// 		btns: ['知道了']
					// 	}).then(() => {
					// 		this.$router.push({path:'/home'});
					// 	});
					// },200)
				}else{
					this.getApplication();
				}
			}
		},
		created() {
			this.checkLevel();
		},
		mounted() {
			this.paddingTop = this.$refs.topTip && this.$refs.topTip.offsetHeight + 'px';
			Share.Ready();
		}
	}
</script>
