<template>
    <div class="wallet-recharge" v-if="!loading">
        <div class="wallet-progress-wrap">
            <!-- <div class="button-wrap">
                    <span class="button" >充值说明</span>
                </div> -->
            <div class="com-topnav">
                <div @click.stop="explanation" style="color:#fff;">充值说明</div>
            </div>
            <layout-progress :option="option" :step='step' :status="status"></layout-progress>
        </div>
        <div v-if="step == 1" class="wallet-verfing-wrap">
            <com-going/>
        </div>
        <div v-else-if="step == 2" class="wallet-link-wrap">
            <div class="link">
                <div class="title-wrap">
                    <div class="title">收款地址</div>
                    <div class="link-url" id="copy">{{ url }}</div>
                </div>
                <div class="tip-wrap">
                    <div class="tip">
                        <p>1、请确保钱包地址填写正确，填错将导致币资无法找回</p>
                        <p>2、黑钻目前只体现整数位，HZT请充值整数（小数部分将被舍掉）</p>
                    </div>
                    <comp-input Type="button" class="tip-button" :status="1" :value="'复制地址'" @arrow="clickEvent"></comp-input>
                </div>
            </div>
            <div class="refresh">
                <div>每充值完1次，请手动点击右方按钮，以便我们尽快核实您的充值记录</div>
                <div class="refresh-btn" @click.stop="Refresh">已充值</div>
            </div>
        </div>
        <div v-else class="wallet-apply-wrap">
            <div class="apply">
                <div class="img">
                    <img :src="$assets.iconBook">
                </div>
                <div class="title">从交易所购买HZT代币，充值回我们平</div>
                <div class="reason">台，将享有多项社区特权</div>
            </div>
            <comp-input Type="button" class="apply-button" :status="1" :value="'提交申请'" @arrow="clickEvent"></comp-input>
        </div>
    </div>
</template>

<script>
    import compInput from "~components/compInput/input";
    import layoutProgress from '~layout/layoutProgress';
    import comGoing from '~components/comGoing';
    let timeout = 0; //防止短时间内多次更新ETH充值记录
    export default {
        name: "recharge",
        components: {
            compInput,
            layoutProgress,
            comGoing
        },
        data() {
            return {
                option: [{
                    okText: '提交申请',
                    failText: ''
                }, {
                    okText: '正在处理',
                    failText: ''
                }, {
                    okText: '处理成功',
                    failText: '处理失败'
                }],
                step: 0, // 执行步骤
                status: 1, //认证状态
                url: "", // 地址
                loading: 1, // 加载
            }
        },
        methods: {
            // 说明弹窗
            explanation() {
                this.$dialog.pannel({
                    title: "充值说明",
                    content: [
                        "一、本期提现周期：2.2日 18:00:00 - 3.5日 00:00:00 ",
                        "二、总提现额度：300万黑钻",
                        "三、每人提现额度：根据用户等级/所挣黑钻/当前所持黑钻，能提现不同金额的黑钻"
                    ]
                })
            },
            // 点击按钮
            clickEvent() {
                if (!this.step) {
                    this.step = 1;
                    this.getUrl(1);
                } else if (this.step == 2) {
                    this.copy()
                }
            },
            // 复制粘贴
            copy() {
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
                    this.$dialog.alert("复制成功")
                } catch (err) {
                    this.$dialog.alert('复制失败');
                }
            },
            getUrl(scene) {
                scene = scene || 0;
                this.$ajax.post(this.$api.apply.apply_input, {
                    scene: scene
                }).then(res => {
                    if (res.status == 1) {
                        this.loading = 0;
                        this.step = res.data.address.address_status;
                        if (this.step == 2) {
                            this.url = res.data.address.address_content;
                        }
                    }
                });
            },
            //刷新钱包页金额
            Refresh() {
                if (!timeout) {
                    timeout = 1;
                    Ajax.get(Api.apply.update_eth);
                    setTimeout(() => {
                        timeout = 0;
                    }, 60000);
                }
                this.$dialog.alert("系统会自动核实您的充值记录，过几分钟可在钱包里查看到黑钻金额的增加");
            }
        },
        mounted() {
            this.getUrl()
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../../../assets/css/config";
    .wallet-recharge {
        height: e("calc(100vh - 2.5rem)");
        background: url('@{hosturl}login-bottom-bg.png') center bottom no-repeat;
        background-size: contain;
        background-color: #fff;
        overflow: hidden;
        font-size: .75rem;
        color: #333;
        .wallet-progress-wrap {
            height: 7rem;
            width: 100%;
            display: flex;
            justify-content: center;
            flex-direction: column;
            background: #46476B;
            padding: 0 .75rem;
            overflow: hidden;
        }
        .wallet-apply-wrap,
        .wallet-verfing-wrap {
            width: 100%;
            padding: 1.725rem .75rem 0;
            .apply {
                width: 100%;
                padding: 0 1.825rem;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                justify-content: center;
                div {
                    text-align: center;
                    font-size: .75rem;
                    line-height: 1.05rem;
                    color: #333;
                    &.img {
                        width: 5.9rem;
                        height: auto;
                        overflow: auto;
                        margin: 0 auto 1.1rem;
                        img {
                            width: 100%;
                            height: auto;
                            display: block;
                        }
                    }
                }
            }
        }
        .wallet-apply-wrap {
            .apply-button {
                margin-top: 5.5rem;
            }
        }
        .wallet-link-wrap {
            width: 100%;
            padding: .75rem;
            .link {
                width: 100%;
                height: auto;
                overflow: hidden;
                text-align: center;
                background: #F3F3F3;
                line-height: 1.125rem;
                box-shadow: 0 0 .3rem 0 rgba(0, 0, 0, 0.16);
                border-radius: .35rem;
                .title-wrap {
                    position: relative;
                    overflow: hidden;
                    padding: .75rem;
                    .title {
                        color: #333;
                        font-size: .8rem;
                        font-weight: bold;
                        margin-bottom: .45rem;
                        font-family: PingFangSC-Medium;
                    }
                    .link-url {
                        overflow: hidden;
                        color: #888;
                        word-wrap: break-word;
                    }
                    .link-input {
                        position: absolute;
                        left: -200%;
                        top: -300%;
                        /*---IOS 隐藏input 光标 start---*/
                        text-indent: -999rem;
                        width: 1px;
                        opacity: 0;
                        /*---IOS 隐藏input 光标 end---*/
                    }
                }
                .tip-wrap {
                    padding: .75rem;
                    background: white;
                    .tip {
                        color: #888;
                        margin: .25rem auto 1.4rem;
                        font-size: .6rem;
                        text-align: left;
                    }
                    .tip-button {}
                }
            }
        }
        .refresh {
            display: flex;
            margin-top: 2rem;
            justify-content: space-between;
            font-size: .7rem;
            color: #888;
            .refresh-btn {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-shrink: 0;
                padding: 0 .8rem;
                margin-left: 1rem;
                border: .03rem solid #5682FF;
                border-radius: .25rem;
                color: #5682FF;
                font-size: .8rem;
            }
        }
    }
</style>
