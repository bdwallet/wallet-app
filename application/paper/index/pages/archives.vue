<template>
	<div class="paper-archives">
		<div class="top-area">
			<div class="search">
				<input v-model="searchWord" placeholder='查询“嫌疑人”档案' />
				<div @click="shuffle" class="sprites-search-btn"></div>
			</div>
			<div @click="goRanking" class="sprites-share-supects2"></div>
		</div>
		<div class="archives-list" ref="listbox">
			<touch :next="nextData" :previous="previousData" :key="name">
				<div class="center" v-show="firstListIsShow" :class="firstAnimatClass">
					<div v-for="(son,index) in figureData.first" v-bind:key="son" @click="gotoUserHome(son,$event)" class="user-card sprites-photo-frame2" :class="`inshow${index}`">
						<div class="score">{{son.figure_grade}}</div>
						<div class="avatar"><img :src="son.figure_user_photo" /></div>
						<div class="name">{{son.figure_user_name}}</div>
					</div>
				</div>
				<div class="center" v-show="secondListIsShow" :class="secondAnimatClass">
					<div v-for="(son,index) in figureData.second" v-bind:key="son" @click="gotoUserHome(son,$event)" class="user-card sprites-photo-frame2" :class="`inshow${index}`">
						<div class="score">{{son.figure_grade}}</div>
						<div class="avatar"><img :src="son.figure_user_photo" /></div>
						<div class="name">{{son.figure_user_name}}</div>
					</div>
				</div>
			</touch>
		</div>
		<div class="bottom-area"><div class="sprites-ars-backbtn" @click="playVideo"></div></div>
		<div v-if="firstInit=='1'" class="tip-path">
			<div class="animate-box"><i class="iconfont icon-Path"></i><div class="line"></div></div>
			<div class="text">上下滑动可以查看更多</div>
			<div class="close" @click="firstInit='0'">知道了</div>
		</div>
		<div :class="dialogClass"></div>
	</div>
</template>

