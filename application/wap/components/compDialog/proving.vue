<template>
    <div class="comp-dialog" :class="{'active': state == 1, 'hidden': state == 2}" @touchmove.prevent="TouchMove">
        <div class="dialog comp-proving">
            <div class="dialog-head">
                <div class="title">为保证您的账号安全请进行验证</div>
                <!-- <div class="title">{{move}}</div> -->
                <div class="image">
                    <div class="base-img">
                        <img class="base" :src="img" />
                        <img class="target" :src="prov" :style="{top:`${top}px`,left:`${left}px`}" />
                    </div>
                    <div class="piece-box" ref="piece" :style="{transform:`translateX(${move-left}px)`,webkitTransform:`translateX(${move-left}px)`}">
                        <div class="piece" :style="{backgroundImage:`url(${img})`,webkitMaskPosition:`${left}px ${top}px`,webkitMaskImage:`url(${prov})`}"></div>
                    </div>
                </div>
                <div class="slide" :class="{'success':result>0,'error':result==0,'':result<0}">
                    <span>拖动左边滑块，完成上方拼图</span>
                    <div class="slider" ref="slider" :style="{transform:`translateX(${move}px)`,webkitTransform:`translateX(${move}px)`}" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd"><i class="icon" :class="{'icon-Path':result>0,'icon-Pathni':result==0,'icon-Group':result<0}"></i></div>
                    <!-- <div class="process" ref="process" :style="{width:`${move+30}px`}"></div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import PWD from '~script/PWD';
    export default {
        name: 'compProving',
        data() {
            return {
                state: 0,
                slider: undefined, //slider对象
                piece: undefined, //piece对象
                // process:undefined,
                img: "", //背景图
                prov: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACQUlEQVR4Xu1a0TFEQRDsiwARIAJEgAgQgRMBIkAEiIDLgAyIABEgAkRA9dnj1dU9bx89W2+82aqr+7i92d3eme7Z3RmgTFsCsA6A36sA5ivDPgHg5wbAA4DXMlP6HGVgOBgXuQtgmBadO9QVgPMESO5/ft3PCoB9AMdTO912kvSIveQdbf+b3d8CgIu069mT+KEjw2ETwL3C2CwbagAOAJyKJ0sQlq24QQkAY/7xj25fh91JCikxtloSJNnR/S0aVYJeIG9KDyB7b8ln+G1wzYILlACQtan1Vo1kyDGkLQAQwkndPxLamzal3Kwv20qjTHHvjAC4BbBhYVsJAOdHtl40mCgzwksDu/KzgIUUvhnlFmM81R5g4QVmSZAVAMp0mLvPI7TZEdnCA5gSv4jidSQ8WM2ckgUAHOhdBICp+1uFQO8B6H0IKC9E6E0mZ4BJiJIDVOkr2ZrZGr/VjTdCPAjJ1YAAqAhLvegi9gKA8IAIgeCAIMEidNvRQUIFQgVCBUIFQgU6StBFphUqECoQKhAqECpQhG47OkioQKhAqMC/UAG+IbI2gdfmfJjh9TwLNuaaqMc7B/Dt8KzmvYBAsF6Br9V1RRvPngHYAcDSvJw2AWKl0plP70OvABymnc9ZfLUPvYKhwTYuufMIgLRgyiMA0oIpbwDIC6a8ASAvmfEGgNT9PZKgvFjCmwcsqIskvAEgr2oLAJwdh8MD2ua+Tf29hUDvVaD3ecA1gO0mt27zu7cQ4I0PcwFZ8wYAFy4Ngw8PPHbZXtjbOAAAAABJRU5ErkJggg==", //拖拽图形
                top: 50, //后台验证Y值
                left: 150, //后台验证X值
                result: -1, //拖拽物、拖拽按钮的状态，小于0 初始，等于0 错误，大于0 正确
                move: 0,
                start: 0,
                moveMax: 0,
                clientWidth: 0,
                timeout:0,//后台校验时间戳
            }
        },
        methods: {
            show(type,tel) {
                this.getValidate(type,tel);
                return new Promise((resolve, reject) => {
                    this.$on('success', () => {
                        this.hide();
                        let m = parseInt(this.move);
                        let res = `${m}`.length < 3 ? `0${m}` : m;
                        resolve(`c3${res}${this.timeout}`);
                    });
                    this.$on('error', () => {
                        this.hide()
                        reject()
                    });
                });
            },
            hide() {
                Backdrop.hide(); //hide内就会执行this.destroy()
                //this.destroy()
            },
            touchStart(e) {
                this.start = e.changedTouches[0].pageX;
                this.slider.style.webkitTransition = this.slider.style.transition = 'none';
                this.piece.style.webkitTransition = this.piece.style.transition = 'none';
                // this.process.style.webkitTransition = this.process.style.transition = 'none';
                e.preventDefault();
            },
            touchMove(e) {
                let touch = e.changedTouches[0];
                let x = touch.pageX - this.start;
                if (x > this.moveMax)
                    x = this.moveMax;
                //this.move = parseInt(x > 0 ? x : 0);
                this.move = x > 0 ? x : 0;
                e.preventDefault();
            },
            touchEnd(e) {
                this.slider.style.webkitTransition = this.slider.style.transition = '250ms';
                this.piece.style.webkitTransition = this.piece.style.transition = '250ms';
                // this.process.style.webkitTransition = this.process.style.transition = '250ms';
                this.validate();
                e.preventDefault();
            },
            //获取验证数据
            getValidate(type,key) {
                this.top = parseInt(Math.random() * 55);
                Ajax.post(Api.apply.get_validate,{phone:key,type}).then(res => {
                    let d = res.data;
                    let s = d.status;
                    if(s == 1){
                        let pos = PWD.unlock(d.code,d.phone);
                        this.left = parseInt(pos.substr(4,3));
                        this.timeout = pos.substr(9,10);
                        this.img = d.bg + "?x-oss-process=image/resize,m_fill,h_320,w_750";

                        let img = new Image();
                        img.src = this.img;
                        img.onload = () => {
                            Backdrop.show(this.destroy);
                            this.state = 1;
                            this.slider = this.$refs.slider;
                            this.piece = this.$refs.piece;
                            // this.process = this.$refs.process;
                            this.clientWidth = this.slider.parentNode.clientWidth;
                            this.moveMax = this.clientWidth - this.slider.clientWidth; //计算最大拖拽距离
                        }
                    }else if (s == -20005){
                        this.$dialog.alert(res.message);
                        this.$destroy()
                    }
                }).catch(err => {
                    this.$dialog.alert(err.message);
                    this.$destroy()
                });
            },
            //验证结果
            validate() {
                let offset = Math.abs(this.move - this.left);
                if (offset <= 5) { //容错值为5;
                    this.result = 1;
                    setTimeout(() => {
                        this.$emit('success');
                    }, 800);
                } else {
                    this.result = 0;
                    setTimeout(() => {
                        this.result = -1;
                        this.move = 0;
                    }, 800);
                }
            },
            TouchMove(e){
                e && e.preventDefault();
            },
            destroy() {
                this.state = 2
                setTimeout(() => {
                    this.state = 0
                    this.$destroy()
                }, 300);
            }
        },
        destroyed() {
            let parent = this.$el.parentNode;
            parent.removeChild(this.$el);
        }
    }
