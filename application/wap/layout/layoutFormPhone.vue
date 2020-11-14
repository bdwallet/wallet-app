<template>
    <div class="layout-form">
        <div class="label" v-if="label">{{label}}</div>
        <comp-input :placeholder="placeholder" v-model="phone" Type="tel" reg="^[1][0-9]{10}$" @input="btnState=getPhone.length==11" />
        <!-- <comp-input v-if="invite" placeholder="请输入邀请码（可选）" v-model="code" style="margin-top:.5rem;" /> -->
        <comp-input class="nextbtn" :value="btnText" Type="button" @arrow="clickEvent" :status="btnState" />
    </div>
</template>

<script>
    import "./style";
    let compInput = undefined;
    //console.log(Service);
    if(1){
        compInput = require('~components/compInput/input');
        //compInput = require('~appcomps/compInput/input');
    }else{
        compInput = require('~components/compInput/input');
    }
    // import compInput from '~components/compInput/input';
    export default {
        name: 'layoutFormPhone',
        components: {
            compInput
        },
        props: {
            label: '',
            params: Object,
            placeholder: {
                type: String,
                default: "请输入手机号"
            },
            btnText: {
                type: String,
                default: "下一步"
            },
            invite:{
                type: Number,
                default: 0
            },
        },
        data() {
            return {
                phone: '', //电话号码
                //code:'', //邀请码
                btnState: 0, //按钮的可点击状态
            }
        },
        computed: {
            getPhone() {
                return this.phone.replace(/\s/g, ''); //去除组件传出的值有空格问题
            }
        },
        methods: {
            //点击事件处理
            clickEvent() {
                // if(this.code){
                //     let code = Service.CheckInviteCode(this.code);
                //     if(!code){
                //         this.$dialog.tip('请填写正确的邀请码');
                //         return;
                //     }
                // }
                let phone = this.getPhone;
                let ps = this.params;
                let type = (ps && ps.type) ? ps.type : 1;
                if (phone && /^[1][0-9]{10}$/.test(phone)) {
                    Service.Proving(type,phone).then(r => {
                        if(r.data.status == 1)
                            this.$emit('next', {
                                next: 2, //业务流程 2：进入验证码输入
                                type: r.data.type, //0新用户登录 1老用户登录
                                phone,
                                //inviteCode:this.code
                            });
                        else
                            this.$dialog.alert(r.message);
                    });
                } else {
                    this.$dialog.tip("请输入正确的手机号");
                }
            },
        }
    }
</script>