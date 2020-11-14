<template>
	<div class="home-main">
		<comp-banner type="2" />
		<!-- 运营位 -->
		<comp-menus v-if="menus&&menus.length>0" :menus="menus" />
		<comp-datalist scene="1" type="0" empty-txt="暂时没有推荐内容" />
	</div>
</template>

<script>
	import LocalStore from '~script/localStore';
	import compDatalist from '~components/compDatalist';
    import compBanner from '~components/compBanner';
	import compMenus from '~components/compMenus';
	export default {
		name: "recommend",
		components: {
			compDatalist,
			compBanner,
			compMenus
		},
		data() {
			return {
				menus: [], //运营位数据
			}
		},
		methods: {

		},
		mounted(){
			//获取葫芦位数据
			Ajax.post(Api.apply.operation_get_list).then(res => {
				this.menus = res.data;
			});
		},
		activated() {
			setTimeout(() => {
				Share.Ready();
			});
		}
	}
</script>
