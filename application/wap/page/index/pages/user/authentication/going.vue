<template>
    <div class="auth-going">
        <com-going :options="options"/>
    </div>
</template>
<script>
    import comGoing from '~components/comGoing'
    export default {
        name: "auth-going",
        components:{
            comGoing
        },
        data(){
            return {
                options: {
                    title: '您提交的实名认证正在审核中',
                    reason: '即将获得200实名认证释放黑钻积分<br/>请您耐心等待....'
                }
            }
        }
    }
</script>
