<template>
	<div class="coins-main">
		<!-- 公告 -->
		<comp-banner type="3" />
		<!-- 吸顶tab -->
		<div class="com-tab">
			<div class="tab-item">
				<span :class="{'active': currentTab==6}" @click="Cuter(6)">黑钻出品</span>
			</div>
			<!-- 以后运营可能放其他内容 -->
			<!-- <div class="tab-item">
					<span :class="{'active': currentTab==7}" @click="Cuter(7)">新闻资讯</span>
				</div> -->
			<div class="tab-item">
				<span :class="{'active': currentTab==13}" @click="Cuter(13)">项目进度</span>
			</div>
		</div>
		<keep-alive>
			<comp-datalist scene="6" :type="currentTab" :key="currentTab" />
		</keep-alive>
	</div>
</template>

<script>
	import compBanner from "~components/compBanner";
	import compDatalist from "~components/compDatalist";
	export default {
		name: "coins-main",
		components: {
			compBanner,
			compDatalist
		},
		computed: {
			currentTab() {
				// tab激活  6:黑钻出品  7:新闻资讯 13:产品进度
				return this.$route.query.tab || 0;
			}
		},
		methods: {
			//TAB切换处理
			Cuter(tab) {
				let query = {
					path: '/coins/main',
					query: {
						tab: tab
					}
				}
				this.$router.replace(query);
				this.Share();
			},
			Share() {
				//分享配置
				Share.Ready({
					title: "黑钻评级——币圈资讯，尽在黑钻评级",
					desc: "获取币圈资讯，了解行业发展，尽在黑钻评级",
					link: location.href
				});
			}
		},
		mounted() {
			this.Share();
		},
    	activated(){
    	    console.log("in coins => main");
    	}
	};
</script>