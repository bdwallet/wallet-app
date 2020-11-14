<template>
    <div class="app-comp-share" :class="{'visible':state==1,'hidden':state==2}" v-show='visible'>
        <div class="share-image" v-if="Src">
            <img :src="Src">
        </div>
        <div class="share-main">
            <span class="share-item" v-for="(item) in buttons" :key="item"
                 @click="OnShare(item.scene)">
                <img :src="item.img">
                <label>{{ item.title }}</label>
            </span>
        </div>
        <div class="cancle" @click="Cancel">取消</div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                Src: '',
                buttons: [{
                        title: '微信好友',
                        img: require('~assets/img/wx.png'),
                        scene: 'WXSceneSession',
                    },
                    {
                        title: '微信朋友圈',
                        img: require('~assets/img/wx_pyq.png'),
                        scene: 'WXSceneTimeline',
                    },
                    {
                        title: 'QQ好友',
                        img: require('~assets/img/qq.png'),
                        scene: '',  // QQSceneSession
                    }
                ],
                visible:0, //0:不显示 1：显示
                state:0,// 用于过渡效果 1：上滑 2：下滑
            }
        },
        methods: {
            OnShare(scene) {
                Share.OnShare(scene);
                this.Cancel();
            },
            // 父组件打开此组件的方法 type 判断分享类型
            Show(options) {
                Backdrop.show(this.Cancel);
                this.visible = 1;
                setTimeout(() => {
                    this.state = 1;
                }, 10);
                this.Src = options.img ?`${options.img}?timeStamp=` + new Date(): ""; // 处理缓存问题
                if ((options.type && options.img) || options.name == 'hotlist' || options.name == 'invite-main') { // 解决详情|项目|个人主页 分享图片问题
                    Share.Ready({
                        type: options.type,
                        pictures: options.img
                    });
                }
            },
            Cancel(){
                Backdrop.hide();
                this.destroy()
            },

            getState(){
                return {
                    state: this.state,
                    type: 1
                }
            },

            destroy(){
                this.state = 2;
                setTimeout(() => {
                    this.state = 0;
                    this.Src = '';
                }, 300);
            }
        },
        mounted() {},
    }
</script>
<style lang='less'>
    .app-comp-share {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        padding-bottom: env(safe-area-inset-bottom);
        background: #f8f8f8;
        transition: transform .2s ease-out;
        z-index: 9;
        transform: translateY(100%);
        &.visible{
            transform: translateY(0);
        }
        &.hidden{
            transform: translateY(100%);
        }
        .cancle {
            width: 100%;
            text-align: center;
            color: rgb(51, 51, 51);
            font-size: 16px;
            height: 50px;
            line-height: 50px;
            background-color: #f8f8f8;
            border-top: 1px solid rgb(223, 223, 223);
        }
        .share-main {
            width: 100%;
            padding: 20px 10px;
            display: flex;
            .share-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 1;
                min-width: 60px;
                margin: 0 5px;
                img {
                    width: 40px;
                    height: 40px;
                }
                label {
                    display: block;
                    font-size: 12px;
                    margin-top: 8px;
                    text-align: center;
                    color: black;
                }
            }
        }
        .share-image {
            position: absolute;
            top: -23rem;
            left: 50%;
            margin-left: -6rem;
            background: transparent;
            width: 12rem;
            height: auto;
            overflow-y: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
            max-height: 20rem;
            img {
                width: 100%;
                height: auto;
                display: block;
            }
        }
    }
</style>
