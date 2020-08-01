<template>
    <div :class="'count' in Dlist ? '' : 'comp-comment-list'">
        <div class="comment-list" v-if="Dhotlist.length > 0">
            <div class="comment-title">
			    <div class="title-txt">推荐评论</div>
                <!-- 说明文本提示按钮  暂时取消 -->
                <!-- <i class="icon icon-bangzhuzhongxin" @click.stop="HotTip($event)"></i> -->
		    </div>
            <comp-scroll>
                <list-item v-for="(obj,i) in Dhotlist" :key="obj" :obj="obj" @delete="Delete(i,'hot')" />
            </comp-scroll>
        </div>
        <div class="comment-list" v-if="$route.name != 'comment'"> <!-- 评论详情页不显示 -->
            <div class="comment-title">
			    <div class="title-txt">最新评论</div>
                <div class="sieve">
                    <b>只看作者</b>
                    <comp-switch @ChangeSwitch="ChangeSwitch"/>
                </div>
		    </div>
            <comp-scroll :on-infinite="onInfinite" v-if="Dlist.length > 0">
                <list-item v-for="(obj,i) in Dlist" :key="obj" :floor="Dcount - i" :obj="obj" @delete="Delete(i)" />
            </comp-scroll>
        </div>
        <!-- 评论详情 -->
        <div class="dropdown comment-list" v-if="'count' in Dlist">
            <list-item class="comment-pater" :obj="commentPater" :actions="0" />
            <!-- <div style="height:14rem;"></div> -->
            <div class="rank comment-title" style="position:sticky;top:0;margin-top:0.25rem;">
                <div class="title-txt">全部{{Dlist.count}}条回复</div>
                <div class="checkbtn" :class="{'act':show}" @click="toggle(checked)">
                    <div v-if="checked==0">按最新</div>
                    <div v-else-if="checked==1">按最早</div>
                    <div v-else-if="checked==2">按赞数</div>
                    <i class="icon icon-shouhui"></i>
                </div>
                <!-- <transition name="checkbox"> -->
                    <ul class="checkbox" v-if="show">
                        <li :class="{'act':checked==0}" @click="toggle(0)">最新</li>
                        <li :class="{'act':checked==1}" @click="toggle(1)">最早</li>
                        <li :class="{'act':checked==2}" @click="toggle(2)">赞数</li>
                    </ul>
                <!-- </transition> -->
            </div>
            <comp-scroll :on-infinite="onInfinite">
                <list-item v-for="(obj,i) in Dlist.data" :key="obj" :floor="Dcount - i" :obj="obj" @delete="Delete(i)" />
            </comp-scroll>
            <transition name="backdrop">
                <div class="backdrop" v-if="show" @click="show=!show"></div>
            </transition>
        </div>
        <comp-empty class="noComment"
            v-if="!Dloading && Dlist.length == 0"
            mainHeight="11rem"
            text="目前还没有评论, 期待您的精彩发言" />
    </div>
</template>

