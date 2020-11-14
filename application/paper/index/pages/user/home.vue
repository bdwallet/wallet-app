<template>
	<div class="paper-user-home animate2" animate-style='{"attr":"transform","val":"translateY(150vh)"}' animate-transition="all .5s cubic-bezier(0.7,-0.4,0,-0.2)">
		<div class="head-title"><img :src="$assets.paperUserTop" /></div>
		<div class="center" ref="usercenter">
			<div class="sprites-stamp2 animate" animate-style='{"attr":"transform","val":"scale(4)"}' animate-time="1600"></div>
			<div class="introduce">
				<div class="user-card sprites-photo-frame2" ref="usercard">
					<div class="score">{{userScore}}</div>
					<div class="avatar"><img :src="userAvatar" /></div>
					<div class="name">{{userName}}</div>
				</div>
				<div class="info" style="transform:translateY(.4rem)">
					<div class="item">
						<b class="animate" animate-style='{"attr":"transform","val":"translateY(-0.4rem)"}' animate-time="200">姓名：</b>
						<span class="animate" animate-style='{"attr":"transform","val":"translateX(-5rem)"}' animate-time="400">{{figureData.figure_user_name}}</span>
					</div>
					<div class="item">
						<b class="animate" animate-style='{"attr":"transform","val":"translateY(-0.4rem)"}' animate-time="300">投资项目：</b>
						<span class="animate" v-if="figureData.figure_itme_data && figureData.figure_itme_data.length > 0" animate-style='{"attr":"transform","val":"translateX(-5rem)"}' animate-time="600"><span v-for="item in figureData.figure_itme_data" :key="item">{{item.item_urrency_abbreviation}} </span></span>
						<span class="animate" v-else animate-style='{"attr":"transform","val":"translateX(-5rem)"}' animate-time="600">无</span>
					</div>
					<div class="item" style="display:flex;">
						<b class="animate" animate-style='{"attr":"transform","val":"translateY(-0.4rem)"}' animate-time="400">可信度：</b>
						<div class="stars animate" animate-style='{"attr":"transform","val":"scale(3)"}' animate-time="800">
							<div class="star" v-for="star in figureData.starnum" :key="star">
								<span class="sprites-light-star"></span>
							</div>
							<div class="star" v-if="figureData.halfstar">
								<span class="sprites-light-halfstar"></span>
							</div>
						</div>
					</div>
					<div class="item">
						<b class="animate" animate-style='{"attr":"transform","val":"translateY(-0.4rem)"}' animate-time="500">现任职位：</b>
						<span class="animate" animate-style='{"attr":"transform","val":"translateX(-5rem)"}' animate-time="1000">{{figureData.figure_default_user_job}}</span>
					</div>
				</div>
			</div>
			<div class="addon animate" animate-style='{"attr":"transform","val":"translateY(0.4rem)"}' animate-time="1600">
				<div class="addon-type">评价({{figureData.figure_grade_num}})</div>
				<div v-if="figureGradeData.length > 0" class="addon-more" @click="toAppraise(0)">查看全部 ></div>
			</div>
			<div class="animate" animate-style='{"attr":"transform","val":"translateY(0.4rem)"}' animate-time="1800">
				<div class="labels" v-if="figureData.figure_label_data && figureData.figure_label_data.length > 0">
					<div class="label" v-for="item in figureData.figure_label_data" :key="item" @click="toAppraise(item.label_id)">{{item.label_name}}({{item.figure_label_num}})</div>
				</div>
			</div>
			<ul class="datalist animate" animate-style='{"attr":"transform","val":"translateY(0.4rem)"}' animate-time="2000">
				<li v-if="!loading && figureGradeData.length <= 0" class="empty">
					<div class="thumb"><img :src="$assets.paperAppraiseNone" /></div>
					<div class="text">TA还没有收到过评论, 也是够低调的～</div>
				</li>
				<li v-else v-for="item in figureGradeData" :key="item" @click="$router.push(`/share/${item.grade_figure_id}/${item.grade_user_id}`)">
					<div class="author">
						<div class="avatar"><img :src="item.user_photo" /></div>
						<div class="name">
							<div>{{item.user_name}}</div>
							<div class="stars">
								<div class="star" v-for="s in item.grade_score" :key="s"><span class="sprites-light-star"></span></div>
							</div>
						</div>
					</div>
					<div class="content">{{item.grade_content}}</div>
					<div class="actions">
						<div class="date">{{dater(item.grade_create_time).format('MM-DD hh:mm')}}</div>
						<div class="like" :class="item.is_like?'current':''" @click.stop="doLike(item,index,$event)">
							<i class="iconfont icon-ic_dibu_dianzan"></i>
							<span>{{item.grade_like_num > 0 ? item.grade_like_num : '赞'}}</span>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	const name = 'userhome';
	import dater from "~script/dater";
	export default {
		name,
		components: {},
		data() {
			return {
				figureData: {},
				figureGradeData: [],
				loading: true,
				current_page: 1,
				page_size: 5
			}
		},
		computed: {
			figureId() {
				return this.$route.params.id;
			},
			userName() {
				return this.$route.query.name ? this.$route.query.name : this.figureData.figure_user_name;
			},
			userAvatar() {
				return this.$route.query.avatar ? this.$route.query.avatar : this.figureData.figure_user_photo;
			},
			userScore() {
				return this.$route.query.score ? this.$route.query.score : this.figureData.figure_grade;
			},
		},
		methods: {
			dater,
			//点赞
			doLike(item, index,e) {
				if (this.$store.getters.userInfo.user_is_attention != 1) {
					this.$store.commit('changeShowWxcode', {
						status: true
					});
					return false;
				}
				if (item.is_like == 1) return;
				let params = {
					open_id: this.$store.getters.userInfo.user_openid,
					grade_id: item.grade_id
				}
				this.$ajax.post(this.$api.apply.figure_grade_like, params).then(res => {
					if (res.data.status == 1) {
						doLikeAnimation(e);
						item.is_like = 1;
						item.grade_like_num = +item.grade_like_num + 1;
						this.$set(this.figureGradeData, index, item);
					} else {
						console.log(res);
					}
				}).catch(err => {
						this.$dialog.tip({
								type: 'other',
								content: err.message,
							})
				})
			},
			//获取人物详情
			getFigureData() {
				Ajax.get(Api.apply.get_figure, {
					figure_id: this.figureId,
					current_page: this.current_page,
					page_size: this.page_size,
					order: 0,
					open_id: this.$store.getters.userInfo.user_openid,
					user_id: 0,
					label_id: 0
				}).then(res => {
					this.loading = false;
					this.figureData = res.data.figureData;
					let figure_grade = this.figureData.figure_grade;
					let halfstar = parseInt(figure_grade.toString().split('.')[1]) >= 5;
					this.$set(this.figureData, 'starnum', parseInt(figure_grade));
					this.$set(this.figureData, 'halfstar', halfstar);
					this.figureGradeData = res.data.figureGradeData.gradeData;
					this.$parent.isShowWriteBtn = res.data.checkUserFigureGrade.status == 1;
					this.scaleAvatar();
					this.animateStart("animate");
					this.share();
				}).catch(err => {
					console.log(err);
				});
			},
			//头像缩放动效
			scaleAvatar() {
				let usercard = this.$refs.usercard;
				usercard.style.transition = "all .2s ease-in";
				usercard.style.transform = `translate(0px,0px) scale(1)`;
			},
			toAppraise(label_id){
				this.animateGo("animate2");
				setTimeout(() => {
					this.$router.push(`/user/${this.figureData.figure_id}/ars/${label_id}`);
				}, 800);
			},
			share(){
					let href = location.href;
					let shareobj = this.$global.getShareTxt(this.figureData.figure_user_name,this.figureData.figure_grade);
					let wxShare = new WxShare(this.$route, {
						href: browser == "IOS" ? this.$store.getters.href : href,
						imgUrl: this.figureData.figure_user_photo,
						title: shareobj.shareTitle,
						desc: shareobj.sharedesc,
						link: `${this.$global.home}?link=/user/${this.figureData.figure_id}/home`,
						circleFunction() { //分享朋友圈成功回调
							//alert("分享朋友圈成功！");
						},
						friendFunction() { //分享给朋友成功回调
							//alert("分享给好友成功！");
						},
						errorFunction(res) { //config配置失败回调
							console.log("wxShare config error",res);
						}
					});
			}
		},
		beforeMount() {
		},
		mounted() {
			let usercenter = this.$refs.usercenter;
			let usercard = this.$refs.usercard;
			if (this.userName) {
				let _left = (usercenter.clientWidth - usercard.clientWidth) / 2 - usercard.offsetLeft;
				let _top = (window.innerHeight - usercard.clientHeight) / 2 - usercard.offsetTop - usercenter.offsetTop;
				usercard.style.transition = false;
				usercard.style.transform = `translate(${_left}px,${_top}px) scale(5)`;
			}
			this.animateBeFore();
			this.getFigureData();
		},
		updated() {},
	}
</script>