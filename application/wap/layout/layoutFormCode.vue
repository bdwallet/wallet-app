<template>
    <div class="layout-form form-main">
        <div class="title">输入短信验证码</div>
        <div class="sub">已向您的手机 {{params.phone && params.phone.substr(7)}} 发送验证码</div>
        <!-- <div class="label">验证码</div> -->
        <comp-code @arrow="validate" ref="compCode" />
        <div class="repeat" @click.stop="repeat">重新发送<span v-if="time>0">({{time}}s)</span></div>
        <div class="tip" @click.stop="show">收不到验证码</div>
    </div>
</template>

<script>
    import compCode from '~components/compInput/code';
    import PWD from '~script/PWD';
    export default {
        name: 'layoutFormCode',
        components: {
            compCode
        },
        props: {
            params: undefined
        },
        data() {
            return {
                time: 60, //倒计时
                timeout: 0, //计时器
            }
        },
        computed:{
            isPay(){
				return this.$store.getters.userInfo.is_pay;
			}
        },
        methods: {
            //错误提示并清除输入内容
            clear(err) {
                this.$refs.compCode.clear();
                this.$dialog.alert(err.message);
                if(err.status == -20002 || err.status == -10008){ // 邀请码输入有误 || 帐号已禁用 返回第一步
                    this.$emit('next', {next:1});
                }
            },
            //短信校验成功
            success(r) {
                //短信验证成功，进入下一步业务流程
                let s = r.data.status;
                if (s == 1 || s == 2) { //校验正确
                    let ps = {};
                    switch (parseInt(this.params.type)) {
                        case 2: //找回密码
                            ps.next = 5;
                            ps.code = PWD.unlock(r.data.louk_code, this.params.phone).substr(0, 4);
                            break;
                        case 3: //绑定手机 => 新号码
                            ps.next = 0;
                            ps.info = {
                                user_tel: this.params.phone
                            };
                            break;
                        case 4: //绑定手机 => 第一步
                            ps.next = 1;
                            ps.type = 5;
                            break;
                        case 5: //绑定手机 => 第二步
                            ps.next = 0; //绑定完成
                            ps.info = {
                                user_tel: r.data.user_tel
                            };
                            break;
                        case 6: //新微信注册绑定手机号
                            ps.next = 3; //下一步设置密码
                            ps.info = r.data.user_data;
                            break;
                        case 7: //设置支付密码
                            ps.next = 2; //下一步设置支付密码
                            ps.info = r.data;
                            break;
                        default: //登录流程
                            ps.next = 3;
                            ps.info = r.data.user_data;
                            break;
                    }
                    this.$emit('next', ps);
                } else { //校验错误
                    //if(s == -40002 || s == -30002){ //-40002:该手机号已经使用过,-30002:请输入正确的手机号码
                    if(s == -40002){
                        this.$emit('next', {next:1});
                        this.$dialog.tip(r.message);
                    }
                    this.clear(r);
                }
            },
            //校验验证码
            validate(val) {
                let d = this.params;
                if (d.type == 2) { //找回密码
                    Ajax.post(Api.apply.set_pwd, {
                        phone: d.phone,
                        old_password: val,
                        type: 3
                    }).then(this.success).catch(this.clear);
                } else if (/[3,4,5,6]/.test(d.type)) { //绑定手机
                    let scene = 0;
                    if (d.type == 4) scene = 1;
                    if (d.type == 5) scene = 2;
                    if (d.type == 6) scene = 3;
                    let params = {
                        phone: d.phone,
                        verification_code: val,
                        scene, //0：绑定新号 1:换绑第一步 2:换绑第二步 3:新微信绑定手机号
                        img_url:d.img_url,
                        user_name:d.user_name,
                        openid:d.openid,
                        unionid:d.unionid
                    };
                    if(Global.isApp) {
                        params.deviceid = plus.device.uuid || 1;
                    }
                    Ajax.post(Api.apply.binding_phone,params).then(this.success).catch(this.clear);
                } else if (d.type == 7) { //设置支付密码
                    Ajax.post(Api.apply.set_user_info, {
                        type: 1,
                        scene: d.scene, // 1：校验短信  2：设置密码
                        set_data: JSON.stringify({'code': val, 'code_type': this.isPay? 8 : 7})
                    }).then(this.success).catch(this.clear);
                } else if(d.type == 10){ // 黑钻提现
                    this.$emit('arrow', val);
                    this.$refs.compCode.clear();
                } else { //登录流程
                    let params = {
                        phone: d.phone, //手机号
                        password: d.password, //密码
                        verification_code: val, //验证 解决tostring问题 verification
                        scene: 1, //0密码登录，1验证码登录
                        //invite:d.inviteCode //邀请码
                    };
                    if(Global.isApp) {
                        params.deviceid = plus.device.uuid || 1;
                    }
                    Ajax.post(Api.apply.user_login, params).then(this.success).catch(this.clear);
                }
            },
            //重新获取短信验证码
            repeat() {
                if (this.time <= 0) {
                    if(this.params.type == 10){ //黑钻提现重新发送验证码
                        this.$emit('repeat');
                    }
                    let d = this.params;
                    Service.Proving((d.type || 1), d.phone).then(r => {
                        this.$dialog.tip(r.message);
                        this.record();
                    });
                }
            },
            //收不到验证码提示框
            show() {
                this.$dialog.pannel({
                    title: "收不到验证码？",
                    content: ['1.查看是否误设短信拦截。',
                        '2.若号码欠费停机，建议您更换或缴费后重新获取。',
                        '3.若因信号问题网络延迟，请稍后尝试重新获取。',
                        '4.若当前手机号未正常使用,无法接收验证码,请添加"黑钻评级管理员"微信进行反馈。',
                        `<p style="text-align: center;"><img style="width:5rem;height:5rem;" src="https://heizuan.oss-cn-shenzhen.aliyuncs.com/h5images/kefucode.png" /></p>`
                    ]
                });
            },
            //倒计时
            record() {
                this.time = 60;
                this.timeout && clearInterval(this.timeout);
                this.timeout = setInterval(() => {
                    this.time--;
                }, 1000);
            }
        },
        mounted() {
            this.record();
            if (this.params && !this.params.phone) {
                this.params.phone = this.$store.getters.userInfo.user_tel;
            }
            setTimeout(() => {
                this.$refs.compCode.onfocus();
            }, 300);
        }
    }
</script>
