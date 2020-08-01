<template>
    <div class="layout-prompt" :style="{backgroundColor: bgColor}">
        <i class="icon icon-gantanhao" :style="{color: iconColor}"></i>
        <span :style="{color: color}"><slot /></span>
    </div>
</template>
<script>
    export default {
        name: 'layout-prompt',
        props: {
            color: {
                type: String,
                default: '#FF7270'
            },
            bgColor: {
                type: String,
                default: 'transparent'
            },
            iconColor: {
                type: String,
                default: '#FF7270'
            }
        }
    }
</script>


<style lang="less" scoped>
    .layout-prompt {
        display: flex;
        font-size: .6rem;
        margin: 1rem auto;
        color: #FF7270;
        .icon {
            margin-right: .4rem;
            flex-shrink: 0;
            font-size: .8rem;
        }
        span {
            padding-top: .2rem;
            text-align: justify;
        }
    }
</style>
