<template>
  <div von-backdrop class="backdrop visible" :class="{'active': state == 1}">
  </div>
</template>

<script>
  import {
    timeout,
    removeElement
  } from '~script/utils'
  
  const duration = 200
  const preventDefault = (e) => {
    e.preventDefault()
  }
  export default {
    data() {
      return {
        state: 0
      }
    },
    destroyed() {
      removeElement('[von-backdrop]')
    },
    methods: {
      show(allowTouchMove) {
        if (!allowTouchMove) document.body.addEventListener('touchmove', preventDefault)
        this.state = 1
      },
      hide(allowTouchMove) {
        if (!allowTouchMove) document.body.removeEventListener('touchmove', preventDefault)
        this.state = 0
        return timeout(duration)
      },
      getState() {
        return this.state
      }
    }
  }
</script>

<style lang="less">
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 11;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.3);
    visibility: hidden;
    opacity: 0;
    -webkit-transition: .1s opacity linear;
    transition-duration:.2;
    -webkit-transition-duration:.2s;
    pointer-events:auto;
    transition: .1s opacity linear;
  }
  .backdrop.visible {
    visibility: visible;
  }
  .backdrop.active {
    opacity: 1;
  }
</style>
