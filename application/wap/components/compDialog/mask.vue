<template>
    <div class="comp-mask"  :class="{'active': state == 1}" @click.stop="hide" @touchmove.prevent="TouchMove">
        <div class="dialog" :class="[isApp ? (isApp==1 ? 'isApp': 'isIOS') : '']">
            <i class="icon icon-jiantou"></i>
            <div class="tip" :style="{'backgroundImage': 'url('+$assets.downOval+')'}">{{ content }}</div>
            <div class="btn" v-if="btn" @click.stop="hide">好的</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "compMask",
        data(){
            return{
                content: "",
                btn: 0, // 默认不存在
                isApp: 0, // 判断平台
            }
        },
        methods:{
            show(options) {
                Backdrop.show(this.destroy);
                this.content = options.content;
                this.btn = options.btn;
                this.isApp = options.isApp;
                this.state = 1;
            },

            hide(){
                Backdrop.hide();
                this.state = 0;
                this.$destroy()
            },

            getState() {
                return this.state
            },

            TouchMove(e){
                e && e.preventDefault();
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

<style scoped>

</style>
