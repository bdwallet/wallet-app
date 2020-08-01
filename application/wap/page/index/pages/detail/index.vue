<template>
    <div class="detail-page showFooter">
        <!-- 审核状态及提示 START -->
        <div v-if="isSelf && Ddata.status==-1" class="audit-content">
            <h3>
                <i class="icon icon-gantanhao"></i>
                <span>此内容未通过审核，请修改后重新发布</span>
            </h3>
            <p>未通过原因：{{Ddata.refuse_reson}}</p>
        </div>
        <!-- 审核状态及提示 END -->
        <!-- 精选标签 START -->
        <div class="comp-userbox">
            <div class="grade-hot" v-if="Ddata.is_hot==1">精选</div>
            <comp-userinfo :source="Ddata" :concernShow="1" />
        </div>
        <!-- 精选标签 END -->
        <div class="container detail" v-show="Ddata.id">
            <!-- 标题 仅今日热议、资讯、公告 -->
            <div class="topic-title" v-if="Ddata.title">{{Ddata.title}}</div>
            <!-- 整体评价 仅交易所评级 -->
            <div class="total-evaluation" v-if="gradeType == 5">总体评价：<span>{{ $service.GetEvaluate(Ddata.score) }}</span></div>
            <!-- 内容 -->
            <p class="content com-detail" id="detCon">
                <span v-if="Ddata.pid>0" class="com-zhuiping" @click.stop="showTip">追评</span>
                <span v-html="Ddata.content"></span>
                <span class="clc" v-if="Ddata.type==2&&Ddata.url" @click.stop="$service.OpenUrl(Ddata.url)">
                    戳我查看
                    <i class="icon icon-shouhui"></i>
                </span>
            </p>
            <!-- 图片 -->
            <div v-if="Ddata.imgs&&Ddata.imgs.length>0" class="rading-imgs" :class="{'plural':Ddata.imgs.length>=2}">
                <img v-for="(src,i) in Ddata.imgs" :key="i" :src="getImgSrc(src,Ddata.imgs.length)" @click="$service.ImagePreview(Ddata.imgs,src,i)">
            </div>
            <!-- 删除操作区域 | 热榜 | 新评 -->
            <div class="pro-action">
                <!-- 热榜 | 新评 -->
                <div class="pro-hotlist">
                    <div v-if="Ddata.type == 0 && Ddata.grade_top" class="grade-h-n-label grade-hotlist-label" @click="gotoHotlist(Ddata.grade_top)">
                        <div class="pro-name">热榜</div>
                    </div>
                    <!-- <div v-if="false" class="grade-h-n-label grade-new-label">
                        <div class="pro-name">新评</div>
                    </div> -->
                </div>
                <div v-if="isSelf" @click.stop="deleteRating(Ddata.id)" class="pro-delete">
                    <i class="icon icon-shanchu"></i>
                    <span>删除</span>
                </div>
                <!-- is_report == 1 时才能举报，为0时 不能举报 -->
                <div v-else @click.stop="goReport" class="pro-delete">
                    <i class="icon icon-jubao"></i>
                    <span>举报</span>
                </div>
            </div>
            <!-- 历史评级 仅评级 -->
            <div class="histroy" v-if="append_data.length>1">
                <h3>历史评级</h3>
                <div class="listbox">
                    <div v-for="(s,I) in append_data" :key="s" v-if="s.id!=rid">
                        <div class="sub">
                            <div class="spot"></div>
                            <div class="major">
                                <div class="time">
                                    {{s.create_time}}
                                    <span class="com-hot" v-if="s.is_hot==1">精选</span>
                                </div>
                                <div class="score">{{s.score}}分</div>
                            </div>
                        </div>
                        <div class="main" :class="{'line': append_data.length>1 && I!=append_data.length-2}">
                            <!-- 最后一条不展示左边边线 -->
                            <div class="content" v-if="append_show[I]">
                                <span>{{s.content.substr(0,80)}}…</span>
                                <span @click="toogle(I)" style="color:#5682FF;">展开</span>
                            </div>
                            <div v-else>
                                <div class="content">
                                    <span>{{s.content}}</span>
                                    <span @click="toogle(I)" style="color:#5682FF;">收起</span>
                                </div>
                                <div class="rading-imgs" v-if="s.imgs&&s.imgs.length>0" :class="{'plural':s.imgs.length>=2}">
                                    <img v-for="(src,i) in s.imgs" :key="i" :src="getImgSrc(src,s.imgs.length,1)" @click="$service.ImagePreview(s.imgs,src,i)">
                                </div>
                            </div>
                            <div class="other">
                                <div class="zan">{{s.like_num}}赞</div>
                                <div class="look">
                                    <span v-if="s.comment_num>0" @click="$router.push(`/comment/${s.id}`)">{{`查看${s.comment_num}条相应评论`}}</span>
                                    <span v-else>0条评论</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 多少人评过 仅评级 -->
            <div class="pro-info" v-if="[0,5].includes(+Ddata.type)" @click="gotoProInfo(Ddata.item_id || Ddata.bourse_id, Ddata.urrency|| Ddata.cn)">
                <div class="pro-score">
                    <img :src="Ddata.logo+'?x-oss-process=image/resize,m_lfit,h_80,w_80'">
                    <div class="score">
                        <div class="pro-name">
                            {{ Ddata.urrency || Ddata.cn }}
                            <span v-if="Ddata.urrency&&Ddata.cn">/</span> {{Ddata.cn}}
                        </div>
                        <div class="score-txt">{{Ddata.item_score>0?`${Ddata.item_score}分`:'—'}}</div>
                    </div>
                </div>
                <div v-if="Ddata.user_num>1" class="user_name">还有{{Ddata.user_num-1}}名超级评审员也评过</div>
                <div v-else class="user_name">此项目仅1人评过，一起来评吧</div>
            </div>

            <!-- 相关项目标签列表 仅爆料 -->
            <div class="tag" v-if="Ddata.label && Ddata.label.length > 0">
                <ul>
                    <li v-for="item in Ddata.label" :key="item" @click="LabelJump(item)">{{item.label_name}}</li>
                </ul>
            </div>

            <!-- 赞、踩 -->
            <div class="action-like" v-if="gradeType==0 || gradeType==5">
                <div class="btnbox">
                    <comp-liketool class="like"
					   :number="Ddata.like_num"
                       :status="Ddata.is_like"
                       :type="gradeType"
                       :id="Ddata.id"
                       @liked="Liked" />
                </div>
                <div class="btnbox">
                    <comp-liketool class="lose"
                        comptype="-1"
					   :number="Ddata.nolike_num"
                       :status="Ddata.is_like"
                       :type="gradeType"
                       :id="Ddata.id"
                       @liked="Liked" />
                </div>
            </div>

            <!-- 赞赏相关 -->
            <div class="reward" v-if="dt_give.is_give >= 0">
                <div class="reward-btn" @click.stop="goReward">
                    <div class="btn-text">赏</div>
                </div>
                <div class="lable">{{rewardLable}}</div>
                <div class="reward-people" v-if="dt_giveData && dt_giveData.length>0">
                    <comp-avatar :size="64" :border="1" v-for="item in dt_giveData" :key="item" :src="item.user_photo" :userID="item.give_send_user_id" />
                    <i class="icon icon-shouhui" @click.stop="goRewardList"></i>
                </div>
            </div>
            <comp-prompt  @click.native="Liked" color="#888" style="margin: 0 0 .6rem;">以上内容仅代表超级评审员个人观点，不代表黑钻评级官方立场，币市有风险，切勿盲目投资！</comp-prompt>
        </div>
        <!-- 评论点赞操作区域 -->
        <div class="comment-wrap" v-if="Ddata.status>=0">
            <comp-comment-list :type="gradeType" :rid="rid" :uid="Ddata.user_id" />
        </div>
        <!-- 关于我们 关注公众号引导 -->
        <!-- <layout-about v-if="userInfo.user_is_attention != 1 && ((allData.allData &&　comment_data.allData.length<10) || !allData.allData)" /> -->
        <!-- 修改、追评按钮 -->
        <div class="edit-btn" v-if="isSelf && (Ddata.status==-1 || Ddata.is_append==1)" @click.stop="gotoWrite">
            <span v-if="Ddata.status==-1">修改</span>
            <span v-else>追评</span>
        </div>
        <comp-comment-toolbar v-if="Ddata.status>=0"
            :type="gradeType"
            :rid="rid"
            :is_like="Ddata.is_like"
            :is_collect="Ddata.is_collect"
            :like_num="Ddata.like_num"
            :comment_num="Ddata.comment_num"
            @liked="Liked" />

        <!-- 付费置顶 -->
        <div class="pay-top" v-if="gradeType == 0" @click.stop="ShowTimeRange">
            <img :src="$assets.payToTop" />
        </div>
        <comp-time-range ref="TimeRange" :type="gradeType" :grade_id="rid"></comp-time-range>
    </div>
