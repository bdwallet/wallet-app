<template>
    <div class="comp-dialog"  :class="{'active': state == 1, 'hidden': state == 2}" @touchmove.prevent="TouchMove">
        <div class="dialog reward-dialog" style="width: 17.25rem;" @click.stop>
            <div class="dialog-head">
                <label for="title" class="title">赞赏作者</label>
                <div class="hz-wrap">
                    <div class="item" v-for="(h,i) in hztNum" :key="i" :class="{'active': i==reward.i}" @click="checkHzt(h, i)"><span>{{h}}</span>黑钻</div>
                </div>
            </div>
            <div v-if="btns.length > 0" class="dialog-btns">
                <div class="button" v-for="(s,i) in btns" :key="i" :class="{'button-ok':i==0}" @click.stop="onClick(i)">{{s}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'reward',
    data() {
        return {
            state: 0, //0: hidden, 1: showing, 2: active
            btns: ['确定', '取消'],
            hztNum: [],
            reward: {}, //选择赞赏的黑钻
        }
    },
    methods: {
        show(give_num) {
            this.hztNum = give_num || [1,2,3,4,5,6];
            Backdrop.show(this.destroy);
            this.state = 1;
            return new Promise(resolve => {
                this.$on('okEvent', (res) => {
                    this.hide();
                    resolve(res);
                })
            })
        },
        hide() {
            Backdrop.hide();
            this.destroy()
        },
        checkHzt(h, i) {
            // 选择赞赏黑钻
            this.reward = {
                hzt: h || this.hztNum[0],
                i: i || 0
            }
        },
        onClick(i){
            if(i) this.hide();
            else this.$emit('okEvent', this.reward);
        },
        destroy(){
            this.state = 2;
            setTimeout(() => {
                this.state = 0;
                this.$destroy()
            }, 300);
        },
        TouchMove(e){
            e && e.preventDefault();
        },
    },
    mounted() {
        this.checkHzt();
    },
    destroyed() {
        let parent = this.$el.parentNode;
        parent.removeChild(this.$el);
    }
}
</script>

<style lang="less" scoped>
    @import '../../assets/css/config.less';
    .reward-dialog{
        display: block;
        width: 17.25rem;
        padding: 0;
        .dialog-head{
            width: 100%;
            text-align: left;
            padding: 1.5rem 1rem 1rem;
            .title{
                color: @color-title;
                font-size: .75rem;
                .icon{
                    color: @color-attention;
                }
            }
            .hz-wrap{
                width: 100%;
                height: 5.85rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                margin-top: 1rem;
                .item{
                    width: 4.6rem;
                    height: 2.4rem;
                    color: @color-attention;
                    border-radius: .3rem;
                    border: .05rem solid @color-attention;
                    font-size: .5rem;
                    line-height: 2.4rem;
                    text-align: center;
                    span{
                        font-size: 1rem;
                        font-weight: 500;
                    }
                    &.active{
                        background-color: @color-attention;
                        color: #fff;
                    }
                }
            }
        }
        .dialog-btns{
            width: 100%;
            height: 2.7rem;
            display: flex;
            justify-content: space-around;
            border-top: .025rem solid @color-border-main;
            .button{
                width: 50%;
                height: 2.7rem;
                line-height: 2.7rem;
                &.button-ok{
                    color: @color-attention;
                }
            }
        }
    }
</style>

