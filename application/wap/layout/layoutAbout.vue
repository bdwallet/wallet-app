<template>
    <div class="layout-about">
        <div class="about-content">
            <div class="title">关于黑钻评级</div>
            <div class="content">
                <p>黑钻评级是全球首家"评审团"式区块链评级社区。我们秉持着中立、客观、透明、开放的原则组建黑钻超级评审团，给用户提供专业、权威、真实的评级报告。 </p>
                <p>超级评审团由1000名区块链资产持仓20万元以上、交易经验超过2年的超级评审员组成，他们将对同一项目进行多维度评析，生成500份客观全面的社区化综合评级，并可随项目发展及时修正。</p>
            </div>
        </div>
        <div class="wxcode" :style="{'background-image':`url(${$assets.bannerBg})`}">
            <div class="wxcode-img"><img src="https://heizuan.oss-cn-shenzhen.aliyuncs.com/images/hzpjewm.jpg" /></div>
            <div class="reasons">
                <div class="title">长按二维码关注公众号</div>
                <p>随时查看600+项目评级</p>
                <p>成为超级评审员，发评级赚黑钻</p>
                <p>参与社区共建，共享平台分红</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'layoutAbout'
}
</script>

<style lang="less" scoped>
    @import "../assets/css/config";
    .layout-about{
        background: @bgcolor-item;
        .about-content{
            padding: .5rem @gutter;
            .title{
                padding-left:.3rem;
                border-left:.3rem solid @color-dec;
                font-size: .75rem;
                color:@color-dec;
            }
            .content{
                margin-top:.5rem;
                font-size: .7rem;
                color:@color-dec;
            }
        }
        .wxcode{
            display: flex;
            width: 100%;
            height: 7.5rem;
            padding: 0 @gutter;
            align-items: center;
            background-size:100% 100%;
            background-position:center center;
            .wxcode-img{
                width: 4.85rem;
                height: 4.85rem;
                font-size: 0;
                line-height: 1;
                img{
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
            .reasons{
                margin-left:.75rem;
                .title{
                    font-weight: bold;
                    font-size: .85rem;
                    color:@color-link;
                }
                p{
                    margin-top:.35rem;
                    font-size: .6rem;
                    color:@color-dec;
                }
            }
        }
    }
</style>