<script>
	const name = 'archives';
	let isSearchList = false; //标识现展示区的数据是否为搜索的数据
	var dataListAll = [];
	import localStore from '~script/localStore';
	import touch from '~components/touch';
	export default {
		name,
		components: {
			touch
		},
		data() {
			return {
				loading: true, //数据加载状态
				more: true, //是否有未加载数据
				searchWord: "", //搜索关键词
				dataList: [],
				dataPage: 0, //dataList每页9条数据的总分页数
				figureData: { //数据容器
					first: [],
					second: []
				},
				current_page: 1, //当前页
				page_size: 108, //分页数
				firstAnimatClass: 'move-in', //第一个center动画class
				secondAnimatClass: 'move-in', //第二个center动画class
				firstListIsShow: true, //第一个center是否显示
				secondListIsShow: false, //第二个center是否显示
				change: 0, //控制figureData的索引
				currentFigure: {}, //当前选择的人物数据对象
				currentFigureEl: undefined, //当前选择的人物的DOM对象
				dialogClass: "", //消息弹框类名
				firstInit:false,//是否第一次进入此页面
			}
		},
		computed: {},
		methods: {
			//搜索
			shuffle() {
				if (this.searchWord) {
					this.loading = true;
					Ajax.get(Api.apply.get_figure_list, {
						open_id: this.$store.getters.userInfo.user_openid,
						current_page: 1,
						page_size: this.page_size,
						order: 4,
						figure_name: this.searchWord
					}).then(res => {
						this.loading = false;
						if (res.status == 1) {
							isSearchList = true;
							this.dataList = this.splitArrToDataList(res.data.figureData);
							this.nextData();
						} else {
							this.$dialog.tip({
								type: 'other',
								content: "查无此人,该人物暂未进入怀疑名单",
							});
							if (!isSearchList) return false;
							isSearchList = false;
							this.dataList = this.splitArrToDataList(dataListAll);
							this.nextData();
						}
					}).catch(err => {
						this.$dialog.tip({
							type: 'other',
							content: "服务器忙，请稍后再试！",
						});
						this.loading = false;
					});
				} else {
					this.dataList = this.splitArrToDataList(dataListAll);
					this.nextData();
				}
			},
			//获取数据
			getDataList() {
				this.loading = true;
				Ajax.get(Api.apply.get_figure_list, {
					open_id: '',
					current_page: this.current_page,
					page_size: this.page_size,
					order: 0
				}).then(res => {
					this.current_page++;
					this.loading = false;
					dataListAll = res.data.figureData;
					this.dataList = this.splitArrToDataList(dataListAll);
					this.figureData.first = this.dataList[0];
					this.more = res.data.figureData.length >= this.page_size;
					this.share();
				}).catch(err => {
					this.$dialog.tip({
						type: 'other',
						content: "服务器忙，请稍后再试！",
					});
					this.loading = false;
				});
			},
			//计算数据条数并拆分数组到this.dataList
			splitArrToDataList(array) {
				let len = array.length;
				this.dataPage = Math.ceil(len / 9) - 1;
				let Arr = new Array();
				let index = 0,
					count = 0;
				array.forEach(element => {
					count++;
					if (count > 9) {
						count = 1;
						index++;
					}
					if (!Arr[index]) {
						Arr[index] = [];
					}
					Arr[index].push(element);
				});
				return Arr;
			},
			//下一页处理函数
			nextData(done) {
				this.firstAnimatClass = 'move-in';
				this.secondAnimatClass = 'move-in';
				if (this.change >= this.dataPage) {
					this.change = 0;
				} else {
					this.change++;
				}
				this.changeAnimateClass('move-out');
				if (this.firstListIsShow) {
					this.figureData.second = this.dataList[this.change];
				} else {
					this.figureData.first = this.dataList[this.change];
				}
				setTimeout(() => {
					this.firstListIsShow = !this.firstListIsShow;
					this.secondListIsShow = !this.secondListIsShow;
				}, 600);
				done && done();
			},
			//上一页处理函数
			previousData(done) {
				this.firstAnimatClass = 'move-in';
				this.secondAnimatClass = 'move-in';
				if (this.change <= 0) {
					this.change = this.dataPage;
				} else {
					this.change--;
				}
				this.changeAnimateClass('move-out');
				if (this.firstListIsShow) {
					this.figureData.second = this.dataList[this.change];
				} else {
					this.figureData.first = this.dataList[this.change];
				}
				setTimeout(() => {
					this.firstListIsShow = !this.firstListIsShow;
					this.secondListIsShow = !this.secondListIsShow;
				}, 500);
				done && done();
			},
			//跳转至用户档案
			gotoUserHome(obj, event) {
				this.currentFigure = obj;
				let el = event.currentTarget;
				this.currentFigureEl = el;
				let listbox = this.$refs.listbox;
				let _left = (listbox.clientWidth - el.clientWidth) / 2 - el.offsetLeft;
				let _top = (window.innerHeight - el.clientHeight) / 2 - el.offsetTop - listbox.offsetTop;
				el.style.transform = `translate(${_left}px,${_top}px) rotateY(360deg)`;
				setTimeout(() => {
					el.style.transform = `translate(${_left}px,${_top}px) scale(5)`;
				}, 300);
				//el.style.animation = "moveToCenter .8s";
				setTimeout(() => {
					this.$router.push({
						path: `/user/${obj.figure_id}/home`,
						query: {
							name: obj.figure_user_name,
							avatar: obj.figure_user_photo,
							score: obj.figure_grade
						}
					});
				}, 600);
				// setTimeout(() => {
				// 	el.style = null;
				// }, 1000);
			},
			//跳转至排行榜
			goRanking() {
				if (this.$store.getters.userInfo.user_is_attention != 1) {
					this.$store.commit('changeShowWxcode', {
						status: true
					});
					return false;
				} else {
					this.$router.push('/ranking/3');
				}
			},
			//改变动画类名
			changeAnimateClass(v) {
				if (this.firstListIsShow) {
					this.firstAnimatClass = v;
				} else {
					this.secondAnimatClass = v;
				}
			},
			//播放视频
			playVideo(){
				if(this.$browser == 'IOS'){
					location.href = '/home?play=1';
				}else
				this.$router.push({
					path:'/home',
					query:{play:1}
				});
			},
			share(){
					let href = location.href;
					let wxShare = new WxShare(this.$route, {
						href: browser == "IOS" ? this.$store.getters.href : href,
						imgUrl: this.$global.shareImg,
						title: '54位币圈大佬，韭菜收割王 or 实干家？速来提供情报',
						desc: this.$global.shareDesc,
						link: this.$global.home,
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
			this.firstInit = (localStore.get('isfirst') || "1");
			!this.$route.query.code && this.$store.getters.isLogin && localStore.set("isfirst","0",2592000);
		},
		mounted() {
			//this.dataList = this.splitArrToDataList(arr.arr);
			//this.figureData.first = this.dataList[this.change];
			this.getDataList();
		},
		updated() {},
		activated() {
			if (this.currentFigureEl) {
				try {
					this.currentFigureEl.style = null;
				} catch (e) {
					this.currentFigureEl.style.transform = "";
				}
			}
		},
		deactivated() {}
	}
</script>

<style lang="less">
	@center-height: 22rem;
	.flip-list-move {
		transform: rotateY(360deg);
		transition: transform 3s;
	}
	.paper-archives {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100vh;
		padding: 0 .75rem 1.4rem;
		overflow: hidden;
		.top-area,.bottom-area {
			display: flex;
			width: 100%;
			height:e('calc(50vh - @{center-height}/2)');
			min-height: 2.5rem;
			max-height: 5rem;
			align-items: center;
			justify-content: space-between;
			overflow: hidden;
			.search {
				display: flex;
				width: 9.375rem;
				height: 1.9rem;
				padding: 0 .75rem;
				overflow: hidden;
				align-items: center;
				justify-content: space-between;
				background: #FFFDE8;
				border:.15rem solid rgba(138,234,194,1);
				border-radius: 1.4rem;
				box-shadow:0 0 .1rem 0 rgba(75,24,2,0.5);
				input {
					width: 6.5rem;
					border: none;
					background: none;
					font-size: .75rem;
					color: #FF994E;
					&::-webkit-input-placeholder {
						color: #FF994E;
					}
				}
			}
			.sprites-share-supects2 {
				background-size: 57.7rem 38.5rem;
			}
		}
		.bottom-area{
			justify-content: flex-end;
		}
		.archives-list {
			width: 17.05rem;
			.touch {
				background: #8BD09C;
				box-shadow: 0px .2rem 0px 0px #834A29, 0px -.2rem 0px 0px #D88658;
				border-radius: .4rem;
			}
			.center {
				display: flex;
				width: 100%;
				height: @center-height; //padding: .2rem .7rem;
				justify-content: space-around;
				align-items: center;
				flex-wrap: wrap;
				line-height: 1;
			}
		}
		.tip-path{
			position:absolute;
			left:0;
			top:0;
			display: flex;
			flex-direction: column;
			width: 100%;
			height: 100%;
			align-items: center;
			justify-content: center;
			background: rgba(0,0,0,.6);
			z-index: 999;
			color:#fff;
			.animate-box{
				position: relative;
				display: flex;
				width: 100%;
				height: 10rem;
				align-items: center;
				justify-content: center;
				.iconfont{
					font-size: 2.8rem;
					animation: tipPath 5s ;
					animation-iteration-count: infinite;
					animation-delay:1s;
				}
				.line{
					position: absolute;
					top:3.6rem;
					left:50vw;
					width: .3rem;
					margin-left:-1.2rem;
					align-self:flex-start;
					animation: tipPathLine 5s;
					animation-iteration-count: infinite;
					animation-delay:1s;
					//background: linear-gradient(rgba(255,255,255,.1), rgba(255,255,255,1));
				}
			}
			.text{
				margin-top:2rem;
				font-size: .8rem;
			}
			.close{
				margin-top:1.1rem;
				padding:.4rem 1.5rem;
				border:.05rem solid #fff;
				border-radius: 1rem;
				line-height: 1;
				font-size: .8rem;
			}
		}
	}
	.move-in {
		.inshow0 {
			animation: upMoveIn1 1s ease-out;
		}
		.inshow1 {
			animation: upMoveIn2 1s ease-out;
		}
		.inshow2 {
			animation: upMoveIn3 1s ease-out;
		}
		.inshow3 {
			animation: upMoveIn4 1s ease-out;
		}
		.inshow4 {
			animation: upMoveIn5 1s ease-out;
		}
		.inshow5 {
			animation: upMoveIn6 1s ease-out;
		}
		.inshow6 {
			animation: upMoveIn7 1s ease-out;
		}
		.inshow7 {
			animation: upMoveIn8 1s ease-out;
		}
		.inshow8 {
			animation: upMoveIn9 1s ease-out;
		}
	}
	.move-out {
		.user-card {
			animation: upMoveOut .5s ease-out;
		}
	}
	@keyframes upMoveIn1 {
		0% {
			transform: translate3d(-8rem, -8rem, 0) rotateY(360deg);
		}
		50% {
			transform: translate3d(0.4rem, 0.4rem, 0) rotateY(0);
		}
		90% {
			transform: translate3d(0.4rem, 0.4rem, 0) rotateY(0)
		}
		100% {
			transform: translate3d(0, 0, 0) rotateY(0)
		}
	}
	@keyframes upMoveIn2 {
		0% {
			transform: translate3d(0, -12rem, 0) rotateY(360deg);
		}
		50% {
			transform: translate3d(0, 0.4rem, 0) rotateY(0);
		}
		90% {
			transform: translate3d(0, 0.4rem, 0) rotateY(0);
		}
		100% {
			transform: translate3d(0, 0, 0) rotateY(0);
		}
	}
	@keyframes upMoveIn3 {
		0% {
			transform: translate3d(8rem, -8rem, 0) rotateY(360deg);
		}
		50% {
			transform: translate3d(-0.4rem, 0.4rem, 0) rotateY(0);
		}
		90% {
			transform: translate3d(-0.4rem, 0.4rem, 0) rotateY(0)
		}
		100% {
			transform: translate3d(0, 0, 0) rotateY(0)
		}
	}
	@keyframes upMoveIn4 {
		0% {
			transform: translate3d(-8rem, 0, 0) rotateY(360deg)
		}
		50% {
			transform: translate3d(0.4rem, 0, 0) rotateY(0)
		}
		90% {
			transform: translate3d(0.4rem, 0, 0) rotateY(0)
		}
		100% {
			transform: translate3d(0, 0, 0) rotateY(0)
		}
	}
	@keyframes upMoveIn5 {
		0% {
			transform: scale(3) rotateY(360deg)
		}
		50% {
			transform: scale(1) rotateY(0)
		}
		100% {
			transform: scale(1) rotateY(0)
		}
	}
	@keyframes upMoveIn6 {
		0% {
			transform: translate3d(8rem, 0, 0) rotateY(360deg)
		}
		50% {
			transform: translate3d(-0.4rem, 0, 0) rotateY(0)
		}
		90% {
			transform: translate3d(-0.4rem, 0, 0) rotateY(0)
		}
		100% {
			transform: translate3d(0, 0, 0) rotateY(0)
		}
	}
	@keyframes upMoveIn7 {
		0% {
			transform: translate3d(-8rem, 8rem, 0) rotateY(360deg)
		}
		50% {
			transform: translate3d(0.4rem, -0.4rem, 0) rotateY(0)
		}
		90% {
			transform: translate3d(0.4rem, -0.4rem, 0) rotateY(0)
		}
		100% {
			transform: translate3d(0, 0, 0) rotateY(0)
		}
	}
	@keyframes upMoveIn8 {
		0% {
			transform: translate3d(0, 12rem, 0) rotateY(360deg)
		}
		50% {
			transform: translate3d(0, -0.4rem, 0) rotateY(0)
		}
		90% {
			transform: translate3d(0, -0.4rem, 0) rotateY(0)
		}
		100% {
			transform: translate3d(0, 0, 0) rotateY(0)
		}
	}
	@keyframes upMoveIn9 {
		0% {
			transform: translate3d(8rem, 8rem, 0) rotateY(360deg)
		}
		50% {
			transform: translate3d(-0.4rem, -0.4rem, 0) rotateY(0)
		}
		90% {
			transform: translate3d(-0.4rem, -0.4rem, 0) rotateY(0)
		}
		100% {
			transform: translate3d(0, 0, 0) rotateY(0)
		}
	}
	@keyframes upMoveOut {
		0% {
			transform: rotate(0) scale(1);
			opacity: 1;
		}
		100% {
			transform: rotate(360deg) scale(0);
			opacity: .1;
		}
	}
	@keyframes moveToCenter {
		0% {
			transform: rotate(7deg);
		}
		60% {
			transform: rotate(-7deg);
		}
		100% {
			transform: rotate(7deg);
		}
	}
	@keyframes tipPath {
		0% {
			transform: translateY(0);
		}
		25% {
			transform: translateY(-5rem);
		}
		50% {
			transform: translateY(0);
		}
		75% {
			transform: translateY(5rem);
		}
		100% {
			transform: translateY(0);
		}
	}
	@keyframes tipPathLine {
		0% {
			background: linear-gradient(rgba(255,255,255,1),rgba(255,255,255,.1));
			top:3.6rem;
			bottom: 6.4rem;
		}
		10%	{
			bottom: 6.4rem;
		}
		25% {
			top: -1.4rem;
		}
		30% {
			background: linear-gradient(rgba(255,255,255,1),rgba(255,255,255,.1));
			top: -1.4rem;
			bottom: 11.4rem;
		}

		50%{
			background: linear-gradient(rgba(255,255,255,.1), rgba(255,255,255,1));
			top:3.6rem;
			bottom: 6.4rem;
		}
		60% {
			top:3.6rem;
		}
		75% {
			bottom: 1.4rem;
		}
		80% {
			background: linear-gradient(rgba(255,255,255,.1), rgba(255,255,255,1));
			top:8.6rem;
			bottom: 1.4rem;
		}
		100% {
			background: linear-gradient(rgba(255,255,255,.1), rgba(255,255,255,1));
			top:3.6rem;
			bottom: 6.4rem;
		}
	}
</style>
