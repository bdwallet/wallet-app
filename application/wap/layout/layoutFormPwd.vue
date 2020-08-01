<template>
    <div class="layout-form form-main">
        <div class="label">{{label}}</div>
        <comp-input :placeholder="placeholder" v-model="pwd" :eye="true" Type="password" reg="^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]+$" @input="btnState = getPwd" />
        <comp-prompt>密码只能由数字和字母组成</comp-prompt>
        <comp-input class="nextbtn" :value="btnText" Type="button" @arrow="clickEvent" :status="btnState" />
    </div>
</template>

<script>
    import "./style";
    import compInput from '~components/compInput/input';
    import compPrompt from '~components/compPrompt';
    import PWD from "~script/PWD";
    export default {
        name: "layoutFormPwd",
        components: {
            compInput,
            compPrompt
        },
        data() {
            return {
                pwd: '', // 密码
                btnState: 0, // 按钮的可点击状态
                label: '为了您的账号安全，请设置登录密码', // 输入提示语
            }
        },
        props: {
            params: {
                type: Object,
                default: {}
            },
            placeholder: {
                type: String,
                default: "请设置6-16位登录密码"
            },
            btnText: {
                type: String,
                default: "下一步"
            },
        },
        computed: {
            getPwd() {
                return /^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]+$/.test(this.pwd)
            }
        },
        methods: {
            clickEvent() {
                let pwd = this.pwd,
                    ps = this.params;
                if (pwd && /^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{6,16}$/.test(pwd)) {
                    let pwdlock = PWD.lock(`p${pwd}p`, ps.phone);
                    let parmas = {
                        password: pwdlock,
                        type: 0 //0 设置密码 2找回密码
                    };
                    if(ps.code){ //如果有code值 则为找回、修改密码
                        parmas.type = 2;
                        parmas.old_password = ps.code;
                        parmas.phone = ps.phone;
                    }
                    Ajax.post(Api.apply.set_pwd, parmas).then(r => {
                        let s = r.data.status;
                        if (s == 1) { //验证成功，设置、修改密码
                            this.$emit('next', {
                                next: 4
                            }); //设置、修改密码成功，进行下一步头像验证
                        } else { // 设置、修改密码失败
                            let msg = '';
                            if(s == -30005){
                                this.$dialog.tip("新密码不能与旧密码相同");
                            }else{
                                this.$dialog.alert(r.message).then(() => {
                                    this.$emit('next', {
                                        next: 1
                                    });
                                });
                            }
                            
                        }
                    });
                } else {
                    this.$dialog.tip("密码需由6-16位的数字和字母组成");
                }
            }
        },
        mounted() {
            this.params.code ? this.label = "为了您的账号安全，请重新设置登录密码" : this.label;
        }
    }
</script>