<script>
    import "./style";
    import mixin from './mixin';
	import compScroll from "~components/compScroll";
	import compEmpty from '~components/compEmpty';
    import listItem from "./item";
    import compSwitch from '~components/compTools/compSwitch';
    import compUserinfo from "~components/compUserinfo";
    export default {
        name:'compCommentList',
        mixins: [mixin],
        components:{listItem,compScroll,compEmpty,compSwitch,compUserinfo},
        props:{
            //内容ID
			rid: {
				type: String,
            },
            //内容类型 0评级 1爆料 2话题 3 (资讯，活动，帮助)  4 (项目公告)
            type: {
				type: String,
				default: "1",
            },
            //父级评论的id，获取子评论信息
            pid: {
                type: String,
                default: ''
            },
            //用于“只看作者筛选”
            uid: {
                type: String,
                default: 0
            }
        },
		computed: {
			userInfo() {
				return this.$store.getters.userInfo;
			},
		},
        data(){
            return{
                Dloading: 1, // 数据加载状态
                Dcount: 0, //评论总数
                Dlist:[], //评论列表
                Dhotlist:[],//热门评论列表
				Dpage: 1,
                Dsize: 10,
                Dmore:1, //是否还有更多未加载数据
                DonlyAuthor: 0, //只看作者
                show: 0, //显示遮罩层
                checked: 0, //切换筛选状态 0: 最新  1：最早  2：赞数
                commentPater: {}, // 评论页 父评论
            }
        },
        watch: {
            rid(v){
                this.Dpage = 1;
                if(v){
                    this.GetList();
                }
            },
            pid(v){
                this.Dpage = 1;
                if(v)
                    this.GetList();
            }
        },
        methods:{
            toggle(type){
                this.show = !this.show;
                this.checked = type;
                this.Dpage = 1;
                this.GetList();
            },
            ChangeSwitch(v) {
                this.DonlyAuthor = v;
                this.Dpage = 1;
                this.GetList();
            },
            // 上推荐提示
            // HotTip(e) {
            //     this.$dialog.msg({
            //         content: '点赞数多、获得作者认可(每篇文章下，作者的前5次点赞)的评论，均能上推荐',
            //         OffsetX: -155,
            //         mark: 'right'
            //     }, e);
            // },
            //添加一条数据至列表
            AddData(data){ //若回复时调用该方法，则只增加评论数，列表数据已由editor内处理
                if(data){
                    if(+data.comment_pater_id <= 0 || !data.comment_pater_id){
                        this.Dlist.splice(0, 0, data);
                    }else if(data.isDetail){ //在评论详情页的处理
                        this.Dlist.data.splice(0, 0, data);
                    }else {
                        for(let i in this.Dlist){
                            if(this.Dlist[i].comment_id == data.comment_pater_id){
                                if(!('count' in this.Dlist[i].commentPaterData)) {
                                    this.Dlist[i].commentPaterData = {
                                        count: 0,
                                        data: []
                                    };
                                }
                                this.Dlist[i].commentPaterData.count++;
                                this.Dlist[i].commentPaterData.data.splice(0, 0, data);
                                return;
                            }
                        }
                    }
                }
                this.Dcount = +this.Dcount + 1;
            },
            //删除评论后业务处理 i:索引 type:评论类型 new:最新 hot：热门
            Delete(i,type){
                if(type == 'hot'){
                    this.Dhotlist.splice(i,1); //从列表中移除数据
                }else{
                    if(this.Dlist.data)
                        this.Dlist.data.splice(i,1); //从列表中移除数据
                    else
                        this.Dlist.splice(i,1); //从列表中移除数据
                }
                //评论数据-1
                let toolbar = this.GetToolbar();
                if(toolbar) toolbar.$props.comment_num -= 1;
            },
            //获取评论列表
            GetList(done){
                let params = {
                    type: this.type,//(0评级，1爆料, 2话题) 3(资讯，活动，帮助)  4(项目公告)
					id: this.rid,  //文章id
					page: this.Dpage,
                    pagesize: this.Dsize,
                    pid: this.pid, //父级评论的id，获取子评论信息
                    scene: this.checked //排序筛选
                };
                if(this.DonlyAuthor){
                    params.self_id = this.uid;
                }
				Ajax.post(Api.apply.get_comment_list, params).then(res => {
                    done && done();
                    this.Dloading = 0;
                    let d = res.data;
                    if(this.$route.name == "comment"){ //仅用于评论详情页底部评论工具栏，需要点赞、评论、状态、作者等数据
                        this.$emit('response',d.comment_data.comment_pater);
                    }
                    if(this.Dpage == 1){
                        if('comment_pater' in d.comment_data && this.pid != d.comment_data.comment_id) {
                            d.comment_data.comment_pater["isDetail"] = 1;
                            this.commentPater = d.comment_data.comment_pater;
                        }
                        this.Dcount = d.comment_count;
                        this.Dlist = d.comment_data;
                        this.Dhotlist = d.comment_hot_data;
                    }
                    else{
                        this.Dlist = this.Dlist.concat(d.comment_data);
                    }
					this.Dmore = d.comment_data.length >= this.Dsize;
					this.Dpage++;
				}).catch(err => {
                    this.Dloading = 1;
                    setTimeout(() => {
                        this.$dialog.alert({
                            title: "系统消息",
                            content: err.message,
                            btns: ["好"]
                        }).then(res => {
                            if (Global.isApp && Global.isPro) {
                                HZApp.Back()
                            } else {
                                this.$router.go(-1);
                            }
                        });
                    }, 500);
                });
            },
            //下拉加载
            onInfinite(done){
				if (this.Dmore) {
					this.GetList(done);
				} else {
					done();
				}
            },
        },
        mounted(){
            //保存该列表组件，用于发布、回复后加入新数据至列表
            this.SetList(this);
            this.GetList();
        },
        // beforeRouteEnter(to,from,next) {

        // }
    }
</script>
