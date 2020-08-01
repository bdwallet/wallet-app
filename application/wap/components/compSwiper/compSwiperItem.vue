<template>
  <div class="comp-swiper-item">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'compSwiperItem',
  }
</script>

<style lang="less">
  .comp-swiper-item {
    display: flex;
    width: 100%;
    height: 100%;
    //overflow: hidden;
    justify-content: center;
    img {
      width: 100%;
      height: auto;
    }
  }
</style>
