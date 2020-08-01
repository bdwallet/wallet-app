<template>
	<div class="redpack-actend">
		<div class="sprites-actend-img1"></div>
		<div class="sprites-yellow-bgbtn" @click="$router.push('/')">发现更多精彩</div>
	</div>
</template>
<script>
	export default {
		name: 'redpack-actend',
		data() {
			return {}
		},
		mounted() {
			setTimeout(() => {
				Share.Ready({
					imgUrl: this.$rpshare.sharelogo,
					title: '猪年评级努努力,争做家里有矿人.',
					desc: this.$rpshare.getdesc(this.$route.params.id),
					link: location.href,
				});
			})
		}
	}
</script>