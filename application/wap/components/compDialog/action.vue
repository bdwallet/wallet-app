<template>
    <div class="comp-dialog" :class="{'active': state == 1, 'hidden': state == 2}" @touchmove.prevent="TouchMove">
        <div class="dialog comp-action-pannel">
            <div class="action-list">
                <div class="comp-item" v-for="item in btns" :key="item" @click.stop="throwAction(item.action)"><span>{{item.name}}<i class="com-bit" v-if="item.name.indexOf('追评')>=0"></i></span></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'compActionPannel',
        data() {
            return {
                state: 0,
                btns: [], //name -> 按钮名称  action -> 回调
            }
        },
        methods: {
            show(btns) {
                this.btns = btns;
                Backdrop.show(this.destroy);
                this.state = 1;
            },
            hide() {
                Backdrop.hide();
            },
            throwAction(an) {
                Backdrop.hide();
                an && an();
            },
            destroy() {
                this.state = 2
                setTimeout(() => {
                    this.state = 0
                    this.$destroy()
                }, 300);
            },
            TouchMove(e){
                e && e.preventDefault();
            },
        },
        destroyed() {
            let parent = this.$el.parentNode;
            parent.removeChild(this.$el);
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/css/config";
    .comp-action-pannel {
        .action-list {
            width: 13.75rem;
            background: @bgcolor-item;
            box-shadow: 0px .1rem .25rem 0px rgba(0, 0, 0, 0.2);
            border-radius: .7rem;
            overflow: hidden;
            .comp-item {
                display: flex;
                justify-content: center;
                width: 100%;
                padding: .8rem 0;
                border-bottom: .025rem solid @color-border-item;
                font-size: .75rem;
                color: @color-sub;
                text-align: center;
                &:last-child {
                    border: none;
                }
                span{
                    position: relative;
                }
            }
        }
    }
</style>
