<template>
  <transition name="ext-loading-fade" @after-leave="handleAfterLeave">
    <div v-show="visible" class="ext-loading-mask" :class="{fullscreen: fullscreen }">
      <div class="ext-loading-spinner">
        <svg class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none"/>
        </svg>
        <span v-if="text" class="ext-loading-text">{{ text }}</span>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'uiLoading',
  data () {
    return {
      visible: true,
      fullscreen: true,
      text: null
    }
  },
  methods: {
    handleAfterLeave() {
      this.$emit('after-leave');
    },
	setText(text){
		this.text = text
	}
  }
}
</script>
<style lang="less">


.ext-loading-mask {
	position: absolute;
	margin: 0;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	-webkit-transition: opacity .3s;
	transition: opacity .3s;
	z-index: 999;
}

.ext-loading-mask.fullscreen {
	position: fixed
}

.ext-loading-spinner {
	//top: 50%;
	//margin-top: -21px;
	width: 100%;
	text-align: center;
	position: absolute
}


.ext-loading-spinner .ext-loading-text {
	display: inline-block;
	vertical-align: middle;
	color: #409EFF;
	margin: 0 8px 0;
	font-size: 14px
}

.ext-loading-spinner .circular {
	display: inline-block;
	vertical-align: middle;
	height: 42px;
	width: 42px;
	-webkit-animation: loading-rotate 2s linear infinite;
	animation: loading-rotate 2s linear infinite
}

.ext-loading-spinner .path {
	-webkit-animation: loading-dash 1.5s ease-in-out infinite;
	animation: loading-dash 1.5s ease-in-out infinite;
	stroke-dasharray: 90,150;
	stroke-dashoffset: 0;
	stroke-width: 2;
	stroke: #409EFF;
	stroke-linecap: round
}

.ext-loading-spinner i {
	color: #409EFF
}

@-webkit-keyframes loading-rotate {
	100% {
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg)
	}
}

@keyframes loading-rotate {
	100% {
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg)
	}
}

@-webkit-keyframes loading-dash {
	0% {
		stroke-dasharray: 1,200;
		stroke-dashoffset: 0
	}

	50% {
		stroke-dasharray: 90,150;
		stroke-dashoffset: -40px
	}

	100% {
		stroke-dasharray: 90,150;
		stroke-dashoffset: -120px
	}
}

@keyframes loading-dash {
	0% {
		stroke-dasharray: 1,200;
		stroke-dashoffset: 0
	}

	50% {
		stroke-dasharray: 90,150;
		stroke-dashoffset: -40px
	}

	100% {
		stroke-dasharray: 90,150;
		stroke-dashoffset: -120px
	}
}
</style>