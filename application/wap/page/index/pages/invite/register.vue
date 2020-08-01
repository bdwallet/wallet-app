<template>
    <div class="invite-register">
        <div class="invite-landing">
            <div class="award">
                <div class="order">
                    <span class="line"></span>
                    <span class="txt">黑钻评级</span>
                    <span class="line"></span>
                </div>
                <p class="award-title">注册即领<span>225</span>黑钻新人礼包</p>
                <p class="award-desc">5完善个人资料+20登录+200实名认证</br>申请超级评审员还可尊享分红权益</p>
            </div>
            <div class="register">
                <div class="invite-code">
                    邀请码&nbsp;{{inviteCode}}
                </div>
                <comp-input placeholder="请输入手机号" :pinkBg="1" Type="tel" v-model="phone" reg="^[1][0-9]{10}$" @input="inputEvent"></comp-input>
                <div class="valid-code">
                    <comp-input placeholder="请填写验证码" :pinkBg="1" :width="'90%'" Type="code" v-model="code"></comp-input>
                    <comp-input :value="validText? validText : '还剩' + time + 's'" :pinkBg="1" Type="button" @arrow="clickEvent" :status="btnState" :width="'5rem'"></comp-input>
                </div>
                <div class="sub-btn" @click="SendSMS" :class="{'sub-active': (btnState && code.length==4)}">邀请好友领黑钻</div>
            </div>
        </div>
        <logo-foot/>
    </div>
</template>

<script>
    import compInput from '~components/compInput/input';
    import logoFoot from '~layout/logoFoot';
    export default {
        name: 'invite-register',
        components: {
            compInput,
            logoFoot
        },
        data() {
            return {
                validText: '获取验证码',
                time: 0, //倒计时
                timeout: 0, //计时器
                phone: '', //输入的手机号
                code: '', //输入的验证码
                btnState: 0, //获取验证码按钮是否灰掉
                getValid: 0, //是否获取验证码
            }
        },
        computed: {
            getPhone() {
                return this.phone.replace(/\s/g, ''); //去除组件传出的值有空格问题
            },
            inviteCode() { //邀请码
                return this.$route.params.invid;
            }
        },
        mounted() {
            Share.Ready();
        },
        methods: {
            inputEvent() {
                if(this.getPhone.length == 11){
                    this.getValid = 1;
                    this.btnState = 1;
                }else{
                    this.getValid = 0;
                    this.btnState = 0;
                    this.time = 0;
                    this.timeout && clearInterval(this.timeout);
                    this.validText = '获取验证码';
                }
            },
            clickEvent() {
                // 点击获取验证码
                if(!this.getValid) return;
                let phone = this.getPhone;
                let type = 1; //注册
                if (phone && /^[1][0-9]{10}$/.test(phone) && this.time <= 0) {
                    Service.Proving(type, phone).then(r => {
                        if (r.data.status == 1) {
                            this.validText = '';
                            this.recode();
                            this.$dialog.tip(r.message);
                        } else
                            this.$dialog.tip(r.message);
                        this.getValid = 0;
                    });
                } else {
                    this.$dialog.tip("请输入正确的手机号");
                }
            },
            SendSMS() {
                if (this.btnState && this.code.length == 4) {
                    let data = {
                        phone: this.getPhone,
                        scene: 1,
                        verification_code: this.code, //验证码
                        invite: this.inviteCode
                    }
                    Ajax.post(Api.apply.user_login, data).then(this.success).catch(this.clear);
                }
            },
            success(res) {
                if (res.data.status == 1) { //登录
                    this.$dialog.confirm({
                        title: '您已经是黑钻评级的用户啦！',
                        btns: ['下载APP', '好的']
                    }).then(() => {
                        location.href = "/down.html";
                    }).catch(() => {
                        this.phone = '';
                        this.code = '';
                    });
                } else if (res.data.status == 2) { //注册
                    this.$router.replace('/invite/success');
                }
            },
            clear(err) {
                this.$dialog.tip(err.message);
            },
            // 倒计时
            recode() {
                this.time = 5;
                this.timeout && clearInterval(this.timeout);
                this.timeout = setInterval(() => {
                    this.time--;
                    if (this.time <= 0) {
                        this.getValid = 1;
                        this.validText = '重新获取';
                    }
                }, 1000);
            }
        },
    }
</script>

<style lang="less" scoped>
    @import "../../../../assets/css/config.less";
    .invite-register {
        width: 100%;
        height: 100vh;
        overflow: hidden;
        background: url('@{hosturl}invite-bg.jpg') no-repeat;
        background-size: cover;
        position: relative;
        padding: 0 .25rem 1.325rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .invite-landing {
            width: 100%;
            height: 21.825rem;
            margin-top: .8rem;
            margin-bottom: 4.2rem;
            background: url('@{hosturl}landing-bg.png') no-repeat;
            background-size: cover;
            padding: 0 2.05rem;
            line-height: 1.4;
            font-weight: 400;
            flex-shrink: 0;
            .award {
                padding-top: 3.4rem;
                text-align: center;
                .order {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1.4;
                    font-size: .6rem;
                    color: #888888;
                    font-weight: 400;
                    .line {
                        display: inline-block;
                        width: .6rem;
                        vertical-align: middle;
                        border-top: 1px solid #888888;
                    }
                    span {
                        padding: 0 .25rem;
                    }
                }
                .award-title {
                    font-size: 1rem;
                    color: #323232;
                    margin-top: .5rem;
                }
                .award-desc {
                    font-size: .7rem;
                    color: #888888;
                    margin-top: .2rem;
                }
            }
            .register {
                margin-top: 1.5rem;
                .invite-code {
                    font-size: .7rem;
                    color: #888888;
                    text-align: center;
                    margin-bottom: 1.35rem;
                }
                .valid-code {
                    display: flex;
                    margin-top: .9rem;
                }
                .sub-btn {
                    display: block;
                    width: 100%;
                    font-size: .8rem;
                    padding: .575rem 0;
                    text-align: center;
                    color: #fff;
                    background-color: #DDDFE3;
                    border: 0;
                    border-radius: 1.25rem;
                    margin-top: 1.1rem;
                    &.sub-active {
                        background-color: #FF6666;
                    }
                }
            }
        }
    }
</style>

