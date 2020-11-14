<template>
	<transition name="fade">
		<div class="modal align-baseline" v-show="visible">
			<div class="modal-mask" v-if="backdrop" @click="backdropClose"></div>
			<div class="modal-card" :class="[{'show-title':title},cardClass]" :style="{width:width+'px'}">
				<span v-if="showClose" class="modal-card-close" @click="handleClose">
						<svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M13.486 12l5.208-5.207a1.048 1.048 0 0 0-.006-1.483 1.046 1.046 0 0 0-1.482-.005L12 10.514 6.793 5.305a1.048 1.048 0 0 0-1.483.005 1.046 1.046 0 0 0-.005 1.483L10.514 12l-5.208 5.207a1.048 1.048 0 0 0 .006 1.483 1.046 1.046 0 0 0 1.482.005L12 13.486l5.207 5.208a1.048 1.048 0 0 0 1.483-.006 1.046 1.046 0 0 0 .005-1.482L13.486 12z" fill-rule="evenodd"></path></svg>
					</span>
				<div class="modal-card-title" v-if="title" ref="title">
					<p><i v-if="iconType" :class="iconClass"></i>{{title}}</p>
				</div>
				<div class="modal-card-body" ref="body" :style="{height:bodyHeight}">
					<div class="modal-card-main" ref="main" :style="{padding:type=='release'?'15px':''}">
						<slot></slot>
						<div class="clear"></div>
						<div class="modal-message-button f-r" v-if="message">
							<ui-button class="canle-btn" v-if="message.showCancel" type="gray" @click="handleClose" plain>{{message.coloseText||'取消'}}</ui-button>
							<ui-button :type="message.type" @click="handleOk">{{message.okText||'确定'}}</ui-button>
						</div>
						<div class="clear"></div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	export default {
		name: 'Modal',
		props: {
			title: {
				type: String,
				default: ""
			},
			showClose: {
				type: Boolean,
				default: true
			},
			width: {
				type: Number,
				default: 416,
			},
			backdrop: {
				type: Boolean,
				default: true
			},
			message: Object,
			visible: {
				type: Boolean,
				default: true
			},
			iconType: {//图标类型
				type: String,
				default: ""
			},
			type: {
				type: String,
				default: ''
			},
			isMessage: Boolean,
			backdropClosable: Boolean,
		},
		data() {
			return {
				defaultHeight: {},
				bodyHeight: 'auto',
				cardClass: ''
			};
		},
		computed: {
			//图标class类
			iconClass() {
				let cls = [];
				switch (this.iconType) {
					case 'success':
						cls = ['success','icon','icon-chenggong1-copy'];
						break;
					case 'error':
						cls = ['error','icon','icon-cuowu1'];
						break;
					case 'information':
						cls = ['information','icon','icon-gantanhao'];
						break;
					case 'warning':
						cls = ['warning','icon','icon-gantanhao'];
						break;
					case 'confirm':
						cls = ['confirm','icon','icon-wenhao'];
						break;
					default:
						cls = [];
						break;
				}
				return cls;
			}
		},
		watch: {
			visible(state) {
				this.checkScroll()
				if (state) {
					this.cardClass = 'ui-modal-in';
					setTimeout(() => {
						this.defaultHeight = this.modalHeight();
						this.resize();
						window.addEventListener('resize', this.resize, false);
					}, 0)
				} else {
					this.cardClass = 'ui-modal-out';
				}
			}
		},
		mounted() {
			this.checkScroll()
		},
		methods: {
			handleClose() {
				this.$emit('close')
			},
			handleOk() {
				this.$emit('ok')
			},
			backdropClose() {
				if (this.backdropClosable) this.handleClose();
			},
			checkScroll() {
				document.body.style.overflow = this.visible ? 'hidden' : '';
			},
			getStyle(ele, attr) {
				return parseFloat(window.getComputedStyle ? window.getComputedStyle(ele, false)[attr] : ele.currentStyle[attr])
			},
			winHeight() {
				var height = 0;
				//获取窗口高度
				if (window.innerHeight) {
					height = window.innerHeight;
				} else if ((document.body) && (document.body.clientHeight)) {
					height = document.body.clientHeight;
				}
				if (document.documentElement && document.documentElement.clientHeight) {
					height = document.documentElement.clientHeight;
				}
				return height
			},
			modalHeight() {
				let title = this.title ? this.getStyle(this.$refs.title, 'height') : 0
				let body = this.getStyle(this.$refs.body, 'height')
				let main = this.getStyle(this.$refs.main, 'height')
				let container = title + body;
				return {
					title,
					body,
					container
				}
			},
			resize() {
				let winHeight = this.winHeight();
				let titleHeight = this.defaultHeight.title
				let bodyHeight = this.defaultHeight.body
				let mainHeight = this.getStyle(this.$refs.main, 'height')
				let containerHeight = titleHeight + mainHeight;
				if (winHeight < containerHeight) {
					bodyHeight = (winHeight - titleHeight) + 'px'
				} else {
					bodyHeight = 'auto'
				}
				this.bodyHeight = bodyHeight
			}
		}
	};
</script>

<style>
	.ui-modal-in {
		animation: 0.5s ease-out backwards;
		animation-name: ui-modal-in;
	}
	.ui-modal-out {
		animation: 0.5s ease-in forwards;
		animation-name: ui-modal-out;
	}
	.canle-btn{
		border: none;
		background: #ededed;
		color:#888;
	}
	@keyframes ui-modal-in {
		0% {
			opacity: 0;
			transform: translate(-50%, -70%);
		}
		100% {
			opacity: 1;
			transform: translate(-50%, -50%);
		}
	}
	@keyframes ui-modal-out {
		0% {
			opacity: 1;
			transform: translate(-50%, -50%);
		}
		100% {
			opacity: 0;
			transform: translate(-50%, 70%);
		}
	}
</style>