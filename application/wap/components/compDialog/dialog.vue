<template>
  <div class="comp-dialog" :class="{'active': state == 1, 'hidden': state == 2}" @touchmove="TouchMove">
    <div :class="['dialog',type]">
      <div v-if="close" @click.stop="onClick(0)" class="close icon icon-Pathni"></div>
      <div class="dialog-head">
        <div v-if="icon" :class="['icon',icon]"></div>
        <div v-if="title" class="title" v-html="title"></div>
        <div v-if="typeof(content)=='object' && type == 'pannel'" class="sub-title">
          <p v-for="(s,i) in content" :key="i" v-html="s"></p>
        </div>
        <div v-if="typeof(content)=='object' && type !='pannel'" class="sub-title center">
          <p v-for="(s,i) in content" :key="i" v-html="s"></p>
        </div>
        <div v-else-if="typeof(content)=='string'" class="sub-title">
          <div class="sub-img" v-if="img">
            <img :src="imgUrl"  >
          </div>
          {{content}}
        </div>
      </div>
      <div v-if="btns.length > 0" class="dialog-buttons">
        <div class="button" v-for="(s,i) in btns" :key="i" :class="{'button-ok':i==0}" @click.stop="onClick(i)">{{s}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  const extend = (target, source) => {
    for (let key in source) {
      target[key] = source[key]
    }
    return target
  };

  export default {
    name: 'compDialog',
    data() {
      return {
        state: 0, //0: hidden, 1: showing, 2: active
        type: '', //alert confirm success warning tip pannel
        icon: '', //头部图标 icon-wancheng icon-gantanhao
        title: '', //提示标题
        content: '', //提示内容
        img: 0, // 是否显示图片
        btns:[],//操作按钮文本数组
        showBackdrop: false, //是否显示遮罩面板
        time: 0, //自动关闭时间
        timeout:0, //自动关闭计时器
        imgUrl: this.$assets.appDialog, // 图片链接
        close: false, //是否显示头部关闭按钮
        backdropClick:1, //遮罩点击事件 1：可点击 0：不可点击
      }
    },
    methods: {
      show(options) {
        extend(this, options);
        if(this.showBackdrop){
          if(this.backdropClick){
            this.showBackdrop && Backdrop.show(() => {
              this.onClick("ok");
              this.destroy();
            }); //显示遮罩
          }else{
            Backdrop.show(1);
          }
        }
        this.state = 1;
        this.promise = new Promise((resolve, reject) => {
          this.$on('okEvent', () => {
            this.hide()
            resolve()
          });
          this.$on('cancelEvent', () => {
            this.hide()
            reject()
          });
          if (this.time) {
            this.timeout = setTimeout(() => {
              this.hide()
              resolve()
            }, this.time);
          }
        });
        return this.promise;
      },
      hide() {
        if(this.showBackdrop){
          Backdrop.hide(); //关闭遮罩
          this.destroy();
        } else
          this.destroy();
      },
      destroy(){
        this.state = 2
        setTimeout(() => {
          this.state = 0
          this.$destroy()
        }, 300);
      },
      TouchMove(e){
        if(this.type == 'pannel') return;
        e && e.preventDefault();
      },
      onClick(i){
        if(i == 0 || (i == 'ok' && this.btns.length <= 1)) //如果有多个按钮，则点击阴影触发cancelEvent
          this.$emit('okEvent');
        else
          this.$emit('cancelEvent')
      },
    },
    destroyed() {
      clearTimeout(this.timeout); //防止手动关闭后，再次触发resolve();
      let parent = this.$el.parentNode
      parent.removeChild(this.$el)
    }
  }
</script>
