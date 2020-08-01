<template>
	<div class="comp-empty" :style="{height:mainHeight}">
		<div v-show="$route.name!='search'" class="default">
			<img :src="$assets.searchEmptyIcon" />
			<div>{{text}}</div>
		</div>
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name: "compEmpty",
		props: {
			mainHeight: {
				type: String,
				default: "5.9rem"
			},
			text: {
				type:String,
				default:""
			}
		}
	}
</script>
<style lang="less">
	.comp-empty {
		position: relative;
		display: flex;
		height: e("calc(100vh - 10.25rem)");
		// background-color: #fff;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 0.7rem;
		color: #ccc;
		text-align: center;
		.default{
			img{
				width: 6rem;
				margin-bottom:.8rem;
			}
		}
		
	}
</style>
