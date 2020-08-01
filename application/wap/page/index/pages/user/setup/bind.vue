<template>
    <layout-frame :showhead="show" class="main" key="bind">
        <div v-if="comp" class="setup-bind">
            <component :is="comp" @next="Next" :params="compData" :label="label" />
        </div>
        <div v-else class="setup-rebind">
            <div class="head-area">
                <div class="head-icon"><img :src="this.$assets.bindCheck" /></div>
                <div class="head-text">您当前绑定的手机号为：{{tel}}</div>
            </div>
            <comp-input Type="button" value="更换手机号绑定" status="1" @arrow="SendSMS" />
        </div>
    </layout-frame>
</template>

<script>
    //import compPrompt from '~components/compPrompt';
    import compInput from '~components/compInput/input';
    import layoutFrame from '~layout/layoutFrame';
    import layoutFormPhone from '~layout/layoutFormPhone';
    import layoutFormCode from '~layout/layoutFormCode';
    export default {
        name: 'setup-bind',
        components: {
            layoutFrame,
            //compPrompt,
            compInput
        },
        data() {
            return {
                compData: undefined, //组件内数据传递载体
                comp: undefined, //动态组件载体
                show: 0, //是否展示头部logo
                bindType: 0, //绑定类型 0绑定 1换绑
            }
        },
        computed: {
            tel() {
                return this.$store.getters.userInfo.user_tel;
            },
            // 提示语
            label() {
                return this.bindType ? '请输入新的手机号：' : '请输入绑定的手机号：';
            }
        },
        methods: {
            //切换登录方式
            Change() {
                this.loginType = !this.loginType;
                if (this.loginType)
                    this.comp = layoutFormPhone;
                else
                    this.comp = layoutFormLogin;
            },
            //验证原手机号码
            SendSMS() {
                Service.Proving(4).then(r => {
                    this.compData = {type: 4};
                    this.GoCode();
                });
            },
            //进行下一步,获取组件内的数据
            Next(dt) {
                //data.next 2：进入短信验证业务流程；3：短信验证成功后业务流程；4:进入设置个人资料业务流程
                //data.type 0新用户登录 1老用户登录 2绑定手机业务流程
                //data.phone 手机号
                //data.code 获取短信需要的滑动验证码
                this.compData = Object.assign({}, this.compData, dt);
                this.show = 0;
                switch (dt.next) {
                    case 0: //绑定完成
                        this.Binded();
                        break;
                    case 1:
                        this.GoPhone();
                        break;
                    case 2:
                        this.GoCode();
                        break;
                    case 3:
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
            //绑定完成
            Binded(){
                Service.Update(this.compData.info);
                let url = this.$route.query.url;
                if(Global.isApp && Global.isPro){
                    mui.toast("绑定成功");
                    HZApp.Back();
                } else {
                    if(url)
                        this.$router.replace(url);
                    else
                        this.$router.go(-1);
                    setTimeout(() => {
                        this.$dialog.tip("绑定成功");
                    }, 200);
                }
            }
        },
        mounted() {
            this.bindType = !!this.tel;
            this.comp = !!this.tel ? undefined : layoutFormPhone; //初始绑定状态
            this.show = !!this.comp;
            this.compData = !!this.comp ? {type:3} : undefined;
            Share.Ready();
        },
    }
</script>