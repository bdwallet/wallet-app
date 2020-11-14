<template>
    <div class="setup-pay">
        <layout-frame :showhead="show" class="main" padding="0">
            <comp-prompt v-if="isSompVerCode" style="margin:0;padding: 0.4rem 0.75rem;" color="#333333" bgColor="rgba(255,166,120,.1)">{{hintText}}</comp-prompt>
            <div class="label" style="margin: 1rem 1rem 0.85rem;" v-if="isSompVerCode">{{label}}</div>
            <component :is="comp" @next="Next" @arrow="validatePwd" :params="compData" :amount="6" :type="1" margin="0 1rem" ref="verCode"/>
        </layout-frame>
    </div>
</template>

<script>
    import layoutFrame from '~layout/layoutFrame';
    import layoutFormCode from '~layout/layoutFormCode';
    import compPrompt from '~components/compPrompt';
    import compVerCode from '~components/compInput/code';
    import PWD from "~script/PWD";

    export default {
        name: 'setup-pay',
        components: {
            layoutFrame,
            compPrompt
        },
        data(){
            return{
                comp: undefined, //动态组件载体
                compData: {type: 7, scene: undefined}, //组件内数据传递载体   // scene:  1：校验短信  2：设置密码
                show: 0,
                isSompVerCode: 0,  
                isFirst: 1, // 0:再次输入支付密码  1:首次输入支付密码
                firstPwd: undefined,
            }
        },
        computed:{
            hintText(){
                return this.isPay? '为了您的账号安全，请设置无规律的6位数字。支付密码重置后，48小时内无法进行资金操作' : '为了您的账号安全，请设置无规律的6位数字。支付密码请牢记（忘记后再找回，会冻结资金操作48小时）';
            },
            label(){
                return this.isFirst? '请输入新的支付密码' : '请再次输入新的支付密码，进行确认';
            },
            tel(){
                return this.$store.getters.userInfo.user_tel;
            },
            isPay(){
				return this.$store.getters.userInfo.is_pay;
			}
        },
        methods:{
            Next(dt){
                this.compData = Object.assign({}, this.compData, dt);
                switch (dt.next) {
                    case 1:
                        this.GoCode();
                        break;
                    case 2:
                        this.GoPWD();
                        break;
                }
            },
            //短信验证
            GoCode() {
                this.isSompVerCode = 0;
                this.compData.scene = 0;
                this.comp = layoutFormCode;
            },
            // 设置密码
            GoPWD(){
                this.isSompVerCode = 1;
                this.compData.scene = 1;
                this.comp = compVerCode;
            },
            // 验证两次输入的密码
            validatePwd(pwd){
                console.log(pwd)
                if(this.isFirst) {
                    this.firstPwd = pwd;
                    this.isFirst = 0;
                    this.verCodeClear();
                }else{
                    if(this.firstPwd == pwd){
                        // 密码的第四五位插入两位虚位
                        let new_pwd = pwd.slice( 0 , 3 ) + Math.floor(Math.random()*10) + Math.floor(Math.random()*10) + pwd.slice( 3 );
                        let info = this.compData.info;
                        let set_data = {
                            'pay': PWD.lock(`y${new_pwd}y`, info.phone),
                            'code': PWD.unlock(info.louk_code, info.phone).substr(0, 4),
                            'code_type': this.isPay? 8 : 7
                        };
                        Ajax.post(Api.apply.set_user_info, {
                            type: 1,
                            scene: this.compData.scene, // 0：校验短信  1：设置密码
                            set_data: JSON.stringify(set_data)
                        }).then(this.success).catch(this.clear);
                        
                    }else{
                        this.$dialog.tip('两次输入的密码不一致');
                        this.isFirst = 1;
                        this.verCodeClear();
                    }
                }                     
            },
            // 密码输入并清空
            verCodeClear(){
                this.$refs.verCode.clear();
                this.Next({next: 2});
            },
            success(r){
                let s = r.data.status;
                if(s == 1){
                    if(Global.isApp && Global.isPro){
                        HZApp.Back()
                    }else {
                        this.$router.go(-1);
                    }
                    Service.Update({is_pay:1});
                    setTimeout(() => {
                        this.$dialog.tip(r.message);
                    }, 200)
                }else{
                    this.clear(r);
                }
            },
            clear(r){
                this.$dialog.tip(r.message);
            }
        },
        mounted(){
            this.GoCode();
        }
    }
</script>

