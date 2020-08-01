<template>
    <div class="wallet-cashout">
        <div v-show="!showCode">
            <div class="com-topnav">
                <div @click.stop="explain" style="color:#5682ff;">提现规则</div>
                <!-- <div @click="$router.push('/user/wallet/record')">提现记录</div> -->
            </div>
            <div class="cashout-box">
                <ul class="tab">
                    <li class="tab-item" :class="{'active-tab': i != tab}" v-for="(item,i) in tabs" :key="item" @click.stop="toggleTabs(i)">{{item}}</li>
                </ul>
                <div class="cashout-main">
                    <div class="cashout-item cashout-address">
                        <label for="address">提币地址</label>
                        <div class="address-change" @click="$router.push(`/user/wallet/node/main?select=1`)">
                            <div class="content" :class="{'placeholder':!aname}">{{aname ? aname : '选择提币地址'}}</div>
                            <i class="icon icon-shouhui"></i>
                        </div>
                    </div>
                    <div class="cashout-item">
                        <label for="num">提现金额</label>
                        <comp-input :placeholder="`最小提现金额 ${rule[tab].min}`" v-model="hztNum" Type="number" />
                    </div>
                    <div class="cashout-usable">
                        <span>最大可提金额: <b>{{rule[tab].max}}</b></span>
                    </div>
                    <div class="cashout-remind" style="margin-top:1rem;">
                        <span>单笔提现手续费: </span>
                        <b>{{rule[tab].charge}}</b>
                    </div>
                    <div class="cashout-remind">
                        <span>实际到账: </span>
                        <b v-show="truth>0">{{truth}}</b>
                    </div>
                </div>
            </div>
            <div class="cashout-invite">
                <!-- 邀请 -->
                <div class="invite-top">
                    <div class="invite-content">
                        <p>邀请提升提现额度</p>
                        <p class="subTip">还可赚300黑钻</p>
                    </div>
                    <div class="invite-btn">
                        <div class="button" @click="$router.push('/invite/main')">去邀请</div>
                        <!-- <i class="icon icon-shouhui"></i> -->
                    </div>
                </div>
                <div class="invite-details">
                    <div class="detail-wrap">
                        <span>+{{invitedNum}}人</span>
                        <span class="tip">已邀请</span>
                    </div>
                    <div class="detail-wrap">
                        <span>+{{invitedLimit}}%</span>
                        <span class="tip">已提升</span>
                    </div>
                </div>
                <p class="invite-hint">近30天每邀请1个用户通过实名认证可提升0.5%额度，最多提升20%。</p>
            </div>
            <comp-input Type="button" value="确认" :status="1" @arrow="SendSMS" />
        </div>
        <layout-frame class="main" :showhead="0" v-if="showCode">
            <layout-form-code :params="paramsCode" @arrow="validate" @repeat="repeat" />
        </layout-frame>
    </div>
</template>

