<template>
    <div class="layout-form">
        <comp-input placeholder="请输入手机号" v-model="phone" Type="tel" reg="^[1][0-9]{10}$" />
        <comp-input placeholder="请输入密码" v-model="pwd" :eye="1" Type="password" style="margin-top:.5rem;" />
        <comp-input class="nextbtn" value="登录" Type="button" @arrow="clickEvent" :status="btnState" />
    </div>
</template>

<script>
    import "./style";
    import compInput from '~components/compInput/input';
    import PWD from '~script/PWD';
    export default {
        name: 'layoutFormLogin',
        components:{compInput},
        props: {
            label: '',
        },
        data() {
            return {
                phone: '', //手机号
                pwd: '', //密码
            }
        },
        computed: {
            getPhone() {
                return this.phone.replace(/\s/g, ''); //去除组件传出的值有空格问题
            },
            //按钮状态
            btnState() {
                if(Global.appScenc != 1) return 1; //用于测试免输密码快捷登录的需求
                return this.getPhone.length == 11 && this.pwd ? 1 : 0;
            }
        },
        methods: {
            //点击事件处理
            clickEvent() {
                let phone = this.getPhone;
                if (phone && /^[1][0-9]{10}$/.test(phone)) {
                    let pwd = this.pwd;
                    // if(Global.appScenc != 1) pwd = 'qwe123'; //用于测试免输密码快捷登录的需求
                    let params = {
                        phone: phone,
                        password: PWD.lock(`p${pwd}p`,phone),
                        scene: 0 //0密码登录，1验证码登录
                    };
                    if(Global.isApp && Global.isPro) {
                        params.deviceid = plus.device.uuid || 1;
                    }
                    Ajax.post(Api.apply.user_login, params).then(r => {
                        if (r.data.status == 1) { //校验正确
                            this.$emit('next', {
                                next: 3,
                                info: r.data.user_data
                            }); //短信验证成功，进入下一步业务流程
                        } else { //校验错误
                            this.$dialog.alert(r.message);
                        }
                    }).catch(err => { //校验错误
                        this.$dialog.alert(err.message);
                    });
                } else {
                    this.$dialog.tip("请输入正确的手机号");
                }
            },
        }
    }
</script>
