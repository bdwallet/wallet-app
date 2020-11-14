<template>
    <div class="comp-dialog" :class="{'active': state == 1, 'hidden': state == 2}" @touchmove.prevent="TouchMove">
        <div class="dialog comp-newComes" :style="style">
            <div class="buttons" :style="btnStyle" @click.stop="onOk()"></div>
            <div @click.stop="onHide()" class="close icon icon-dianji"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NewComes",
        data(){
            return {
                style: {
                    backgroundColor: 'transparent',
                    backgroundImage: "url(" + this.$assets.appNew + ")",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 100%"
                },
                btnStyle: {
                    backgroundImage: "url(" + this.$assets.appRectangle + ")",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 100%"
                },
                state: 0 // 0: hidden, 1: showing, 2: active
            }
        },
        methods:{
            show() {
                Backdrop.show(this.destroy);
                this.state = 1;
                return new Promise((resolve) => {
                    this.$on('OkEvent', () => {
                        this.hide();
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
                Backdrop.hide();
            },

            TouchMove(e){
                e && e.preventDefault();
            },

            getState(){
                return {
                    state: this.state,
                    type: 0
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
