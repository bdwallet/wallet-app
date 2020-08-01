<template>
	<div class="paper-user">
		<router-view />
		<div class="bottons animate" animate-style='{"attr":"transform","val":"translateY(-4.3rem)"}' animate-time="2400">
			<div class="btn sprites-blue-btn1" @click="$router.replace('/archives')">返回档案库</div>
			<div v-if="isShowWriteBtn" class="btn sprites-orange-btn1" @click="$router.push(`/write/${figureId}`)">提供情报</div>
		</div>
	</div>
</template>

<script>
	const name = 'user';
	export default {
		name,
		components: {},
		data() {
			return {
				isShowWriteBtn: true,
			}
		},
		computed: {
			figureId() {
				return this.$route.params.id;
			},
		},
		methods: {},
		beforeMount() {
		},
		mounted() {
		},
		updated() {},
	}
</script>

<style lang="less">
	.paper-user {
		padding-bottom:4.25rem;
		.bottons {
			position:fixed;
			left:0;
			bottom:0;
			display: flex;
			width: 100%;
			height: 4.25rem;
			background: rgba(0,0,0,.35);
			justify-content: space-around;
			align-items: center;
			.btn {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: .9rem;
				color: #fff;
			}
		}
		.paper-user-home,
		.paper-appraise {
			width: 100%;
			padding: .6rem .75rem .8rem;
			overflow-x: hidden;
			.head-title {
				position: relative;
				z-index: 1;
				.head-title-bg {
					display: flex;
					height: 3rem;
					margin: 0 -.1rem;
					justify-content: center;
					align-items: center;
					background-size: contain;
					background-repeat: no-repeat;
					font-size: .9rem;
					color: #B54A1C;
				}
				img {
					width: 100%;
				}
			}
			.center {
				position: relative;
				margin-top: -2rem;
				padding: 2.8rem .75rem .5rem;
				background: #FFFBE1;
				border: .1rem solid #69BA7E;
				border-radius: 1.1rem;
				color: #4B1802;
				.stars {
					display: flex;
					align-items: center;
					.star {
						display: flex;
						width: .7rem;
						height: .7rem;
						align-items: center;
						justify-content: center; //overflow: hidden;
					}
					.sprites-light-star,
					.sprites-light-halfstar {
						flex-shrink: 0;
						transform: scale(.6);
					}
				}
				.sprites-stamp2 {
					position: absolute;
					right: 0;
					top: 2rem;
				}
				.introduce {
					display: flex; //align-items: center;
					.user-card {
						position: relative;
						z-index: 2;
					}
					.info {
						margin-left: .4rem;
						font-size: .65rem;
						.item {
							margin-bottom: .6rem;
							&:last-child {
								margin: 0;
							}
							b {
								flex-shrink: 0;
								font-weight: normal;
								color: #B54A1C;
							}
						}
					}
				}
				.addon {
					display: flex;
					margin: 1rem 0 .6rem;
					align-items: center;
					justify-content: space-between;
					line-height: 1.2;
					.addon-type {
						padding-left: .2rem;
						border-left: .25rem solid #4B1802;
						font-size: .75rem;
						color: #4B1802;
					}
					.addon-more {
						font-size: .7rem;
						color: #b54a1c;
					}
				}
				.labels {
					display: flex;
					padding: 0;
					flex-wrap: wrap;
					.label {
						padding: .4rem;
						margin: 0 .75rem .75rem 0;
						border: .05rem solid #B54A1C;
						border-radius: .7rem;
						line-height: 1;
						font-size: .6rem;
						color: #B54A1C;
						&.hover {
							background: #B54A1C;
							color: #fff;
						}
					}
				}
				.datalist {
					display: flex;
					flex-direction: column;
					min-height: 12.5rem;
					li {
						padding: .75rem 0 0;
						border-top: .03rem solid #F1DFD0;
						.author {
							display: flex;
							align-items: center;
							.avatar {
								line-height: 1;
								img {
									width: 1.6rem;
									height: 1.6rem;
									border-radius: 50%;
								}
							}
							.name {
								margin-left: .7rem;
								line-height: 1;
								font-size: .7rem;
								color: #B54A1C;
								.star {
									width: .5rem;
									height: .5rem;
									margin-top: .5rem;
									.sprites-light-star,
									.sprites-light-halfstar {
										transform: scale(.4);
									}
								}
							}
						}
						.content {
							padding: .2rem 0;
							font-size: .75rem;
							color: #4B1802;
							word-break: break-all;
						}
						.actions {
							display: flex;
							justify-content: space-between;
							font-size: .6rem;
							color: #B54A1C;
							.like {
								color: #DEAE87;
								&.current {
									color: #B54A1C;
								}
							}
						}
					}
				}
			}
			.empty {
				display: flex;
				width: 100%;
				height: 12rem;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.thumb {
					img {
						width: 6.3rem;
						height: auto;
					}
				}
				.text {
					font-size: .6rem;
					color: #B54A1C;
				}
			}
		}
	}
</style>
