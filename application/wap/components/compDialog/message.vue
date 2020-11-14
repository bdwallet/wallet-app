<template>
    <div class="comp-message" v-show="state" :style="{top:`${preTop}px`,left:`${preLeft}px`}" @touchmove.prevent="TouchMove">
        <span class="layer" :style="markPos"></span>
        <span>{{content}}</span>
    </div>
</template>
<script>
    export default {
        name: 'compMessage',
        data() {
            return {
                state: 0, //0: hidden, 1: showing, 2: active
                mark: '',
                content: "",
                preTop: 0,
                preLeft: 0,
                OffsetX: 0, // x偏移
                OffsetY: 0, // y偏移
            }
        },
        computed: {
            //倒三角位置
            markPos() {
                let pos = {};
                switch (this.mark) {
                    case "left":
                        pos.left = "0";
                        break;
                    case "right":
                        pos.right = "0";
                        break;
                    default: //center
                        pos.left = "50%";
                        break;
                }
                return pos;
            }
        },
        methods: {
            show(options, e) {
                this.mark = options.mark || 'left';
                this.content = options.content;
                // if(options.Offset) this.Offset = options.Offset;
                this.OffsetX = options.OffsetX || 0;
                this.OffsetY = options.OffsetY || 0;
                this.state = 1;
                if (e && e.target) {
                    let target = e.target;
                    // this.preTop = e.pageY + target.clientHeight - e.offsetY + this.Offset;
                    // this.preLeft = e.pageX   - e.offsetX + target.clientWidth/2;
                    this.preTop = e.pageY + 17 + this.OffsetY;
                    this.preLeft = e.pageX - 8 + this.OffsetX;
                }
                document.addEventListener("click",this.hide,false);
            },
            hide(){
                this.$destroy();
            },
            getState() {
                return this.state
            },
            TouchMove(e){
                e && e.preventDefault();
            },
        },
        destroyed() {
            document.removeEventListener("click",this.hide,false);
            let parent = this.$el.parentNode;
            parent.removeChild(this.$el);

        }
    }
</script>
