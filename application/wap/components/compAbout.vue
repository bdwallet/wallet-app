<template>
    <div class="comp-about">
        <div class="img img1"></div>
        <div class="img img2"></div>
        <div class="img img3"></div>
    </div>
</template>

<script>
    export default {
        name: 'comp-about'
    }
</script>

<style lang="less" scoped>
    @import '../assets/css/config.less';
    .comp-about{
        display: flex;
        flex-direction: column;
        .img{
            width: 100%;
            height: 100vh;
            &.img1{
                background: url('@{hosturl}about-img1.jpg') no-repeat center;
                background-size: cover;
            }
            &.img2{
                background: url('@{hosturl}about-img2.jpg') no-repeat center;
                background-size: cover;
            }
            &.img3{
                background: url('@{hosturl}about-img3.jpg') no-repeat center;
                background-size: cover;
            }
        }
    }
</style>
