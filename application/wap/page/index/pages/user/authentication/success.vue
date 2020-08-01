<template>
    <div class="authentication-success">
        <p class="title">获得实名认证200黑钻待释放积分</p>
        <div class="card">
            <img :src="$assets.barCode" class="img">
            <div class="user-info">
                <div class="com-rect">
                    <div class="user-head"><i class="icon icon-Path2"></i></div>
                </div>
                <div class="card-right">
                    <p><label for="name">真实姓名:</label>{{idcert.idcert_name}}</p>
                    <p><label for="type">证件类型:</label>身份证</p>
                    <p><label for="card">身份证号码:</label>{{idcert.idcert_num}}</p>
                </div>
            </div>
            <div class="stamp">
                <div class="border-1">
                    <div class="border-2">
                        <span>已通过</span><i class="icon icon-shixing"></i>
                    </div>
                </div>
            </div>
        </div>
        <comp-prompt>释放规则</br>通过实名认证后，从次日起的100天内登录【访问任务中心即视为登录；若100天内某日未登录，则视为放弃当日奖励】，可获得2黑钻积分【可于钱包-待释放明细里查看，30天后将成功释放】，累计200黑钻积分。若您邀请的好友完成实名认证任务，该好友从次日起的100天内登录【对方访问任务中心才视为登录】，您也可额外获得1黑钻/天的登录积分。</comp-prompt>
    </div>
</template>

<script>
    import compPrompt from '~components/compPrompt';
    export default {
        name: 'authenticationSuccess',
        components: {
            compPrompt
        },
        computed:{
            idcert(){
                return this.$store.getters.userInfo.idcert_info;
            }
        }
    }
</script>
