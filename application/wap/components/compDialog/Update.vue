<template>
    <div class="comp-dialog" :class="{'active': state == 1, 'hidden': state == 2}" @touchmove.prevent="TouchMove">
        <div class="dialog comp-update">
            <div class="dialog-head">
                <div class="title" :style="style">
                    <div class="title-content">
                        <div class="titles" v-text="title"></div>
                        <div class="version" v-text="version"></div>
                    </div>
                </div>
                <div class="content">
                    <div class="texts">更新内容:</div>
                    <div class="tip" v-if="isforce == 1">新版本与当前版本不兼容，请务必更新！</div>
                    <div v-if="content.length>0" class="content">
                        <p v-for="(itemstr,index) in content" :key="index" v-html="itemstr"></p>
                    </div>
                </div>
            </div>
            <div class="buttons">
                <button class="update" @click.stop="onOk()">立即更新</button>
            </div>
            <div v-show="isforce != 1" @click.stop="onHide()" class="close icon icon-dianji"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Update",
        data(){
            return {
                title: '发现新版本',
                content: [],
                version: "",
                isforce: false,
                style: {
                    background: "url(" + this.$assets.appUpdateBg + ")",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 100%"
                },
                state: 0 // 0: hidden, 1: showing, 2: active
            }
        },
        methods:{
            show(options) {
                this.content = options.content;
                this.isforce = options.isforce;
                this.version = options.version;
                if(this.isforce == 1){
                    Backdrop.show(false);
                }else{
                    Backdrop.show(this.destroy);
                }
                this.state = 1;
                return new Promise((resolve) => {
                    this.$on('OkEvent', () => {
                        if(this.isforce != 1) {
                            this.hide();
                        }
                        resolve()
                    });
                    this.$on('HideEvent', () => {
                        this.hide();
                    })
                });
            },
            onOk() {
                this.$emit('OkEvent')
            },

            onHide() {
                this.$emit('HideEvent')
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

<style scoped>

</style>
