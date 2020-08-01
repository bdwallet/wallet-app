<template>
    <div class="comp-comment-toolbar" v-show="DshowToolbar">
        <!-- 编辑框 -->
        <div class="btn-input" @click.stop="CreateEditor">{{Dcontent || this.placeholder}}</div>
        <!-- 点赞按钮 -->
        <comp-liketool class="btn-like"
			:number="like_num"
            :status="is_like"
            :type="type"
            :id="rid"
            :commentid="comment_data ? comment_data.comment_id : 0"
            @liked="Liked" />
        <!-- 评论按钮 -->
        <div class="btn-com" @click.stop="CreateEditor">
            <i class="icon icon-huifu"></i>
            <span class="number" v-if="comment_num>0">{{comment_num}}</span>
        </div>
        <!-- 收藏按钮 -->
        <!-- <div class="btn-col" :class="{'is-like':is_collect >= 1}" @click.stop="Collect">
            <i v-if="is_collect" class="icon icon-shixing"></i>
            <i v-else class="icon icon-kongxing"></i>
        </div> -->
        <comp-collect class="btn-col"
            v-if="is_collect>=0"
            :status="is_collect"
            :type="type"
            :id="rid" />
    </div>
</template>

<script>
    import "./style";
    import mixin from './mixin';
    import Create from './creat';
    import compLiketool from '~components/compTools/compLiketool';
    import compCollect from '~components/compTools/compCollect';
    export default {
        name: 'compCommentToolbar',
        mixins: [mixin],
        components:{
            compLiketool,
            compCollect
        },
        props: {
            type: 1, //0评级 1爆料 2话题 3 (资讯，活动，帮助)  4 (项目公告)
            rid: 0, //内容的ID
            comment_data: 0, //评论的ID 大于0为评论的点赞、回复
            is_like: 0, //是否点过赞 状态
            is_collect: 0, //是否收藏 状态 如果小于0，则隐藏该按钮
            like_num: 0, //内容的点赞数
            comment_num: 0, //内容的评论数
            placeholder:{
                type:String,
                default:"发评论..."
            }
        },
        data() {
            return {
                Dcontent: '', //用户输入的没有发布的内容
                Dimgs:[], //用户输入的没有发布的内容图片
                Dnonymity:0, //用户输入的没有发布的内容实名状态
                DshowToolbar: 1, //组件显示状态
            }
        },
        computed: {
            bannedType() { //账号异常状态 1正常  -1冻结账号  -2禁言  -3不能获取奖励   -4答题 -5禁止提现和赞赏
                return this.$store.getters.bannedType;
            }
        },
        methods: {
            //点赞成功后处理逻辑
            Liked(){
                this.$emit("liked",1); //抛出点赞结果 为了处理详情页上下点赞按钮状态一致
            },
            //创建评论编辑器
            CreateEditor() {
                Service.CheckLogin().then(() => {
                    Service.CheckBind().then(() => {
                        if(this.bannedType.indexOf(-2) != -1){ //禁言
                            this.$dialog.alert('很抱歉，您目前行为受限，无法进行相应操作。');
                            return;
                        }
                        let params = {
                            type: this.type, //0评级 1爆料 2话题 3 (资讯，活动，帮助)  4 (项目公告)
                            typeid: this.rid, //内容ID
                            placeholder: this.placeholder,
                            content: this.Dcontent,
                            imgs: this.Dimgs,
                            nonymity: this.Dnonymity,
                            commentType: 1, //评论类型 1评论 2回复
                        };
                        if(this.comment_data && this.comment_data.comment_id){ //满足条件时，为评论详情页的回复操作
                            params.commentid = this.comment_data.comment_id, //可选 有值时为回复  不传或传0时为评论
                            params.pdata = this.comment_data;
							params.isDetail = 1; //回复时是否是在评论详情
                        }
                        let editor = Create(params);
                        editor.$on("blur", this.OnBlur);
                        // editor.$on("close", () => {
                        //     //显示评论工具栏
                        //     this.Show();
                        // });
                        editor.$on("submit", (res) => {
                            if (res.data.status == 1) {
                                if (res.data.commentData.mission[0]) {
                                    this.$dialog.other("评论成功", res.data.commentData.mission[2].hzt, "");
                                }else {
                                    this.$dialog.tip('评论成功');
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
                        //隐藏评论工具栏
                        //this.Hide();
                    })
                })
            },
            //编辑器失焦后，将未发布的内容展示 并保存图片、实名状态
            OnBlur(o) {
                this.Dcontent = o.content;
                this.Dimgs = o.imgs;
                this.Dnonymity = o.nonymity;
            },
            //隐藏该TOOLBAR
            Hide(){
                this.DshowToolbar = 0;
            },
            //显示评论工具栏
            Show(){
                this.DshowToolbar = 1;
            }
        },
        mounted() {
            this.SetToolbar(this);
        }
    }
</script>
