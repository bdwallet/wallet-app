<template>
    <div class="hot-main">
        <comp-banner type="4" />
        <!-- 吸顶tab -->
        <div class="com-tab">
            <div class="tab-item">
                <span :class="{'active': currentTab==8}" @click="Cuter(8)">路演直播</span>
            </div>
            <div class="tab-item">
                <span :class="{'active': currentTab==9}" @click="Cuter(9)">空投活动</span>
            </div>
            <!-- 暂时注掉 -->
            <!-- <div class="tab-item">
                        <span :class="{'active': currentTab==10}" @click="Cuter(10)">官方活动</span>
                    </div> -->
        </div>
        <keep-alive>
            <comp-datalist scene="6" :type="currentTab" :key="currentTab" />
        </keep-alive>
    </div>
</template>

<script>
    import compBanner from '~components/compBanner';
    import compDatalist from '~components/compDatalist';
    export default {
        name: 'hot-main',
        components: {
            compBanner,
            compDatalist
        },
        computed: {
            currentTab() {
                // tab激活  8:路演直播  9：空投活动  10：官方活动
                return this.$route.query.tab;
            }
        },
        methods: {
            //TAB切换处理
            Cuter(tab) {
                let query = {
                    path: '/hot/main',
                    query: {
                        tab: tab
                    }
                }
                this.$router.replace(query);
                this.Share();
            },
            Share() {
                //分享配置
                Share.Ready({
                    title: '黑钻评级——热门活动，尽在黑钻评级',
                    desc: '路演空投，线下交流，尽在黑钻评级',
                    link: location.href,
                });
            }
        },
        mounted() {
            this.Share();
        }
    }
</script>