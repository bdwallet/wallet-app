<template>
	<div class="invite">
		<div class="bg-box">
			<div class="bg" :style="{backgroundImage:`url(${$assets.inviteBg1})`}"></div>
			<div class="bg" :style="{backgroundImage:`url(${$assets.inviteBg2})`}"></div>
			<div class="bg" :style="{backgroundImage:`url(${$assets.inviteBg3})`}"></div>
			<div class="bg" :style="{backgroundImage:`url(${$assets.inviteBg4})`}"></div>
			<!-- <div class="bg" :style="{backgroundImage:`url(${$assets.inviteBg5})`}"></div> -->
		</div>
		<div class="main">
			<div class="item item1">
				<div class="top-rule"><span @click.stop="showDialog">规则</span></div>
				<div class="bottom-tip">
					<i class="icon icon-tongzhi"></i>
					<div class="swiper-box">
						<comp-swiper v-if="tips.length" width="7.85rem" height="1.05rem" :auto="1" :touch="0">
							<comp-swiper-item v-for="(item,index) in tips" :key="index">
								<div class="hzt">{{ item.user_name }} 已获得{{ item.hzt }}黑钻奖励</div>
							</comp-swiper-item>
						</comp-swiper>
					</div>
				</div>
			</div>
			<div class="item item2">
				<div class="invite-button" @click.stop="GoShare">立即邀请赚黑钻</div>
				<div class="invite-code" v-if="isLogin">我的邀请码：{{ invid }}</div>
			</div>
			<div class="item item3">
				<img :src="$assets.inviteGuide" />
			</div>
			<div class="item item4">
				<div class="invite-reward" :style="{ backgroundImage:`url(${$assets.myReward})` }">
					<div class="go-list" @click="$router.push({path: '/invite/list'})">
						<i class="icon icon-shouhui"></i>
					</div>
					<div class="reward">
						<div class="reward-wrap">
							<div class="wrap i1" :style="{ backgroundImage:`url(${$assets.artboard})` }">
								<div class="title">您已成功邀请</div>
								<div class="count">{{invite_data? invite_data.count : 0 }}<span>人</span></div>
							</div>
							<div class="wrap i2" :style="{ backgroundImage:`url(${$assets.artboard})` }">
								<div class="title">累计获得黑钻</div>
								<div class="count">{{invite_data? (invite_data.sum == null ? 0 : Number(invite_data.sum)) : 0 }}<span>个</span></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="item item5">
				<logo-foot/>
				<!-- canvas绘制icon 最为重要的一步 Start-->
				<div class="hzt" v-show="0">
					<span class="span-1">&#xe6a0;</span>
					<span class="span-2">&#xe6a0;</span>
					<span class="span-3">&#xe6a3;</span>
					<!--<span class="span-4">&#xe6a8;</span>-->
				</div>
				<!-- canvas绘制icon 最为重要的一步 End-->
			</div>
		</div>
	</div>
</template>