</script>

<style lang="less" scoped>
    .comp-proving {
        width: 16rem;
        line-height: 1;
        .image {
            position: relative;
            margin: 1rem 0;
            overflow: hidden;
            .base-img {
                position: relative; // width: 100%;
                // height: 7rem;
                // background: green;
                mask-repeat: no-repeat;
                -webkit-mask-repeat: no-repeat;
                mask-size: 2.5rem 2.5rem;
                -webkit-mask-size: 2.5rem 2.5rem;
                background-size: 100%;
                .base {
                    display: block;
                    width: 100%;
                }
                .target {
                    position: absolute;
                    width: 2.5rem;
                    height: auto;
                }
            }
            .piece-box {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                width: 100%;
                .piece {
                    width: 100%;
                    height: 100%;
                    mask-repeat: no-repeat;
                    -webkit-mask-repeat: no-repeat;
                    mask-size: 2.5rem 2.5rem;
                    -webkit-mask-size: 2.5rem 2.5rem;
                    background-size: 100%;
                }
            }
        }
        .slide {
            position: relative;
            display: flex;
            width: 100%;
            height: 2rem;
            justify-content: center;
            align-items: center;
            border-radius: 1rem;
            background: #BCBCBC;
            font-size: .65rem;
            color: #fff;
            transition: all .25s;
            .slider {
                position: absolute;
                left: 0;
                z-index: 1;
                display: flex;
                width: 2.5rem;
                height: 2.5rem;
                justify-content: center;
                align-items: center;
                background: #F3F3F3;
                border-radius: 50%;
                box-shadow: 0 .1rem .1rem 0 rgba(0, 0, 0, 0.3), 0 .25rem .5rem 0 rgba(0, 0, 0, 0.1);
                font-size: .7rem;
                color: #5682FF;
            } // .process{
            //     position:absolute;
            //     top:0;
            //     left:0;
            //     bottom: 0;
            //     border-radius: 1rem;
            //     background: #5682FF;
            //     transition: all .25s;
            // }
            &.error {
                background: #FFCDCC;
                .slider {
                    background: #FF7270;
                    color: #fff;
                }
            }
            &.success {
                background: #BFD0FF;
                .slider {
                    background: #5682FF;
                    color: #fff;
                }
            }
        }
    }
</style>
