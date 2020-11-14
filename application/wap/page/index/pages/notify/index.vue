<template>
    <div class="notify">
        <div class="notify-list" v-if="!type">
            <div class="comp-item-list item-list">
                <div class="comp-item-wrap item-wrap" v-if="dataList && !loading" v-for="(item,index) in dataList"  @click.stop="GoMain(index+1)">
                    <div class="item-left">
                        <div class="img"><img :src="item.img" ></div>
                        <div class="title">{{ item.title }}</div>
                    </div>
                    <div class="comp-item-right item-right">
                        <div :class="{ 'red-num': item.num }">{{ +item.num>999 ? `999+`: item.num }}</div>
                        <i class="icon icon-shouhui"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="notify-main" v-else>
            <comp-scroll
                    v-if="!(notifyList.length == 0 && !loading)"
                    ref="scroller"
                    :on-refresh="OnRefresh"
                    :on-infinite="OnInfinite"
            >
                <ul class="list-box">
                    <li v-for="(item,index) in notifyList" :key="item">
                        <comp-avatar
                                @click.native.stop="GoToUserHome(item.msg_send_user,item.msg_data.anonymity)"
                                :src="item.msg_data.user_photo"
                                :level="item.msg_data.level"
                                size="94"
                                :itemid="item.msg_data.user_located_item_id"
                                :border="false"
                        />
                        <div class="center" @click.stop="OpenActionPannel(item)">
                            <div class="title">
                                <!-- <span-->
                                <!-- @click.stop="gotoUserHome(item.msg_send_user,item.msg_data.anonymity)"-->
                                <!-- >{{item.message_content.name}}</span>-->
                                <span>{{item.msg_title}}</span>
                            </div>
                            <div v-if="!item.showAll" class="content">
                                {{ item.msg_content.substr(0, 20) }}
                                <span
                                        v-if="item.msg_content.length > 20"
                                        @click.stop="ShowAll(index,true)"
                                        class="more"
                                >展开</span>
                            </div>
                            <div v-else class="content">
                                {{item.msg_content}}
                                <span
                                        v-if="item.msg_content.length > 20"
                                        @click.stop="ShowAll(index,false)"
                                        class="more"
                                >收起</span>
                            </div>
                            <div class="time">{{$service.Dater(item.msg_create_time)}}</div>
                        </div>
                        <div
                                class="comer-desc"
                                v-if="item.msg_des"
                                @click.stop="OpenActionPannel(item)"
                        >{{item.msg_des}}</div>
                    </li>
                </ul>
                <div v-if="!more" slot="infinite" class="text-center">
                    <span class="line-fast"></span>
                    <span class="txt-fast">没有更多内容</span>
                    <span class="line-fast"></span>
                </div>
            </comp-scroll>
            <comp-empty
                    v-if="notifyList.length <= 0 && !loading"
                    class="empty-page"
                    mainHeight="calc(100vh - 2.5rem)"
                    text="您暂未收到任何信息"
            >
            </comp-empty>
        </div>
    </div>
    <!--<div class="notify">-->
        <!--<router-view />-->
    <!--</div>-->
</template>


