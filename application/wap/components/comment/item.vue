<template>
	<div class="comp-list-item">
		<comp-userinfo :source="obj" size="94" centerMarginLeft=".6rem" :showfloor="floor" :author="obj" />
		<div class="wrap">
			<!-- 评论详情页回复显示 START -->
            <div class="content detail" v-if="obj.isDetail">
                <div class="content-txt">
                    <span><span v-if="obj.reply_name">回复 </span><b v-if="obj.reply_name">{{obj.reply_name}}：</b>{{obj.comment_content}}</span>
                    <div class="rading-imgs" v-if="obj.comment_imgs&&obj.comment_imgs.length>0" :class="{'plural':obj.comment_imgs.length>=2}">
                        <img v-for="(src,i) in obj.comment_imgs" :key="i" :src='`${obj.comment_imgs.length>=2?(src+"?x-oss-process=image/resize,m_fill,h_150,w_150"):src}`' @click="$service.ImagePreview(obj.comment_imgs,src,i)" />
                    </div>
                </div>
            </div>
            <!-- 评论详情页回复显示 END -->

			<!-- 评论内容展示 START -->
            <div class="content detail" v-else>
                <!-- 收回状态 显示200个字符 条件为内容长度>200 并且DallComment==0 -->
                <div class="content-txt" v-if="!DallComment&&obj.comment_content.length>200">
                    <span>{{obj.comment_content.substr(0,200)}}{{obj.comment_imgs&&obj.comment_imgs.length>0?' [图片]':''}}</span>
                    <span class="expand" @click="DallComment=1;">展开</span>
                </div>
                <div class="content-txt" v-else>
                    <span><span v-if="obj.reply_name">回复 </span><b v-if="obj.reply_name">{{obj.reply_name}}：</b>{{obj.comment_content}}</span>
                    <div class="rading-imgs" v-if="obj.comment_imgs&&obj.comment_imgs.length>0" :class="{'plural':obj.comment_imgs.length>=2}">
                        <img v-for="(src,i) in obj.comment_imgs" :key="i" :src='`${obj.comment_imgs.length>=2?(src+"?x-oss-process=image/resize,m_fill,h_150,w_150"):src}`' @click="$service.ImagePreview(obj.comment_imgs,src,i)" />
                    </div>
                    <span class="expand" v-if="DallComment" @click="DallComment=0;">收回</span>
                </div>
            </div>
            <!-- 评论内容展示 END -->

			<!-- 点赞、回复操作区 START -->
            <div class="action">
                <!-- 点赞 -->
				<div class="dump" v-if="!actions" @click="Dump">查看原内容</div>
                <comp-liketool class="like"
					v-if="actions"
					:number="obj.comment_like_num"
					:status="obj.is_like"
					:type="parentProps.type"
					:id="parentProps.rid"
					:commentid="obj.comment_id" />
                <div class="del" v-if="userInfo.user_id == obj.comment_user_id" @click.stop="Delete"> <i class="icon icon-shanchu"></i> <span>删除</span> </div>
                <div class="reply" v-if="userInfo.user_id != obj.comment_user_id && actions" @click="Reply"> <i class="icon icon-huifu"></i> <span>回复</span> </div>
                <div class="reply" v-if="userInfo.user_id != obj.comment_user_id" @click="Report"> <i class="icon icon-jubao"></i> <span>举报</span> </div>
            </div>
            <!-- 点赞、回复操作区 END -->

			<!-- 回复列表展示区 START -->
			<div class="reply-content" v-if="obj.commentPaterData && 'count' in obj.commentPaterData && obj.commentPaterData.count > 0">
				<div class="list" v-for="comment in obj.commentPaterData.data" :key="comment">
					<div class="name" @click.stop="+comment.user_anonymity !=1 ? $router.push(`/user/homepage/${comment.comment_user_id}`) : $dialog.tip('该大侠已归隐江湖，没法打听到他的行踪')">{{comment.user_name}}:</div>
					<!--未通过审核 -->
					<div v-if="+comment.comment_status == -2">该内容未通过审核</div>
					<!-- 文章详情页 回复>50 显示... -->
						<div class="reply-txt">{{comment.comment_content.length>50?`${comment.comment_content.substr(0,50)}...` : comment.comment_content}}{{comment.comment_imgs&&obj.comment_imgs.length>0?' [图片]':''}}</div>
				</div>
				<div class="total name" v-if="obj.commentPaterData.count > 0" @click.stop="$router.push(`/comment/${parentProps.rid}/${obj.comment_id}?type=${parentProps.type}`)">共{{obj.commentPaterData.count}}条回复></div>
			</div>
			<!-- 回复列表展示区 END -->
		</div>
	</div>
