<template>
  <div class="popup-container" :class="{'popup-showing active': state == 1, 'popup-showing popup-hidden': state == 2}">
    <div class="popup ios popup-tip" :class="{'popup-other-tip':type=='other'}">
      <div class="popup-head">
        <div v-if="type=='other'" class="popup-blackzoom" :style="{'background-image':'url('+$assets.messageTipBg+')'}"></div>
        <div v-if="type!='other'" class="popup-icon icon" :class="[iconType]"></div>
        <div class="popup-sub-title" v-text="content"></div>
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
        type: 'success',
        content: "",
        state: 0, // 0: hidden, 1: showing, 2: active
      }
    },
    computed: {
      iconType() {
        return this.type == "success" ? "icon-wancheng" : "icon-jinggao"
      }
    },
    methods: {
      show(options) {
        extend(this, options)
        this.state = 1
        this.promise = new Promise((resolve, reject) => {
          setTimeout(() => {
            this.hide();
            resolve();
          }, 2000);
        });
        document.body.classList.add('popup-open')
        return this.promise
      },
    }
  }
</script>
