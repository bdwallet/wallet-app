<template>
    <div class="invite-success">
        <div class="reg-success-bg1">
            <div class="top">
                <img :src="$assets.regSuccessBg2" class="download-img">
                <p class="text1">恭喜您，注册成功</p>
                <p class="text2">225黑钻新人礼包</p>
                <p class="text3">下载黑钻评级，收下吧~</p>
                <a class="sub-btn" href="/down.html">即刻下载App</a>
            </div>
            <logo-foot />
        </div>
        <comp-about />
        <img :src="$assets.regSuccessImg" class="bottom-img" />
    </div>
</template>

<script>
    import compAbout from '~components/compAbout';
    import logoFoot from '~layout/logoFoot';
    export default {
        name: 'invite-success',
        components: {
            compAbout, logoFoot
        },
        mounted() {
            Share.Ready();
        },
    }
</script>

<style lang="less" scoped>
@import "../../../../assets/css/config.less";
    .invite-success{
        display: flex;
        flex-direction: column;
        .reg-success-bg1{
            position: relative;
            width: 100%;
            height: 100vh;
            background: url('@{hosturl}reg-success-bg1.jpg') no-repeat center;
            background-size: cover;
            padding: 1.5rem 1.925rem 1.325rem;
            color: #fff;
            line-height: 1.4;
            text-align: center;
            font-size: .9rem;
            font-weight:400;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .top{
                .download-img{
                    width: 100%;
                    height: auto;
                }
                .text1{
                    margin-top: 1.55rem;
                }
                .text2{
                    display: inline-block;
                    margin-top: .45rem;
                    font-size: 1.6rem;
                    font-weight: 600;
                    position: relative;
                    z-index: 1;
                    &::after{
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: 2%;
                        width: 96%;
                        height: .525rem;
                        background-color: rgba(255, 114, 112, .28);
                        z-index: -1;
                    }
                }
                .text3{
                    margin-top: .4rem;
                    font-size: .8rem;
                }
                .sub-btn{
                    display: block;
                    // width: 100%;
                    font-size: .8rem;
                    padding: .575rem 0;
                    text-align: center;
                    color: #fff;
                    background-color: #FF6666;
                    border: 0;
                    border-radius: 1.25rem;
                    margin: 4.05rem .775rem 3.75rem;
                }
            }
        }
        .bottom-img{
            width: 100%;
        }
    }
</style>

