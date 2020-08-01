<template>
    <div class="comp-userinfo" :class="{'to-top': +source.is_top }">
        <div class="left" @click.stop="source.anonymity !=1 ? $router.push(`/user/homepage/${source.user_id||source.comment_user_id||source.itemnoti_user_id || source.give_send_user_id || source.grade_user_id}`) : $dialog.tip('该大侠已归隐江湖，没法打听到他的行踪')">
            <comp-avatar :src="source.anonymity==1?2:source.user_photo" :level="source.userlv" :size="size" :itemid="source.user_located_item_id" :border="false" />
            <div class="center" :style="{'margin-left':centerMarginLeft}">
                <div class="title">
                    <comp-level :username="source.user_name" :isOffiece="source.userlv" :value="source.explv" />
                    <!-- 如果是项目方，则不能匿名？？？ -->
                    <div class="identify" v-if="!source.user_located_item_id">
                        <div class="niming" v-if="source.type==1&&source.anonymity==1">
                            <span>匿名</span>
                        </div>
                    </div>
                </div>
                <div class="time" v-if="isTime">
                    <span v-if="showfloor>0">{{`第${showfloor}楼 . `}}</span>
                    <span :style="{color:source.like_num==-1&&([0,5].includes(+source.type))?'#5682FF':''}">{{$service.Dater(source.create_time||source.give_create_time||source.news_create_time||source.comment_create_time||source.grade_recommend_time||source.itemnoti_create_time)}}</span>
                </div>
                <div class="time" v-else>
                    <span>粉丝&nbsp;{{source.by_attention_num}}</span>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="Topping" v-if="+source.is_top">
                <img :src="$assets.horn" alt=""/>
            </div>
            <div class="score" v-if="!source.user_located_item_id && source.score" @click="$router.push(`/detail/${source.type}/${source.id}`)">
                <span v-if="source.type==0">{{source.score}}分</span>
                <span v-if="source.type==5">{{$service.GetEvaluate(source.score)}}</span>
            </div>
            <div class="hot" v-if="source.type==2&&$route.name!='detail'">
                <span class="hotbox" :class="{'reyi': classType == 0,'reyi-1': classType == 1,'reyi-2': classType == 2,}"><i class="icon icon-Path1"></i>热议</span>
            </div>
            <!-- 赞赏的黑钻 -->
            <div class="reward-hz" v-if="source.give_hzt">{{Number(source.give_hzt)}}黑钻</div>
            <!-- 关注 -->
            <div class="follow-btn" v-if="concernShow && !isSelf" :class="source.is_attention? 'followed' : 'not-followed'" @click="GoConcern">
                <span class="icon icon-add-icon" v-if="!source.is_attention"></span>{{source.is_attention? '已关注' : '关注'}}
            </div>
            <!-- 作者觉得很赞 -->
            <!-- <comp-avatar :src="source.anonymity==1?2:source.user_photo" :level="source.userlv" size="38" :itemid="source.user_located_item_id" :border="false" /> -->
        </div>
    </div>
</template>

<script>
    import compAvatar from '~components/compAvatar';
    import compLevel from '~components/compLevel';
    export default {
        name: "compUserinfo",
        components: {
            compAvatar,
            compLevel
        },
        props: {
            showfloor: { //评论列表的楼层展示
                type: Number,
                default: 0
            },
            source: {
                type: Object,
                default: {}
            },
            size: {
                type: Number,
                default: 80
            },
            centerMarginLeft: {
                type: String,
                default: '.4rem'
            },
            concernShow: { //关注按钮显示
                type: Boolean,
                default: false
            },
            isTime: { //用户名下方是否显示时间
                type: Boolean,
                default: true
            },
        },
        data(){
            return {
                classType: '0'
            }
        },
        computed: {
            uinfo(){
                return this.$store.getters.userInfo;
            },
            isSelf() {
                return this.uinfo.user_id == this.source.user_id;
            },
        },
        methods: {
            //关注
            GoConcern() {
                Service.UpdateAtt(this.source.user_id,() => { //关注
                    this.source.is_attention = 1;
                },() => { //取消关注
                    this.source.is_attention = 0;
                });
            }
        },
        mounted() {
			//定时改变【正在热议】的背景色
			if (this.$route.name == 'recommend') {
				let currentTime = 0;
				setInterval(() => {
					this.classType = ['0', '1', '2'][(currentTime++) % 3];
				}, 10000);
			}
        }
    }