<script>
    import compInput from '~components/compInput/input';
    import layoutFrame from '~layout/layoutFrame';
    import layoutFormCode from '~layout/layoutFormCode';
    export default {
        name: 'user-waller-cashout',
        components: {
            compInput,
            layoutFrame,
            layoutFormCode
        },
        data() {
            return {
                rule: [{max: 0,min: 0,status: 0,charge: 0}, {max: 0,min: 0,status: 0,charge: 0}], // 提币数据容器
                tabs: ['社区奖励金额', '充值金额'],
                freeze: 1, //freeze_status:1：账户正常 0：账户冻结 freeze_time:解冻时间
                hztNum: '', //提现黑钻数量
                invitedNum: 0, //已邀请人数
                invitedLimit: 0, //已邀请提升额度
                userTel: '', //用户手机号
                showCode: 0, //是否显示验证码输入框
                paramsCode: {}, //验证码输入组件传值
                desc: '', //提现规则
                notSend: false, //不可提交
            }
        },
        computed: {
            aid() { // 提币地址id
                return this.$route.query.aid;
            },
            aname() { // 提币地址name
                return this.$route.query.aname;
            },
            tab() {
                return this.$store.getters.cashOutTab;
            },
            //实际到帐金额
            truth() {
                let r = this.hztNum - this.rule[this.tab].charge;
                return r < 0 ? 0 : r;
            }
        },
        methods: {
            //显示提现规则弹框
            explain() {
                this.$dialog.pannel({
                    title: '提现规则说明',
                    content: this.desc
                })
            },
            toggleTabs(i) {
                if(i == 1){
                    this.$dialog.tip("充值金额提现即将开放");
                    return;
                }
                if (i == this.tab) return;
                this.$store.commit("changeCashOutTab", i);
                this.clear();
                this.cashoutTip();
            },
            getData() {
                Ajax.get(Api.apply.get_available).then(res => {
                    let d = res.data;
                    if(+d.is_user_check == 0){
                        this.IdenVer();
                    }else{
                        this.notSend = false;
                        this.freeze = d.freeze;
                        this.userTel = d.user_tel;
                        this.invitedNum = d.invite.invite_num;
                        this.invitedLimit = +d.invite.invite_limit * 100;
                        let arr = [],
                            rule = d.rule;
                        for (let i = 0; i <= 1; i++) {
                            arr[i] = {
                                max: parseInt(rule[i].max),
                                min: parseInt(rule[i].min), //单笔提现最小金额
                                charge: parseInt(rule[i].charge), //手续费
                                status: rule[i].status //可提状态
                            }
                        }
                        this.rule = arr;
                        this.desc = d.desc; // 提现规则
                        this.cashoutTip();
                    }
                }).catch(err => {
                    this.$dialog.alert(err.message);
                });
            },
            IdenVer() { //身份核实弹窗
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
            SendSMS() {
                // 判断是否实名认证
                Service.CheckRealName().then(() => {
                    this.paramsCode = {
                        phone: this.userTel,
                        type: 10
                    };
                    if (this.notSend){
                        this.IdenVer();
                    }else {
                        if (!this.cashoutTip()) return;
                        let rule = this.rule[this.tab];
                        if (!this.aname) {
                            this.$dialog.alert('请选择提币地址');
                            return;
                        }
                        // 校验提现的数据
                        if (this.hztNum == '') {
                            this.$dialog.alert('请输入提现金额');
                            return;
                        }
                        if (this.hztNum < rule.min) {
                            this.$dialog.alert('单次至少提现：' + rule.min);
                            return;
                        }
                        if (this.hztNum > rule.max) {
                            this.$dialog.alert('提现金额不能超过最大可提金额');
                            return;
                        }
                        if (this.freeze.status==0) {
                            this.$dialog.alert({
                                title: '您目前处于资金冻结状态',
                                content: `${this.freeze.time}后才可进行资金操作`,
                                btns: ["好的"]
                            });
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
            validate(val) {
                // 短信验证码校验
                //console.log("in validate!!")
                Ajax.post(Api.apply.output_apply, {
                    type: this.tab,
                    address_id: this.aid,
                    hzt_num: this.hztNum,
                    code: val
                }).then(r => {
                    //console.log("in validate!! res=>"+JSON.stringify(r))
                    if (r.data.status == 1) {
                        this.clear(1);
                        this.showCode = 0;
                        setTimeout(() => {
                            this.$dialog.alert('提现申请已提交，请耐心等待').then(() => {
                                HZApp.Reload('/user/wallet/record')
                            });
                        }, 300);
                    } else {
                        if (r.data.status == -40001) {
                            this.showCode = 0;
                        }
                        setTimeout(() => {
                            this.$dialog.tip(r.message);
                        }, 300)
                    }
                }).catch(err => {
                    //console.log("in validate!! err=>"+JSON.stringify(err))
                    this.showCode = 0;
                    setTimeout(() => {
                        this.$dialog.tip(err.message);
                    },300)
                });
            },
            clear(type) {
                // 清空列表数据
                this.hztNum = '';
                if(!type){
                    if(Global.isApp && Global.isPro){
                        HZApp.Reload('/user/wallet/cashout')
                    } else {
                        this.$router.replace('/user/wallet/cashout');
                    }
                }
            },
            repeat() {
                // 重新获取验证码
                this.showCode = 0;
                this.$dialog.paypwd(this.userTel).then(() => {
                    this.showCode = 1;
                });
            },
            cashoutTip() {
                // 提现次数限制弹框
                if (!this.rule[this.tab].status) {
                    setTimeout(() => {
                        this.$dialog.alert(`${this.tabs[this.tab]}，一个周期只能提现1次`);
                    }, 200);
                    return 0;
                }
                return 1;
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../../../assets/css/config";
    .wallet-cashout {
        position: relative;
        width: 100%;
        min-height: 100vh;
        background: url('@{hosturl}login-bottom-bg.png') center bottom no-repeat;
        background-size: contain;
        background-color: @bgcolor-item;
        color: @color-sub;
        padding: 1rem 1.4rem;
        .cashout-box {
            margin-top: 1rem;
            margin-bottom: .725rem;
            background-color: #fff;
            box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.16);
            border-radius: .35rem;
            .tab {
                display: flex;
                .tab-item {
                    width: 50%;
                    text-align: center;
                    box-shadow: 0px 1px 0px 0px rgba(218, 218, 218, 1);
                    color: #BCBCBC;
                    font-size: .75rem;
                    height: 2.5rem;
                    line-height: 2.5rem;
                    &:first-child {
                        box-shadow: 1px 1px 0px 0px rgba(218, 218, 218, 1);
                    }
                    &.active-tab {
                        background-color: #EAEAEA;
                        color: #333;
                    }
                }
            }
            .cashout-main {
                padding: 0 .75rem .75rem;
                .cashout-item {
                    margin-top: .75rem;
                    label {
                        font-size: .75rem;
                        font-weight: 400;
                        line-height: 1.05rem;
                    }
                }
                .cashout-address {
                    border-bottom: .1rem solid @color-border-item;
                    .address-change {
                        display: flex;
                        height: 2.1rem;
                        width: 100%;
                        justify-content: space-between;
                        align-items: center;
                        font-size: .75rem;
                        font-weight: 400;
                        line-height: 1.05rem;
                        .content {
                            word-break: break-all;
                        }
                        .placeholder {
                            color: #BCBCBC;
                        }
                        i {
                            margin-left: 1.975rem;
                        }
                    }
                }
                .cashout-remind,
                .cashout-usable {
                    margin-top: .2rem;
                    color: #BCBCBC;
                    font-size: .65rem;
                    b {
                        color: #333;
                    }
                }
                .cashout-usable {}
                .cashout-remind {
                    display: flex;
                    justify-content: space-between;
                }
            }
        }
        .cashout-invite {
            width: 100%;
            background: url('@{hosturl}cashout-bg.png') no-repeat;
            background-size: cover;
            border-radius: .1rem;
            box-shadow: 0 0 .3rem 0 rgba(0, 0, 0, 0.16);
            padding: .75rem .75rem .5rem;
            margin-bottom: 1rem;
            .invite-top {
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #fff;
                line-height: 1.4;
                .invite-content {
                    font-size: .7rem;
                    .subTip {
                        font-size: .45rem;
                    }
                }
                .invite-btn {
                    display: flex;
                    align-items: center;
                    .button {
                        border-radius: .1rem;
                        background-color: #FF7270;
                        color: #fff;
                        font-size: .65rem;
                        font-weight: 400;
                        line-height: 1.4;
                        vertical-align: middle;
                        padding: .2rem .525rem;
                        margin-right: .65rem;
                    }
                }
            }
            .invite-details {
                margin-top: .6rem;
                margin-bottom: .5rem;
                padding: .15rem;
                background-color: #fff;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .detail-wrap {
                    width: 50%;
                    height: 2.1rem;
                    text-align: center;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    span {
                        color: #FF7270;
                        font-size: .8rem;
                        line-height: 1.4;
                        font-weight: 600;
                        letter-spacing: .075rem;
                    }
                    .tip {
                        color: #BCBCBC;
                        font-size: .5rem;
                        font-weight: 400;
                        letter-spacing: normal;
                    }
                    &:first-child::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        right: 0;
                        width: .025rem;
                        height: .975rem;
                        background-color: #BCBCBC;
                        transform: translate(0, -50%);
                    }
                }
            }
            .invite-hint {
                font-size: .45rem;
                color: #fff;
                line-height: 1.4;
                font-weight: 500;
            }
        }
    }
</style>
