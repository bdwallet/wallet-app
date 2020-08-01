<template>
	<div class="home-main">
		<comp-datalist scene="1" type="2" :keep-state="true" empty-txt="暂时无爆料" />
	</div>
</template>

<script>
	import compDatalist from '~components/compDatalist';
	export default {
		name: "disclosures",
		components: {
			compDatalist
		},
		data() {
			return {}
		},
		activated() {
			setTimeout(() => {
				Share.Ready({
					title: "关注黑钻社区达人，看精彩评级",
					desc: "了解币圈动态，实时掌握最新资讯",
					link: location.href,
				});
			});
		}
	}
</script>