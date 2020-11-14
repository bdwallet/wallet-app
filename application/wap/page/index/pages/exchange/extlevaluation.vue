<template>
    <div class="extl-eval-detail">
        <div class="detail-wrapper">
            <div class="title">
                <div class="main-title">{{ detail.title && detail.title.length > 35 ? `${detail.title.substr(0,35)}...`: detail.title}}</div>
                <ul class="sub-title">
                    <li class="left">
                        <div class="le-item">作者：{{detail.user_name}}</div>
                        <div class="le-item">
                            标签：<span @click="GoExch(detail.bourse_id)">{{detail.bourse_name}}</span>
                        </div>
                    </li>
                    <li class="right">{{detail.create_time}}</li>
                </ul>
            </div>
            <div class="content" id="detCon" ref="detCon" v-html="detail.content"></div>
            <ul class="tip">
                <li>免责声明：</li>
                <li>1、本文版权归原作者所有，仅代表作者本人观点，不代表黑钻评级观点或立场。</li>
                <li>2、如发现文章、图片等侵权行为，侵权责任将由作者本人承担。</li>
            </ul>
        </div>
        <div class="other-extl-list" v-if="otherList && otherList.length > 0">
            <div class="other-extl-title">其他测评</div>
            <ul class="extl-list" :class="{'only-one': otherList.length == 1}">
                <li class="list-item" v-for="(item, index) in otherList" :key="index" @click="GoOtherDetail(item.id)">
                    <div class="img" v-if="item.imgs || item.pic">
                        <img :src="item.imgs || item.pic" alt="">
                    </div>
                    <div class="item-title" v-if="item.imgs || item.pic">{{item.title.length > 30 ? `${item.title.substr(0,30)}…` : item.title}}</div>
                    <div class="item-title full" v-if="!item.imgs && !item.pic">{{item.title.length > 60 ? `${item.title.substr(0,60)}…` : item.title}}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "extlevaluation",
        data () {
            return {
                detail:{}, // 数据容器
                otherList: []
            }
        },
        watch: {
            '$route.path': {
                immediate: true,
                handler: function () {
                    this.GetDetail()
                },
            },
        },
        computed: {
            itemId () {
                return this.$route.params.rid
            }
        },
        methods: {
            // 分享
            Share(){
                let intro = this.detail.intro;
                Share.Ready({
                    imgUrl: this.$assets.logo,
                    title: `【黑钻评级】${this.detail.title.length > 30 ? this.detail.title.substr(0,30)+'...' : this.detail.title}`,
                    desc: intro.length > 60 ? `${intro.substr(0, 60)}...` : intro,
                    link: location.href,
                });
            },

            // 跳转页面 其他详情页
            GoOtherDetail(id) {
                this.$router.push({
                    path: `/extlevaluation/${id}`
                })
            },

            // 跳转到 交易所
            GoExch(id) {
                this.$router.push({
                    path: `/exchange/${id}`
                })
            },

            // 获取数据
            GetDetail() {
                this.detail={};
                this.otherList = [];
                let params = {
                    id: this.itemId
                };
                this.$ajax.get(this.$api.apply.get_bourse_extledetail, params).then(res => {
                    if(res.status == 1) {
                        this.detail = res.data.grade;
                        this.otherList = res.data.rand_grade;
                        this.Share()
                    }
                });
            },
            //文章内部链接跳转|文章内图片预览
            GetDom() {
                let CDom = document.querySelector("#detCon");
                if(CDom){
                    let ADom = CDom.querySelectorAll('a'),
                        IDom = CDom.querySelectorAll('img');
                    if(ADom) {
                        for (let i = 0; i < ADom.length; i++) {
                            (function (i) {
                                let href = ADom[i].getAttribute("href");
                                ADom[i].setAttribute("href",'javascript:void(0);');
                                ADom[i].onclick = function () {
                                    Service.OpenUrl(href)
                                }
                            })(i)
                        }
                    }
                    if(IDom){
                        let imgList = [];
                        for (let i = 0; i < IDom.length; i++) {
                            let src = IDom[i].getAttribute("src");
                            imgList.push(src);
                            (function (i) {
                                IDom[i].onclick = function () {
                                    Service.ImagePreview(imgList,imgList[i],i)
                                }
                            })(i)
                        }
                    }
                }
            }
        },
        updated() {
            // console.log("in pages => activityDetail.vue => updated");
            this.$nextTick(() => {
                if(Global.isApp && Global.isPro) {
                    this.GetDom()
                }
            })
        }
    }
</script>

<style lang="less">
    @import "../../../../assets/css/config.less";
    .extl-eval-detail{
        padding: .75rem;
        .detail-wrapper{
            padding-bottom: 1rem;
            .title{
                display: flex;
                flex-direction: column;
                padding: .5rem 0;
                border-bottom: .025rem solid rgba(233, 234, 234, 1);
                .main-title{
                    font-size: .8rem;
                    font-weight: bold;
                    color: #000;
                }
                .sub-title{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: .5rem;
                    color: rgba(153, 153, 153, 1);
                    margin-top: .5rem;
                    .left{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .le-item{
                            margin-right: 1rem;
                            &:last-child{
                                margin-right: 0;
                            }
                            span{
                                padding: .1rem .3rem;
                                background:rgba(237,237,237,1);
                                border-radius: .5rem;
                            }
                        }
                    }
                }
            }
            .content{
                padding:  0 0 .75rem;
                font-size: .7rem;
                color: rgba(85, 85, 85, 1);
                p, img{
                    margin-top: .75rem;
                }
                img{
                    display: block;
                    width: 100%;
                    height: 9rem;
                    border-radius: .125rem;
                    overflow: hidden;
                }
            }
            .tip{
                font-size: .5rem;
                color: rgba(153, 153, 153, 1);
                background: rgba(247,249,250,1);
                border-radius: .125rem;
                border: .025rem solid rgba(232,232,232,1);
                padding: .5rem;
                li{
                    margin-bottom: .3rem;
                    &:last-child{
                        margin-bottom: 0;
                    }
                }
            }
        }
        .other-extl-list{
            .other-extl-title{
                position: relative;
                font-size: .7rem;
                font-weight: bold;
                color: rgba(51, 51, 51, 1);
                padding-left: .5rem;
                line-height: normal;
                &::before{
                    position: absolute;
                    left: 0;
                    top: 0;
                    content: "";
                    width: .125rem;
                    height: 100%;
                    background: rgba(86, 130, 255, 1);
                    border-radius: .0625rem;
                }
            }
            .extl-list {
                display: flex;
                align-items: center;
                justify-content: space-around;
                margin-top: .75rem;
                &.only-one{
                    justify-content: flex-start;
                }
                .list-item{
                    width: 8.375rem;
                    height: 8.075rem;
                    border-radius: .125rem;
                    background: white;
                    overflow: hidden;
                    .img{
                        width: 100%;
                        height: 4.725rem;
                        overflow: hidden;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .item-title{
                        width: 100%;
                        height: 3.35rem;
                        padding: .5rem;
                        font-size: .7rem;
                        text-align: center;
                        border: .025rem solid rgba(232,232,232,1);
                        border-top: none;
                        &.full{
                            height: 100%;
                        }
                    }
                }
            }
        }
    }
</style>
