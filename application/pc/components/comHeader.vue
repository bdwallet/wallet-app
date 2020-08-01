<template>
	<div class="HZPJ-header">
		<div class="container">
			<div class="logo-box" @click="$router.push('/')">
				<img class="logo" :src="$assets.logo" />
				<img class="logo-text" :src="$assets.logoTextHeader" />
			</div>
			<ul class="tab-pc">
				<router-link tag="li" to="/home">首页</router-link>
				<router-link tag="li" to="/ratings">评级</router-link>
			</ul>
			<router-link class="tab-wap" tag="div" to="/ratings">
				<i class="icon icon-pingji"></i>
			</router-link>
		</div>
	</div>
</template>

<script>
	const name = 'header';
	export default {
		name,
		data() {
			return {}
		},
		computed: {},
		methods: {
		},
		mounted() {}
	}
</script>