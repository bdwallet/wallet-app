<template>
    <div class="comp-dialog" :class="{'active': state == 1, 'hidden': state == 2}" @touchmove.prevent="TouchMove">
        <div class="dialog comp-loadings">
            <i class="icon icon-spinner"></i>
            <span class="loading">{{text}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "loading",
        data() {
            return {
                text: "正在加载",
                state: 0, // 0: hidden, 1: showing, 2: active
            }
        },
        methods:{
            show() {
                this.state = 1;
            },

            hide() {
                this.destroy();
                Backdrop.hide();
            },

            TouchMove(e){
                e && e.preventDefault();
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
