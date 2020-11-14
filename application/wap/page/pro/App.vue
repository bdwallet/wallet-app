<template>
	<div class="hz-pro">
		<div class="follow">
			<div class="follow-left left">
				<div class="follow-logo left" :style="{'background-image':`url(${$assets.logo2})`}"></div>
				<div class="follow-desc left">
					<p class="p1">黑钻评级</p>
					<p class="p2">全球首家“评审团”式区块链评级社区</p>
				</div>
			</div>
			<div class="follow-btn right" @click="showCode">立即下载</div>
		</div>
		<div class="left-container">
			<div class="item pro-info">
				<div class="pro-head" v-if="item_data && item_data.item_id">
					<img class="left" :src="item_data && item_data.item_logo ? item_data.item_logo : $assets.proItemNone">
					<div class="pro-name left">{{item_data.item_cn_name }}<span v-if="item_data.item_urrency_abbreviation&&item_data.item_cn_name">/</span>{{item_data.item_urrency_abbreviation}}</div>
				</div>
				<div class="pro-box">
					<div class="box-top">
						<div class="left pro-left">
							<div class="pro-score left">
								<span v-if="item_data&&item_data.item_id&&(item_data.item_user_num>=5)">{{currentScore.toFixed(1)}}</span>
								<span v-else>—</span>
							</div>
							<div class="pro-star left">
								<div class="pro-star-score">黑钻评分</div> 
								<ul class="xingxing">
									<li v-for="item in [1,2,3,4,5,6,7,8,9,10]" :key="item">
										<i v-if="item_data&&item_data.item_id&&(item_data.item_user_num>5)" :class="['icon' ,getIcon(item_data.item_grade,item),{'current':currentScore.toFixed()>=item}]"></i>
										<i v-else class="icon icon-shixing"></i>
									</li> 
								</ul>
								<div class="pro-desc">
									<!-- <span v-if="item_data&&item_data.item_id&&(item_data.item_user_num<5)">该项目暂无评分</span>
									<span v-else-if="item_data&&item_data.item_id&&(item_data.item_user_num>5)">基于{{item_data&&item_data.item_user_num}}位超级评审员的专业评级</span>
									<span v-else>抱歉,黑钻评级暂未收录该项目</span> -->
									<span v-if="!item_data||(item_data.item_user_num==0)">该项目暂无评分</span>
									<span v-else-if="item_data&&item_data.item_id&&(item_data.item_user_num>0&&item_data.item_user_num<5)">该项目评级太少，暂无评分</span>
									<span v-else-if="item_data&&item_data.item_id&&(item_data.item_user_num>=5)">基于{{item_data&&item_data.item_user_num}}位超级评审员的专业评级</span>
									<span v-else>抱歉,黑钻评级暂未收录该项目</span>
								</div> 
							</div>
						</div>
						<div class="left pro-center" v-if="item_data&&item_data.item_id&&(item_data.item_user_num>=5)"></div>
						<div class="right pro-right"  v-if="item_data&&item_data.item_id&&(item_data.item_user_num>=5)">
							<div class="pro-item">
								<div class="left score-interval">8-10分</div>
								<div class="left score-img">
									<div class="score-bg"></div>
									<div class="score-draw"  ref="draw1"></div> 
								</div>
							</div>
							<div class="pro-item">
								<div class="left score-interval">4-7分</div>
								<div class="left score-img">
									<div class="score-bg"></div>
									<div class="score-draw"  ref="draw2"></div>
								</div>
							</div>
							<div class="pro-item">
								<div class="left score-interval">1-3分</div>
								<div class="left score-img">
									<div class="score-bg"></div>
									<div class="score-draw"  ref="draw3"></div>
								</div>
							</div>
						</div>
					</div>
					<div class="box-center">
						<div v-if="item_data&&item_data.item_id&&!(item_data.read_num==0)"><i class="icon icon-renkanguo"></i><span>{{item_data.read_num}}人看过</span></div>
					</div>
					<div class="box-linethrough"></div>
					<div class="box-bottom">
						<div class="title">
							<i class="icon icon-shixing"></i>
							<span>黑钻评分</span>
						</div>
						<div class="intro-txt">
							1000名投资经验丰富的超级评审员，本着真实客观的原则，从项目、团队、生态建设、项目进展、代币经历等维度考量，评出的综合评分。
						</div>
					</div>
				</div>
			</div>
			<div class="item ratings">
				<div class="title">
					<i class="icon left icon-wenzhang-"></i>
					<div class="left">
						<span>精彩评级</span>
					</div>
					<div class="pub-btn right" @click="showCode">发评级,赚黑钻</div>
				</div>
				<div class="line-through"></div>
				<div  class="content-box" v-for="item in grade_data" :key="item"  v-if="grade_data && grade_data.length > 0">
					<div class="avatar">
						<div class="avatar-left left">
							<div class="photo left"><img :src="item.user_photo"></div>
							<div class="data left">
								<div class="name">{{item.user_name}}</div>
								<div class="time">{{Dater(item.grade_create_time).format('MM-DD hh:mm')}}</div>
							</div>
						</div>
						<div class="right">{{item.grade_score}}分</div>
					</div>
					<p class="content">{{item.grade_content}}</p>
					<div class="action" style="display: none;">
						<div class="pro-type left">{{item_data.item_urrency_abbreviation}}</div>
					</div>
					<div class="line-through"></div>
				</div>
				<div class="no-grade" v-if="!(grade_data && grade_data.length > 0)&&!loading">
					<img src="https://heizuan.oss-cn-shenzhen.aliyuncs.com/h5images/pro-grade-none2.png"> 
					<div v-if="!item_data">抱歉，我们暂未收录该项目</div>
					<div v-else-if="item_data&&item_data.item_id&&(item_data.item_user_num==0)">抱歉，该项目暂无评级内容</div>
				</div>
			</div>
			
			<div class="item ratings" v-if="other_grade_data && other_grade_data.length > 0">
				<div class="title">
					<!-- <i class="icon left icon-wenzhang-"></i> -->
					<div class="left other_grade">
						<span>其他项目评级</span>
					</div>
					<!-- <div v-if="!grade_data.length > 0" class="pub-btn right" @click="showCode">发评级,赚黑钻</div> -->
				</div>
				<div class="line-through"></div>
				<div  class="content-box" v-for="item in other_grade_data" :key="item">
					<div class="avatar">
						<div class="avatar-left left">
							<div class="photo left"><img :src="item.user_photo"></div>
							<div class="data left">
								<div class="name">{{item.user_name}}</div>
								<div class="time">{{Dater(item.grade_create_time).format('MM-DD hh:mm')}}</div>
							</div>
						</div>
						<div class="right">{{item.grade_score}}分</div>
					</div>
					<p class="content">{{item.grade_content}}</p>
					<div class="action">
						<div class="pro-type left">{{item.item_urrency_abbreviation}}</div>
					</div>
					<div class="line-through"></div>
				</div>
			</div>

			<div class="wxcode">
				<div class="wxcode-box">
					<div class="wxcode-bg">
						<!-- <img :src="item_data&&item_data.item_qrcode?item_data.item_qrcode:'https://heizuan.oss-cn-shenzhen.aliyuncs.com/images/download.jpg'" /> -->
						<img src="https://heizuan.oss-cn-shenzhen.aliyuncs.com/images/download.jpg" />
					</div>
					<div class="wxcode-text">
						<h3>下载"<span>黑钻评级</span>"APP</h3>
						<p>尽享产品完整体验</p>
					</div>
				</div>
			</div>
		</div>
		<div class="right-container">
			<div class="item">
				<div class="title">
					<i class="icon icon-qitaxiangmupingfen"></i>
					<span>其他项目评级</span>
					<span class="more right" @click="showCode">更多<i class="icon icon-shouhui"></i> </span>
				</div>
				<div class="line-through"></div>
				<div class="recommend">
					<div class="recommend-list" v-for="item in rand_item_data" :key="item">
						<img :src="item.item_logo">
						<div>{{item.item_urrency_abbreviation||item.item_cn_name}}</div>
						<div class="score">{{item.item_grade}}分</div>
					</div>
				</div>
			</div>
			<div class="item">
				<div class="title">
						<i class="icon icon-guanyupingji"></i>
						<span>关于黑钻评级</span>
				</div>
				<div class="line-through"></div>
				<div class="desc-txt">
					<p>黑钻评级是全球首家"评审团"式区块链评级社区。我们秉持着中立、客观、透明、开放的原则组建黑钻超级评审团，给用户提供专业、权威、真实的评级报告。</p>
					<p>超级评审团有1000名区块链资产持仓20万元以上、交易经验超过2年的超级评审员组成，他们将对同一项目进行多维度评析，生成1000份客观全面的社区化综合评级，并可随项目发展及时修正。</p>
					<p>加入超级评审团，可享区块链行业顶尖资源，增加个人品牌曝光、提升行业话语权，黑钻平台分红等多重权益，超级评审团仅剩17席，赶快申请吧！</p>
				</div>
				<div class="join" @click="showCode('application')">申请加入超级评审团</div>
			</div>
			<div class="item">
				<div class="title">
					<i class="icon icon-lianxiwomen_icon"></i>
					<span>联系我们</span>
				</div>
				<div class="line-through"></div>
				<div class="codeimg">
					<div class="codeimg-list">
							<!-- <img :src="(item_data&&item_data.item_qrcode)||'https://heizuan.oss-cn-shenzhen.aliyuncs.com/images/download.jpg'"> -->
							<img src="https://heizuan.oss-cn-shenzhen.aliyuncs.com/images/download.jpg" />
							<div class="codeimg-txt">
								<p>下载 "黑钻评级" APP</p>
								<p>尽享产品完整体验</p>
							</div>
							<div class="line-through"></div>
					</div>
					<div class="codeimg-list">
							<img src="https://heizuan.oss-cn-shenzhen.aliyuncs.com/h5images/kefucode.png">
							<div class="codeimg-txt">
								<p>商务合作</p>
							</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 浮动关注按钮 -->
		<div class="float-btn" @click="showCode"><img :src="$assets.proFloatBtn" /></div>
		
		<!-- 二维码弹框 -->
		<div v-show="showDialog" class="wxcode-dialog">
			<div class="wxcode-box" :style="{'background-image':`url(${$assets.proWxcodeBg})`}">
				<div class="wxcode-bg"><img :src="qr_code_url" /></div>
				<div v-if="qr_code_type==0" class="wxcode-text">
					<h3>下载"<span>黑钻评级</span>"APP</h3>
					<p>尽享产品完整体验</p>
				</div>
				<div v-else class="wxcode-text">
					<h3>添加黑钻评级管理员微信</h3>
					<p>申请成为超级评审员</p>
				</div>
			</div>
			<div class="wxcode-close-btn" @click="showDialog=false;">
				<i class="icon icon-dianji"></i>
			</div>
		</div>
	</div>