</script>

<style lang="less">
    @import "../assets/css/config";
    .comp-userinfo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        .left {
            display: flex;
            .center {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                max-width: 11rem;
                margin-left: .4rem;
                .title {
                    display: flex;
                    align-items: center;
                    line-height: 1.2;
                    font-size: .7rem;
                    font-weight: @font-weight-bold;
                    color: @color-sub;
                    .comp-level-name {
                        color: @color-sub;
                    }
                    .level {
                        display: flex;
                        align-items: center;
                        margin-left: .4rem;
                        padding: .2rem .3rem;
                        background: rgba(86, 130, 255, .1);
                        border-radius: 0.6rem;
                        line-height: 1;
                        span {
                            margin-left: 0.2rem;
                            margin-top: 2px;
                            font-size: 0.5rem;
                            color: @color-link;
                        }
                        .icon {
                            font-size: .7rem;
                            color: @color-link;
                        }
                    }
                    .identify {
                        .niming {
                            position: relative;
                            margin-left: 0.3rem;
                            border-radius: 0.1rem;
                            border: 0.05rem solid #5682FF;
                            color: #5682FF;
                            span {
                                display: table-cell;
                                text-align: center;
                                vertical-align: middle;
                                height: 0.6rem;
                                font-size: 0.6rem;
                                text-align: center;
                                -webkit-transform: scale(0.83);
                                transform: scale(0.83);
                            }
                        }
                    }
                }
                .time {
                    margin-top: .2rem;
                    line-height: .55rem;
                    font-size: .5rem;
                    color: @color-time;
                }
            }
        }
        .right {
            line-height: 1.6;
            text-align: right;
            font-size: .8rem;
            font-weight: @font-weight-bold;
            color: @color-num;
            display: flex;
            align-items: center;
            justify-content: center;
            // min-width: 4rem;
            img {
                width: 4.125rem;
                height: 1.5rem;
                opacity: 0.8;
            }
            .hotbox {
                padding: 0.2rem 0.4rem;
                color: #fff;
                font-size: 0.8rem;
                transition: all .5s;
                i {
                    font-size: 0.7rem;
                    margin-right: 0.1rem;
                }
                &.reyi{
                    background: linear-gradient(119deg,rgba(255,166,81,1) 0%,rgba(255,112,72,1) 29%,rgba(255,33,58,1) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    i {
                        background: linear-gradient(119deg,rgba(255,166,81,1) 0%,rgba(255,112,72,1) 29%,rgba(255,33,58,1) 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                }
                &.reyi-1{
                    background: linear-gradient(313deg,rgba(255,111,64,1) 0%,rgba(255,210,33,1) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    i {
                        background: linear-gradient(313deg,rgba(255,111,64,1) 0%,rgba(255,210,33,1) 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                }
                &.reyi-2{
                    background: linear-gradient(138deg,rgba(210,70,255,1) 0%,rgba(51,98,255,1) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    i {
                        background: linear-gradient(138deg,rgba(210,70,255,1) 0%,rgba(51,98,255,1) 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                }
            }
            .reward-hz{
                color: @color-link;
                font-size: .75rem;
            }
            .score{
                margin-right: .45rem;
                font-weight: 700;
            }
            .Topping{
                width: 1.5rem;
                height: 1.4rem;
                background: transparent;
                margin-right: .5rem;
                padding-bottom: .2rem;
                img{
                    width: 100%;
                    height: 100%;
                    display: inline-block;
                }
            }
        }
    }
    .to-top{
        margin: -1rem -.75rem;
        background-image: url('@{hosturl}top-bg.png');
        background-size: cover;
        background-repeat: no-repeat;
        padding: 1rem .75rem;
    }
</style>
