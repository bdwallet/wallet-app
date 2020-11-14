<template>
    <div class="loading-waiting">
        <i class="icon icon-spinner"></i>
        <span class="loading">{{text}}</span>
    </div>
</template>

<script>
    export default {
        name: "compLoadings",
        data() {
            return {
                text: "正在加载"
            }
        }
    }
</script>

<style lang="less" scoped>
    .loading-waiting{
        position: fixed;
        left: 50%;
        top: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transform: translate(-50%,-50%);
        i.icon{
            font-size: 2rem;
            line-height: normal;
            -webkit-animation: spin 1s linear infinite;
            animation: spin 1s linear infinite;
        }
        span.loading{
            font-size: .75rem;
        }
    }
    @-webkit-keyframes spin {
        from { /*动画起始状态*/
            -webkit-transform: rotate(0deg);
        }
        to { /*动画结束状态*/
            -webkit-transform: rotate(360deg);
        }
    }
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
