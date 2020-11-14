<template>
	<div class="announce-news">
		<!-- 快讯 -->
		<comp-scroll class="page-content" ref="scroller" :on-refresh="OnRefresh" :on-infinite="OnInfinite" v-if="!loading">
			<div v-for="(data, key) in d_dataList" :key="data">
				<div class="date-time">
					<span class="icon icon-qiandao_"></span>
					<span class="date">
						<span class="light">{{key | FormatDate}}</span>
					</span>
				</div>
				<div class="container-content">
					<div class="item" v-for="(item,i) in data" :key="item.newsletter_id">
						<div class="time"><span>{{item.newsletter_create_time}}</span></div>
						<div class="content">
							<div class="title">{{item.newsletter_title}}</div>
							<div class="desc" @click="ShowAllContent(key,i)">
								<span v-if="item.newsletter_content.length>80 && !item.showAll">{{item.newsletter_content.substr(0,80)}}...</span>
								<span v-else>{{item.newsletter_content}}</span>
							</div>
						</div>
						<div class="operation">
							<div class="left">
								<span class="clc" v-if="item.newsletter_link" @click.stop="$service.OpenUrl(item.newsletter_link)">查看原文</span>
							</div>
							<div class="right">
								<div class="list" :class="(+item.newsletter_like_num>+item.newsletter_nolike_num && !item.ischecked) || item.like?'up-active':'up'" @click.stop="LikeClickEvent(key,i,item.newsletter_id,1)">
									<i class="icon icon-lihao1" :class="{'icon-lihao-active':item.like}"></i><span>利好</span>{{item.newsletter_like_num}}
								</div>
								<div class="list" :class="(+item.newsletter_like_num<+item.newsletter_nolike_num && !item.ischecked) || item.nolike?'down-active':'down'" @click="LikeClickEvent(key,i,item.newsletter_id,2)">
									<i class="icon icon-likong1" :class="{'icon-likong-active':item.nolike}"></i><span>利空</span>{{item.newsletter_nolike_num}}
								</div>
								<div class="list share" v-if="isApp" @click="Share(item, key)">
									<i class="icon icon-fenxiang1"></i>分享
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</comp-scroll>
	</div>
</template>

<script>
	import compScroll from "~components/compScroll";
	import drawCanvas from "~script/drawCanvas";
	export default {
		name: "announce-news",
		components: {
			compScroll
		},
		data() {
			return {
				d_page: 1,
				d_pagesize: 20,
				d_more: 1, // 获取更多
				d_dateArray: [], // 日期排序
				d_date: "", // 当前遍历日期
				d_i: 0, // 当前日期下的快讯的索引
				d_dataList: [], //数据列表
				d_likeArray: [],
				d_nolikeArray: [],
				d_isChecked: 0, //点击利好或利空
				// 生成图片相关
				Url: "https://heizuan.oss-cn-shenzhen.aliyuncs.com/",
				imageData: {
					header: "", // 头部
					wrapBg: "", // 内容区域水印
					user_photo: "",
					user_level: "",
					item_logo: "",
					QRCode: ""
				},
				loading: 1, // 数据加载状态
			};
		},
		computed: {
			upLight(like, nolike) {
				return like > nolike;
			},
			isApp() {
				return Global.isApp;
			}
		},
		filters: {
			FormatDate(date) {
				// 日期转换  显示今天  昨天  昨天之前显示日期
				let today = new Date();
				let y = today.getFullYear(),
					m = today.getMonth() + 1,
					d = today.getDate();
				let d1 = new Date(y + "/" + m + "/" + d);
				let year = date.substring(0, 4),
					month = date.substring(5, 7),
					day = date.substring(8, 10);
				let d2 = new Date(year + "/" + month + "/" + day);
				let result = parseInt(d2 - d1) / 1000 / 60 / 60 / 24;
				let weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
				return (
					(result == 0 ? "今天" : result == -1 ? "昨天" : date) + "  " + weekday[d2.getDay()]
				);
			}
		},
		methods: {
			GetData(handle, isRefresh) {
				if (isRefresh) {
					this.d_page = 1;
					this.d_more = 1;
				}
				this.$ajax.get(this.$api.apply.get_newsletter, {
					page: this.d_page,
					pagesize: this.d_pagesize
				}).then(res => {
					if (res.status == 1) {
						this.loading = 0;
						if (this.d_page == 1) {
							this.d_dateArray = [];
							this.d_date = "";
							this.d_i = 0;
							this.d_data = [];
						}
						res.data.forEach((item, index) => {
							if (this.d_date != item.newsletter_date) {
								this.d_i = 0;
								this.d_dateArray[item.newsletter_date] = [];
								this.d_date = item.newsletter_date;
							}
							item.like = 0;
							item.nolike = 0;
							item.ischecked = 0;
							item.showAll = 0;
							this.d_dateArray[item.newsletter_date][this.d_i++] = item;
						});
						this.d_dataList = Object.assign({}, this.d_dateArray);
						this.d_more = res.data.length >= this.d_pagesize ? 1 : 0;
						handle && handle();
					} else {
						this.d_more = 0;
						handle && handle();
					}
				}).catch(err => {
					handle && handle();
				});
			},
			LikeClickEvent(date, i, id, type) {
				let item = this.d_dataList[date][i];
				if (item.ischecked) return;
				this.$ajax.post(this.$api.apply.newsletter_like, {
					id: id,
					type: type //1:利好 2：利空
				}).then(res => {
					if (+res.status == 1) {
						item.ischecked = 1;
						if (type == 1) {
							item.like = 1;
							item.newsletter_like_num++;
						} else if (type == 2) {
							item.nolike = 1;
							item.newsletter_nolike_num++;
						}
						this.d_dateArray[date][i] = item;
						this.d_dataList = Object.assign({},this.d_dataList)
					}
				});
			},
			ShowAllContent(date, i) {
				this.d_dataList[date][i].showAll = !this.d_dataList[date][i].showAll;
				this.d_dataList = Object.assign({},this.d_dataList)
			},
			OnInfinite(done) {
				// 上拉加载
				if (this.d_more) {
					this.d_page++;
					this.GetData(done);
				} else {
					done();
				}
			},
			OnRefresh(done) {
				// 下拉刷新
				this.GetData(done, 1);
			},
			Share(data, date) {
				if (Global.isApp && Global.isPro) {
					this.$dialog.tip("图片生成中···");
					if (this.imageData.QRCode !== '') {
						this.imageData.text = null;
						this.imageData.text = {
							title: data.newsletter_title.length > 35? `${data.newsletter_title.substr(0,35)}...` : data.newsletter_title,
							content: data.newsletter_content.length > 200 ? `${data.newsletter_content.substr(0,200)}...` : data.newsletter_content,
							date: `${date} ${data.newsletter_create_time}` //日期
						};
						if(this.imageData.text != null) {
							drawCanvas.creatDetailCanvas({
								Type: 9,
								imageData: this.imageData,
								footip: "第一时间掌握币圈动态",
							}).then(res => {
								let type = 'png';
								drawCanvas.saveImage(type, res).then(resolve => {
									HZApp.Share.Show({
										type: 'image',
										img: resolve
									});
								});
							})
						}
					}
				} else {
					Share.Ready({
						title: data.newsletter_title,
						desc: '了解项目动态，尽在黑钻评级',
						link: location.href
					})
				}
			},
			Base64Url() {
				// 生成图片
				drawCanvas.toBase64Url(`${this.Url}h5images/new-news-header.jpg?timeStamp=` + new Date(), 375 * drawCanvas.DPR(), 308 * drawCanvas.DPR(), (callBackData) => {
					this.imageData.header = callBackData;
					drawCanvas.toBase64Url(`${this.Url}h5images/water-mark.jpg?timeStamp=` + new Date(), 375 * drawCanvas.DPR(), 1053 * drawCanvas.DPR(), (callBackData) => {
						this.imageData.wrapBg = callBackData;
						drawCanvas.toBase64Url(`${this.Url}web/downewm.jpg`, 200 * drawCanvas.DPR(), 200 * drawCanvas.DPR(), (callBackData) => {
							this.imageData.QRCode = callBackData; //二维码
						})
					})
				})
			}
		},
		mounted() {
			if (Global.isApp && Global.isPro) this.Base64Url();
			this.GetData();
		}
	};
