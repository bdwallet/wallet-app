<template>
    <div class="user-level">
        <div class="topnav">
            <div @click.stop="explain">等级说明</div>
            <div @click="$router.push('/user/exp')">经验明细</div>
        </div>
        <comp-avatar :src="userInfo.user_photo" :level="userInfo.level" size="140" :itemid="userInfo.user_located_item_id" />
        <comp-level :username="userInfo.user_name" :value="currentLv" />
        <div class="experience">
            <span class="number">{{userExp}}</span>
            <span class="txt">经验值</span>
        </div>
        
        <comp-swiper class="swiper-progress" v-if="!loading" ref="swiperLv" width="7.3rem" height="3.5rem" :touch="false" :start="1">
            <comp-swiper-item key="0">
                <div class="progress">
                    <div class="bar-box">
                        <div class="bar"></div>
                        <div class="node mid"></div>
                        <div class="bar rt"></div>
                    </div>
                    <div class="lvtxt">
                        <div>LV.0</div>
                        <div>从0开始</div>
                    </div>
                </div>
            </comp-swiper-item>
            <comp-swiper-item v-for="(item,index) in levelArr" :key="index">
                <div class="progress">
                    <div class="bar-box">
                        <div class="bar" :class="{'lt':index<=currentLv-1}"></div>
                        <div class="node" :class="{'big':index==currentLv-1}"><i class="icon icon-ic_heizuan"></i></div>
                        <div class="bar" :class="{'rt':index<=currentLv-1}"></div>
                    </div>
                    <div class="lvtxt" :class="{'current': index==lvstatus-1,'reach': index < currentLv}">
                        <div>LV.{{index+1}}</div>
                        <div v-if="index!=lvstatus-1">{{item}}</div>
                    </div>
                </div>
            </comp-swiper-item>
        </comp-swiper>
        <comp-swiper class="main-swiper" v-if="!loading" ref="swiperFreedom" width="16.8rem" @movend="swiperMovend">
            <comp-swiper-item v-for="(item,index) in levelArr" :key="index">
                <div class="freedom-list">
                    <div class="arrow"><i class="icon icon-sanjiao"></i></div>
                    <div class="head">
                        <div class="exp">
                            <span><i class="icon icon-renwuzhongxinicbg"></i>{{item}}经验值</span>
                            <div class="btn" v-if="index >= currentLv" @click="$router.push('/user/task')">做任务升级</div>
                        </div>
                        <div class="line"></div>
                    </div>
                    <div class="scrollbox">
                        <ul class="list">
                            <li class="item" v-for="item in equityArr" :key="item">
                                <img class="ico" @click.stop="$dialog.msg(item.desc,$event)" :src="item.level<=lvstatus ? item.icon_on : item.icon_off" />
                                <span class="text">{{item.name}}</span>
                            </li>
                            <li class="point">提示：黑钻拍卖及后续权益正在研发中，敬请期待！</li>
                        </ul>
                    </div>
                </div>
            </comp-swiper-item>
        </comp-swiper>
    </div>
</template>

<script>
    import compAvatar from '~components/compAvatar';
    import compLevel from '~components/compLevel';
    import {
        compSwiper,
        compSwiperItem
    } from '~components/compSwiper';
    export default {
        name: 'user-level',
        components: {
            compAvatar,
            compLevel,
            compSwiper,
            compSwiperItem
        },
        data() {
            return {
                currentLv: 0, //用户当前等级
                userExp: 0, //用户当前经验
                levelArr: [], //等级列表
                equityArr: [], //权益列表
                loading: true, //数据加载状态
                lvstatus: 0, //当前滑动到的LV等级
            }
        },
        computed: {
            isLogin() {
                return (this.userInfo && this.userInfo.user_id) ? 1 : 0;
            },
            userInfo() {
                return this.$store.getters.userInfo;
            },
        },
        methods: {
            //滑动结束回调方法，联动等级swiper
            swiperMovend(current) {
                this.$dialog.hide();
                this.$refs.swiperLv.Go(current + 1);
                this.lvstatus = current + 1;
            },
            explain() {
                this.$dialog.pannel({
                    title: "等级说明",
                    content: ["黑钻等级是黑钻社区用户的身份象征。我们将不断完善等级体系，上线更多有价值、有趣的权益，回馈为社区持续作出贡献的用户"]
                });
            },
        },
        mounted() {
            this.$ajax.post(this.$api.apply.get_levelequity_byuser).then(res => {
                this.currentLv = res.data.user_level;
                this.userExp = res.data.user_exp;
                this.levelArr = res.data.leve_to_exp;
                this.levelArr.splice(0, 1); //多了一个0级，后台去掉后删除
                this.equityArr = res.data.equity;
                this.loading = false;
                setTimeout(() => {
                    let goLV = this.currentLv > 0 ? this.currentLv - 1 : this.currentLv;
                    this.$refs.swiperFreedom.Go(goLV);
                }, 10);
            });
            if(!this.isLogin){
                Share.Ready();
                return;
            }
            Share.Ready({
                title: '黑钻评级用户等级权益',
                desc: '加入黑钻评级，尊享海量特权',
                link: location.href,
            });
        },
        // activated() {
        //     console.log('in user-level => activated')
        //     Share.Ready({
        //         title: '用户等级中心-黑钻评级',
        //         desc: '尊享多项特权',
        //         link: location.href,
        //     });
        // }
    }
</script>
