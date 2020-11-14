<template>
  <div class="video">
    <div v-if="playVideo=='1' && $store.getters.isLogin">
      <div v-show="showSkipBotton" class="skip" @click="skipVideo">跳过</div>
      <div v-if="!isIOS && showPlayimg" id="play" @click="playing" class="playimg"><img src="https://heizuan.oss-cn-shenzhen.aliyuncs.com/paper/paper-video-play.jpg" /></div>
      <div class="video-box" @click="gotoArchives">
        <video v-if="isIOS" id="video" autoplay="autoplay" autobufer="true" preload="meta" x-webkit-airplay="true" x5-video-player-fullscreen="true" x5-video-player-type="h5" webkit-playsinline="true" playsinline="true">
            <source :src="videoUrl" type="video/mp4" style="object-fit:fill">
          </video>
        <!-- <video v-else id="video" :src="videoUrl" controls x5-playsinline playsinline webkit-playsinline preload="auto"></video> -->
        <video v-else id="video" style="object-fit:fill;max-width:100vw;max-height:100vh;" autobufer="true" x-webkit-airplay="true" x5-video-player-type="h5" x5-video-player-fullscreen="true" webkit-playsinline="true" playsinline="true">
            <source :src="videoUrl" type="video/mp4" style="object-fit:fill;max-width:100vw;max-height:100vh;">
          </video>
      </div>
      <div v-if="showEndimg" @click="skipVideo" class="endimg"><img src="https://heizuan.oss-cn-shenzhen.aliyuncs.com/paper/paper-video-end.jpg" /></div>
    </div>
  </div>
</template>

<script>
  import parameter from '~script/parameter';
  import localStore from '~script/localStore';
 
  export default {
    name: 'home',
    data() {
      return {
        showSkipBotton: true,
        videoUrl: 'https://heizuan.oss-cn-shenzhen.aliyuncs.com/video/paper-finished.mp4',
        showPlayimg: true,
        showEndimg: false,
        jumpLink: '',
        playVideo:'0',//是否需要播放视频
      }
    },
    computed: {
      isIOS() {
        return this.$browser == 'IOS';
      }
    },
    methods: {
      //跳过视频
      skipVideo() {
        this.jumpLink = this.jumpLink ? this.jumpLink : '/archives';
        this.$router.replace(this.jumpLink);
      },
      gotoArchives() {},
      playing() {
        let _this = this;
        this.showPlayimg = false;
        let video = document.getElementById("video");
        video.addEventListener("ended", function() {
          _this.videoEnd();
        })
        video.play();
      },
      videoEnd() {
        this.skipVideo();
        return false;
        let videoBox = document.getElementById("video");
        this.showEndimg = true;
        document.removeChild(videoBox);
      },
      share() {
        let href = location.href;
        let wxShare = new WxShare(this.$route, {
          href: browser == "IOS" ? this.$store.getters.href : href,
          imgUrl: this.$global.shareImg,
          title: '54位币圈大佬，谁拿走了金镰刀?',
          desc: this.$global.shareDesc,
          link: this.$global.home,
          circleFunction() { //分享朋友圈成功回调
            //alert("分享朋友圈成功！");
          },
          friendFunction() { //分享给朋友成功回调
            //alert("分享给好友成功！");
          },
          errorFunction(res) { //config配置失败回调
            console.log("wxShare config error", res);
          }
        });
      }
    },
		beforeMount() {
      let isplay = this.$route.query["play"];
      if(isplay == '1'){
        this.playVideo = "1";
      }else{
        this.playVideo = (localStore.get('playvideo') || "1");
      }
			!this.$route.query.code && this.$store.getters.isLogin && localStore.set("playvideo","0",2592000);
		},
    mounted() {
      this.jumpLink = this.$route.query["link"];
      if (this.playVideo == "1" || this.$route.query["play"] == '1') {
        let _this = this;
        let video = document.getElementById("video");
        video.width = window.innerWidth;
        if (this.isIOS) {
          document.addEventListener("WeixinJSBridgeReady", function() {
            document.getElementById("video").play();
          }, false);
          let md = document.getElementById("video");
          md.addEventListener("ended", function() {
            _this.videoEnd();
          })
        }
      }else{
        this.skipVideo();
      }
      setTimeout(() => {
        this.share();
      })
    }
  }
</script>

<style lang="less">
  .video {
    position: relative;
    height: 100vh;
    background: #000;
    align-items: center;
    overflow: hidden;
    .playimg,
    .endimg {
      display: flex;
      height: 100%;
      align-items: center;
      img {
        width: 100%;
      }
    }
    .endimg {
      width: 100%;
    }
    .video-box {
      position: relative;
      z-index: 1;
      display: flex;
      height: 100%;
      align-items: center;
      overflow: hidden;
    }
    .skip {
      position: absolute;
      top: 3rem;
      right: 1rem;
      z-index: 9999999;
      padding: .1rem .3rem;
      color: #fff;
      font-size: .6rem;
      border: .03rem solid #fff;
      border-radius: 1rem;
    }
  }
</style>
