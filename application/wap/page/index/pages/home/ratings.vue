<template>
	<div class="home-main">
		<comp-datalist scene="1" type="1" />
	</div>
</template>

<script>
	import compDatalist from '~components/compDatalist';
	
	export default {
		name: "ratings",
		components: {
			compDatalist
		},
		data() {
			return {}
		},
		activated() {
			setTimeout(() => {
				Share.Ready();
			});
		}
	}
</script>