<script>
	let Canvas = [];
	import { compSwiper, compSwiperItem} from '~components/compSwiper';
	import logoFoot from '~layout/logoFoot';
	import drawCanvas from '~script/drawCanvas';
	export default {
		name: "invite-main",
		components: {
			compSwiper,
			compSwiperItem,
			logoFoot
		},
		data() {
			return {
				invid: Service.GetInviteCode(), // 邀请码
				tips: [], // 广播获得黑钻数据
				invite_data: {}, // 数据

				// 分享相关
				Url: 'https://heizuan.oss-cn-shenzhen.aliyuncs.com/h5images/',
				imageData: '',
				ImgUrl: '', // 本地图片地址
				image: {
					canvas_photo: '',
					canvas_inviteBg: '',
					canvas_shareBg: '',
					canvas_QRCode: '',
				},
			}
		},
		computed: {
			user() {
				return this.$store.getters.userInfo
			},
			name(){
				return this.user.user_name;
			},
			user_photo() {
				return this.user.user_photo ? this.user.user_photo : this.$assets.avatar;
			},
			isLogin() {
				return (this.user && this.user.user_id) ? 1 : 0;
			},
		},
		methods: {
			// 显示弹窗
			showDialog() {
				this.$dialog.pannel({
					title: "奖励规则",
					content: [
						'1.每邀请一位好友下载登录黑钻评级APP,被邀请人可获得225黑钻新人礼包，邀请人可获得至多300黑钻奖励。',
						'2.奖励及经验获得方式：</br>' +
						'①被邀请人每发布一条评级并通过审核，邀请人可获得20黑钻（仅限前10条），累计可获得200黑钻。</br>' +
						'②被邀请人通过实名认证，从次日起的100天内登录【访问任务中心即视为登录】，邀请人可获得1黑钻/天，累计100黑钻/人的奖励。',
						'3.邀请获得经验上限为1000。',
						'4.任何通过不正当手段（包括但不限于侵犯第三人合法权益，作弊，扰乱系统，实施网络攻击，批量注册，用机器注册账户，用机器模拟客户端）获得邀请奖励，黑钻评级有权撤销奖励并永久注销黑钻评级账户。',
						'5.本奖励的最终解释权归黑钻评级所有。'
					]
				})
			},
			// 获取相关数据
			getInvite() {
				this.$ajax.post(this.$api.apply.get_invite).then(res => {
					this.tips = res.data.data[0].data;
					this.invite_data = res.data.count.data;
					if(Global.isApp && this.isLogin){
						this.toBase64Url(1, this.user_photo + '?timeStamp='+ new Date(), 206 * drawCanvas.DPR(), 315 * drawCanvas.DPR())
					}
				}).catch(err => {});
			},
			// 分享| 跳转分享页
			GoShare() {
				if(Global.isApp){
					Service.CheckLogin(this.$route.fullPath).then(() => {
						Service.CheckBind().then(() => {
							if (this.ImgUrl) {
								HZApp.Share.Show({ type: 'image', img: this.ImgUrl });
							} else {
								this.$dialog.tip("图片生成中···");
							}
						})
					})
				} else {
					this.$router.push({
						path: '/invite/share',
						query: {
							url: this.invite_data.url,
							invid: this.invid
						}
					})
				}
			},

			// 转化oss背景图片为base64地址--> 解决跨域问题
			toBase64Url(index,Url,width,height) {
				Canvas[index] = document.createElement('canvas');
				Canvas[index].width = width;
				Canvas[index].height = height;
				if(!Canvas[index].getContext) return false;
				let ctx = Canvas[index].getContext("2d");
				let img = new Image();
				img.src = Url;
				img.crossOrigin = "anonymous";
				img.onload = () => {
					ctx.drawImage(img, 0, 0, width, height);
					let database64 = Canvas[index].toDataURL("image/png", 1);
					if (index == 1) {
						this.image.canvas_photo = database64;
						this.toBase64Url(2, `${this.Url}invite-bg.jpg` + '?timeStamp=' + new Date(), 375 * drawCanvas.DPR(), 667 * drawCanvas.DPR());
					} else if (index == 2) {
						this.image.canvas_inviteBg = database64;
						this.toBase64Url(3, `${this.Url}share-bg.png` + '?timeStamp=' + new Date(), 319 * drawCanvas.DPR(), 519.5 * drawCanvas.DPR());
					} else if (index == 3) {
						this.image.canvas_shareBg = database64;
						this.toBase64Url(4, this.invite_data.url + '?timeStamp=' + new Date(), 86 * drawCanvas.DPR(), 86 * drawCanvas.DPR());
					} else if (index == 4) {
						this.image.canvas_QRCode = database64;
						let type = 'png';
						drawCanvas.creatCanvas({
							image: this.image,
							imageData: this.imageData,
							tipName: '邀你来黑钻评级领取',
							name: this.name,
							code: document.querySelector('.span-1').textContent,
							code1: document.querySelector('.span-3').textContent,
							type
						}).then(res => {
							drawCanvas.saveImage(type,res).then(resolve =>{
								this.ImgUrl = resolve
							});
						})
					}
				}
			}
		},
		mounted() {
			Share.Ready({
				title: `您的好友“${this.user.user_name}”送你225黑钻，点击立即领取`,
				desc: '下载注册黑钻评级App，领取新人大礼包',
				link: `${location.origin}/invite/register/${this.invid}`,
				href: `/invite/register/${this.invid}`
			});
			this.getInvite();
		},
	}
