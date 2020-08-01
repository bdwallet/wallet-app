<template>
    <div class="financial-management">
        <div v-if="!showCode && Loading">
            <div class="head" :class="{'head-other': !switch_checked, 'head-two': ficiaData.finance_type==2}">
                <div class="bg"></div>
                <div class="bg1">
                    <div class="filter"></div>
                </div>
                <div class="head-content">
                    <div class="content-top">
                        <div class="top">
                            <div class="title">{{ficiaData.finance_title}}</div>
                            <div class="label"><span :class="{'red':ficiaData.finance_type==1, 'green': ficiaData.finance_type==2}">{{ficiaData.finance_type==1 ? '高收益' : '随存随取'}}</span><span class="blue">{{ficiaData.finance_type==1 ? '低风险' : '放心便捷'}}</span></div>
                            <div class="con-box">
                                <div class="con-box-title">
                                    <div class="left"><span class="main">{{(+ficiaData.finance_basics_return).toFixed(1)}}</span>%<span v-if="switch_checked">+{{(+ficiaData.finance_add_return).toFixed(1)}}%</span></div>
                                    <div class="right">{{(+ficiaData.finance_min_limit).toFixed(6)}}</div>
                                </div>
                                <div class="con-box-subtitle">
                                    <div class="left">年化收益率</div>
                                    <div class="right">起投额度（{{ficiaData.finance_currency}}）</div>
                                </div>
                            </div>
                            <div class="line"></div>
                            <div class="tip" v-if="switch_checked"><i class="icon icon-gantanhao"></i>支付{{ficiaData.finance_add_hzt}}HZT获得额外{{(+ficiaData.finance_add_return).toFixed(1)}}%年化利率</div>
                        </div>
                        <div class="bot">
                            <div class="bot-wrap">
                                <div class="b-w-item"><span>起投日</span><span>{{ficiaData.finance_type==1 ? SetTime(ficiaData.finance_raise_start) : SetTime(1)}}</span></div>
                                <div class="b-w-item"><span>预计起息日</span><span>{{ficiaData.finance_type==1 ? SetTime(ficiaData.finance_value_date) : SetTime(2)}}</span></div>
                            </div>
                            <div class="bot-wrap">
                                <div class="b-w-item"><span>投资天数</span><span v-if="ficiaData.finance_type==1">{{ficiaData.finance_raise_day}}天</span><span v-else>一</span></div>
                                <div class="b-w-item"><span>预计{{ficiaData.finance_type==1 ? '到期' : '结算'}}日</span><span v-if="ficiaData.finance_type==1">{{SetTime(ficiaData.fiannce_due_date)}}</span><span v-else>一</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="content-bot" v-if="ficiaData.finance_type==1">
                        <div class="title">
                            <div class="t-item">已募集：<span>{{(+ficiaData.deposit_amount).toFixed(6)}}</span> {{ficiaData.finance_currency}}</div>
                            <div class="t-item">剩余：<span>{{(+ficiaData.finance_limit - +ficiaData.deposit_amount).toFixed(6)}}</span> {{ficiaData.finance_currency}}</div>
                        </div>
                        <comp-progress-bar :barwidth="barwidth"/>
                    </div>
                </div>
            </div>
            <div class="content-box"  :class="{'content-box-two': ficiaData.finance_type==2}">
                <div class="rate-hike" v-if="ficiaData.finance_type==1 && ficiaData.finance_add_return && ficiaData.finance_add_return != 0.00">
                    <div class="left">
                        <div class="up-logo">
                            <img :src="$assets.iconFicialUp">
                        </div>
                        <div class="rate-rule">
                            <div class="title">支付HZT享{{(+ficiaData.finance_add_return).toFixed(1)}}%加息</div>
                            <div class="sub-title">付{{ficiaData.finance_add_hzt}}HZT，到期多得{{(+ficiaData.finance_add_return).toFixed(1)}} {{ficiaData.finance_currency}}</div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="switch-btn" :class="{ 'switch-on': switch_checked}" @click.stop="SwitchBtn"></div>
                    </div>
                </div>
                <div class="investment-amount">
                    <div class="title">
                        <div class="left">投资金额</div>
                        <div class="right">预计收益：<span class="come-in">{{comein}}</span> {{ficiaData.finance_currency}}</div>
                    </div>
                    <div class="investemt">
                        <div class="investemt-line"></div>
                        <div class="investemt-input-wrapper">
                            <div class="investemt-input">
                                <comp-input v-model="investemt" Type="number" scene="licai" :pinkBg="1" height="1.75rem" :isonscroll="true" :nobg="1" placeholder="请输入存入金额，可存0.01~10000000"/>
                            </div>
                            <div class="investemt-btn" @click="All">全部</div>
                        </div>
                    </div>
                    <div class="line"></div>
                    <div class="balance">
                        <div class="balance-pakg">钱包余额：<span>{{(+ficiaData.wallet_balance).toFixed(6) || 0}}</span> {{ficiaData.finance_currency}}</div>
                        <div class="recharge-btn" @click="Recharge">充值</div>
                    </div>
                </div>
                <div class="financial-rules">
                    <div class="line"></div>
                    <div class="title">理财规则</div>
                    <div class="rate-payback-time" v-html="ficiaData.finance_hint"></div>
                    <div class="tip">
                        <i class="icon icon-xuanze-hide" :class="{'icon-xuanze-show': picked}" @click.stop="picked = !picked"></i>
                        <p @click.stop="picked = !picked">同意并签署<span class="s-agreement" @click.stop="GoTheAgreement">服务协议</span>，且知晓页面展示预期收益不代表实际收益承诺。</p>
                    </div>
                </div>
            </div>
            <comp-input class="bot-button" :value="btntip" Type="button" height="2.25rem" :nobg="1" :bg="bg" @arrow="ClickEvent" :status="btnState" />
        </div>
        <comp-loadings v-if="!Loading"/>
        <layout-frame class="main" :showhead="0" v-if="showCode">
            <layout-form-code :params="paramsCode" @arrow="Validate" @repeat="Repeat" />
        </layout-frame>
    </div>
