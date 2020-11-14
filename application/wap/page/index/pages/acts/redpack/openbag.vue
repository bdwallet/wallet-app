<template>
	<div class="redpack-openbg">
		<div class="openbg-main">
			<img :src="cardObj.advbanner">
			<act-panel class="opencard" :style="{'backgroundImage':`url(${$assets.openbg})`}">
				<img class="logo" :src="cardObj.advlogo">
				<div class="sprites-actend-img2"></div>
				<div class="gotcard" :class="cardClass"></div>
				<div class="celetxt">{{cardObj.celetxt}}</div>
				<transition name="closebtn">
					<div v-show="showCloseBtn" class="sprites-activity-btn2" @click="close">确定</div>
				</transition>
			</act-panel>
		</div>
	</div>
</template>
<script>
	import actPanel from './actPanel';
	export default {
		name: 'redpack-openbg',
		components: {
			actPanel,
		},
		data() {
			return {
				cardClass: 'sprites-activity-card0',
				showCloseBtn: false,
			}
		},
		props: {
			cardtxt: {
				type: Number,
				default: ''
			}
		},
		computed: {
			cardObj() {
				let dataObj = {};
				let cele = ['黑钻评级-祝您猪年大吉','Pureland祝您猪年大吉','ExNow--祝您新岁安康','欧链OracleChain-祝您猪年大吉','Bit.cc-祝您猪年大吉','黑钻评级-祝您猪年大吉'];
				let celeIndex = [0,3,2,1,4,5];
				dataObj.advlogo = this.$assets['adverCardLogo'+celeIndex[Number(this.cardtxt)]];
				dataObj.advbanner = this.$assets['adverCardBanner'+celeIndex[Number(this.cardtxt)]];
				dataObj.celetxt = cele[this.cardtxt];
				switch (this.cardtxt) {
					case 0: //谢谢
						let cele0 = ['黑钻评级-祝您猪年大吉','欧链OracleChain-祝您猪年大吉','ExNow--祝您新岁安康','Pureland祝您猪年大吉','Bit.cc-祝您猪年大吉','黑钻评级-祝您猪年大吉'];
						dataObj.class = 'sprites-activity-card' + parseInt(Math.random() * 3 + 1);
						let rand =  parseInt(Math.random() * 5 + 1);
						dataObj.advlogo = this.$assets['adverCardLogo'+rand];
						dataObj.advbanner = this.$assets['adverCardBanner'+rand];
						dataObj.celetxt = cele0[rand];
						break;
					case 1: //猪
						dataObj.class = 'sprites-activity-card4';
						break;
					case 2: //年
						dataObj.class = 'sprites-activity-card5';
						break;
					case 3: //大
						dataObj.class = 'sprites-activity-card6';
						break;
					case 4: //吉
						dataObj.class = 'sprites-activity-card7';
						break;
					case 5: //logo
						dataObj.class = 'sprites-activity-card8';
						break;
					default:
						dataObj.class = 'nothing';
						break;
				}
				return dataObj;
			}
		},
		watch:{
			cardtxt(val){
				if(val!=-1){
					this.showAni();
				}
			}
		},
		methods: {
			close() {
				this.$emit('close');
			},
			showAni(){
				let _this = this;
				let img = new Image();
				img.src = _this.cardObj.advbanner;
				img.onload = function() {
					//弹框动效
					let div = document.getElementsByClassName('openbg-main')[0];
					div.style.transition = 'all .2s cubic-bezier(.1,.96,.33,1.53)';
					setTimeout(() => {
						div.style.transform = 'scale(1)';
					}, 200);
					//抽卡动效
					let timeout = undefined;
					let index = 1;
					setTimeout(() => {
						timeout = setInterval(() => {
							if (index >= 8)
								index = 1;
							else
								index++;
							_this.cardClass = 'sprites-activity-card' + index;
						}, 50);
					}, 1100);
					setTimeout(() => {
						clearInterval(timeout);
						_this.cardClass = _this.cardObj.class;
						_this.showCloseBtn = true;
					}, 2500);
				}
			}
		},
		mounted() {
			if(this.cardtxt!=-1){
					this.showAni();
			}
		}
	}
</script>
<style lang="less">
	.redpack-openbg {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #99211B;
		background-color: rgba(0, 0, 0, 0.5);
		.openbg-main {
			width: 16.0rem; //height: 19.2rem;
			border-radius: 0.45rem;
			transform: scale(0);
			img {
				display: block;
				width: 100%;
				height: 7.4rem;
				border-radius: 0.45rem;
			}
			.opencard {
				display: flex;
				flex-direction: column;
				align-items: center;
				min-height: 14.5rem;
				border-top-left-radius: 0;
				border-top-right-radius: 0;
				.logo {
					position: absolute;
					top: -1.2rem;
					left: 50%;
					transform: translateX(-50%);
					width: 2.4rem;
					height: 2.4rem;
					border-radius: 50%;
				}
				.sprites-actend-img2 {
					position: absolute;
					top: 1.2rem;
					left: 3.1rem;
				}
				.tl {
					top: 0;
					left: 0;
					.sprites-frame-bg1 {
						position: relative;
						margin-top: 3.3rem;
						margin-left: -1.25rem;
					}
				}
				.sprites-frame-bg2 {
					top: 7.35rem;
					right: 1.0rem;
				}
				.gotcard {
					margin-top: 1.9rem; //animation: rotating duration timing-function delay iteration-count direction fill-mode;
					animation: rotating 3s cubic-bezier(1, .33, .03, .97);
					animation-delay: .3s; //animation-iteration-count: infinite;
				}
				.celetxt {
					width: 100%;
					margin-top: .3rem;
					font-size: 0.7rem;
					text-align: center;
				}
				.sprites-activity-btn2 {
					margin-top: .3rem;
					font-size: 0.8rem;
					color: #FAD393;
					text-align: center;
					line-height: 2.0rem;
				}
			}
		}
	}
	.closebtn-enter-active {
		transition: all .5s;
	}
	.closebtn-enter {
		opacity: 0;
		transform: translateY(1rem);
	}

	@keyframes rotating {
		from {
			transform: rotateY(0);
		}
		to {
			transform: rotateY(1800deg);
		}
	}
</style>