<template>
  <div class="touch" :class="{
           'pull-down': (state === 0),
           'pull-up': (state === 1),
           refreshing: (state === 2),
           touching: touching}"
          @touchstart="next && previous ? touchStart($event) : undefined"
          @touchmove="next && previous ? touchMove($event) : undefined" 
          @touchend="next && previous ? touchEnd($event) : undefined" 
          @mousedown="next && previous ? mouseDown($event) : undefined" 
          @mousemove="next && previous ? mouseMove($event) : undefined"
          @mouseup="next && previous ? mouseUp($event) : undefined">
    <div class="touch-inner">
      <div class="pull-to-refresh-layer" v-if="!!onRefresh">
        <slot name="refresh">
          <div class="preloader"></div>
          <div class="pull-to-refresh-arrow"></div>
          <span class="label-down">下拉刷新</span>
          <span class="label-up">释放刷新</span>
          <span class="label-refresh">正在刷新..</span>
        </slot>
      </div>
      <slot ref="touch"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name:"touch",
    props: {
      offset: {
        type: Number,
        default: 20
      },
      next: {
        type: Function,
        default: undefined,
        required: false
      },
      previous: {
        type: Function,
        default: undefined,
        required: false
      },
      haveMore: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        top: 0,
        state: 0, // 0:down, 1: up, 2: refreshing
        startY: 0,
        touching: false,
        infiniteLoading: false,
      }
    },
    methods: {
      touchStart(e) {
        this.startY = e.targetTouches[0].pageY
        this.touching = true
      },
      mouseDown(e) {
        this.startY = e.pageY
        this.touching = true
      },
      touchMove(e) {
        if (!this.touching) {
          return
        }
        let diff = e.targetTouches[0].pageY - this.startY
        if (diff > 0) e.preventDefault()
        let off = diff >= 0 ? Math.pow(diff, 0.8) + (this.state === 2 ? this.offset : 0) : -Math.pow(-diff, 0.8) + (this.state === 2 ? this.offset : 0);
        this.top = off;
        if (this.state === 2) { // in refreshing
          return
        }
        if (this.top >= this.offset) {
          this.state = 1
        } else {
          this.state = 0
        }
      },
      mouseMove(e) {
        if (!this.touching) {
          return
        }
        let diff = e.pageY - this.startY
        if (diff > 0) e.preventDefault()
        this.top = Math.pow(diff, 0.8) + (this.state === 2 ? this.offset : 0)
        if (this.state === 2) { // in refreshing
          return
        }
        if (this.top >= this.offset) {
          this.state = 1
        } else {
          this.state = 0
        }
      },
      touchEnd(e) {
        this.touching = false
        if (this.state === 2) { // in refreshing
          this.state = 2
          this.top = this.offset
          return
        }
        if (Math.abs(this.top) >= this.offset) { // do refresh
          this.refresh()
        } else { // cancel refresh
          this.state = 0
          this.top = 0
        }
      },
      mouseUp(e) {
        this.touching = false
        if (this.state === 2) { // in refreshing
          this.state = 2
          this.top = this.offset
          return
        }
        if (this.top >= this.offset) { // do refresh
          this.refresh()
        } else { // cancel refresh
          this.state = 0
          this.top = 0
        }
      },
      refresh() {
        let type = this.top >= 0;
        this.state = 2
        this.top = this.offset
        if(type)
          this.previous(this.refreshDone);
        else
          this.next(this.refreshDone);
      },
      refreshDone() {
        this.state = 0
        this.top = 0
      },
    },
    mounted(){
    }
  }
</script>

<style lang="less">
  @layer-height: 2rem;
  @color-text-gray: #aaa;
  @keyframes preloader-spin {
    100% {
      transform: rotate(360deg);
    }
  }
  .preloader() {
    width: 0.9rem;
    height: 0.9rem;
    animation: preloader-spin 1s steps(12, end) infinite;
    &:after {
      display: block;
      width: 100%;
      height: 100%;
      content: "";
      background-image: url("data:image/svg+xml;charset=utf-8,<svg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><defs><line id='l' x1='60' x2='60' y1='7' y2='27' stroke='#6c6c6c' stroke-width='11' stroke-linecap='round'/></defs><g><use xlink:href='#l' opacity='.27'/><use xlink:href='#l' opacity='.27' transform='rotate(30 60,60)'/><use xlink:href='#l' opacity='.27' transform='rotate(60 60,60)'/><use xlink:href='#l' opacity='.27' transform='rotate(90 60,60)'/><use xlink:href='#l' opacity='.27' transform='rotate(120 60,60)'/><use xlink:href='#l' opacity='.27' transform='rotate(150 60,60)'/><use xlink:href='#l' opacity='.37' transform='rotate(180 60,60)'/><use xlink:href='#l' opacity='.46' transform='rotate(210 60,60)'/><use xlink:href='#l' opacity='.56' transform='rotate(240 60,60)'/><use xlink:href='#l' opacity='.66' transform='rotate(270 60,60)'/><use xlink:href='#l' opacity='.75' transform='rotate(300 60,60)'/><use xlink:href='#l' opacity='.85' transform='rotate(330 60,60)'/></g></svg>");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100%;
    }
  }
  .pull-to-refresh-layer {
    position: absolute;
    left: 0;
    top: -2rem;
    width: 100%;
    height: @layer-height;
    color: @color-text-gray;
    .preloader {
      visibility: hidden;
      .preloader();
    }
    .pull-to-refresh-arrow {
      width: .7rem;
      height: .7rem;
      background: no-repeat center;
      background-image: url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 40'><polygon points='9,22 9,0 17,0 17,22 26,22 13.5,40 0,22' fill='#bbb'/></svg>");
      background-size: 10.4px 16px;
      z-index: 10;
      transform: rotate(0deg) translate3d(0, 0, 0);
      transition-duration: 300ms;
      margin-left: -.7rem;
    }
  }
  .touch {
    position: relative;
    top: 0;
    -webkit-overflow-scrolling: touch;
    &.touching .touch-inner {
      transition-duration: 0ms;
    }
    &:not(.refreshing) {
      .pull-to-refresh-layer .preloader {
        animation: none;
      }
    }
    &.refreshing {
      .pull-to-refresh-arrow {
        visibility: hidden;
        transition-duration: 0ms;
      }
      .preloader {
        visibility: visible;
      }
    }
    &.pull-up {
      .pull-to-refresh-arrow {
        transform: rotate(180deg) translate3d(0, 0, 0);
      }
    }
  }
  .touch-inner {
    position: relative;
    top: 0;
    width: 100%;
    transition-duration: 300ms;
  }
  .label-down,
  .label-up,
  .label-refresh {
    display: none;
    text-align: center;
  }
  .pull-down .label-down,
  .pull-up .label-up,
  .refreshing .label-refresh {
    display: block;
    width: 5.5em;
  }
  .pull-to-refresh-layer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .6rem;
    color:#bbb;
  }
  .infinite-layer {
    height: 2.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .6rem;
    color: @color-text-gray;
  }
  .infinite-preloader {
    .preloader();
  }
  .label-loading {
    display: block;
    width: 5.5em;
    text-align: center;
  }
  .text-center{
    font-size: 0.6rem;
    line-height: 1;
    color: #ccc;
    display: flex;
    justify-content:center;
    .line-fast{
      width: 2.2rem;
      height: 1px;
      margin-top: 0.3rem; 
      background-color: #d6d6d6;
    }
    .txt-fast{
      margin: 0 0.5rem;
    }
  }
</style>
