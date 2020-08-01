<template>
    <div class="comp-backdrop" :class="{'active': state == 1,'visible': state != 0}" @click.stop="Clear" @touchmove="TouchMove"></div>
</template>

<script>
    export default {
        data() {
            return {
                state: 0,
                count:0, //记录被显示次数 当count只有一次时，才能被hide隐藏
                callbacks: [], //点击遮罩的回调方法队列，由每次show时传入
                dontClear:1, //控制是否点击阴影消失 为 1 时则点击阴影不进行任何操作；
            }
        },
        methods: {
            show(callback) {
                this.state = 1;
                if(this.count++ < 1) //防止多次hide变为负数
                    this.count = 1;
                if(typeof(callback) != 'function' && callback != undefined){ //为实现点击不关闭的功能，随便传一个不为function的参数则生效
                    this.dontClear = 1;
                }else{
                    this.dontClear = 0;
                    callback && this.callbacks.push(callback); //将callback插入队列
                }
            },
            hide() {
                this.dontClear = 0;
                this.count--;
                if(this.count < 1){
                    this.Clear();
                    return;
                }
            },
            Clear(){
                if(this.dontClear) return;
                this.Callback();
                this.count = 0;
                this.state = 2;
                setTimeout(() => { //等待隐藏过渡效果
                    if(this.count < 1) //预防关掉遮罩的同时有新弹框弹出，没有遮罩的问题
                        this.state = 0;
                }, 300);
            },
            //清空回调队列
            Callback(){
                let len = this.callbacks.length;
                if(this.callbacks.length > 0){
                    for(let i = 0; i < len; i++){
                        let call = this.callbacks[i];
                        setTimeout(() => {
                            call && call();
                        }, 0);
                    }
                }
                this.callbacks = [];
            },
            TouchMove(e){
                e && e.preventDefault();
            },
        }
    }
</script>

<style lang="less" scoped>
    .comp-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 8;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.5);
        visibility: hidden;
        opacity: 0;
        -webkit-transition: .1s opacity linear;
        transition-duration: .2s;
        -webkit-transition-duration: .2s;
        pointer-events:auto;
        transition: .1s opacity linear;
        &.visible{
            visibility: visible;
        }
        &.active {
            opacity: 1;
        }
    }
</style>
