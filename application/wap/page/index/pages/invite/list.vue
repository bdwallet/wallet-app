<template>
    <div class="invite-list">
        <div class="list-wrap-title">
            <div class="el-title name">邀请好友</div>
            <div class="el-title">已获奖励</div>
            <div class="el-title surplus">待释放奖励</div>
        </div>
        <div class="list-wrap" v-if="Invite.length > 0">
            <comp-scroll :on-refresh="OnRefresh" :on-infinite="OnInfinite">
                <ul>
                    <li class="list" v-for="(item, i) in Invite" :key="i">
                        <div class="left" @click.stop="$router.push(`/user/homepage/${item.invite_by_user_id}`)">
                            <comp-avatar :src="item.user_photo" :size="94" :level="item.level" :itemid="item.user_located_item_id" :border="false" />
                            <div class="center">
                            <!--<div class="title">-->
                                <!--<span class="name">{{ item.user_name }}</span>-->
                                <!--<span class="level" v-if="item.user_level&&item.user_level!='0'">LV.{{item.user_level}}</span>-->
                            <!--</div>-->
                                <div class="tel">{{item.user_tel}}</div>
                            </div>
                        </div>
                        <!-- 登录领取的黑钻 -->
                        <div class="right" v-if="item.stay_sent_hzt"><span class="reward-hz">+{{item.stay_sent_hzt}}</span></div>
                        <div class="right" v-if="item.stay_surplus_hzt"><span class="reward-hz">+{{item.stay_surplus_hzt}}</span></div>
                    </li>
                </ul>
            </comp-scroll>
        </div>
        <comp-empty class="noComment" v-if="Invite.length == 0" mainHeight="calc(100vh - 6.25rem)" text="您目前还没有成功邀请好友哦" />
    </div>
</template>

<script>
    import compAvatar from "~components/compAvatar";
    import compLevel from "~components/compLevel";
    import compScroll from "~components/compScroll";
    import compEmpty from "~components/compEmpty";
    export default {
        name: "invite-list",
        components: {
            compAvatar,
            compEmpty,
            compLevel,
            compScroll
        },
        data() {
            return {
                Invite: [], //评论列表
                current_page: 1,
                page_size: 10,
                more: true, //标识是否还有更多未加载数据
            }
        },
        methods: {
            GetData(handle, isrefresh) {
                let p = {
                    current_page: this.current_page,
                    page_size: this.page_size
                };
                this.$ajax.get(this.$api.apply.get_invite_list, p).then( res => {
                    let r = res.data;
                    if(r.status == 1) {
                        if(isrefresh) {
                            this.Invite = r.data;
                        }else {
                            this.Invite = this.Invite.concat(r.data);
                        }
                        this.more = r.data.length >= this.page_size;
                        handle && handle();

                    }
                }).catch((err) => {
                    this.$dialog.alert({
                        title: '系统消息',
                        content: err.message,
                        btns: ['好']
                    });
                    handle && handle();
                });
            },
            OnInfinite(done) {
                // 上拉加载
                if (this.more) {
                    this.current_page++;
                    this.GetData(done);
                } else {
                    done();
                }
            },
            OnRefresh(done) {
                // 下拉刷新
                this.current_page = 1;
                this.more = true;
                this.GetData(done, true);
            }
        },
        mounted() {
            this.Invite = [];
            this.current_page = 1;
            this.GetData()
        }
    }
</script>

<style lang="less" scoped>
    .invite-list{
        .list-wrap-title{
            position: relative;
            height: 2.25rem;
            width: 100%;
            display: flex;
            padding: 0 .75rem;
            justify-content: space-between;
            align-items: center;
            background: #fff;
            color: #888;
            z-index: 1;
            &::before{
                content: '';
                position: absolute;
                bottom: .1rem;
                z-index: 2;
                left: -.75rem;
                right: -.75rem;
                height: .025rem;
                background: #D6D6DB;
                transform: scaleY(.5);
                -webkit-transform: scaleY(.5);
                -moz-transform: scaleY(.5);
                -ms-transform: scaleY(.5);
                -o-transform: scaleY(.5);
            }
            .el-title{
                flex: 2;
                font-size: .7rem;
                color: #888;
                &.name{
                    flex: 4;
                    color: #333;
                }
                &.surplus{
                    text-align: center;
                }
            }
        }
        .list-wrap{
            padding: 0 .75rem;
            ul{
                li.list{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: .75rem 0;
                    .left,.right{
                        display: flex;
                    }
                    .left{
                        .center{
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            margin-left: .4rem;
                            .title{
                                display: flex;
                                justify-content: flex-start;
                                .name{
                                    font-size: .75rem;
                                    font-weight: bold;
                                    color: #333;
                                }
                                .level{
                                    display: flex;
                                    width: 1.65rem;
                                    height: .8rem;
                                    margin-top: .2rem;
                                    margin-left:.4rem;
                                    justify-content: center;
                                    align-items: center;
                                    background: linear-gradient(180deg, rgba(248, 213, 188, 1) 0%, rgba(255, 177, 136, 1) 100%);
                                    border-radius: 24px;
                                    color: #fff;
                                    font-size: .5rem;
                                }
                            }
                            .tel{
                                // font-size: .55rem;
                                font-size: .75rem;
                                // color: #888;
                                color: #333;
                            }
                        }
                    }
                    .right{
                        font-size: .75rem;
                        font-weight: bold;
                        color: #5682FF;
                        text-align: right;
                    }
                }
            }
        }
    }
</style>