<template>
    <div class="announce-main">
        <!-- 吸顶tab -->
        <div class="com-tab">
            <div class="tab-item">
                <span :class="{'active': currentTab==0}" @click="Cuter(0)">快讯</span>
            </div>
            <div class="tab-item">
                <span :class="{'active': currentTab==1}" @click="Cuter(1)">项目方动态</span>
            </div>
            <div class="tab-item">
                <span :class="{'active': currentTab==7}" @click="Cuter(7)">新闻</span>
            </div>
        </div>
        <comp-announce-news v-if="currentTab == 0" />
        <div v-else-if="currentTab == 1">
            <comp-banner type="5" />
            <div class="wrap housed">
                <div class="title">
                    <div class="left">已入驻项目</div>
                    <div class="right" @click="$router.push('/announce/list')">更多<span class="icon icon-shouhui"></span></div>
                </div>
                <ul class="ul-main">
                    <li class="list" v-for="h in dt_housed_data" :key="h" @click="$router.push(`/article/${h.item_id}?pro=${h.item_urrency_abbreviation}`)">
                        <img :src="`${h.item_logo}?x-oss-process=image/resize,m_fill,h_96,w_96`">
                    </li>
                </ul>
            </div>
            <div class="announce-wrap">
                <div class="com-pro-order comp-userbox com-sticky">
                    <div class="label">全部公告（{{totalNum}}）</div>
                    <div class="order">
                        <span :class="{'current':current(0)}" @click="orderType=0">最新</span>
                        <span :class="{'current':current(1)}" @click="orderType=1">热门</span>
                    </div>
                </div>
                <keep-alive>
                    <comp-datalist :key="orderType" scene="4" type="5" :show-order="`${orderType}`" @getTotal='getTotal' mainHeight="calc(100vh - 14.9rem)" />
                </keep-alive>
            </div>
        </div>
        <div v-else-if="currentTab==7" class="news-list">
            <keep-alive>
                <comp-datalist scene="6" :type="currentTab" />
            </keep-alive>
        </div>
    </div>
</template>

<script>
    import compBanner from "~components/compBanner";
    import compDatalist from "~components/compDatalist";
    import compAnnounceNews from "~components/announceList/news";
    export default {
        name: "announce-main",
        components: {
            compBanner,
            compDatalist,
            compAnnounceNews,
        },
        data() {
            return {
                dt_housed_data: [],
                totalNum: 0,
                orderType: 0, //排序默认0最新 1热门(点赞数)
                oldOrder: 0, // 缓存排序
            };
        },
        computed: {
            currentTab() {
                return this.$route.query.tab;
            }
        },
        methods: {
            // 获取全部公告
            getTotal(total) {
                return (this.totalNum = total);
            },
            getHoused() {
                // 获取项目最新入驻
                this.$ajax.post(this.$api.apply.itemnoti_get_new).then(res => {
                    if (res.status == 1) {
                        this.dt_housed_data = res.data;
                    } else {
                        this.$dialog.alert(res.message);
                    }
                }).catch(err => {
                    this.$dialog.alert(err.message);
                });
            },
            current(type) {
                return this.orderType == type;
            },
            //TAB切换处理
            Cuter(tab) {
                let query = {
                    path: '/announce/main',
                    query: {
                        tab: tab
                    }
                }
                this.$router.replace(query);
                this.Share();
            },
            Share(){
                //分享配置
                Share.Ready({
                    title: "黑钻评级——了解项目动态，尽在黑钻评级",
                    desc: "各方项目公告，最新动态行情，尽在黑钻评级",
                    link: location.href
                });
            }
        },
        mounted() {
            this.Share();
            this.oldOrder = this.orderType;
            this.getHoused();
        },
        activated() {
            if (this.oldOrder != this.orderType) {
                this.oldOrder = this.orderType;
            }
        }
    };
</script>

<style lang="less" src="./style">

</style>
