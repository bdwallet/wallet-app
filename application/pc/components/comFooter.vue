<template>
	<div class="HZPJ-footer">
		<div class="container">
			<div class="links">
				<div class="title">友情链接</div>
				<ul class="list">
					<li v-for="item in linkData" :key="item"><a :href="item.link_url" target="_blank" :title="item.link_name">{{item.link_name}}</a></li>
				</ul>
			</div>
			<div class="copyright">
				<div class="logo-box">
					<img class="logo" :src="$assets.logoTextFooter" />
				</div>
				<div class="info">
					<div class="tel"><span>Email: contact@heizuan.com</span></div>
					<p>CopyRight @ 2020 heizuan.com</p>
				</div>
				<div class="weixin">
					<img :src="$assets.kefuewm" />
					<div class="text">
						<h3>微信咨询</h3>
						<p>商务合作</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	const name = 'footer';
	export default {
		name,
		data() {
			return {
				linkData:[],
			}
		},
		computed: {},
		methods: {
		},
		mounted() {
			Ajax.get(Api.get_link_list,{
        		order: 1
			}).then(res => {
				this.linkData = res.data.linkData;
			})
		}
	}
</script>