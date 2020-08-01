<template>
  <div class="touch" @scroll="(onInfinite || infiniteLoading) ? onScroll($event) : undefined">
    <div class="touch-inner">
      <slot ref="scroll"></slot>
      <div class="infinite-layer" v-show="needscroll && onInfinite">
        <slot name="infinite">
          <div class="infinite-preloader"></div>
          <span class="label-loading">正在加载..</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name:"scroll",
    props: {
      onInfinite: {
        type: Function,
        default: undefined,
        require: false
      },
      needscroll:{
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        infiniteLoading: false
      }
    },
    methods: {
      infinite() {
        this.infiniteLoading = true
        this.onInfinite(this.infiniteDone)
      },
      infiniteDone() {
        this.infiniteLoading = false
      },
      getBodyScrollTop(){
        return document.documentElement.scrollTop || document.body.scrollTop
      },
      onScroll(e) {
        if(!this.needscroll) return false;
        this.$emit('getScrollTop',this.getBodyScrollTop());
        if (this.infiniteLoading) {
          return
        }
        let outerHeight = this.$el.clientHeight
        let innerHeight = this.$el.querySelector('.touch-inner').clientHeight
        let scrollTop = this.$el.scrollTop
        let ptrHeight = this.onRefresh ? this.$el.querySelector('.pull-to-refresh-layer').clientHeight : 0
        let infiniteHeight = this.$el.querySelector('.infinite-layer').clientHeight
        //let bottom = this.$el.offsetHeight-(window.innerHeight+this.getBodyScrollTop());
        let bottom = document.body.offsetHeight-(window.innerHeight+this.getBodyScrollTop());
        if (bottom <= 40){
          this.infinite()
        } 
      }
    },
    mounted(){
       let me = this
       setTimeout(function(){
         window.addEventListener('scroll',me.onScroll,false)
       })
    },
    activated(){
      let me = this
      setTimeout(function(){
         window.addEventListener('scroll',me.onScroll,false)
       })
    },
    deactivated(){
      window.removeEventListener('scroll',this.onScroll,false)
    },
    destroyed(){
     window.removeEventListener('scroll',this.onScroll,false)
    }
  }
</script>