</template>

<script>
	import "./style";
	import compUserinfo from "~components/compUserinfo";
    import compLiketool from '~components/compTools/compLiketool';
	import Create from "./creat";
	export default {
		name: 'compListItem',
		components: {
			compUserinfo,
			compLiketool
		},
		props: {
			floor: { //在评论列表里的楼层
				type: Number,
			},
			obj: { //单条评论数据对象
				type: Object
			},
			actions: { //是否显示操作区按钮，特殊业务处理，用于评论详情页第一条不显示该区域的点赞、评论按钮
				type: Number,
				default: 1,
			}
		},
		computed: {
			userInfo() {
				return this.$store.getters.userInfo;
			},
			//父级Props参数
			parentProps() {
				let r = this.$parent.$parent.$props;
				r = r ? r : {};
				if(r.type == undefined) r.type = this.$route.query.type;
				if(r.rid == undefined) r.rid = this.$route.params.rid;
				return r;
			},
			bannedType() { //账号异常状态 1正常  -1冻结账号  -2禁言  -3不能获取奖励   -4答题
                return this.$store.getters.bannedType;
			}
		},
		data() {
			return {
				DallReply: 0, //回复内容的展开、收回状态 0:收起状态 1:展开状态
				DallComment: 0, //评论内容的展开、收回状态 0:收起状态 1:展开状态
			}
		},
		methods: {
			//查看原内容的跳转
			Dump(){
				let r = this.$route;
				let params = r.params,
					query = r.query;
				
				let type = query.type,
					rid = params.rid;
				let path = '';
				if([0,1,2,4,5].includes(+type)){ //项目评级0、爆料1、话题2、交易所评级5的详情页地址为：/detail/:type/:id
					path = `/detail/${type}/${rid}`;
				// }else if(type == 4){ //公告详情页地址为：/announce/detail/:id
				// 	path = `/announce/detail/${rid}`;
				}else{ //资讯详情页地址：/activity-detail/:id
					path = `/activity-detail/${rid}`;
				}
				this.$router.push(path);
			},
			//回复评论
			Reply() {
				Service.CheckLogin().then(() => {
					Service.CheckBind().then(() => {
						if(this.bannedType.indexOf(-2) != -1){ //禁言
                            this.$dialog.alert('很抱歉，您目前行为受限，无法进行相应操作。');
                            return;
                        }
						let ps = this.parentProps;
						let editor = Create({
							type: ps.type,
							typeid: ps.rid,
							pdata: this.obj, //回复时用 父级评论数据
							commentid: this.$route.name == 'comment' ? this.$route.params.pid : this.obj.comment_id, //  ***注回复的回复时，需要传原评论id，并非此id
							placeholder: `回复 ${this.obj.user_name}：`,
							isDetail: this.obj.isDetail || +this.obj.comment_pater_id > 0? 1 : 0 , //回复时是否是在评论详情
						});
						editor.$on('submit', res => {
							if (res.data.status == 1) {
								if (res.data.commentData.mission[0]) {
									this.$dialog.other("回复成功", res.data.commentData.mission[2].hzt, "");
								}else {
									this.$dialog.tip('回复成功');
								}
							} else {
								if(res.status == -20004){ //包含非法字符
									this.$dialog.alert({
										title: "系统消息",
										content: res.message,
										btns: ["好"]
									});
									return;
								}
								this.$dialog.tip(res.message);
							}
						});
					});
				});
			},
			//删除评论
			Delete() {
				this.$dialog.confirm({
					title: '是否确认删除此条评论？',
					btns: ['确认删除', '取消']
				}).then((res) => {
					let api = Api.apply.del_comment; //评级的评论删除
					if (this.parentProps.type > 2) api = Api.apply.del_comment2; //（资讯，活动，帮助）（项目公告）等评论的删除
					Ajax.post(api, {
						type: this.parentProps.type,
						comment_id: this.obj.comment_id
					}).then(res => {
						setTimeout(() => {
							this.$dialog.tip("删除成功");
							this.$emit("delete");
						}, 300)
					}).catch(err => {
						setTimeout(() => {
							this.$dialog.alert(err.message);
						}, 300)
					})
				});
			},
			//举报评论
			Report(){
				Service.CheckLogin(this.$route.fullPath).then(() => {
					Service.CheckBind().then(() => {
						this.$router.push({
							path: "/report",
							query: {
								gradetype: this.parentProps.type,
								gradeid: this.parentProps.rid,
								commentid: this.obj.comment_id
							}
						});
					}).catch(() => { });
				}).catch(() => {});
			}
		},
		mounted() {

		}
	}
</script>
