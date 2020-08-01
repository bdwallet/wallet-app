<template>
    <div class="purchistory-detail">
        <div v-if="Data && Loading">
            <div class="history-title" @click="GoMain">
                <span>{{Data.finance_title}}</span>
                <i class="icon icon-shouhui"></i>
            </div>
            <div class="comp-item-list item-list">
                <div class="grade">
                    <div class="comp-item-wrap item-wrap"><span>目前状态</span>
                        <div class="comp-item-right">{{Ttext}}</div>
                    </div>
                    <div class="comp-item-wrap item-wrap"><span>存入金额</span>
                        <div class="comp-item-right">{{Data.bill_deposit_amount}}{{Data.finance_currency}}</div>
                    </div>
                    <div class="comp-item-wrap item-wrap" v-if="Data.finance_add_hzt"><span>加息费用</span>
                        <div class="comp-item-right">{{Data.finance_add_hzt}} HZT</div>
                    </div>
                    <div class="comp-item-wrap item-wrap"><span>年化收益率</span>
                        <div class="comp-item-right">{{(+Data.finance_basics_return + (+Data.finance_add_return || 0)).toFixed(2)}}</div>
                    </div>
                    <div class="comp-item-wrap item-wrap"><span>预期收益</span>
                        <div class="comp-item-right">{{Data.bill_expected_return}} {{Data.finance_currency}}</div>
                    </div>
                    <div class="comp-item-wrap item-wrap"><span>购买时间</span>
                        <div class="comp-item-right">{{Data.bill_create_time}}</div>
                    </div>
                    <div class="comp-item-wrap item-wrap"><span>封闭周期</span>
                        <div class="comp-item-right">{{Data.finance_close_day}}天</div>
                    </div>
                    <div class="comp-item-wrap item-wrap"><span>到期日期</span>
                        <div class="comp-item-right">{{Data.bill_expire_time ? Data.bill_expire_time : endtime}}</div>
                    </div>
                </div>
            </div>
            <div class="purchistory-tip">
                <div class="title">温馨提示</div>
                <div class="content">
                    <div class="content-item">
                        <i class="icon icon-shixing"></i>
                        <div class="tip-text">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</div>
                    </div>
                    <div class="content-item">
                        <i class="icon icon-shixing"></i>
                        <div class="tip-text">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</div>
                    </div>
                </div>
            </div>
        </div>
        <comp-loadings v-if="!Loading"/>
    </div>
</template>

<script>
    import compLoadings from "~components/compTools/compLoadings";
    export default {
        name: "purchistory-detail",
        components: {
            compLoadings
        },
        data() {
            return {
                Data: {}, // 数据
                Loading: false, // 是否加载中 false 加载中
            }
        },
        computed: {
            ficiaId() { // 理财id
                return this.$route.query.id
            },
            Ttext () { // 目前状态
                if(this.Data.bill_status == -1) return '已失效';
                if(this.Data.bill_status == 0) return '已下单';
                if(this.Data.bill_status == 1) return '已计息';
                if(this.Data.bill_status == 2) return '已回款';
            },
            endtime() { // 结束时间
                let endtime = new Date(this.Data.finance_raise_start).getTime(),
                    keepday = this.Data.finance_raise_day * 24 * 60 * 60 * 1000,
                    dtime = new Date(endtime + keepday),
                    dy = dtime.getFullYear(),
                    dm = (dtime.getMonth() + 1) > 9 ? dtime.getMonth() + 1 : `0${dtime.getMonth() + 1}`,
                    dd = dtime.getDate() > 9 ? dtime.getDate() : `0${dtime.getDate()}`,
                    dh = dtime.getHours() > 9 ? dtime.getHours() : `0${dtime.getHours()}`,
                    dmm = dtime.getMinutes() > 9 ? dtime.getMinutes() : `0${dtime.getMinutes()}`,
                    ds = dtime.getSeconds() > 9 ? dtime.getSeconds() : `0${dtime.getSeconds()}`;
                return `${dy}-${dm}-${dd} ${dh}:${dmm}:${ds}`;
            },
        },
        methods: {
            // 跳转详情
            GoMain() {
                this.$router.push({
                    path: '/ficial-ment/main',
                    query: {
                        id: this.$route.query.id
                    }
                })
            },
            // 获取数据
            GetContent() {
                let id = this.ficiaId;
                let params = {
                    id: id,
                    type: 7
                };
                Ajax.get(Api.apply.contentInfo_get, params).then(res => {
                    this.Loading = true;
                    if (res.status == 1) {
                        this.Data = res.data;
                    }
                }).catch(err => {
                    this.Loading = true;
                    setTimeout(() => {
                        this.$dialog.alert({
                            title: "系统消息",
                            content: err.message,
                            btns: ["好"]
                        }).then(res => {
                            if (Global.isApp && Global.isPro) {
                                HZApp.Back()
                            } else {
                                this.$router.go(-1);
                            }
                        });
                    }, 500);
                });
            },
        },
        mounted() {
            this.GetContent()
        }
    }
</script>

<style lang="less" scoped>
    .purchistory-detail{
        .history-title{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: .75rem;
            font-size: .75rem;
            background-color: rgba(245, 242, 237, 1);
            span{
                color: rgba(51, 51, 51, 1);
                font-weight: bold;
                margin-right: 1.4rem;
            }
            i.icon{
                color: rgba(138, 138, 138, 1)
            }
        }
        .item-list{
            line-height: 2.25rem;
            .grade{
                .item-wrap{
                    span{
                        font-size: .6rem;
                        color: rgba(102, 102, 102, 1);
                    }
                    .comp-item-right{
                        font-size: .8rem;
                        color: rgba(51, 51, 51, 1);
                    }
                    &:first-child{
                       .comp-item-right{
                            color: rgba(209, 173, 111, 1);
                        }
                    }
                    &:last-child{
                        &::before{
                            border-bottom: 0;
                        }
                    }
                }
            }
        }
        .purchistory-tip{
            padding: 1rem .75rem 0;
            background-color: white;
            .title{
                font-size: .7rem;
                font-weight: bold;
                color: rgba(153, 153, 153, 1);
            }
            .content{
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                padding-bottom: .5rem;
                .content-item{
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    font-size: .6rem;
                    padding-top: .5rem;
                    i.icon{
                        font-size: .6rem;
                        color: rgba(153, 153, 153, 1);
                        margin-right: .3rem;
                    }
                    .tip-text{
                        color: rgba(102, 102, 102, 1);
                        overflow: hidden;
                        word-break: break-all;
                        word-wrap: break-word;
                    }
                }
            }
        }
    }
</style>
