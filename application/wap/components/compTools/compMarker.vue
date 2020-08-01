<template>
    <ul class="comp-marker-star">
        <li @click="marking(index+1)" :class="{current:(score>=index+1)}" v-for="(item,index) in count" :key="item">
            <i class="icon icon-shixing"></i>
        </li>
    </ul>
</template>

<script>
    //计时器
    let timeOut = null;
    export default {
        name: "compMarkers",
        components: {},
        data() {
            return {}
        },
        props: {
            // 多少颗星
            count: {
                type: Number,
                default: 10
            },
            // 当前单个分数
            score: {
                type: Number,
                default: 0
            },
            // 当前类别分数项
            name: {
                type: String,
                default: ''
            }
        },
        methods: {
            //打分
            marking(score) {
                let params = {
                    score
                };
                if(this.name) params.name = this.name;
                this.$emit("score",params);
                let animate = () => {
                    clearTimeout(timeOut);
                    if (this.score == score) return;
                    if (this.score < score) {
                        this.score++;
                    } else {
                        this.score--;
                    }
                    settime();
                };
                let settime = () => {
                    timeOut = setTimeout(animate, 40);
                };
                animate();
            }
        }
    }
</script>

<style lang="less">
    @import "../../assets/css/config";
    .comp-marker-star {
        display: -webkit-flex;
        display: flex;
        height: 1.85rem;
        padding:0 0 .75rem;
        align-items: center;
        justify-content: center;
        line-height: 1;
        color: @color-dec;
        font-size: 1rem;
        text-align: center;
        li {
            -webkit-flex: 1;
            flex: 1;
            color:#bbb;
            .icon{
                font-size: inherit;
            }
            &.current {
                font-size: 1.1rem;
                .mixin-ease-in-out();
            }
        }
        .current {
            color: @color-num !important;
        }
    }
</style>