</template>

<script>
    import compProgressBar from "~components/compTools/compProgressbar";
    import compInput from '~components/compInput/input';
    import layoutFrame from '~layout/layoutFrame';
    import layoutFormCode from '~layout/layoutFormCode';
    import compLoadings from "~components/compTools/compLoadings";
    export default {
        name: "ficail-ment-main",
        components: {
            compProgressBar,
            compInput,
            layoutFrame,
            layoutFormCode,
            compLoadings
        },
        data() {
            return {
                switch_checked: false, // 是否选择
                investemt: '', // 输入框数据
                picked: false, // 是否选择同意协议
                ficiaData: {}, // 数据渲染
                paramsCode: {}, // 验证码输入组件传值
                showCode: 0, // 是否显示验证码输入框
                notSend: false, // 不可提交
                userTel: '', // 用户手机号
                Loading: false, // 数据加载中
            }
        },
        computed: {
            btnState() { // 是否可以点击
                return this.bg==1
            },
            ficiaId() { // 理财id
                return this.$route.query.id
            },
            barwidth() { // 进度条比例
                return (this.ficiaData.deposit_amount/this.ficiaData.finance_limit * 100).toFixed(2)
            },
            bg() { // 背景更改type值 0,1,2
                return this.ficiaData.finance_status == 1 ? 1 : (this.ficiaData.finance_status == 0 ? 2 : 0)
            },
            btntip() { // 底部按钮的文子内容
                return this.bg == 1 ? '立即投资': (this.bg == 2 ? `${this.SetTime(this.ficiaData.finance_raise_start,1)}` : '已结束')
            },
            comein() { // 预计收益 收益 = [存入金额*（年利率/365）]*投资天数
                let cost = null;
                if(this.investemt == '' || this.investemt < 0.01) cost = 0;
                else if(this.investemt > 10000000) cost = 10000000;
                else cost = this.investemt;
                return (cost * ((+this.ficiaData.finance_basics_return + (this.ficiaData.finance_add_return ? +this.ficiaData.finance_add_return : 0)/100)/365) * (+this.ficiaData.finance_raise_day)).toFixed(6)
            }
        },
        methods:{
            // 处理建超沙雕传过来的沙雕数据
            SetTime(datetime,type) {
                let dtime = null,
                    dm = null,
                    dd = null;
                if(datetime == 1 || datetime == 2) { // 活期 1 起投日 2 起息日
                    dtime = datetime == 1 ?  new Date() : new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
                }else { // 定期
                    dtime = type ? new Date(new Date(new Date(datetime).getTime() + this.ficiaData.finance_raise_day * 24 * 60 * 60 * 1000))
                        : new Date(new Date(datetime).getTime());
                }
                dm = (dtime.getMonth() + 1) > 9 ? dtime.getMonth() + 1 : `0${dtime.getMonth() + 1}`;
                dd = dtime.getDate() > 9 ? dtime.getDate() : `0${dtime.getDate()}`;
                if(datetime == 1 || datetime == 2) {
                    return `${dm}-${dd}`;
                }else {
                    return type ? `${dm}月${dd}日 12:00开抢` : `${dm}-${dd} 12:00`;
                }
            },
            // 开关事件
            SwitchBtn() {
                // 是否选择
                this.switch_checked = !this.switch_checked
            },
            // 服务协议跳转
            GoTheAgreement() {
                // @TODO
            },
            // 钱包里面的钱全部投入
            All() {
                this.investemt = (+this.ficiaData.wallet_balance).toFixed(6) || 0
            },
            // 充值
            Recharge() {
                // @TODO
            },
            // 获取数据
            GetContent() {
                let id = this.ficiaId;
                let params = {
                    id: id,
                    type: 6
                };
                Ajax.get(Api.apply.contentInfo_get, params).then(res => {
                    this.Loading = true;
                    if (res.status == 1) {
                        this.ficiaData = res.data;
                        this.userTel = res.data.user_tel
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
            // 确定投资
            ClickEvent() {
                if(this.investemt == '' || this.investemt < +this.ficiaData.finance_min_limit) {
                    this.$dialog.alert('存入金额不能小于起投额度');
                    return;
                }
                if(!this.picked) {
                    this.$dialog.alert('请先同意并勾选服务协议');
                    return;
                }
                // 判断是否实名认证
                Service.CheckRealName().then(() => {
                    this.paramsCode = {
                        phone: this.userTel,
                        type: 10
                    };
                    if (this.notSend){
                        this.IdenVer();
                    }else {
                        if(this.investemt > +this.ficiaData.wallet_balance) {
                            this.$dialog.alert('存入金额不能超过您的可用余额');
                            return;
                        }
                        if(this.investemt > (+this.ficiaData.finance_limit - +this.ficiaData.finance_currency)) {
                            this.$dialog.alert('存入金额不能超过剩余额度');
                            return;
                        }
                        if(this.investemt > 10000000) {
                            this.$dialog.alert('存入金额不能超过10000000');
                            return;
                        }
                        if(+this.ficiaData.finance_add_hzt > this.ficiaData.burse_hzt) {
                            this.$dialog.alert('HZT余额不足以支付加息费用');
                            return;
                        }
                        // 支付密码校验通过弹出短信验证码输入框
                        this.$dialog.paypwd(this.userTel).then(() => {
                            this.showCode = 1;
                        })
                    }
                }).catch(() => {
                    this.$dialog.confirm({
                        title: "请先进行实名认证",
                        btns: ["去认证", "好的"]
                    }).then(() => {
                        this.$router.push("/user/authentication");
                    }).catch(() => {});
                });
            },
            // 重新获取验证码
            Repeat() {
                this.showCode = 0;
                this.$dialog.paypwd(this.userTel).then(() => {
                    this.showCode = 1;
                });
            },
            // 支付
            Validate(val){
                this.$dialog.loading();
                Ajax.post(Api.apply.finance_addBill, {
                    amount: this.investemt,
                    id: this.ficiaData.finance_id,
                    raise: this.switch_checked ? 1 : 0,
                    code: val
                }).then(r => {
                    this.$dialog.hide();
                    //console.log("in validate!! err=>"+JSON.stringify(r))
                    if (r.status == 1) {
                        setTimeout(() => {
                            this.$dialog.alert('支付成功').then(() => {
                                this.investemt = '';
                                this.switch_checked = false;
                                this.picked = false;
                                this.showCode = 0;
                                this.$router.push('/ficial-ment/purchistory-list')
                            });
                        }, 300)
                    } else {
                        if (r.data.status == -40001) {
                            this.showCode = 0;
                        }
                        setTimeout(() => {
                            this.$dialog.tip(r.message);
                        }, 300)
                    }
                }).catch(err => {
                    this.$dialog.hide();
                    //console.log("in validate!! err=>"+JSON.stringify(err))
                    this.showCode = 0;
                    setTimeout(() => {
                        this.$dialog.tip(err.message);
                    },300)
                });
            },
            //身份核实弹窗
            IdenVer() {
                this.$dialog.alert({
                    content: [`为了维护黑钻评级社区真实用户的权益，您首次提现需要添加人工客服进行身份核实。客服微信：<span id="copy">hzwd-001</span>，感谢您的支持！`],
                    btns: ['复制客服微信', '知道了']
                }).then(() => {
                    this.Copy();
                });
                this.notSend = true;
            },
            // 复制粘贴
            Copy() {
                window.getSelection().removeAllRanges(); //每次先清除选中状态
                let range = document.createRange(),
                    Object = document.querySelector("#copy"); //要复制文字的节点
                // 选中需要复制的节点
                range.selectNode(Object);
                // 执行选中元素
                window.getSelection().addRange(range);
                // 执行 copy 操作
                document.execCommand('copy');
                // 移除选中元素的选中样式
                window.getSelection().removeAllRanges();
                try {
                    this.$dialog.tip("已复制")
                } catch (err) {
                    this.$dialog.tip('复制失败');
                }
            },
        },
        mounted() {
            this.GetContent()
        }
    }
</script>

<style lang="less" scoped>
    .financial-management{
        background: rgba(240, 243, 246, 1);
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        .head{
            position: relative;
            height: 20rem;
            width: 100%;
            background: white;
            overflow: hidden;
            .bg{
                height: 10.5rem;
                background: linear-gradient(129deg,rgba(237,208,155,1) 0%,rgba(205,166,101,1) 100%);
            }
            .bg1{
                height: 9.5rem;
                background: white;
                padding: 2.6rem .7rem 0;
                .filter{
                    height: 3.95rem;
                    width: 100%;
                    background:rgba(237,237,237,1);
                    filter: blur(.25rem);
                }
            }
            .head-content{
                position: absolute;
                left: .75rem;
                top: 1rem;
                width: 17.25rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .content-top{
                    padding: 1rem .5rem .75rem;
                    background: white;
                    .top{
                        padding: 0 .5rem;
                        .title{
                            font-size: .85rem;
                            font-weight: bold;
                            color: rgba(51, 51, 51, 1);
                        }
                        .label{
                            display: flex;
                            margin-top: .5rem;
                            span {
                                font-size: .5rem;
                                border-radius: .05rem;
                                line-height: normal;
                                padding: .1rem .2rem;
                                margin-right: .5rem;
                                &.red{
                                    color: rgba(255, 124, 124, 1);
                                    background: rgba(255, 233, 233, 1);
                                }
                                &.blue{
                                    color: rgba(139, 169, 255, 1);
                                    background: rgba(233, 239, 255, 1);
                                }
                                &.green{
                                    color: rgba(139,211,118,1);
                                    background: rgba(236,251,232,1);
                                }
                            }
                        }
                        .con-box{
                            margin-top: 1rem;
                            .con-box-title,.con-box-subtitle{
                                display: flex;
                                align-items: center;
                                .left{
                                    flex: 5;
                                }
                                .right{
                                    flex: 4;
                                }
                            }
                            .con-box-title{
                                .left{
                                    color: rgba(255, 136, 39, 1);
                                    font-size: .85rem;
                                    span.main{
                                        font-size: 1.75rem;
                                        font-weight: bold;
                                    }
                                }
                                .right{
                                    font-size: 1.1rem;
                                }
                            }
                            .con-box-subtitle{
                                font-size: .6rem;
                                color: rgba(168, 168, 168, 1) !important;
                                .left{
                                    padding-left: .2rem;
                                }
                            }
                        }
                        .line{
                            margin-top: .5rem;
                            background: rgba(227, 227, 227, 1);
                            height: .025rem;
                        }
                        .tip{
                            display: flex;
                            align-items: center;
                            font-size: .6rem;
                            margin-top: .5rem;
                            color: rgba(129, 157, 238, 1);
                            i{
                                margin-right: .35rem;
                            }
                        }
                    }
                    .bot{
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        padding: .5rem .75rem;
                        margin-top: .75rem;
                        background: rgba(245, 242, 237, 1);
                        .bot-wrap{
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            font-size: .6rem;
                            color: rgba(153, 153, 153, 1);
                            &:first-child{
                                margin-bottom: .5rem;
                                .b-w-item{
                                    position: relative;
                                    &::after{
                                        position: absolute;
                                        top: 20%;
                                        right: -.6rem;
                                        content: '';
                                        width: .025rem;
                                        height: 60%;
                                        background: rgba(207, 207, 207, 1);
                                    }
                                }
                            }
                            .b-w-item{
                                flex: 1;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                &:first-child{
                                    margin-right: 1.2rem;
                                }
                            }
                        }
                    }
                }
                .content-bot{
                    margin-top: 1rem;
                    .title{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        color: rgba(102, 102, 102, 1);
                        font-size: .6rem;
                    }
                }
            }
        }
        .head-other{
            height: 18rem;
            .bg1{
                height: 7.5rem;
                padding: .7rem .7rem 0;
            }
        }
        .head-two{
            height: 16rem;
            .bg1{
                height: 5.5rem;
                padding: .7rem .7rem 0;
            }
        }
        .content-box{
            background: white;
            padding: .75rem;
            .rate-hike{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 0 -.75rem;
                padding: .75rem;
                background: rgba(247, 243, 243, 1);
                .left{
                    display: flex;
                    align-items: center;
                    .up-logo{
                        width: 1.6rem;
                        height: 1.6rem;
                        border-radius: 50%;
                        margin-right: .5rem;
                        overflow: hidden;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .rate-rule{
                        .title{
                            font-size: .8rem;
                            font-weight: bold;
                            color: rgba(38, 45, 52, 1);
                        }
                        .sub-title{
                            font-size: .6rem;
                            color: rgba(168, 168, 168, 1);
                        }
                    }
                }
                .right{
                    .switch-btn{
                        position: relative;
                        width: 2.7rem;
                        height: 1.3rem;
                        border-radius: .65rem;
                        background-color: rgba(216, 216, 216, 1);
                        box-sizing: border-box;
                        transition: background-color 0.1s;
                        &::after{
                            content: '';
                            position: absolute;
                            left: 0;
                            top: 50%;
                            width: 1.15rem;
                            height: 1.15rem;
                            margin-top: -.576rem;
                            border-radius: 50%;
                            background-color: white;
                            transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
                        }
                        &.switch-on{
                            background-color: rgba(209, 173, 111, 1);
                            &::after {
                                transform: translateX(1.55rem);
                            }
                        }
                    }
                }
            }
            .investment-amount{
                padding: 1rem 0 0;
                .title{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: rgba(51, 51, 51, 1);
                    .left{
                        font-size: .8rem;
                        font-weight: bold;
                    }
                    .right{
                        font-size: .65rem;
                        .come-in{
                            color: #D1AD6F;
                        }
                    }

                }
                .investemt{
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-top: .75rem;
                    .investemt-line{
                        background-color: rgba(209, 173, 111, 1);
                        height: 1.75rem;
                        width: .1rem;
                    }
                    .investemt-input-wrapper{
                        flex: 9;
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                        .investemt-input{
                            flex: 8;
                        }
                        .investemt-btn{
                            background-color: rgba(209, 173, 111, 1);
                            font-size: .8rem;
                            color: rgba(250, 251, 252, 1);
                            border-radius: .1rem;
                            padding: .225rem .45rem;
                        }
                    }
                }
                .line{
                    height: .025rem;
                    background: #E3E3E3;
                    margin: .5rem -.75rem 0;
                }
                .balance{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: .65rem;
                    padding: .6rem 0;
                    color: rgba(187, 187, 187, 1);
                    .recharge-btn{
                        margin-left: .75rem;
                        border-bottom: .025rem solid rgba(209, 173, 111, 1);
                        color: rgba(209, 173, 111, 1);
                    }
                }
            }
            .financial-rules{
                .line{
                    height: .25em;
                    background: rgba(240,243,246,1);
                    margin: 0 -.75rem;
                }
                .title{
                    font-size: .8rem;
                    color: rgba(51, 51, 51, 1);
                    font-weight: bold;
                    padding-top: .75rem;
                }
                .rate-payback-time{
                    margin: .75rem 0;
                    font-size: .7rem;
                    white-space: pre-line;
                    line-height: 2;
                    color: rgba(51, 51, 51, 1);
                }
                .tip{
                    display: flex;
                    box-sizing: border-box;
                    align-items: flex-start;
                    font-size: .6rem;
                    height: 2rem;
                    margin-top: .75rem;
                    color: rgba(168, 168, 168, 1);
                    .s-agreement{
                        color: rgba(86, 130, 255, 1);
                    }
                    i.icon{
                        margin-right: .5rem;
                        line-height: normal;
                        &.icon-xuanze-show{
                            color: #5682FF;
                        }
                    }
                }
            }
            &.content-box-two{
                padding-top: 0;
                .investment-amount{
                    padding: 0;
                }
            }
        }
    }
</style>
