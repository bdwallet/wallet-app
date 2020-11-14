<template>
	<header class="app-titlebar">
		<div class="top_bar">
			<div class="abs_l" v-show="showBack" @click='BackTo'><i class="icon icon-shouhui"></i></div>
			<div class="abs_m" :class="{ 'text-indent': showBack && !$route.meta.isShare }">{{title}}</div>
			<div class="abs_r" v-show="showShare" @click='Share'><i class="icon icon-xingzhuang"></i></div>
		</div>
	</header>
</template>
<script>
    export default {
        name: "appTitlebar",
		computed:{
			title(){
				let t = this.$route.meta.title || "";
				return t.replace("黑钻评级-","");
			},
			showBack(){
				return HZApp.mainPage.indexOf(this.$route.name) == -1;
			},
			showShare(){
				return this.showBack && this.$route.meta.isShare ? 1 : 0;
			},
		},
        methods: {
            BackTo () {
				HZApp.Back();
            },
			Share(){
				HZApp.Share.Show({name: this.$route.name});
			}
        },
        mounted(){
            window.Titlebar = this;
        }
    }
</script>
<style lang='less' scoped>
	@import "../assets/css/config";
	.app-titlebar{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 8;
		display: block;
		max-width: 768px;
		height: 3.7rem;
		margin: 0 auto;
		background: rgba(255,255,255,.98);
		color: #333;
		font-size: .75rem;
		.top_bar {
			height: 3.7rem;
			padding-top: 1.25rem;
			user-select: none;
			display: flex;
			align-items: center;
			.abs_m {
				flex: 1;
				font-weight: 400;
				text-align: center;
			}
			.abs_l,.abs_r {
				display: flex;
				width: 2.5rem;
				height: 100%;
				justify-content: center;
				align-items: center;
				font-size: .75rem;
				font-weight: 400;
				color: inherit;
				.icon-shouhui{
					transform: rotate(180deg);
				}
			}
			.text-indent{
				text-indent: -2.5rem;
			}
		}
		&.cssHeader{
			z-index: -2 !important;
		}
	}
	.bgColor{
		background: #31364c;
	}
	.bgColor1{
		background: #ca291b;
	}
	.bgColor2{
		background: #517be1;
	}
	.fixedCenJ{
		z-index: -1 !important;
	}
</style>
