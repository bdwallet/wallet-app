<template>
    <div class="comp-dialog" :class="{'active': state == 1, 'hidden': state == 2}" @touchmove.prevent="TouchMove">
        <div class="dialog comp-paypwd">
            <div class="dialog-head">
                <div class="paypwd-title">请输入支付密码</div>
                <div class="paypwd-content">
                    <comp-code ref="arrow" :amount="6" :type="1" @arrow="getValidate"/>
                    <div class="paypwd-tip">{{tip}}</div>
                </div>
                <span class="paypwd-forget" @click.stop="forgetPayPwd">忘记密码</span>
            </div>
        </div>
    </div>
</template>

<script>
    import compCode from '~components/compInput/code';
    import PWD from '~script/PWD';
    export default {
        name: "payPwd",
        components:{
            compCode
        },
        data(){
            return{
                tip: '', // 错误提示语
                state: 0,
                tel: '', // 电话号码
            }
        },
        methods:{
            show(tel) {
                Backdrop.show(this.destroy);
                this.tel = tel;
                this.state = 1;
                return new Promise((resolve, reject) => {
                    this.$on('success', (res) => {
                        this.hide();
                        resolve(res)
                    });
                });
            },
            hide() {
                Backdrop.hide();
                this.destroy()
            },
            //重置密码跳转
            forgetPayPwd(){
                //this.$emit("success",2);
                this.$service.OpenUrl('/user/setup');
            },
            //获取输入数据
            getValidate(val) {
                // 密码的第四五位插入两位虚位
                val = val.slice( 0 , 3 ) + Math.floor(Math.random()*10) + Math.floor(Math.random()*10) + val.slice( 3 );
                let params = {
                    pay: PWD.lock(`y${val}y`,this.tel)
                };
                Ajax.post(Api.apply.check_pay,params).then(res => {
                    if(res.data.status == 1){
                        this.tip = '';
                        this.$emit("success",1)
                    } else {
                        switch (res.data.status) {
                            case -60000:
                                this.tip = "未设置支付密码";
                                break;
                            case -60001:
                                this.tip = "今日连续输错已达5次，请明日再试";
                                break;
                            default:
                                this.tip = "密码错误，请重新输入";
                                break;
                        }
                        this.$refs.arrow.clear()
                    }
                })
            },
            TouchMove(e){
                e && e.preventDefault();
            },
            destroy() {
                this.state = 2;
                setTimeout(() => {
                    this.state = 0;
                    this.$destroy()
                }, 300);
            }
        },
        destroyed() {
            let parent = this.$el.parentNode;
            parent.removeChild(this.$el);
        },
    }
</script>

<style lang="less" scoped>
    .comp-paypwd{
        width: e("calc(100vw - 1.95rem)");
        font-family:PingFangSC-Regular !important;
        font-weight: 400;
        font-size: .7rem;
        .paypwd-title{
            color: #333;
            font-size: .9rem;
            margin-bottom: 1.175rem;
            font-weight:400;
        }
        .paypwd-content{
            .paypwd-tip{
                height: 1rem;
                margin-top: .5rem;
                text-align: left;
                color: #FF7270;
            }
        }
        .paypwd-forget{
            margin-top: .7rem;
            color: #888
        }
    }
</style>