</template>

<script>
    import {
        compCommentToolbar,
        compCommentList
    } from "~components/comment";
    import compUserinfo from "~components/compUserinfo";
    import compPrompt from "~components/compPrompt";
    import compAvatar from "~components/compAvatar";
	import compLiketool from '~components/compTools/compLiketool';
    import drawCanvas from '~script/drawCanvas';
    import compTimeRange from  '~components/compTimeRange';
    export default {
        name: "detail",
        components: {
            //layoutAbout,
            compCommentList,
            compCommentToolbar,
            compUserinfo,
            compPrompt,
            compLiketool,
            compAvatar,
            compTimeRange,
        },
        data() {
            return {
                Ddata: {}, //评级文章详情数据
                allData: [],
                append_data: [], //历史评级
                append_show: [], //历史评级内容是否展开
                more: true,
                dt_give: {}, //赞赏额度，是否显示赞赏
                dt_giveData: [], //赞赏的人
                dt_grade_give_num: 0, //赞赏人数
                dt_grade_give_sum: 0, // 赞赏黑钻
                delPath: "", //删除评级爆料成功后跳转路由
                backwhere: '', // app 删除后跳转
                dt_isRefresh: false, //赞赏成功后，假如进入赞赏列表页，用于刷新列表
                // 生成图片相关
                Url: 'https://heizuan.oss-cn-shenzhen.aliyuncs.com/h5images/',
                ImgUrl: '', // 本地图片地址
                imageData: {
                    user_photo: "",
                    user_super: '', // 超级评审员
                    user_project: '', // 项目 | 黑钻 官方
                    logo: "",
                    header: '', // 头部
                    wrapBg: '', // 内容区域水印
                    QRCode: '',
                },
            };
        },
        beforeRouteEnter(to, from, next) {
            // 进入页面记录上一页路由，便于删除评级爆料后跳转刷新页面
            next(vm => {
                vm.delPath = from.path;
                vm.backwhere = decodeURIComponent(location.search).slice(12) // 解码，截取参数
            });
        },
        computed: {
            userInfo() {
                return this.$store.getters.userInfo;
            },
            isSelf() {
                return this.$store.getters.userInfo.user_id == this.Ddata.user_id;
            },
            //计算是否还有未加载的点赞人
            // haveMore() {
            //     if (this.Ddata.grade_like_user_photo)
            //         return (
            //             this.Ddata.like_num > this.Ddata.grade_like_user_photo.length
            //         );
            //     return false;
            // },
            gradeType() {
                return this.$route.params.type;
            },
            rid() {
                //评级详情ID
                return this.$route.params.rid;
            },
            //用于资讯大类
            // 分类     3 所有 资讯         6 资讯下的 黑钻出品   7 资讯下的 新闻资讯
                //          4 所有 活动         8 路演直播              9 空投活动              10 线下会议交流
                //          5 所有 帮助中心     11 常见问题             12 功能宝典
                //          13 产品进度         14 小白入门             15 玩转黑钻
            tab(){
                let tab = this.$route.query.tabs;
                return tab ? tab : 0;
            },
            // isRatings() {
            //     return this.gradeType == 0;
            // },
            rewardLable() {
                return this.dt_giveData.length > 0 ?
                    `共${this.dt_grade_give_num}人赞赏了${this.dt_grade_give_sum}黑钻` :
                    "好内容值得更多喝彩";
            },
            bannedType() { //账号异常状态 1正常  -1冻结账号  -2禁言  -3不能获取奖励   -4答题  -5禁止提现和赞赏
                return this.$store.getters.bannedType;
            },
        },
        watch: {
            rid(v) {
                this.getDetail();
            }
        },
        methods: {
            //点赞成功后改变状态
            Liked(v){
                this.Ddata.is_like = v; //同步赞、踩的状态
                if(v == 1){ //同步toolbar组件的点赞数
                    this.Ddata.like_num++;
                }
            },
            //处理图片宽高  针对历史评级图片尺寸不同 0为详情内容的图片 1为历史评级内的图片
            getImgSrc(src, length, type) {
                let size0 = type?160:210,
                    size1 = type?120:150;
                src +=
                    length >= 2 ?
                    `?x-oss-process=image/resize,m_fill,h_${size1},w_${size1}` :
                    `?x-oss-process=image/resize,m_lfit,h_${size0},w_${size0}`;
                return src;
            },
            // 进入热榜
            gotoHotlist(type) {
                let query = type.split("|");
                this.$router.push({
                    path: '/hotlist',
                    query: {
                        tab: query[0],
                        time: query[1]
                    }
                })
            },
            //处理点赞数显示，大于9999显示为9999+
            likeNumShow(v) {
                if (v <= 0) {
                    return "赞";
                }
                return v > 9999 ? "9999+" : v;
            },
            // 处理标签
            removeHTMLTag(str){
                str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
                str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
                str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
                return str;
            },
            share() {
                let data = this.Ddata,
                    type = this.gradeType;
                let title, desc, imgUrl, href, Type, footip, imgHeader;
                title = `【黑钻爆料】${data.intro && data.intro.substring(0, 60)}...`; //
                desc = `${data.intro && data.intro.substring(0, 60)}`;
                imgUrl = data.logo ||this.$assets.logo;
                href = location.href;
                if (type == 0 || type == 5) {
                    //评级
                    title = `【黑钻评级】“${data.user_name}”给${data.cn || data.urrency}打了${data.score}分，您怎么看？`;
                    footip = '查看完整评级详情';
                    if(type == 0){
                        Type = 0;
                        imgHeader = `${this.Url}new-detail-share.jpg?timeStamp=` + new Date();
                    } else {
                        Type = 5;
                        imgHeader = `${this.Url}new-detail-share5.jpg?timeStamp=` + new Date();
                    }
                } else if (type == 1) {
                    //爆料
                    desc = `黑幕、跑路、产品关停、维权投诉、打假、辟谣，净化币圈猛料等你爆`;
                    Type = 1;
                    footip = "关注币圈更多猛料";
                    imgHeader = `${this.Url}new-detail-share1.jpg?timeStamp=` + new Date();
                } else if (type == 2) {
                    //话题
                    title = `【黑钻热议】${data.title}`;
                    Type = 2;
                    footip = '参与讨论挖黑钻';
                    imgHeader = `${this.Url}new-detail-share2.jpg?timeStamp=` + new Date();
                } else if (type == 3) {
                    // 资讯
                    let min_type = Number(this.tab);
                    desc = `${data.content && this.removeHTMLTag(data.content).substring(0, 60)}`;
                    imgUrl = this.$assets.logo;
                    if (min_type >= 6 && min_type <= 7) {
                        //币圈资讯
                        title = `【币圈资讯】${data.title}`;
                    } else if (min_type >= 8 && min_type <= 10) {
                        //热门活动
                        title = `【热门活动】${data.title}`;
                    } else if (min_type == 12) {
                        //功能宝典
                        title = `【功能宝典】${data.title}`;
                    } else if (type == 13) {
                        //项目进度
                        title = `【项目进度】${data.title}`;
                    } else if (min_type == 14 || min_type == 15) {
                        //新手课堂
                        title = `【新手课堂】${data.title}`;
                    }
                } else if (type == 4) {
                    // 公告
                    title = `【${data.urrency}公告】${data.content && data.content.substring(0, 60)}...`;
                    desc = `各方项目公告，最新动态行情，尽在黑钻评级`;
                    imgUrl = data.item_logo || this.$assets.logo;
                }
                title = data.share_title || title;
                desc = data.share_intro || desc;
                imgUrl = data.share_img || imgUrl;
                if (Global.isApp && Global.isPro && type != 3 && type != 4) {
                    // 生成图片
                    drawCanvas.toBase64Url(imgHeader, 375 * drawCanvas.DPR(), 308 * drawCanvas.DPR(), (callBackData) => {
                        this.imageData.header = callBackData;
                        drawCanvas.toBase64Url(`${this.Url}water-mark.jpg?timeStamp=` + new Date(), 375 * drawCanvas.DPR(), 930 * drawCanvas.DPR(), (callBackData) => {
                            this.imageData.wrapBg = callBackData;
                            drawCanvas.toBase64Url(`${data.user_photo}?timeStamp=` + new Date(), 83 * drawCanvas.DPR(), 83 * drawCanvas.DPR(), (callBackData) => {
                                this.imageData.user_photo = callBackData;
                                drawCanvas.toBase64Url(`${this.allData.img_url}?timeStamp=` + new Date(), 200 * drawCanvas.DPR(), 200 * drawCanvas.DPR(), (callBackData) => {
                                    this.imageData.QRCode = callBackData;
                                    drawCanvas.toBase64Url(`${this.Url}offiece-icon.png?timeStamp=` + new Date(), 24 * drawCanvas.DPR(), 24 * drawCanvas.DPR(), (callBackData) => {
                                        this.imageData.user_project = callBackData;
                                        drawCanvas.toBase64Url(`${this.Url}assessor-icon.png?timeStamp=` + new Date(), 24 * drawCanvas.DPR(), 24 * drawCanvas.DPR(), (callBackData) => {
                                            this.imageData.user_super = callBackData;
                                            if (data.logo) {
                                                drawCanvas.toBase64Url(`${data.logo}?timeStamp=` + new Date(), 88 * drawCanvas.DPR(), 88 * drawCanvas.DPR(), (callBackData) => {
                                                    this.imageData.logo = callBackData;
                                                    this.createImage(Type, data, footip)
                                                })
                                            }else{
                                                this.createImage(Type, data, footip)
                                            }
                                        })
                                    })
                                })
                            })
                        })
                    })
                }
                Share.Ready({
                    imgUrl,
                    title,
                    desc,
                    link: href
                });
            },

            // 生成图片
            createImage(Type, data, footip) {
                let nickname = data.urrency|| data.cn,
                    text = {
                        title: data.title.substring(0, 28) || '', // 讨论title
                        level: data.userlv,
                        locatedid: data.user_located_item_id,
                        user_name: data.user_name,
                        text: data.intro.substring(0, 180),
                        score: Type == 5 ? Service.GetEvaluate(data.score) : (data.score || "—"), // 该评级分数
                        nickname: nickname || "", // 项目简称
                        gradeScore: data.item_score > 0 ? `${data.item_score}分` : '—', // 项目总分
                        personal: data.user_num || "—", // 点评人数
                    };
                if (data.urrency && data.cn)
                    text.nickname = `${data.urrency}/${data.cn}`;
                if (data.intro.length > 178) text.text = text.text + "...";
                if (data.title.length > 28) text.title = text.title + "...";
                this.imageData.text = text;
                drawCanvas.creatDetailCanvas({
                    Type,
                    imageData: this.imageData,
                    footip,
                }).then(res => {
                    let type = 'png';
                    drawCanvas.saveImage(type, res).then(resolve => {
                        this.ImgUrl = resolve;
                        Share.Ready({
                            pictures: this.ImgUrl,
                            type: "image"
                        });
                    });
                })
            },

            //获取评级内容
            getDetail() {
                let id = this.rid;
                let params = {
                    id: id,
                    type: this.gradeType
                };
                Ajax.get(Api.apply.contentInfo_get, params).then(res => { //this.$api.apply.get_grade
                    if (res.status == 1) {
                        let d = res.data.append_data;
                        if (d && d.length > 1 && id != d[d.length - 1].id) {
                            //说明存在追评 需要跳转至最新评级数据
                            if (Global.isApp && Global.isPro) {
                                HZApp.Reload(`/detail/${this.gradeType}/${d[d.length - 1].id}`)
                            } else {
                                this.$router.replace(
                                    `/detail/${this.gradeType}/${d[d.length - 1].id}`
                                );
                            }
                            return false;
                        }
                        this.Ddata = res.data.data;
                        this.allData = res.data;
                        this.append_data = d || [];
                        for (let i = 0; i < this.append_data.length; i++) {
                            this.$set(this.append_show, i, true);
                        }
                        //每次获取数据后都要重新配置分享
                        this.share();
                        // 赞赏
                        this.dt_give = res.data.give || {}; //赞赏金额列表，是否显示赞赏
                        this.dt_giveData = res.data.give_data && res.data.give_data.slice(0, 6); //赞赏数据
                        this.dt_grade_give_num = res.data.data.give_num; //赞赏人数
                        this.dt_grade_give_sum = Number(res.data.data.give_sum); //赞赏总黑钻
                    }
                }).catch(err => {
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

            //跳转到项目详情页
            gotoProInfo(proid, urrency) {
                let path= `/article/${proid}`,
                    query = {
                        pro: urrency
                    };
                if(this.gradeType == 5) {
                    path= `/exchange/${proid}`;
                }
                this.$router.push({path,query});
            },

            //追评、修改
            gotoWrite() {
                if (this.bannedType && this.bannedType.indexOf(-2) != -1) { //禁言
                    this.$dialog.alert('很抱歉，您目前行为受限，无法进行相应操作。');
                    return;
                }
                let d = this.Ddata;
                let query = {
                    pro: d.urrency
                };
                if (d.status == -1) {
                    //修改
                    query.id = d.id;
                    if(this.gradeType == 5) {
                        query.pro = d.cn;
                        this.$router.push({
                            path: `/writexch/0/${d.bourse_id}`,
                            query
                        });
                    } else {
                        this.$router.push({
                            path: `/write/${this.gradeType}/${d.item_id}`,
                            query
                        });
                    }
                } else {
                    //预留追加 拦截等级 < LV5
                    if (this.userInfo.user_level < 5) {
                        this.$dialog.alert({
                            title: "你当前等级权限不足",
                            content: "快去提升等级，获取相应权限吧！",
                            btns: ["好的"]
                        }).then(() => {
                            this.$router.push({
                                path: `/user/task`
                            });
                        }).catch(() => {});
                    } else {
                        if(this.gradeType == 3){
                            query.pro = d.cn;
                            this.$router.push({
                                path: `/writexch/0/${d.bourse_id}`,
                                query
                            });
                        } else{
                            this.$router.push({
                                path: `/write/${this.gradeType}/${d.item_id}`,
                                query
                            });
                        }
                    }
                }
            },

            //点击标签跳转
            LabelJump(obj){
                if(obj.label_item_id > 0)
                    this.$router.push({path:`/article/${obj.label_item_id}?pro=${obj.label_name}`});
            },

            //追评说明提示框
            showTip() {
                this.$dialog.pannel({
                    title: "什么是追评",
                    content: [
                        "1、追评是追加评级的简称，能在保持评级内容不可篡改的前提下，让评审员随着项目的发展，补充自己新的见解、观点",
                        "2、LV5等级以上的超级评审员才可追评",
                        "3、1个项目每隔100天（从上条内容发布日期算起）可追评1次",
                        "4、根据追评时间和追评次数，追评能获得不同奖励（具体奖励规则见帮助中心）"
                    ],
                    btns: ["知道了"]
                });
            },

            //历史评级内容展开收起
            toogle(i) {
                this.$set(this.append_show, i, !this.append_show[i]);
            },

            //删除评级
            deleteRating(id) {
                let d = this.Ddata;
                if (d.is_hot == 1 || d.status == 1) {
                    this.$dialog.alert("发布内容已超过5分钟，不可再删除");
                    return false;
                }
                this.$dialog.confirm({
                    title: `您确定要删除此${+this.gradeType ? (this.gradeType == 5 ? "评级" : "爆料") : "评级"}？`,
                    btns: ["删除", "取消"]
                }).then(res => {
                    this.$ajax.post(this.$api.apply.del_grade, {
                        grade_id: id,
                        item_ad_name: d.urrency ? d.urrency : "",
                        type: this.gradeType
                    }).then(res => {
                        if (res.data.status == 1)
                            if (Global.isApp && Global.isPro) {
                                HZApp.Back()
                            } else {
                                this.$router.replace(`${this.delPath}?refresh=1`);
                            }
                        else
                            this.$dialog.alert({
                                title: "系统消息",
                                content: res.message,
                                btns: ["好"]
                            });
                    });
                });
            },

            goReward() {
                //赞赏
                Service.CheckLogin(this.$route.fullPath).then(() => {
                    Service.CheckBind().then(() => {
                        if (this.bannedType.indexOf(-5) != -1) { //禁止提现和赞赏
                            this.$dialog.alert('很抱歉，您目前行为受限，无法进行相应操作。');
                            return;
                        }
                        if (this.isSelf) {
                            this.$dialog.tip("不能赞赏自己的文章");
                            return false;
                        }
                        this.$dialog.reward(this.dt_give.give_num).then(res => {
                            let params = {
                                grade_id: this.rid, // 评级、爆料、话题id
                                give_type: res.i, // 赞赏黑钻数量
                                grade_type: this.gradeType // 赞赏类型 0：评级 1：爆料 2：话题 5：交易所评级
                            };
                            this.$ajax.post(this.$api.apply.add_give, params).then(res => {
                                if (res.data.status == 1) {
                                    setTimeout(() => {
                                        this.$dialog.tip("赞赏成功");
                                    }, 300);
                                    this.getDetail();
                                    this.dt_isRefresh = true;
                                } else {
                                    setTimeout(() => {
                                        this.$dialog.alert({
                                            content: res.message,
                                            btns: ["知道了"]
                                        });
                                    }, 300);
                                }
                            });
                        });
                    });
                });
            },

            goRewardList() {
                //赞赏的支持者页面
                this.$router.push({
                    name: "reward",
                    params: {
                        gradetype: this.gradeType,
                        rid: this.rid,
                        isRefresh: this.dt_isRefresh
                    }
                });
            },

            // 去举报
            goReport () {
                Service.CheckLogin(this.$route.fullPath).then(() => {
                    Service.CheckBind().then(() => {
                        this.$router.push({
                            path: "/report",
                            query: {
                                gradetype: this.gradeType,
                                gradeid: this.rid,
                            }
                        });
                    }).catch(() => { });
                }).catch(() => {});
            },

            // 付费置顶
            ShowTimeRange(){
                Service.CheckLogin(this.$route.fullPath).then(() => {
                    Service.CheckBind().then(() => {
                        Service.CheckRealName().then(() => {
                            this.$refs.TimeRange.show()
                        }).catch(() => {
                            this.$dialog.confirm({
                                title: "请先进行实名认证",
                                btns: ["去认证", "好的"]
                            }).then(() => {
                                this.$router.push("/user/authentication");
                            }).catch(() => {});
                        });
                    }).catch(() => {});
                }).catch(() => {});
            },

            //文章内部链接跳转|文章内图片预览
            GetDom() {
                let CDom = document.querySelector("#detCon");
                if(CDom){
                    let ADom = CDom.querySelectorAll('a'),
                        IDom = CDom.querySelectorAll('img');
                    if(ADom) {
                        for (let i = 0; i < ADom.length; i++) {
                            (function (i) {
                                let href = ADom[i].getAttribute("href");
                                ADom[i].setAttribute("href",'javascript:void(0);');
                                ADom[i].onclick = function () {
                                    Service.OpenUrl(href)
                                }
                            })(i)
                        }
                    }
                    if(IDom){
                        let imgList = [];
                        for (let i = 0; i < IDom.length; i++) {
                            let src = IDom[i].getAttribute("src");
                            imgList.push(src);
                            (function (i) {
                                IDom[i].onclick = function () {
                                    Service.ImagePreview(imgList,imgList[i],i)
                                }
                            })(i)
                        }
                    }
                }
            },
        },
        mounted() {
            let t = "";
            if (this.gradeType == 0 || this.gradeType == 5) {
                t = "黑钻评级-评级详情";
            } else if (this.gradeType == 1) {
                t = "黑钻评级-爆料详情";
            } else {
                // if (this.gradeType == 2)
                t = "黑钻评级-内容详情";
            }
            document.title = t;
            if (Global.isApp) Titlebar.title = t;
            this.getDetail();
        },
        updated(){
            //处理APP对于后台文章内的链接跳转问题
            if(Global.isApp){
                this.GetDom();
            }
        }
    };
</script>
<style lang="less" src="./style.less">

</style>
