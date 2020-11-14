<template>
  <div class="comp-timer">
    <i class="icon icon-timer"></i>
    <span> {{time}}</span>
  </div>
</template>

<script>
  export default {
    name: "comp-timer",
    props: {
      value: {
        type: Number,
        default: 0
      },
      extraindex:{
        type: Number,//项目列表索引
      }
    },
    data() {
      return {
        val: 0,
        time: ''
      }
    },
    methods: {
      formatTime() {
        let h = parseInt(this.val / 60 / 60) % 24;
        let day = parseInt(this.val / 60 / 60 / 24);
        let str = '';
        if (day > 0) {
          str = day + "天" + h + "小时";
        } else {
          let s = this.val % 60;
          let m = parseInt(this.val / 60 % 60);
          str = (h >= 10 ? h : '0' + h) + ":" + (m >= 10 ? m : '0' + m) + ":" + (s >= 10 ? s : '0' + s);
        }
        this.time = str;
        this.val--;
        return str;
      }
    },
    mounted() {
      this.val = parseInt(this.value);
      this.formatTime();
      let timeout = '';
      timeout = setInterval(() => {
        if (this.val <= 0) {
          this.formatTime();
          this.$emit('hideitem',this.extraindex);
          clearInterval(timeout);
        } else {
          this.formatTime();
        }
      }, 1000);
    }
  }
</script>

<style lang="less" scoped>
  .icon{
    font-size: 0.7rem;
    margin-right: 0.2rem;
  }
</style>

