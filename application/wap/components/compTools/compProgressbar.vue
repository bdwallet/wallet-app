<template>
    <div class="progress-bar">
        <div class="progress">
            <div class="bar" :style="{width: `${barwidth}%`}"></div>
        </div>
        <div class="progress-tip">{{barwidth ? barwidth : 0}}%</div>
    </div>
</template>

<script>
    export default {
        name: "compProgressbar",
        props: {
            barwidth: {
                type: Number,
                default: 0
            }
        }
    }
</script>

<style lang="less" scoped>
    .progress-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .progress{
            flex: 8;
            position: relative;
            background: rgba(230, 233, 242, 1);
            height: .2rem;
            border-radius: .1rem;
            margin-right: .5rem;
            overflow: hidden;
            .bar{
                position: absolute;
                height: inherit;
                width: 100%;
                border-radius: .1rem;
                background: linear-gradient(149deg,rgba(241,228,196,1) 0%,rgba(222,196,145,1) 100%);
            }
        }
        .progress-tip{
            font-size: .6rem;
            color: rgba(209, 173, 111, 1);
        }
    }
</style>
