<template>
	<div class="article-introduction">
		<div class="project-intro container">
			<div class="content" v-if="data.intro">
				<span>{{DshowIntro?data.intro:(data.intro && data.intro.length > 100 ? data.intro.substr(0,100) : data.intro)}}</span>
				<span v-if="data.intro && data.intro.length > 100" class="expand" @click="DshowIntro=!DshowIntro">{{DshowIntro?'收起':'展开'}}</span>
			</div>
			<!-- 项目简介 -->
			<div class="info" v-if="scene == 2">
				<div class="info-item"  v-if="data.bourse_logo && data.bourse_cn_name && data.bourse_id" >
					<div class="sort-name">平台：</div>
					<div class="sort-item sort-cricle">
						<div class="sort-logo" @click="GoToExchOrPro(0, data.bourse_id, data.bourse_cn_name)">
							<img class="logo" :src="data.bourse_logo" alt="">
							<span class="name">{{data.bourse_cn_name}}</span>
						</div>
					</div>
				</div>
				<div class="info-item"><span class="sort-name">英文名：</span><span class="sort-item">{{data.item_en_name}}</span></div>
				<div class="info-item"><span class="sort-name">中文名：</span><span class="sort-item">{{data.item_cn_name==""?"—":data.item_cn_name}}</span></div>
				<div class="info-item"><span class="sort-name">发行时间：</span><span class="sort-item">{{data.item_issue_time==""?"—":data.item_issue_time}}</span></div>
				<div class="info-item"><span class="sort-name">总发行量：</span><span class="sort-item">{{dealNumber(data.item_total_circulation)}}</span></div>
				<div class="info-item"><span class="sort-name">上架交易所：</span><span class="sort-item">{{data.item_exchange==""?"—":data.item_exchange}}</span></div>
				<div class="info-item"><span class="sort-name">最新获投状态：</span><span class="sort-item">{{data.item_investment_status==1?'已上市':'未上市'}}</span></div>
				<div class="info-item"><span class="sort-name">最新投资机构：</span><span class="sort-item">{{data.item_investment_organization==""?"—":data.item_investment_organization}}</span></div>
				<div class="info-item"><span class="sort-name">官网：</span><span class="sort-item sort-break"><a href="javascript:void(0)" @click="link(data.item_official_web)" v-if="data.item_official_web">{{data.item_official_web}}</a><span v-else>—</span></span>
				</div>
				<div class="info-item"><span class="sort-name">白皮书：</span><span class="sort-item sort-break"><a href="javascript:void(0)" @click="link(data.item_white_book)" v-if="data.item_white_book">查看</a> <span v-else>—</span></span>
				</div>
			</div>
			<!-- 交易所简介 -->
			<div class="info" v-else>
				<div class="info-item" v-if="data.bourse_item_logo && data.bourse_item_name && data.bourse_item_score">
					<div class="sort-name">平台币：</div>
					<div class="sort-item sort-cricle" @click="GoToExchOrPro(1, data.bourse_item_id, data.bourse_item_name)">
						<div class="sort-logo">
							<img class="logo" :src="data.bourse_item_logo" alt="">
							<span class="name">{{data.bourse_item_name}}: {{data.bourse_item_score}}分</span>
						</div>
					</div>
				</div>
				<div class="info-item"><span class="sort-name">成立时间：</span><span class="sort-item">{{data.bourse_issue_time==""?"—":data.bourse_issue_time}}</span></div>
				<div class="info-item"><span class="sort-name">注册地：</span><span class="sort-item">{{data.bourse_issue_place==""?"—":data.bourse_issue_place}}</span></div>
				<div class="info-item"><span class="sort-name">币种数量：</span><span class="sort-item">{{data.bourse_item_num==""?"—":data.bourse_item_num}}</span></div>
				<div class="info-item"><span class="sort-name">交易对：</span><span class="sort-item">{{data.bourse_ob==""?"—":data.bourse_ob}}</span></div>
				<div class="info-item"><span class="sort-name">资金实力：</span><span class="sort-item">{{data.bourse_cash==""?"—":`￥${data.bourse_cash}亿`}}</span></div>
				<div class="info-item"><span class="sort-name">官网地址：</span><span class="sort-item sort-break"><a href="javascript:void(0)" @click="link(data.bourse_web)" v-if="data.bourse_web">{{data.bourse_web}}</a><span v-else>—</span></span></div>
				<div class="info-item" v-if="data.bourse_download.android || data.bourse_download.ios || data.bourse_download.pc">
					<div class="sort-name">下载地址：</div>
					<div class="sort-item sort-break">
						<div class="url" v-if="data.bourse_download.android">
							<a href="javascript:void(0)" @click="link(data.bourse_download.android)">{{data.bourse_download.android}}</a><span>(安卓)</span>
						</div>
						<div class="url" v-if="data.bourse_download.ios">
							<a href="javascript:void(0)" @click="link(data.bourse_download.ios)">{{data.bourse_download.ios}}</a><span>(IOS)</span>
						</div>
						<div class="url" v-if="data.bourse_download.pc">
							<a href="javascript:void(0)" @click="link(data.bourse_download.pc)">{{data.bourse_download.pc}}</a><span>(PC)</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="team-member container" v-if="data.figures&&data.figures.length">
			<div class="title">团队成员</div>
			<ul>
				<li v-for="(figuresItem,index) in data.figures" :key="index">
					<div class="userInfo">
						<div class="avatar"><img :src="(figuresItem.figure_user_photo||$assets.teamAvatardefault)+'?x-oss-process=image/resize,m_lfit,h_100,w_100'"></div>
						<div class="userintro">
							<div class="username">{{ figuresItem.figure_user_name }}</div>
							<div class="useroffice">{{ figuresItem.figure_user_job==""? "—":figuresItem.figure_user_job}}</div>
						</div>
					</div>
					<div class="intro-txt" v-if="figuresItem.figure_user_intro">
						<span>{{figuresItem.figure_user_intro}}</span>
						<span v-if="figuresItem.figure_user_intro&&figuresItem.figure_user_intro.length==100">
							<span class="expand" @click="getItemIntro('figures',2,data,index)">展开</span>
						</span>
						<span v-else-if="figuresItem.figure_user_intro&&figuresItem.figure_user_intro.length>100" class="expand" @click="getItemIntro('figures',1,data,index)">收起</span>
					</div>
				</li>
			</ul>
		</div>
		<div class="token-assign container" v-show="data&&data.item_token_distribution&&data.item_token_distribution.length">
			<div class="title">代币分配</div>
			<comp-pie :result="data.item_token_distribution" />
		</div>
	</div>
</template>

<script>
	import compPie from '~components/compTools/compPie';
	import {dealNumber} from '~script/money';

	export default {
		name: "article-introduction",
		components: {
			compPie,
		},
		props: {
			//1：交易所简介 2：项目简介
			scene:{
				default:1
			},
			data: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				DshowIntro:0, //简介内容的展开收起状态 0：收起状态 1：展开状态
				proid: 0,
			}
		},
		methods: {
			dealNumber,
			// app打开外部连接
			link(href){
				Service.OpenUrl(href)
			},
			// 交易所 和 项目 相互跳转
			GoToExchOrPro (type, id, name) {
				if(type == 0) this.$router.push({path:`/exchange/${id}`,query:{pro: name}});
				else this.$router.push({path:`/article/${id}`,query:{pro: name}});
			}
		},
		mounted(){
			if(this.data.bourse_id)
				this.data.intro = this.data.intro.replace(/<[^<>]+>/g,'');
		},
		activated(){
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
		}
	}
</script>
