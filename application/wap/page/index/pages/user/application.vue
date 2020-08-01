<template>
  <div class="user-apply">
    <div class="user-apply-top"><img :src="$assets.userApplyTop" /></div>
    <div class="user-apply-center">
      <div class="line"></div>
      <div class="main-box">
        <div class="content">黑钻评级为打破传统评级中心化的弊端，通过组建超级评审团的方式对项目进行评级。超级评审员仅招募<span>1000</span>位，加入时有严格的条件限制，加入后有定期的资质考察。(仅超级评审员才能发布评级)</div>
        <h1 class="title"><i class="icon icon-biaotizhuangshi"></i>超级评审员特权<i class="icon icon-biaotizhuangshi rotate-180"></i></h1>
        <ul class="interest">
          <li><div class="item-icon"><img :src="$assets.userApplyIcon1" /></div><div class="item-con"><h3>黑钻TOKEN</h3><p>黑钻平台分红权益通证</p></div></li>
          <li><div class="item-icon"><img :src="$assets.userApplyIcon2" /></div><div class="item-con"><h3>顶层资源共享</h3><p>区块链行业顶尖资源聚集</p></div></li>
          <li><div class="item-icon"><img :src="$assets.userApplyIcon3" /></div><div class="item-con"><h3>个人品牌</h3><p>提升行业话语权 增加币圈知名度</p></div></li>
        </ul>
        <h1 class="title"><i class="icon icon-biaotizhuangshi"></i>申请条件<i class="icon icon-biaotizhuangshi rotate-180"></i></h1>
        <div class="condition">
          <p>1.区块链资产持仓20万元以上</p>
          <p>2.交易经验超过2年以上</p>
          <p>3.客观公正，热爱分享对区块链项目的独到见解</p>
        </div>
      </div>
    </div>
    <div class="user-apply-btn"><div class="submit" @click="$router.push(path)">立即申请</div></div>
  </div>
</template>


<script>
  export default {
    name: "user-application",
    data() {
      return {
        path: ''
      }
    },
    computed: {
      uinfo(){
        return this.$store.getters.userInfo;
      },
      isLogin(){
        return (this.uinfo && this.uinfo.user_id) ? 1 : 0;
      }
    },
    methods: {
      getApplication(){
        if(!this.isLogin){//未登录
          this.path = '/login';
          return false;
        }
        if(this.uinfo.level==3){
            this.path = '/apply/success';
            return false;
          }
        this.$ajax.get(this.$api.apply.get_user_apply).then(res=>{
          // 审核状态:  0:未审核/审核中,1:审核通过,-1:未通过 
          if(res.status==1){
            if(!res.data.apply_data){
              this.path = '/apply/form';
            }else if(res.data.apply_data.apply_status ==- 1){
             //审核未通过
             this.path = '/apply/form';
            }else if(res.data.apply_data.apply_status == 0){
              if(res.data.apply_data.apply_wx_code){
                //审核中
                this.path = '/apply/verify';
              }else{
                //未审核
                this.path = '/apply/form';
              }
            }else if(res.data.apply_data.apply_status == 1){
              //审核成功
              this.path = '/apply/success';
            }else{
              this.path = '/apply/form';
            }
          }else{
            this.$dialog.alert({title:'系统消息',content:'未知错误',btns:['知道了']});
          }
          this.loading = false;

        }).catch(err=>{
          this.loading = false;
          this.$dialog.alert({title:'系统消息',content:'未知错误',btns:['知道了']});
        })
      }
    },
    created() {
    },
    mounted(){
      Share.Ready({
				title:'黑钻评级诚邀您加入超级评审团',
				desc:'加入超级评审员，即享分红权益、共建区块链百亿币资顶尖社区',
				link:location.href,
      });
      this.getApplication();
    }
  }
</script>
