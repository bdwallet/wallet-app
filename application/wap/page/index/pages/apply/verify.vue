<template>
	<div class="apply-verify">
		<div class="verfing">
			<img :src="$assets.aplicaApling">
			<div class="title">
				您的资料正在审核中
			</div>
			<div class="reason">预计3个工作日,请耐心等</div>
			<div class="goback"  @click="$router.push({path:'/user/main'})">返回个人中心</div>
			<div class="fixbottom">
				如有疑问,请关注黑钻评级微信公众号进行反馈
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default {
		name: 'apply-verify',
		components:{},
		data(){
			return{
				
			}
		},
		mounted(){
			Share.Ready();
		}
	}
</script>