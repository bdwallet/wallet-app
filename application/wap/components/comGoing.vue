<template>
    <div class="Go-ing">
        <div class="img">
            <img :src="$assets.iconClock">
        </div>
        <div class="title" v-html="options.title"></div>
        <div class="reason" v-html="options.reason"></div>
    </div>
</template>

<script>
    export default {
        name: "comGoing",
        props: {
            options: {
                type: Object,
                default: {
                    title: '已收到您的申请。我们将于3个工作日内',
                    reason: '为您生成专属充值地址，请耐心等待',
                }
            }
            
        }
    }
</script>

<style lang="less">
    .Go-ing{
        width: 100%;
        padding: 0 1.825rem;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        div{
            text-align: center;
            font-size: .75rem;
            line-height: 1.05rem;
            color: #333;
            &.img{
                 width: 5.9rem;
                 height: auto;
                 overflow: auto;
                 margin: 0 auto 1.1rem;
                img{
                    width: 100%;
                    height: auto;
                    display: block;
                }
            }
        }
    }
</style>
