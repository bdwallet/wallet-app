<template>
    <div class="comp-dataitem-pingji container" :class="{'grade-top':isTop}">
		<div class="grade-hot" v-if="isHot">精选</div>
		<div class="state" v-if="showState" @click="GotoDetail">{{`此${data.type==1?'爆料':'评级'}未通过审核，点击查看详情！`}}</div>
		<!-- 话题没有作者信息，展示话题标题 -->
		<comp-userinfo :source="data" />
		<!-- 展示话题标题 -->
		<div class="topic-title" v-if="data.type==2" @click="GotoDetail">{{data.title}}</div>
		<!-- 话题没有有“戳我查看” -->
		<p class="content" v-if="data.type==2" @click="GotoDetail">{{data.intro.substr(0,80)}}<b v-if="data.intro.length>80">...</b><span class="clc" v-if="data.url" @click.stop="$service.OpenUrl(data.url)">戳我查看<i class="icon icon-shouhui"></i></span></p>
		<p class="content" v-else @click="GotoDetail"><span v-if="data.pid>0" class="com-zhuiping">追评</span>{{data.intro.substr(0,80)}}<b v-if="data.intro.length>80">...</b></p>
		<!-- 单图与多图的展示方式不同 -->
		<div v-if="data.imgs&&data.imgs.length>0" class="rading-imgs" :class="{'plural':data.imgs.length>=2}">
			<img v-for="(src,i) in data.imgs" :key="i" :src="GetImgSrc(src,data.imgs.length)" @click="$service.ImagePreview(data.imgs,src,i)" />
		</div>
		<!-- 操作区域 -->
		<div class="pro-action">
			<!-- 爆料和公告标签面板 -->
			<div class="tag" v-if="data.type==1 || data.type==2">
				<ul>
					<li v-if="data.userlv==$global.userLevel.official" @click.stop="ShowTip">官方</li>
					<li v-else @click.stop="ShowTip">爆料</li>
					<li v-for="son in data.label" :key="son" v-if="son.label_name != '其它'" @click="$router.push(`/article/${son.label_item_id}?pro=${son.label_name}`)">{{son.label_name}}</li>
				</ul>
			</div>
			<!-- 交易所评级和项目评级标签面板 type 0:项目评级 4：公告 5：交易所评级 -->
			<div class="grade-label" v-if="[0,4,5].includes(+data.type)">
				<!-- 热榜 -->
				<div v-if="data.grade_top" class="audit-state grade-hotlist-label" @click="GotoHotlist">
					<div class="pro-name">热榜</div>
				</div>
				<!-- 项目详情页的评级列表展示 -->
				<div v-if="$route.query.pro" class="audit-state-2">
					<div class="pro-name">{{$route.query.pro}}</div>
				</div>
				<!-- 其它列表页的展示 -->
				<div v-else class="audit-state" @click="GotoProject">
					<div class="pro-logo"><img :src="data.logo" /></div>
					<div class="pro-name">{{data.urrency}}<span v-if="data.urrency&&data.cn">/</span>{{data.cn}}<span v-if="data.score>0">:{{data.score}}分</span></div>
				</div>
			</div>
			<!-- 操作按钮 -->
			<div class="actions">
				<!-- 点赞 -->
				<comp-liketool class="item" :number="data.like_num" :status="data.is_like" :type="data.type" :id="data.id" />
				<!-- 评论 -->
				<div class="item" @click="GotoDetail">
					<i class="icon icon-huifu"></i>
					<span class="number">{{data.comment_num}}</span>
				</div>
				<!-- 删除/置顶/追评 -->
				<div class="item" v-if="isSelf" @click.stop="OpenActionPannel">
					<i class="icon icon-more"></i>
					<!-- 追评小红点，产品说鸡肋 -->
					<!-- <i class="icon icon-more"><i class="com-bit" v-if="data.is_append==1"></i></i> -->
				</div>
				<!-- 分享 -->
				<!-- <div class="item" @click.stop="ShareList(data)">
					<i class="icon icon-fenxiang"></i>
					<span class="text">分享</span>
				</div> -->
			</div>
		</div>
    </div>
