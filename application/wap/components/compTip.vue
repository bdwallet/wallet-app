<template>
	<div class="comp-tip" v-show="showtip" @click.stop="toggle" :style="{'left':left,'top':top}">
		<span :style="{'left':spanleft}"></span>
		<slot></slot>
	</div>
</template>
<script>
	export default {
		name: 'compTip',
		data() {
			return {
				showtip: false,
			}
		},
		props: {
			spanleft: {
				type: String,
				default: '0'
			},
			left: {
				type: String,
				default: '0.15rem'
			},
			top: {
				type: String,
				default: '1.2rem'
			}
		},
		methods: {
			toggle() {
				this.showtip = !this.showtip;
			},
		}
	}
</script>
<style lang="less">
	.comp-tip {
		position: absolute;
		z-index: 99;
		padding: 0.25rem;
		width: 8.5rem;
		font-size: 0.5rem;
		line-height: 0.7rem;
		text-align: justify;
		color: #fff;
		background: #5682FF;
		border-radius: 0.1rem;
		box-shadow: 0px 0.05rem 0.1rem 0px rgba(0, 0, 0, 0.12);
		span {
			position: absolute;
			width: 0;
			height: 0;
			top: -0.3rem;
			border-right: 0.4rem solid transparent;
			border-left: 0.4rem solid transparent;
			border-bottom: 0.4rem solid #5682FF;
		}
	}
</style>