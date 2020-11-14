<template>
	<div class="setup-main">
		<div class="operating" v-if="isLogin">
			<div class="item" @click="Go('/user/setup/profile')">
				<div>个人资料设置</div>
				<div class="item-right"><sapn class="span"><img :src="uinfo.user_photo"></sapn><i class="icon icon-shouhui"></i></div>
			</div>
			<div class="item" @click="Go('/user/setup/bind')">
				<div>手机号绑定</div>
				<div class="item-right"><span v-if="tel">{{tel}}</span><span v-else>前往绑定</span><i class="icon icon-shouhui"></i> </div>
			</div>
			<div class="item" @click.stop="BindWX">
				<div>微信绑定</div>
				<div class="item-right"><span v-if="wx">{{wx}}</span><span v-else>前往绑定</span><i class="icon icon-shouhui"></i> </div>
			</div>
		</div>
		<div class="operating" v-if="isLogin">
			<div class="item" @click.stop="setPayCode">
				<div>{{isPay? '重置支付密码' : '设置支付密码'}}</div>
				<div class="item-right"><span v-if="!isPay">未设置</span><i class="icon icon-shouhui"></i></div>
			</div>
			<div class="item" @click="Go('/user/setup/pwd')">
				<div>修改密码</div>
				<div class="item-right"><i class="icon icon-shouhui"></i></div>
			</div>
		</div>
		<div class="operating">
			<div class="item" @click="Go('/protocol')">
				<div>用户协议</div>
				<div class="item-right"><i class="icon icon-shouhui"></i></div>
			</div>
			<div class="item" v-if="$global.isApp" @click="CheckVersion">
				<div>检测新版本</div>
				<div class="item-right"><span>V{{ Version }}</span><i class="icon icon-shouhui"></i></div>
			</div>
			<div v-if="isLogin" class="item" @click="$service.LoginOut">
				<div>退出登录</div>
				<div class="item-right"><i class="icon icon-shouhui"></i></div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	export default {
		name: 'setup-main',
		data() {
			return {
				Version: "",// 当前应用版本号
			}
		},
		computed: {
			uinfo(){
				return this.$store.getters.userInfo;
			},
			isLogin(){
        		return (this.uinfo && this.uinfo.user_id) ? 1 : 0;
			},
			tel() {
				return this.uinfo.user_tel;
			},
			wx(){
				return this.uinfo.user_unionid ? this.uinfo.user_nickname : 0;
			},
			code(){
				return this.$route.query.code;
			},
			isPay(){
				return this.uinfo.is_pay;
			}
		},
		methods: {

			//获取当前版本
			getVersion(){
				if(Global.isApp && Global.isPro){
					plus.runtime.getProperty(plus.runtime.appid,(inf) => {
						this.Version = inf.version;
					})
				}
			},

			//跳转
			Go(path){
				this.$router.push(path);
			},

			//获取微信服务
			BindWX(){
				// 解绑
				if(this.wx){
					this.$dialog.confirm({
						title:"确认解绑",
						content:"解绑微信账号后将无法继续使用它登录该黑钻评级账号",
						btns:["确认","取消"]
					}).then(() => {
						if(Global.isApp) {
							// app解绑
							Service.GetAppWxServices(2).then(() => {
								this.Wxs(2,this.wx,this.uinfo.user_nickname);
							}).catch(() => {});
						} else {
							// h5 微信端解绑
							Ajax.post(Api.apply.binding_wx,{
								type:1
							}).then(r => {
								this.$dialog.tip(r.message);
								Service.Update({user_unionid:'',user_openid:''});
							});
						}
					}).catch(() =>{})
				} else {
					// 绑定
					if(Global.isApp) {
						// app 绑定
						Service.GetAppWxServices().then(res => {
							this.Wxs(3,res.unionid,res.nickname)
						}).catch(() => {
							this.$dialog.tip("微信认证失败，请稍后再试！")
						});
					} else {
						// h5 微信绑定
						if(this.code){
							Ajax.post(Api.apply.binding_wx,{
								code:this.code,
								type:0
							}).then(r => {
								this.$dialog.alert(r.message).then(() => {
									this.$router.replace('/user');
								});
							});
						}else{
							Service.GetWXCode();
						}
					}
				}
			},

			//App绑定与解绑微信
			Wxs(type,code,name) {
				Ajax.post(Api.apply.binding_wx,{
					unionid: code,
					nickname: name,
					type: type,
				}).then(r => {
					if(r.data.status ==1){
						let params = {};
						if(r.data.is_bind){ //is_bind: 1 绑定成功，0 解绑成功
							params.user_unionid = code;
							params.user_nickname = name
						}else{
							params.user_unionid = null
						}
						Service.Update(params);
					}else{
						this.$dialog.tip(r.message)
					}
				}).catch(err => {
					this.$dialog.tip(err.message)
				});
			},

			// 7：设置支付密码、 8：重置支付密码
			setPayCode(){
				let type = this.isPay? 8 : 7;
				Service.Proving(type).then(r => {
					if(r.data.status == 1){
						this.Go('/user/setup/pay');
					}else
                        this.$dialog.alert(r.message);
				})
			},
			// 检测版本更新
			CheckVersion(){
				HZApp.CheckUpdate(() => {
					this.$dialog.tip("已是最新版本");
				});
			},
		},
		mounted() {
			setTimeout(() => {
				this.getVersion()
				Share.Ready();
				if(this.code)
					this.BindWX();
			}, 100);
		},
	}
</script>