</script>

<style lang="less">
	@import '../../assets/css/config.less';
	.announce-news {
		background-color: #fff;
		.date-time {
			padding: 0.75rem 0.75rem 0;
			position: sticky;
			position: -webkit-sticky;
			top: 2.2rem;
			background-color: #fff;
			z-index: 2;
			.icon {
				width: 0.725rem;
			}
			.date {
				font-size: 0.8rem;
				color: @color-dec;
				font-weight: 400;
				line-height: 1.4;
				.light {
					color: @color-sub;
				}
			}
		}
		.container-content {
			margin-top: 0.5rem;
			padding: 0 0.75rem;
			.item {
				color: @color-sub;
				font-size: 0.7rem;
				line-height: 1.4;
				font-weight: 400;
				position: relative;
				padding-left: 0.85rem;
				padding-bottom: 1.2rem;
				&:last-child {
					padding-bottom: 0;
				}
				&::before {
					content: '';
					position: absolute;
					top: 0.625rem;
					left: 0;
					height: 100%;
					width: 0.025rem;
					background-color: @color-placeholder;
				}
				.time {
					height: 1rem;
					line-height: 1rem;
					&::before {
						content: '';
						position: absolute;
						top: .3rem;
						left: -0.175rem;
						width: 0.4rem;
						height: 0.4rem;
						background-color: @color-link;
						border-radius: 50%;
					}
					span{
						padding: .2rem .6rem;
						background: #F3F3F3;
						border-radius: .6rem;
					}
				}
				.content {
					text-align: justify;
					.title {
						font-weight: 800;
						margin-top: 0.5rem;
					}
					.desc {
						font-weight: 400;
						margin-top: 0.6rem;
						word-wrap: break-word;
					}
				}
				.operation {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 0.6rem;
					.left {
						flex: 2;
						.clc {
							color: @color-link;
						}
					}
					.right {
						flex: 8;
						display: flex;
						justify-content: flex-end;
						align-items: center;
						color: @color-dec;
						.list {
							margin-left: .75rem;
							&:first-child{
								margin-left: 0;
							}
							i.icon,span{
								margin-right: .2rem;
							}
							&.up-active {
								color: #33cf7e;
								.icon-lihao1 {
									&.icon-lihao-active {
										background: #e8e8e8;
										border-radius: 50%;
									}
								}
							}
							&.down-active {
								color: @color-attention;
								.icon-likong1 {
									&.icon-likong-active {
										background: #e8e8e8;
										border-radius: 50%;
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>
