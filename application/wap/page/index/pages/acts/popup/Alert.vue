<template>
  <div class="popup-container" :class="{'popup-showing active': state == 1, 'popup-showing popup-hidden': state == 2}">
    <div class="popup ios">
      <div class="popup-head">
        <div v-if="title" class="popup-title" v-text="title"></div>
        <div v-if="content" class="popup-sub-title" v-text="content"></div>
        <div class="hairline-bottom"></div>
      </div>
      <div class="popup-buttons">
        <button class="button button-ok" @click="onOk()" v-html="okText">
            </button>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from './mixin'
  
  export default {
    mixins: [mixin],
    data() {
      return {
        title: '',
        content: '',
        okText: 'ok',
        state: 0 // 0: hidden, 1: showing, 2: active
      }
    }
  }
</script>
