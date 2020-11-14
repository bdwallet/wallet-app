<template>
	<div class="paper-appraise animation" animate-style='{"attr":"transform","val":"translateY(-100vh)"}' animate-transition="all .5s cubic-bezier(.33,1.4,.37,1.29)">
		<div class="head-title"><div class="head-title-bg" :style="{'background-image':`url(${$assets.paperAppraiseTop})`}">全部评价</div></div>
		<div class="center" ref="usercenter">
			<div class="labels animation" animate-style='{"attr":"transform","val":"translateY(-0.4rem)"}' animate-time="600">
				<div @click="$router.replace(`/user/${figureId}/ars/0`)" class="label" :class="{'hover':labelId==0}">全部({{figureData.figure_grade_num}})</div>
				<div @click="$router.replace(`/user/${figureId}/ars/new`)" class="label" :class="{'hover':labelId=='new'}">最新</div>
				<div @click="$router.replace(`/user/${figureId}/ars/${item.label_id}`)" class="label" :class="{'hover':labelId==item.label_id}" v-for="item in figureData.figure_label_data" :key="item">{{item.label_name}}({{item.figure_label_num}})</div>
			</div>
			<ul class="datalist animation" animate-style='{"attr":"transform","val":"translateY(-0.4rem)"}' animate-time="800">
				<li v-for="(item,index) in figureGradeData" :key="item" @click="$router.push({path:`/share/${item.grade_figure_id+'/'+item.grade_user_id}`})">
					<div class="author">
						<div class="avatar"><img :src="item.user_photo" /></div>
						<div class="name">
							<div>{{item.user_name}}</div>
							<div class="stars">
								<div class="star" v-for="s in +item.grade_score" :key="s"><span class="sprites-light-star"></span></div>
							</div>
						</div>
					</div>
					<div class="content">{{item.grade_content}}</div>
					<div class="actions" @click.stop>
						<div class="date">{{dater(item.grade_create_time).format('MM-DD hh:mm')}}</div>
						<div class="like" :class="item.is_like?'current':''" @click="doLike(item,index,$event)">
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
	const name = 'appraise';
	let dataArr = {},firstEnter = true;
	import dater from "~script/dater";
	export default {
		name,
		components: {},
		data() {
			return {
				figureData:{},
				figureGradeData:[],
				current_page:1,
				page_size:10,
			}
		},
		computed: {
			figureId(){
				return this.$route.params.id;
			},
			labelId(){
				return this.$route.params.type;
			}
		},
		watch:{
			"labelId":function(label_id){
				firstEnter = false;
				if(dataArr[label_id]){
					this.figureGradeData = dataArr[label_id];
				}else{
					this.getFigureData();
				}
			},
		},
		methods: {
			dater,
			getFigureData() {
				let order = 1;//0 按时间最新，1 按点赞数
				if(this.labelId=="new") order = 0;
				Ajax.get(Api.apply.get_figure, {
					figure_id: this.figureId,
					current_page: this.current_page,
					page_size: this.page_size,
					order,
					open_id: this.$store.getters.userInfo.user_openid,
					user_id: 0,
					label_id: this.labelId == "new" ? 0 : this.labelId
				}).then(res => {
					this.figureData = res.data.figureData;
					this.figureGradeData = res.data.figureGradeData.gradeData;
					dataArr[this.labelId] = this.figureGradeData;
					this.share();
					if(firstEnter){
						this.animateStart("animation");
					}else{}
				}).catch(err => {
					console.log(err);
				})
			},
			doLike(item,index,e){
				if(this.$store.getters.userInfo.user_is_attention != 1){
					this.$store.commit('changeShowWxcode', {status:true});
					return false;
				}
				if (item.is_like == 1) return;
				let params = {
					open_id: this.$store.getters.userInfo.user_openid,
					grade_id: item.grade_id
				}
				if (item.is_like == 1) return;
				this.$ajax.post(this.$api.apply.figure_grade_like,params).then(res=>{
					if(res.data.status==1){
						doLikeAnimation(e);
						item.is_like = 1;
						item.grade_like_num = +item.grade_like_num+1;
						this.$set(this.figureGradeData,index,item);
					}else{
						console.log(res);
					}
				}).catch(err=>{
					this.$dialog.tip({
						type: 'other',
						content: err.message,
					})
				})
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
		beforeMount() {},
		mounted() {
			this.animateBeFore("animation");
			this.getFigureData();
		},
		updated() {},
	}
</script>