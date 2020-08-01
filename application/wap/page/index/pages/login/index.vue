<template>
    <div class="login-page">
        <layout-frame :showhead="show" class="main">
            <div class="center">
                <component
                    :is="comp"
                    @next="Next"
                    :params="compData"
                    :label="label"
                    :invite="!wxlogin"
                />
                <div class="btns" v-show="Show">
                    <div @click="change">{{loginType?"账号密码登录":"手机登录/注册"}}</div>
                    <div v-show="!loginType" @click="Go('/user/setup/pwd')">忘记密码</div>
                </div>
                <comp-prompt
                    v-show="Show"
                >若您是黑钻评级老用户，为保证资产同步，请先使用微信登录绑定手机号后再使用手机号登录，否则因账号异步造成的资产问题，黑钻评级概不负责。</comp-prompt>
            </div>
            <div class="foot" v-if="Show">
                <div class="wechat" @click.stop="WXLogin(0)">
                    <i class="icon icon-weixin2"></i>
                </div>
                <div class="wetext">微信登录</div>
                <div class="agreement">
                    点击“下一步”，即表示你同意
                    <span @click="Go('/protocol')">黑钻评级用户协议</span>
                </div>
            </div>
        </layout-frame>
    </div>
</template>

<script>
import "./style";
import compPrompt from "~components/compPrompt";
import layoutFrame from "~layout/layoutFrame";
import layoutFormPhone from "~layout/layoutFormPhone";
import layoutFormLogin from "~layout/layoutFormLogin";
import layoutFormCode from "~layout/layoutFormCode";
import layoutFormPwd from "~layout/layoutFormPwd";
import layoutFormInfo from "~layout/layoutFormInfo";
export default {
    name: "login",
    components: {
        layoutFrame,
        compPrompt
    },
    data() {
        return {
            loginType: 0, //登录方式 1手机登录 0帐号密码登录
            compData: undefined, //组件内数据传递载体
            comp: layoutFormLogin, //动态组件载体
            show: 1, //是否展示头部logo、登录方式切换按钮、底部协议
            wHeight: 0, //设备高度
            label: "",
            wxlogin: 0, //为微信登录后绑定手机样式
            wxloginstate: 0 //微信登录状态，防止频繁点击 this
        };
    },
    computed: {
        Show() {
            //处理微信登录成功以后，绑定手机页面与登录页一样
            return this.show && !this.wxlogin ? 1 : 0;
        }
    },
    methods: {
        Go(path){
            this.$router.push(path);
        },
        //切换登录方式
        change() {
            this.loginType = !this.loginType;
            if (this.loginType) this.comp = layoutFormPhone;
            else this.comp = layoutFormLogin;
        },
        //进行下一步,获取组件内的数据
        Next(dt) {
            //dt.next 2：进入短信验证业务流程；3：短信验证成功后业务流程；4:进入设置个人资料业务流程
            //dt.type 0新用户登录 1老用户登录 2绑定手机业务流程  6新微信注册绑定手机号
            //dt.phone 手机号
            //dt.code 获取短信需要的滑动验证码
            this.compData = Object.assign({}, this.compData, dt);
            this.compData.jump = 1; //上传头像可跳过按钮
            this.show = 0; //隐藏头部
            switch (dt.next) {
                case 1:
                    this.GoPhone();
                    break;
                case 2:
                    this.GoCode();
                    break;
                case 3:
                    this.Gologined();
                    break;
                case 4:
                    this.GoInfo();
                    break;
                case 5:
                    this.GoPWD();
                    break;
                default:
                    this.Leave();
                    break;
            }
        },
        //进入输入手机号业务流程
        GoPhone() {
            this.show = 1;
            this.comp = layoutFormPhone;
        },
        //进入短信验证业务流程
        GoCode() {
            this.wxlogin = 0;
            this.comp = layoutFormCode;
        },
        //进入新用户设置密码业务流程
        GoPWD() {
            this.comp = layoutFormPwd;
        },
        //进入新用户设置昵称头像业务流程
        GoInfo() {
            this.comp = layoutFormInfo;
        },
        //老用户登录成功业务处理
        Gologined() {
            if(Global.isApp && Global.isPro){
                plus.nativeUI.showWaiting("登录中...");
            }
            Service.Logining(this.compData.info);
            setTimeout(() => { //防止登录后还没有保存用户信息，就自动跳转到【我的】页面，进而触发更新用户数据，覆盖并丢失数据
                if(Global.isApp && Global.isPro){
                    plus.nativeUI.closeWaiting();
                }
                if (/[06]/.test(this.compData.type)) {
                //新用户登录 于微信注册
                    this.GoPWD();
                } else {
                    this.Leave();
                }
            }, 10);
        },
        //微信登录
        WXLogin(code) {
            if (this.wxloginstate) {
                this.$dialog.tip("请勿频繁点击");
                return;
            }
            this.wxloginstate = 1;
            if (Global.isApp) {
                plus.nativeUI.showWaiting("登录中...");
                Service.GetAppWxServices().then(data => {
                    //console.log("登录data=>" + JSON.stringify(data));
                    Service.APPWXGetUserInfo(data, res => {
                        plus.nativeUI.closeWaiting();
                        if (res == 1) {
                            this.wxloginstate = 0;
                            Service.CheckBind().then(this.Leave);
                        } else {
                            this.Next({
                                next: 1,
                                type: 6, //type:6 新微信注册绑定手机号
                                img_url: res.headimgurl,
                                user_name: res.nickname,
                                openid: res.openid,
                                unionid: res.unionid,
                                deviceid: res.deviceid
                            });
                            this.wxlogin = 1;
                            this.wxloginstate = 0;
                            this.label = "请绑定手机号";
                        }
                    }, err => {
                        plus.nativeUI.closeWaiting();
                        this.wxloginstate = 0;
                        //console.log("登录失败 err=>" + JSON.stringify(err));
                        Dialog.alert(err.message);
                    });
                }).catch(err => {
                    plus.nativeUI.closeWaiting();
                    this.wxloginstate = 0;
                    //console.log("获取微信授权失败=>"+JSON.stringify(err));
                });
            } else {
                if (navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1) {
                    Service.WXLogin(code, res => {
                        if (res == 1) {
                            Service.CheckBind().then(this.Leave);
                        } else {
                            this.Next({
                                next: 1,
                                type: 6, //type:6 新微信注册绑定手机号
                                img_url: res.headimgurl,
                                user_name: res.nickname,
                                openid: res.openid,
                                unionid: res.unionid
                            });
                            this.wxlogin = 1;
                            this.label = "请绑定手机号";
                        }
                    });
                } else
                    this.$dialog.alert(
                        "当前环境不支持微信登录，请使用微信客户端打开此页面重新登录！"
                    );
            }
        },
        //登录成功后离开
        Leave() {
            let url = this.$route.query.url;
            this.$router.replace(url || "/user/main");
            this.$destroy();
        }
    },
    activated() {
        setTimeout(() => {
            Share.Ready();
        });
    },
    mounted() {
        this.wHeight = window.innerHeight; //不能用100vh,因为软键盘弹出时，底部微信按钮会上泘
        if (!Global.isApp) {
            let code = this.$route.query.code;
            code && this.WXLogin(code);
        }
    }
};
</script>