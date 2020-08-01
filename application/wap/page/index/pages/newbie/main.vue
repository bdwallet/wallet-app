<template>
	<div class="newbie-main">
		<!-- 新手课堂 -->
		<!-- 吸顶tab -->
		<div class="com-tab">
			<div class="tab-item">
				<span :class="{'active': currentTab==14}" @click="Cuter(14)">小白入门</span>
			</div>
			<div class="tab-item">
				<span :class="{'active': currentTab==15}" @click="Cuter(15)">玩转黑钻</span>
			</div>
		</div>
		<keep-alive>
			<comp-datalist scene="6" :type="currentTab" :key="currentTab" />
		</keep-alive>
	</div>
</template>

<script>
	import compDatalist from "~components/compDatalist";
	export default {
		name: "newbie-main",
		components: {
			compDatalist
		},
		computed: {
			currentTab() {
				// tab激活  小白入门   玩转黑钻
				return this.$route.query.tab;
			}
		},
		methods: {
			//TAB切换处理
			Cuter(tab) {
				this.$router.replace({
					path: '/newbie/main',
					query: {
						tab: tab
					}
				})
				this.Share();
			},
			Share() {
				//分享配置
				Share.Ready({
					title: "黑钻评级——新手课堂，尽在黑钻评级",
					desc: "学习小白入门知识，了解黑钻评级APP玩法",
					link: location.href
				});
			}
		},
		mounted() {
			this.Share();
		}
	};
</script>