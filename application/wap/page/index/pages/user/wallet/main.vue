                                                                                                                                                                              <template>
	<div class="wallet-main">
		<div class="com-head">
			<div class="backpannel" :style="{backgroundImage:`url(${$assets.userHomeTopBg})`}">
				<div class="regards" @click="gotohelp(0)">
					<i class="icon icon-bangzhuzhongxin"></i>
				</div>
				<div class="diamond">
					<div>
						<span>{{integral}}</span>
						<span class="text">(可用)</span>
						<!--<i class="icon icon-Path3" @click="Refresh"></i>-->
					</div>
					<!--<div class="recharge" @click="$router.push('/user/wallet/record')">含 <b>{{burse_data.burse_hzt_top}}</b> 充值金额</div>-->
					<div class="recharge" @click="$router.push('/user/wallet/record')">查看充提记录</div>
				</div>
				<i class="icon icon-qianbao"></i>
			</div>
			<div class="waiting" v-if="(stay_data && stay_data.stay_id > 0) || stay_sum">
				<div class="hint" @click="$router.push('/user/help/main?tab=11&index=7')">待释放<i class="icon icon-bangzhuzhongxin"></i></div>
				<ul>
					<li>
						<b>{{ stay_sum ? stay_sum : 0}}</b>
					</li>
					<li class="hint-i" @click="$router.push('/user/wallet/list')">
						查看明细&nbsp;<i class="icon icon-shouhui"></i>
					</li>
				</ul>
			</div>
		</div>
		<div class="bill" v-if="loading||detail_data.length>0">
			<div class="name-box">
				<div class="sort-name container">可用黑钻明细</div>
			</div>
			<div class="com-datalist">
				<comp-scroll class="page-content" :on-refresh="onRefresh" :on-infinite="onInfinite" v-if="detail_data">
					<ul class="ul">
						<li v-for="item in detail_data" :key="item">
							<div class="main">
								<div class="title">
									<span class="name">{{item.detail_desc}}</span>
									<span class="num">{{ item.detail_hzt>0?'+':''}}{{formatNum(item.detail_hzt) }}</span>
								</div>
								<div class="time">{{item.detail_create_time}}</div>
							</div>
						</li>
					</ul>
				</comp-scroll>
			</div>
		</div>
		<div v-if="!loading&&detail_data.length <= 0" class="wallet-empty">
			<comp-empty main-height='calc(100vh - 9.95rem)' text="您还未获取过黑钻" />
			<div class="fast-konw">
				<span class="line-fast"></span>
				<span class="txt-fast" @click="gotohelp(2)">快速了解获取方法</span>
				<span class="line-fast"></span>
			</div>
		</div>
		<div class="com-btns">
			<comp-input type="button" :status="1" value="提现" @arrow="gotoCashout" />
			<comp-input class="recharge-btn" type="button" :status="1" value="充值" @arrow="gotoRecharge" />
		</div>
	</div>
</template>
<script>
	import compScroll from "~components/compScroll";
	import compEmpty from '~components/compEmpty';
	import compInput from '~components/compInput/input';
	export default {
		name: "user-wallet-main",
		components: {
			compEmpty,
			compScroll,
			compInput
		},
		data() {
			return {
				detail_data: [],
				burse_data: {},
				stay_data: {},
				stay_sum: '',
				more: true,
				loading: 1,
				current_page: 1,
				page_size: 10
			}
		},
		computed: {
			userInfo() {
				return this.$store.getters.userInfo;
			},
			integral() {
				let d = this.burse_data;
				let hzt = d.burse_hzt ? Number(d.burse_hzt) : 0;
				let cz = d.burse_hzt_top ? Number(d.burse_hzt_top) : 0;
				return Number(hzt + cz).toFixed(4) //显示二位小数
			},
			bannedType() { //账号异常状态 1正常  -1冻结账号  -2禁言  -3不能获取奖励   -4答题  -5禁止提现和赞赏
                return this.$store.getters.bannedType;
			},

		},
		methods: {
			formatNum(num){
				return Number(num).toFixed(4);
			},
			//提现
			gotoCashout() {
				//校验功能是否开启
				if(!this.burse_data.withdraw_status){
					this.$dialog.tip("即将开放");
					return 0;
				}
				if(this.bannedType.indexOf(-5) != -1){ //禁止提现和赞赏
					this.$dialog.alert('很抱歉，您目前行为受限，无法进行相应操作。');
                    return;
				}
                Ajax.post(Api.apply.check_output).then(res => {
                    if(res.data.status == 1){
                        //校验是否设置了支付密码
                        if(this.userInfo.is_pay != 1){
                            this.$dialog.confirm({
                                    title:"请先设置支付密码",
                                    btns:["去设置","取消"]
                                }).then(() => {
                                    this.$router.push("/user/setup/main");
                                }).catch(()=>{});
                            return 0;
                        }
                        //校验是否为APP端
                        if (this.$global.isApp || 1) { //暂时不进行APP端拦截
                            Service.CheckRealName().then(() => {
                            	this.$router.push("/user/wallet/cashout");
                            }).catch(() => {
                            	this.$dialog.confirm({
                            		title:"请先进行实名认证",
                            		btns:["去认证","暂不认证"]
                            	}).then(() => {
                            		this.$router.push("/user/authentication");
                            	}).catch(()=>{
									this.$router.push("/user/wallet/cashout");
								});
                            });
                        } else {
                            this.gotoDown("仅APP里才能提现");
                        }
                    }else {
                        this.$dialog.alert(res.message);
                    }
                })
			},
			//充值
			gotoRecharge() {
				if(!this.burse_data.charge_status){
					this.$dialog.tip("即将开放");
					return 0;
				}
				if (this.$global.isApp || 1) { //暂时不进行APP端拦截
					this.$router.push("/user/wallet/recharge");
				} else {
					this.gotoDown("仅APP里才能充值");
				}
			},
			//去下载APP
			gotoDown(txt) {
				this.$dialog.confirm({
					title: txt,
					btns: ["去下载APP","取消"]
				}).then(() => {
					Service.OpenUrl("/down.html");
				}).catch(()=>{});
			},
			//获取数据
			getDate(done, isrefresh) {
				this.$ajax.post(this.$api.apply.get_burse,{
					current_page:this.current_page,
					page_size:this.page_size
				}).then(res => {
					if (res.status == 1) {
						let d = res.data;
						this.current_page++;
							if (isrefresh) {
								this.detail_data = d.detail_data;
							} else {
								this.detail_data = this.detail_data.concat(d.detail_data);
							}
						this.more = d.detail_data.length == this.page_size;
						this.burse_data = d.burse_data || {};
						this.stay_data = d.stay_data;
						this.stay_sum = d.stay_sum;
					} else {
						this.more = false
					}
					this.loading = 0;
					done && done()
				}).catch(err => {
					this.loading = 0;
					done && done()
				})
			},
			gotohelp(val) {
				this.$router.push({
					path: '/user/help/main?tab=11',
					query: {
						index: val
					}
				})
			},
			//上拉处理
			onRefresh(done) {
				this.current_page = 1;
				this.more = true;
				this.getDate(done, true);
			},
			//下拉加载
			onInfinite(done) {
				if (this.more) {
					this.getDate(done)
				} else {
					done();
				}
			}
		},
		mounted() {
			console.log("in wallet=>>>>>main");
			//this.getUserIntegral(); //获取黑钻
			//-1 审核未通过  -2 删除  1审核通过
			this.getDate();
			Share.Ready();
		}
	}
</script>
