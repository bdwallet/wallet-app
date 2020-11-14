<template>
    <div class="logo-foot">
        <img :src="$assets.logo" class="logo" v-if="logoBg">
        <img :src="$assets.logo2" class="logo2" v-else>
        <img :src="$assets.logoTextFoot" class="logo-text">

    </div>
</template>

<script>
    export default {
        name: 'logoFoot',
        props: {
            logoBg: { // logo有圆角背景
                type: Boolean,
                default: 0
            },
        }
    }
</script>

<style lang="less" scoped>
    .logo-foot{
        display: flex;
        justify-content: center;
        align-items: center;
        .logo{
            border-radius: .6rem;
            height: 2.275rem;
        }
        .logo2{
            height: 1.4rem;
        }
        .logo-text{
            height: 100%;
            margin-left: .75rem;
            height: 1.3rem;
        }
    }
</style>
