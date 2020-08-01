<template>
	<div class="HZPJ-MAIN">
		<com-header v-show="showHeader" />
		<keep-alive include="ratings">
			<router-view />
		</keep-alive>
		<com-footer v-show="showFooter" />
	</div>
</template>

<script>
  import comHeader from '~components/comHeader';
  import comFooter from '~components/comFooter';
	const name = 'MAIN';
	export default {
		name,
		components: {
			comHeader,
			comFooter
		},
		data() {
			return {}
		},
		computed: {
			showHeader(){
				return this.$route.meta.header;
			},
			showFooter(){
				return this.$route.meta.footer;
			}
		},
		methods: {
			
		},
		mounted() {
		},
		updated() {},
	}
</script>

<style lang="less" src="./style/"></style>