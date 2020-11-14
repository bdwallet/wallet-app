<template>
  <div class="popup-container" :class="{'popup-showing active': state == 1, 'popup-showing popup-hidden': state == 2}">
    <div class="popup ios popup-pannel">
      <div @click="onHide()" class="popup-close icon icon-bingqichuantongpingjizuofa"></div>
      <div class="popup-head">
        <div class="popup-title" v-text="title"></div>
        <div v-if="content.length>0" class="popup-sub-title">
          <p v-for="(itemstr,index) in content" :key="index" v-html="itemstr"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from './mixin'

  const extend = (target, source) => {
    for (let key in source) {
      target[key] = source[key]
    }
    return target
  }
  
  export default {
    mixins: [mixin],
    data() {
      return {
        title: '提示',
        content: [],
        state: 0 // 0: hidden, 1: showing, 2: active
      }
    },
    methods: {
      show(options) {
        extend(this, options)
        this.state = 1
        this.promise = new Promise((resolve, reject) => {
          this.$on('hideEvent', () => {
            this.hide()
            resolve()
          })
        })
        document.body.classList.add('popup-open')
        return this.promise
      },
    }
  }
</script>
