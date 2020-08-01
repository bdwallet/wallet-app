<template>
    <div class="user-task">
        <!--<div class="header">
            <div class="checkin">
                <div class="checkin-left">
                    <div>已连续签到</div>
                    <div class="day">
                        <span>{{sign_data.singn_num}}</span>天
                    </div>
                </div>
                <div class="checkin-right">
                    <div @click.stop="explain">任务说明</div>
                    <div
                        class="checkin-btn"
                        :class="{'active':sign_data.singn_status||isDisabled}"
                        @click="Sign"
                    >
                        <i class="icon icon-qiandao_"></i>
                        {{sign_data.singn_status?'已签到':'签到'}}
                    </div>
                </div>
            </div>
            <ul class="level-list">
                <li v-for="item in 7" :key="item">
                    <div class="top">
                        <div
                            class="crown gold"
                            :class="{'active':(parseInt(sign_data.singn_num)>=item)}"
                        >
                            <i class="icon icon1 icon-renwuzhongxinicbg1"></i>
                            <i class="icon icon2 icon-renwuzhongxinicbg1"></i>
                            <span class="extranum">
                                <span>+1</span>
                            </span>
                        </div>
                    </div>
                    <div>
                        {{ (sign_data&&sign_data.singn_num)>=+item ? "已签" : ('第'+item+'天') }}
                        &lt;!&ndash; ?("第'+item+'天") : "已签到"  &ndash;&gt;
                    </div>
                </li>
            </ul>
        </div>-->
        <div class="content">
            <div class="wrap">
                <div class="title">
                    <i class="icon icon-Path1"></i>推荐任务
                </div>
                <div class="task-list" v-for="(item,index) in tasklist" v-if="index==6 || index==7">
                    <div class="task-left">
                        <div
                            class="left-icon"
                            :class="index == 6 ? 'sprites-icon-phone' : 'sprites-icon-pen'"
                        ></div>
                        <div class="task-item"  @click.stop="Msg(item.tip,$event)">
                            <div class="task-title">
                                {{item.taskname}}
                                <div class="tiparea">
                                    <i
                                        class="icon icon-bangzhuzhongxin"
                                        v-if="item.tip"
                                    ></i>
                                </div>
                            </div>
                            <div class="task-score">
                                <img :src="$assets.diamond" />
                                {{ item.award }} 奖励
                            </div>
                        </div>
                    </div>
                    <div class="task-right">
                        <div class="complete" @click.stop="DoTask(index)">去完成</div>
                    </div>
                </div>
            </div>
            <div class="wrap">
                <div class="title">每日任务</div>
                <div
                    class="task-list"
                    v-for="(item,index) in tasklist"
                    :key="index"
                    v-if="index>=51 && index<=58"
                    @click.stop="Msg(item.tip,$event)"
                >
                    <div class="task-left">
                        <div class="left-icon" :class="item.iconclass"></div>
                        <div class="task-item">
                            <div class="task-title">
                                {{item.taskname+' ('+item.count+'/'+item.tasknum+')'}}
                                <div class="tiparea">
                                    <i
                                        class="icon icon-bangzhuzhongxin"
                                        v-if="item.tip"
                                    ></i>
                                </div>
                            </div>
                            <div class="task-score">
                                <img :src="$assets.diamond" />
                                {{ item.award }} 奖励
                            </div>
                        </div>
                    </div>
                    <div
                        class="task-right"
                        :class="{'done':(item.count>=item.tasknum)}"
                        @click.stop="DoTask(index,(item.count>=item.tasknum))"
                    >
                        <div class="complete">{{(item.count>=item.tasknum)?'已完成':'去完成'}}</div>
                    </div>
                </div>
            </div>
            <div class="wrap" :style="{order: newOrder}">
                <div class="title">新手任务</div>
                <div
                    class="task-list"
                    v-for="(item,index) in tasklist"
                    :key="index"
                    v-if="index>=1 && index<=3"
                    @click.stop="Msg(item.tip,$event)"
                >
                    <div class="task-left">
                        <div class="left-icon" :class="item.iconclass"></div>
                        <div class="task-item">
                            <div class="task-title">
                                {{item.taskname}}
                                <div class="tiparea">
                                    <i
                                        class="icon icon-bangzhuzhongxin"
                                        v-if="item.tip"
                                    ></i>
                                </div>
                            </div>
                            <div class="task-score">
                                <img :src="$assets.diamond" />
                                {{ item.award }} 奖励
                            </div>
                        </div>
                    </div>
                    <div
                        class="task-right"
                        :class="{'done':(item.count>=item.tasknum)}"
                        @click.stop="DoTask(index,(item.count>=item.tasknum))"
                    >
                        <div class="complete">{{(item.count>=item.tasknum)?'已完成':'去完成'}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "user-task",
    data() {
        return {
            tasklist: {},
            // sign_data: {},
            datetime: null, // 时间戳
            newOrder: -1,
            // isDisabled: false // 签到按钮禁用
        };
    },
    computed: {
        user() {
            return this.$store.getters.userInfo;
        },
        isLogin() {
            return this.user && this.user.user_id ? 1 : 0;
        },
        bannedType() {
            //账号异常状态 1正常  -1冻结账号  -2禁言  -3不能获取奖励   -4答题 -5禁止提现和赞赏
            return this.$store.getters.bannedType;
        }
    },
    methods: {
        explain() {
            this.$dialog.pannel({
                title: "任务说明",
                content: [
                    "1、完成任务，将获得对应黑钻和等额的经验值（可升级）。可于等级中心、钱包中心里查看奖励明细",
                    "2、其余任务：可点击任务项，了解相应奖励规则"
                ]
            });
        },

        // Msg 弹窗
        Msg(str,e) {
            if(str)
                this.$dialog.msg({
                    content: str
                },e)
        },

        Sign() {
            // 每日签到
            // if (this.sign_data.singn_status || this.isDisabled) return false;

            // 实名认证登录释放
            if(this.datetime && (new Date().getTime()/1000) > this.datetime) return false;

            Service.CheckBind().then(() => {
                Ajax.post(Api.apply.user_sign).then(res => {
                    if (res.data.status == 1) {
                        this.datetime = res.data.req['1'];
                        if(+res.data.hzt > 0) this.$dialog.other("实名认证登录", res.data.hzt).then(() =>{});
                        // this.sign_data.singn_num =
                        //     this.sign_data.singn_num == 7
                        //         ? 1
                        //         : +this.sign_data.singn_num + 1;
                        // this.sign_data.singn_status = 1;
                    }
                }).catch(res => {
                    // if (res.status == -20099) {
                    //     //禁获奖励
                    //     this.isDisabled = true;
                    // }
                });
            });
        },
        InTask() {
            // 推荐任务
            let list = {};
            for (let i = 6; i <= 7; i++) {
                switch (i) {
                    case 6:
                        list[i] = {}; //邀请好友
                        list[i]["taskname"] = "邀请好友";
                        list[i]["award"] = "+300";
                        list[i]["iconclass"] = "sprites-icon-hot";
                        list[i]["tip"] = "";
                        break;
                    case 7:
                        list[i] = {}; //推荐任务里的发评级
                        list[i]["taskname"] = "发评级";
                        list[i]["award"] = "+10-670";
                        list[i]["iconclass"] = "sprites-icon-hot";
                        list[i]["tip"] =
                            "根据评级内容的优质程度、发布顺序将获得不同阶梯的奖励（审核不通过、删除会撤回）";
                        break;
                }
            }

            for (let i = 1; i <= 58; i++) {
                if ((i >= 1 && i <= 3) || i === 51 || (i >= 54 && i <= 55) || (i >= 57 && i <= 58)) {
                    if (!list[i]) {
                        list[i] = {};
                        list[i]["count"] = 0;
                    }
                    switch (i) {
                        case 1: //1新手任务 实名认证
                            list[i]["taskname"] = "实名认证每日登录";
                            list[i]["iconclass"] =
                                "sprites-icon-authen";
                            list[i]["award"] = "+200";
                            list[i]["tasknum"] = "1";
                            list[i]["tip"] = "通过实名认证后，从次日起的100天内登录【访问任务中心即视为登录；若100天内某日未登录，则视为放弃当日奖励】，可释放2黑钻积分，累计200黑钻积分";
                            break;
                        case 2: //2新手任务 首次完善个人资料
                            list[i]["taskname"] = "首次完善个人资料";
                            list[i]["iconclass"] = "sprites-icon-men";
                            list[i]["award"] = "+5";
                            list[i]["tasknum"] = "1";
                            list[i]["tip"] =
                                "个人资料首次通过审核（老用户若未获奖励，请去个人中心再编辑1次）";
                            break;
                        case 3: //3新手任务 注册后首登APP
                            list[i]["taskname"] = "注册后首登APP";
                            list[i]["iconclass"] = "sprites-icon-app";
                            list[i]["award"] = "+20";
                            list[i]["tasknum"] = "1";
                            list[i]["tip"] =
                                "注册后首登APP（老用户若未获奖励，请退出账号后重新登录）";
                            break;
                        case 51: //51分享1  --> 每日任务
                            list[i]["taskname"] = "分享";
                            list[i]["iconclass"] =
                                "sprites-icon-share";
                            list[i]["award"] = "+1";
                            list[i]["tasknum"] = "1";
                            list[i]["tip"] =
                                "分享评级详情、爆料详情、个人主页均可获得奖励";
                            break;
                        case 54: //54发布爆料3  --> 每日任务
                            list[i]["taskname"] = "发爆料";
                            list[i]["iconclass"] = "sprites-icon-hot";
                            list[i]["award"] = "+1";
                            list[i]["tasknum"] = "2";
                            list[i]["tip"] =
                                "每日仅前2条爆料能获得发布奖励1（审核不通过、删除会撤回）；每日发布的所有爆料都有机会获得额外的100奖励（平台推荐）。全网首发劲爆内容投稿给我们（微信号：wangbiao-yihan），有机会获得数千黑钻奖励";
                            break;
                        case 55: //55发布评论3   --> 每日任务
                            list[i]["taskname"] = "评论他人";
                            list[i]["iconclass"] = "sprites-icon-talk";
                            list[i]["award"] = "+1";
                            list[i]["tasknum"] = "3";
                            list[i]["tip"] =
                                "每日仅前3条评论（包含对他人评论的回复）能获得发布奖励1（审核不通过、删除会撤回）";
                            break;
                        case 57: //57点赞3  --> 每日任务
                            list[i]["taskname"] = "点赞他人24小时内评级";
                            list[i]["iconclass"] = "sprites-icon-like";
                            list[i]["award"] = "+0.5";
                            list[i]["tasknum"] = "5";
                            list[i]["tip"] =
                                "针对新评级、追加评级（不包括历史评级）的点赞均可获得奖励；每日前5次赞还能参与“评级热榜”活动，获得点赞分红";
                            break;
                        case 58: //58点赞3  --> 每日任务
                            list[i]["taskname"] = "点赞他人其他内容";
                            list[i]["iconclass"] = "sprites-icon-like";
                            list[i]["award"] = "+0.5";
                            list[i]["tasknum"] = "3";
                            list[i]["tip"] =
                                "其他内容包括：①爆料、项目公告、热议话题 ②评论（针对评级、爆料、项目公告、热议话题的评论及回复）";
                            break;
                    }
                }
            }
            this.tasklist = list;
        },
        Format(data) {
            //数据格式重构
            for (let key in data) {
                if ((data[key].type >= 1 && data[key].type <= 3) || (data[key].type >= 51 && data[key].type <= 58)) {
                    this.tasklist[data[key].type].count = parseInt(data[key]["COUNT(1)"]);
                }
            }
            //新手任务完成后，将显示调至列表最后
            for (let i in this.tasklist) {
                if (i <= 3) {
                    this.newOrder = this.tasklist[i].count < this.tasklist[i]["tasknum"] ? -1 : 0;
                }
            }
        },
        GetMission() {
            Ajax.post(Api.apply.get_mission).then(res => {
                if (res.status == 1) {
                    this.Format(res.data);
                    // this.Sign();
                    // this.sign_data = res.data.mission_data["sign_data"];
                    // res.data.user_data.user_tel && this.Sign();
                }
            });
        },
        DoTask(index, status) {
            if (status) return false;
            Service.CheckBind().then(() => {
                if (index == 6) {
                    //邀请好友
                    this.$router.push("/invite/main");
                } else if (index == 7) {
					if (this.bannedType.indexOf(-2) != -1) {
                        //禁言
                        Dialog.alert(
                            "很抱歉，您目前行为受限，无法进行相应操作。"
                        );
                    }else {
						//发评级
						Service.CheckLevel(3)
							.then(() => {
								this.$router.push("/select/2/0");
							})
							.catch(() => {
								//不是超级评审员
								this.$router.push("/user/application");
							});
					}
                } else if (index == 54) {
                    //发布爆料
                    if (this.bannedType.indexOf(-2) != -1) {
                        //禁言
                        Dialog.alert(
                            "很抱歉，您目前行为受限，无法进行相应操作。"
                        );
                    } else {
                        this.$router.push("/select/2/1");
                    }
                } else if (index == 1) {
                    //实名认证
                    this.$router.push("/user/authentication");
                } else if (index == 2) {
                    //首次完善个人资料
                    this.$router.push("/user/setup/profile");
                } else if (index == 3) {
                    //登录app
                    if(Global.isApp && Global.isPro) {
                        this.$dialog.tip('请重新登录过后查看任务结果')
                    } else window.location.href = "/down.html";
                } else {
                    //发布评论或评论或分享
                    this.$router.push("/");
                }
            });
        },
        Share() {
            let _this = this;
            Share.Ready({
                title: "【黑钻评级】任务中心",
                desc: "做任务得黑钻，快速升级尊享黑钻评级海量特权",
                link: location.href,
                circleFunction() {
                    //分享朋友圈成功回调
                    _this.tasklist["17"]["count"] = 1;
                },
                friendFunction() {
                    //分享给朋友成功回调
                    _this.tasklist["17"]["count"] = 1;
                }
            });
        }
    },
    mounted() {
        //初始任务中心数据
        this.InTask();
        //this.Sign();
    },
    activated() {
        this.GetMission();
        this.Sign();
        this.Share();
    }
};
</script>