</template>
<script>
	import Dater from "~script/dater";
	import parameter from '@helper/parameter';
	import localStore from '~script/localStore';
	const name = 'hz-pro';
	export default {
		name,
		components: {},
		data() {
			return {
				grade_id: 0,
				grade_data: [],
				other_grade_data:[],
				item_data: {},
				rand_item_data: [],
				about_intro: "",
				showDialog:false,
				currentScore: 0,
				qr_code_url: '',
				qr_code_type:0,
				defaulticon: 'icon-shixing',
				loading: true,
			}
		},
		methods: {
			Dater,
			showCode(val){
				this.showDialog = true; 
				if(val != 'application'){
					this.qr_code_type = 0;
					this.qr_code_url = 'https://heizuan.oss-cn-shenzhen.aliyuncs.com/images/download.jpg';
				}else{
					this.qr_code_type = 1;
					this.qr_code_url = 'https://heizuan.oss-cn-shenzhen.aliyuncs.com/h5images/kefucode.png';
				}
			},
			getIcon(item_grade,item){
				let grade = item_grade;
				return Number(item_grade).toFixed()==item&&Number(item_grade)<item? this.defaulticon:'icon-shixing';
			},
			animate(item_data){
				let _this = this;
					setTimeout(function(){
						if(_this.$refs.draw1){
								_this.$refs.draw1.style.width = _this.item_data.item_statistics[2]*100+'%';
								_this.$refs.draw2.style.width = _this.item_data.item_statistics[1]*100+'%';
								_this.$refs.draw3.style.width = _this.item_data.item_statistics[0]*100+'%';
						}
					})
			  let grade = item_data&&item_data.item_grade;
				if(grade){
					let timer = setInterval(function(){
						if(Number(grade).toFixed()<=_this.currentScore.toFixed()){
							_this.defaulticon = 'icon-banxing';
							clearInterval(timer);
						}else{
							if(Number(grade).toFixed()<=_this.currentScore+1){
								_this.currentScore = Number(grade);
							}else{
								_this.currentScore++;
							}
						}
					},100);
				}
			}
		},
		mounted() {
			const history_url = localStore.get('history_url') || "";
			let current_url = location.href;
			this.grade_id = parameter('id', location.href);
			let c_url = parameter('c_url', location.href);
			let params = {
				item_id: this.grade_id
			};
			if (c_url && history_url != current_url) {
				params.c_url = c_url;
				localStore.set("history_url", current_url, 30000);
			}
			Ajax.get(Api.apply.get_grade_publicity, params).then(res => {
				this.grade_data = res.data.grade_data;
				this.other_grade_data = res.data.other_grade_data;
				this.item_data = res.data.item_data;
				this.about_intro = res.data.about_intro;
				this.rand_item_data = res.data.rand_item_data;
				this.animate(res.data.item_data);
				this.loading = false;
			})
		},
	}
</script>

<style src="./style" lang="less">

</style>