<script>
    import "./style";

    import compScroll from "~components/compScroll";
    import compAvatar from "~components/compAvatar";
    import compEmpty from "~components/compEmpty";
    import create from "~components/comment/creat";

    export default {
        name: "notify",

        components: {
            compScroll,
            compAvatar,
            compEmpty
        },
        data() {
            return {
                dataList: [ // 列表数据
                    {img: this.$assets.iconLogo, title: "系统消息"},
                    {img: this.$assets.iconRate, title: "评论与回复"},
                    {img: this.$assets.iconLike, title: "赞我的人"},
                    {img: this.$assets.iconFans, title: "新粉丝"}
                ],

                loading: false, // 标识是否正在加载数据
                notifyList: [], // 消息数据容器
                current_page: 1,
                page_size: 20,
                more: true, // 标识是否还有更多未加载数据
                actionObject: {} // 操作对象
            };
        },
        computed: {
            isLogin() {
                return this.userInfo && this.userInfo.user_id ? 1 : 0;
            },
            userInfo() {
                return this.$store.getters.userInfo;
            },
            bannedType() { // 账号异常状态 1正常  -1冻结账号  -2禁言  -3不能获取奖励   -4答题 -5禁止提现和赞赏
                return this.$store.getters.bannedType;
            },
            type(){
                return this.$route.query.tab
            }
        },
        watch: { // 监听路由变化 获取数据
            '$route': 'GetChange'
        },
        methods: {
            // 跳转到消息详情页
            GoMain (index) {
                this.$router.push(`/notify?tab=${index}`);
            },

            // 路由改变 重新获取数据
            GetChange () {
                if(this.$route.name == 'notify'){
                    this.GetMsgNum();
                    if(this.type) {
                        this.notifyList = [];
                        this.GetDataList(null, true);
                        this.ClearMessageStatus();
                    }
                }
            },

            // 获取消息数据列表
            GetDataList(handle, isrefresh) {
                this.loading = true;
                let params = {
                    current_page: this.current_page,
                    page_size: this.page_size,
                    type: this.type
                };
                this.$ajax.get(this.$api.apply.get_meg_list, params).then(res => {
                    this.loading = false;
                    if (isrefresh) {
                        this.notifyList = res.data;
                    } else {
                        this.notifyList = this.notifyList.concat(res.data);
                    }
                    this.more = res.data.length >= this.page_size;
                    handle && handle();
                }).catch(err => {
                    this.loading = false;
                    handle && handle();
                });
            },

            // 获取消息数目
            GetMsgNum() {
                this.loading = true;
                Ajax.post(Api.apply.unread_messages_numlist).then(res => {
                    if(res.data.length > 0) {
                        // 处理 红色背景 数据
                        res.data.forEach(item => {
                            if(item.msg_type == 1) this.dataList[0].num = item['COUNT(1)'];
                            if(item.msg_type == 2) this.dataList[1].num = item['COUNT(1)'];
                            if(item.msg_type == 3) this.dataList[2].num = item['COUNT(1)'];
                            if(item.msg_type == 4) this.dataList[3].num = item['COUNT(1)'];
                        });
                    } else {
                        // 处理 页面返回 红色数据不消失问题
                        this.dataList.forEach(item => {
                            if(item.num) item.num = null
                        })
                    }
                    this.loading = false;
                }).catch(() => {
                    this.loading = false;
                })
            },

            // 下拉刷新处理函数
            OnRefresh(done) {
                this.current_page = 1;
                this.more = true;
                this.GetDataList(done, true);
            },

            // 上拉加载处理函数
            OnInfinite(done) {
                if (this.more) {
                    this.current_page++;
                    this.GetDataList(done);
                } else {
                    done();
                }
            },

            // 跳转至用户个人主页
            GoToUserHome(uid, anonymity) {
                if (uid <= 0) return; //官方帐号
                if (anonymity == 1) {
                    //匿名消息不进行跳转
                    this.$dialog.tip("该大侠已归隐江湖，没法打听到他的行踪");
                    return;
                }
                this.$router.push({
                    path: `/user/homepage/${uid}`
                });
            },

            // 展开全部内容
            ShowAll(index, status) {
                this.$set(this.notifyList[index], "showAll", status);
            },

            // 打开操作面板
            OpenActionPannel(item) {
                this.actionObject = item; // 操作数据对象
                let _this = this;
                let btns = [];
                let btn1 = {
                    name: "回复",
                    action: _this.ReplyClickEvent
                };
                let btn2 = {
                    name: "查看原内容",
                    action: _this.ReadClickEvent
                };
                // 系统消息
                if(item.msg_type == 1 | item.msg_type == 4) {
                    if(!!item.msg_data.url) { // 为真 则跳转
                        this.$router.push(item.msg_data.url);
                    }
                } else if (item.msg_type == 2 || item.msg_type == 3){ // 2、评论回复|3、点赞
                    if(item.msg_type == 2) {
                        // 点赞消息没有回复操作 只有评论消息才有回复操作
                        btns.push(btn1);
                    }
                    btns.push(btn2);
                    this.$dialog.action(btns);
                }
            },

            // 回复操作处理函数
            ReplyClickEvent()  {
                if(this.bannedType.indexOf(-2) != -1){ //禁言
                    this.$dialog.alert('很抱歉，您目前行为受限，无法进行相应操作。');
                    return;
                }
                if (this.actionObject.msg_data.type) {
                    let up_id = this.actionObject.msg_data.up_id == 0 ? this.actionObject.msg_data.pater_id : this.actionObject.msg_data.up_id;
                    let vm = create({
                        type: this.actionObject.msg_data.type,
                        typeid: this.actionObject.msg_data.key_id,
                        commentid: this.actionObject.msg_data.pater_id,
                        pdata: {
                            user_id: this.actionObject.msg_send_user,
                            comment_id: up_id, // 消息关联id
                        },
                        placeholder: `回复${this.actionObject.msg_data.user_name}：`
                    });
                    vm.$on("submit", res => {
                        if (res.data.status == 1) {
                            if (res.data.commentData.mission[0]) {
                                this.$dialog.other("回复成功", res.data.commentData.mission[2].hzt, "");
                            } else {
                                this.$dialog.tip("回复成功");
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
                }
            },

            // 查看操作处理函数 只有用户消息才会有此选项
            ReadClickEvent() {
                if(!!this.actionObject.msg_data.url) { // 为真 则跳转
                    this.$router.push(this.actionObject.msg_data.url);
                }
            },

            // 清除消息未读状态
            ClearMessageStatus() {
                setTimeout(() => {
                    this.$store.commit("changeHaveMessage", false);
                }, 500);
            }
        },
        mounted() {
            // 微信分享接口配置
            setTimeout(() => {
                Share.Ready();
            });

            // 获取消息数据
            this.GetMsgNum();

            // 处理刷新没有数据
            if(this.type) {
                this.GetDataList(null, true);
                this.ClearMessageStatus();
            }
        }
    };
</script>

