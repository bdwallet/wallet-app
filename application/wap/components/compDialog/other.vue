<template>
    <div class="comp-dialog" :class="{'active': state == 1, 'hidden': state == 2}" @touchmove.prevent="TouchMove">
        <div class="comp-dialog-other dialog">
            <img :src="$assets.dialogOther">
            <span class="txt">{{con}}</span>
            <div class="num">+{{num}}</div>
            <p class="desc">{{desc}}</p>
            <div class="btn" @click.stop="hide(1)">好的</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'compActionPannel',
        data() {
            return {
                state: 0,
                con: "",
                num: "",
                desc: ""
            }
        },
        methods: {
            show(ops) {
                Backdrop.show(() => {
                    this.hide(1);
                    this.destroy();
                });
                this.con = ops.con;
                this.num = ops.num;
                this.desc = ops.desc;
                this.state = 1;
                return new Promise(resolve => {
                    this.$on('okEvent', () => {
                        this.hide()
                        resolve()
                    });
                });
            },
            hide(type){
                if(type == 1)
                    this.$emit("okEvent");
                else
                    Backdrop.hide();
                    this.$destroy()
            },
            TouchMove(e){
                e && e.preventDefault();
            },
            destroy(){
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