</template>

<script>
    import mixin from './mixin';
	import compUserinfo from "~components/compUserinfo";
	import compLiketool from '~components/compTools/compLiketool';
	export default {
        name:'compDataitemPingji',
		mixins: [mixin],
		components:{
			compUserinfo,
			compLiketool
		},
		computed:{
			//个人主页置顶状态判断
			isTop(){
				return this.data.user_top == 1 &&
					   this.index == 0 &&
					   this.$route.name=='user-homepage';
			},
			//精选状态判断
			isHot(){
				return this.data.is_hot == 1;
			},
			//是否显示审核未通过状态栏
			showState(){
				return this.isSelf && this.data.status == -1;
			},
			//置顶按钮方案
			btnText() {
				return this.data.user_top == 1 ? '取消置顶' : '置顶该内容';
			}
		},
		methods:{
			//拼接图片地址，做裁剪、压缩处理
			GetImgSrc(src, length) {
				src += length >= 2 ? '?x-oss-process=image/resize,m_fill,h_150,w_150' : '?x-oss-process=image/resize,m_lfit,h_210,w_210';
				return src;
			},
			//点击标签的提示弹窗
			ShowTip() {
				let lv = this.data.userlv;
				if (lv == this.$global.userLevel.official) {
					this.$dialog.alert("“官方”话题暂未对外开放。可点击官方账号头像进入黑钻评级官方主页，查看所有优质内容、官方活动");
				} else {
					this.$dialog.alert("“爆料”话题暂未对外开放。可通过首页-爆料频道，查看全部爆料信息");
				}
			},
			//删除评级
			DelRating() {
				let obj = this.data;
				if ((obj.is_hot && obj.is_hot == 1) || obj.status == 1) {
					this.$dialog.alert("发布内容已超过5分钟，不可再删除");
					return false;
				}
				this.$dialog.confirm({
					title: `您确定要删除此${+obj.type?'爆料':'评级'}？`,
					btns: ['删除', '取消']
				}).then(() => {
					this.$ajax.post(this.$api.apply.del_grade, {
						grade_id: obj.id,
						item_ad_name: obj.urrency ? obj.urrency : '',
					}).then(res => {
						if (res.data.status == 1) {
							this.dataList.splice(this.index, 1);
							this.$dialog.tip("删除成功");
							//改变个人主页上的统计数据 待处理
							//this.$emit('reduceNum', obj.type, obj.grade_anonymity, obj.status);
						} else {
							this.$dialog.alert({
								title: '系统消息',
								content: res.message,
								btns: ['好']
							});
						}
					});
				});
			},
			//置顶评级
			StickRating() {
				this.$dialog.hide();
				let obj = this.data;
				Ajax.post(Api.apply.grade_usertop, {
					grade_id: obj.id,
					type: obj.type
				}).then(res => {
					this.dataList[0].user_top = 0; //还原前一置顶状态
					let temp = this.dataList[this.index];
					temp.user_top = res.data;
					this.dataList.splice(this.index, 1);
					this.dataList.unshift(temp);
				}).catch(err => {
					this.$dialog.alert(err.message);
				});
			},
			//打开操作面板
			OpenActionPannel() {
				let btns = [{
					name: "删除该内容",
					action: this.DelRating
				}];
				if (this.data.explv >= 2) { //用户等级大于等于2，才能置顶内容
					btns.unshift({
						name: this.btnText,
						action: this.StickRating
					});
				}
				if (this.data.is_append == 1) { //可追评
					btns.push({
						name: '追评该内容',
						action: () => {
							this.$router.push(`/detail/${obj.type}/${obj.id}`);
						}
					});
				}
				this.$dialog.action(btns);
			},
		},
	}
</script>
