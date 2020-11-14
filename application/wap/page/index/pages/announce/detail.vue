<template>
	<div class="announce-detail detail-page showFooter" v-if="!loading">
		<div class="container detail" v-if="detail.itemnoti_id">
			<!-- 删除操作区域 -->
			<div class="pro-action">
				<div v-if="isSelf" @click.stop="deleteRating(detail.itemnoti_id)" class="pro-delete"><i class="icon icon-shanchu"></i><span>删除</span></div>
				<div v-else @click.stop="goReport" class="pro-delete">
					<i class="icon icon-jubao"></i>
					<span>举报</span>
				</div>
			</div>
			<!-- 相关项目标签列表 -->
			<div class="tag" v-if="detail.itemnoti_cate_name || detail.item_urrency_abbreviation">
				<ul>
					<li @click="$router.push('/announce/main')">{{detail.itemnoti_cate_name}}</li>
					<li @click="$router.push(`/article/${detail.itemnoti_item_id}`)">{{detail.item_urrency_abbreviation}}</li>
				</ul>
			</div>
		</div>
		<!-- 评论列表 -->
		<div class="comment-wrap">
			<comp-comment-list :type="4" :rid="rid" />
		</div>
		<!-- 评论点赞操作区域 -->
		<comp-comment-toolbar :type="4" :rid="detail.itemnoti_id" :is_like="detail.is_like" :like_num="detail.itemnoti_like_num" :comment_num="detail.itemnoti_comment_num" />

		<!-- 付费置顶 -->
		<div class="pay-top" @click.stop="ShowTimeRange">
			<img :src="$assets.payToTop" />
		</div>
		<comp-time-range ref="TimeRange" :type="4" :grade_id="rid"></comp-time-range>
	</div>
</template>

<script>
	import compUserinfo from '~components/compUserinfo';
	import compTimeRange from  '~components/compTimeRange';
	import {
		compCommentToolbar,
		compCommentList
	} from '~components/comment';
	export default {
		name: 'announce-detail',
		components: {
			compUserinfo,
			compCommentToolbar,
			compCommentList,
			compTimeRange
		},
		data() {
			return {
				detail: {}, //详情数据
				delPath: '', //删除公告后跳转的路由
				backwhere: '', // app 删除后跳转
				loading: 1, // 数据加载状态
			}
		},
		computed: {
			rid() {
				return this.$route.params.pid;
			},
			isSelf() {
				return this.$store.getters.userInfo.user_id == this.detail.itemnoti_user_id;
			},
		},
		watch: {
			rid(v) {
				if (v)
					this.getData();
			},
		},
		methods: {
			//处理图片宽高
			getImgSrc(src, length, type) {
				if (type) { //针对历史评级图片尺寸不同 0为详情内容的图片 1为历史评级内的图片
					src += length >= 2 ? '?x-oss-process=image/resize,m_fill,h_120,w_120' : '?x-oss-process=image/resize,m_lfit,h_160,w_160';
				} else {
					src += length >= 2 ? '?x-oss-process=image/resize,m_fill,h_150,w_150' : '?x-oss-process=image/resize,m_lfit,h_210,w_210';
				}
				return src;
			},
			getData() {
				this.loading = 1;
				this.$ajax.get(this.$api.apply.itemnoti_get_detail, {
					itemnoti_id: this.rid
				}).then(res => {
					if (res.status == 1 && !Array.isArray(res.data)) {
						this.loading = 0;
						this.detail = res.data;
						this.Share();
					} else {
						this.$dialog.alert({
							title: "系统消息",
							content: res.data[1],
							btns: ["好"]
						}).then(() => {
							if (Global.isApp && Global.isPro) {
								HZApp.Back()
							} else {
								this.$router.go(-1);
							}
						});
					}
				}).catch(err => {
					setTimeout(() => {
						this.$dialog.alert({
							title: "系统消息",
							content: err.message,
							btns: ["好"]
						}).then(res => {
							if (Global.isApp && Global.isPro) {
								HZApp.Back()
							} else {
								this.$router.go(-1);
							}
						});
					}, 500);
				})
			},
			Share() {
				//分享配置
				let data = this.detail;
				let title, desc, imgUrl, href;
				title = `【${data.item_urrency_abbreviation}公告】${data.itemnoti_content && data.itemnoti_content.substring(0, 60)}...`;
				desc = `各方项目公告，最新动态行情，尽在黑钻评级`;
				imgUrl = data.item_logo || this.$assets.logo;
				href = location.href;
				Share.Ready({
					imgUrl,
					title,
					desc,
					link: href,
				});
			},
			deleteRating(id) {
				this.$dialog.confirm({
					title: '您确定要删除此公告？',
					btns: ['删除', '取消']
				}).then(res => {
					this.$ajax.post(this.$api.apply.itemnoti_del, {
						id: id
					}).then(res => {
						if (res.status == 1) {
							if (Global.isApp && Global.isPro) {
								HZApp.Back()
							} else
								this.$router.replace(`${this.delPath}?refresh=1`);
						} else {
							this.$dialog.alert({
								title: '系统消息',
								content: res.message,
								btns: ['好']
							});
						}
					}).catch(err => {
						this.$dialog.alert(err.message);
					})
				})
			},
			// 去举报
			goReport() {
				Service.CheckLogin(this.$route.fullPath).then(() => {
					Service.CheckBind().then(() => {
						this.$router.push({
							path: "/report",
							query: {
								gradetype: 4,
								gradeid: this.rid,
							}
						});
					}).catch(() => {});
				}).catch(() => {});
			},

			// 付费置顶
			ShowTimeRange(){
				Service.CheckLogin(this.$route.fullPath).then(() => {
					Service.CheckBind().then(() => {
						Service.CheckRealName().then(() => {
							this.$refs.TimeRange.show()
						}).catch(() => {
							this.$dialog.confirm({
								title: "请先进行实名认证",
								btns: ["去认证", "好的"]
							}).then(() => {
								this.$router.push("/user/authentication");
							}).catch(() => {});
						});
					}).catch(() => { });
				}).catch(() => {});
			},
		},
		mounted() {
			this.getData();
		},
		beforeRouteEnter(to, from, next) {
			// 进入页面记录上一页路由，便于删除评级爆料后跳转刷新页面
			next(vm => {
				vm.delPath = from.path;
				vm.backwhere = decodeURIComponent(location.search).slice(12) // 解码，截取参数
			});
		}
	}
</script>
