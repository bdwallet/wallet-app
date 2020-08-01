<template>
	<div class="menu" :style="{width}">
		<slot></slot>
		<!--倒三角-->
		<div class="layer_arrow" v-if="triangle">
			<div class="arrow_bor" :style="triangle">
				<i class="bg_fr line"></i>
				<em class="bg_br line"></em>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Menu',
		props: {
			width: {
				type: String,
				default: ''
			},
			triangle:{
				type:String,
				default:''
			}
		}
	};
</script>

<style lang="less">
.menu{
	.layer_arrow{
		.arrow_bor{
			top:-18px;
			.bg_fr{
				border:10px solid #383b40;
				margin-top:-2px;
			}
			.bg_br{
				border-color:transparent transparent #fff transparent;
				margin-left:-22px;
				margin-top:4px;
			}
		}
	}
}
</style>