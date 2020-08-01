<template>
	<div class="redpack-awardloss">
		<act-panel class="mycards" :style="{'backgroundImage':`url(${$assets.redpackAwardlossBg})`}">
			<div class="atten">没中奖别着急,关注黑钻评级公众号 回复"空投"领项目方大礼包</div>
			<img class="imgcode" :src="$assets.redpackHzpj">
		</act-panel>
		<act-panel class="strategy">
			<div class="sprites-activity-txt2"></div>
			<div class="pro-title">
				<div class="left-icon"></div>
				<div class="center">每日任务</div>
				<div class="right-icon"></div>
			</div>
			<ul class="pros-box">
				<li class="pro">
					<div class="pro-icon sprites-icon-like"></div>
					<div class="pro-txt">勤写评级接财神,财运亨通（1/3）</div>
					<div class="pro-btn" :class="'ok'">财神到</div>
				</li>
				<li class="pro">
					<div class="pro-icon sprites-icon-login"></div>
					<div class="pro-txt">点赞请财神,财源广进（0/1）</div>
					<div class="pro-btn" :class="'ok'">福临门</div>
				</li>
				<li class="pro">
					<div class="pro-icon sprites-icon-write"></div>
					<div class="pro-txt">每日登录得财神 ,家财万贯（1/1）</div>
					<div class="pro-btn" :class="'ok'">阖家欢</div>
				</li>
			</ul>
			<div class="pro-title">
				<div class="left-icon"></div>
				<div class="center">赏金任务</div>
				<div class="right-icon"></div>
			</div>
			<ul class="pros-box">
				<li class="pro">
					<div class="pro-icon sprites-icon-down1"></div>
					<div class="pro-txt">下载黑钻评级安卓版app并绑定手机号+3</div>
					<div class="pro-btn" :class="'ok'">财神到</div>
				</li>
				<li class="pro">
					<div class="pro-icon sprites-icon-down2"></div>
					<div class="pro-txt">下载eos钱包绑定账号 +3</div>
					<div class="pro-btn" :class="'ok'">福临门</div>
				</li>
				<li class="pro">
					<div class="pro-icon sprites-attention-btn"></div>
					<div class="pro-txt">关注Pureland公众号 +3</div>
					<div class="pro-btn" :class="'ok'">阖家欢</div>
				</li>
			</ul>
		</act-panel>
		<div class="sprites-yellow-bgbtn" @click="$router.push('/')">发现优质区块链项目</div>
	</div>
</template>
<script>
	import actPanel from './actPanel';
	export default {
		name: 'redpack-awardloss',
		components: {
			actPanel,
		},
		data() {
			return {}
		},
		mounted() {
			Share.Ready({
				imgUrl: this.$rpshare.sharelogo,
				title: '新年不做大猪蹄子，先来黑钻评级领空投！',
				desc: this.$rpshare.getdesc(this.$route.params.id),
				link: `${this.$global.host}/acts/${this.$route.params.id}/redpack/actend`,
			});
		}
	}
</script>