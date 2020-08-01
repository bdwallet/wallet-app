<template>
    <div class="setup-pwd">
        <layout-frame :showhead="show" class="main">
            <component :is="comp" @next="Next" :params="compData" label="当前的手机号:" />
        </layout-frame>
    </div>
</template>

<script>
    import layoutFrame from '~layout/layoutFrame';
    import layoutFormPhone from '~layout/layoutFormPhone';
    import layoutFormCode from '~layout/layoutFormCode';
    import layoutFormPwd from '~layout/layoutFormPwd';
    export default {
        name: 'setup-pwd',
        components: {
            layoutFrame,
        },
        data() {
            return {
                compData: {type:2}, //组件内数据传递载体 type:2 修改、找回密码
                comp: layoutFormPhone, //动态组件载体
                show: 1, //是否展示头部logo
            }
        },
        methods: {
            //进行下一步,获取组件内的数据
            Next(dt) {
                //dt.next 2：进入短信验证业务流程；3：短信验证成功后业务流程；4:进入设置个人资料业务流程
                //dt.type 0新用户登录 1老用户登录 2绑定手机业务流程
                //dt.phone 手机号
                //dt.code 获取短信需要的滑动验证码
                this.compData = Object.assign({}, this.compData, dt);
                this.show = 0; //隐藏头部
                switch (dt.next) {
                    case 1:
                        this.GoPhone();
                        break;
                    case 2:
                        this.GoCode();
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
                this.comp = layoutFormCode;
            },
            //进入新用户设置密码业务流程
            GoPWD() {
                this.comp = layoutFormPwd;
            },
            //登录成功后离开
            Leave(){
                this.$router.go(-1);
                this.$destroy();
                setTimeout(() => {
                    this.$dialog.tip("密码修改成功");
                }, 200);
            }
        },
        mounted() {
            Share.Ready();
        }
    }
</script>