</script>

<style lang="less" scoped>
	@import "../../../../assets/css/config";
	.invite {
		position: relative;
		.bg-box {
			.bg {
				width: 100%;
				height: 13rem;
				background-size: cover;
				background-repeat: no-repeat;
				&:last-child{
					height: 11.4rem;
				}
			}
		}
		.main {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			z-index: 1;
			padding: .75rem 0;
			-webkit-overflow-scrolling: touch;
			.item {
				display: flex;
				width: 100%;
				padding: 0 .3rem;
				flex-direction: column;
				justify-content: center;
				&.item1 {
					justify-content: space-between;
					padding-bottom: .75rem;
					.top-rule {
						display: flex;
						justify-content: flex-end;
						span {
							display: flex;
							width: 2.5rem;
							height: 1rem;
							margin-right: .75rem;
							justify-content: center;
							align-items: center;
							border-radius: .5rem;
							font-size: .6rem;
							background: rgba(255, 255, 255, .6);
							color: #1343B9;
						}
					}
					.bottom-tip {
						display: flex;
						width: 12.5rem;
						height: 1rem;
						justify-content: center;
						align-items: center;
						border-radius: .5rem;
						background: linear-gradient(270deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.5) 56%, rgba(0, 0, 0, 0.1) 100%);
						margin: 9.5rem auto 0;
						color: white;
						.icon {
							margin-right: .2rem;
						}
						.swiper-box {
							width: 7.85rem;
							height: 100%;
							overflow: hidden;
							.hzt {
								width: 7.85rem;
								height: 100%;
								font-size: .55rem;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
						}
					}
				}
				&.item2 {
					.invite-button,
					.invite-code {
						margin: 0 auto;
						text-align: center;
						color: white;
						width: 11rem;
						overflow: hidden;
					}
					.invite-button {
						margin-top: 2.5rem;
						height: 2.25rem;
						line-height: 2.25rem;
						border-radius: 1.1rem;
						background: #f66;
						box-shadow: 0 0 0.3rem #1343B9;
					}
					.invite-code {
						margin-top: .6rem;
						font-weight: bold;
						font-size: .65rem;
					}
				}
				&.item3 {
					margin-top: 2.4rem;
					img {
						width: 100%;
						height: auto;
					}
				}
				&.item4 {
					margin-top: .4rem;
					.invite-reward {
						position: relative;
						background-size: contain;
						background-repeat: no-repeat;
						.go-list{
							position: absolute;
							right: 1.5rem;
							top: 1.4rem;
							.icon{
								color: @color-link;
							}
						}
						.reward {
							margin: 3.75rem auto 1.2rem;
							.reward-wrap {
								display: flex;
								justify-content: center;
								.wrap {
									display: flex;
									flex-direction: column;
									justify-content: center;
									width: 6.95rem;
									height: 4rem;
									padding-top: .5rem;
									margin: 0 .5rem;
									background-size: contain;
									border-radius: .45rem;
									text-align: center;
									color: #FFF;
									&.i1 {
										background-color: rgba(255, 0, 0, .9);
									}
									&.i2 {
										background-color: rgba(93, 118, 255, .9);
									}
									.title {
										font-size: .7rem;
										font-weight: 500;
										height: 1rem;
										line-height: 1rem;
									}
									.count {
										font-weight: bold;
										font-size: 1.502rem;
										span {
											font-size: .7rem;
											vertical-align: baseline;
										}
									}
								}
							}
						}
					}
				}
				&.item5 {
					margin-top: 1.5rem;
				}
			}
		}
	}
</style>
