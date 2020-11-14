<template>
    <div class="comp-dataitem-zixun container" @click="goDetail">
        <p class="title">{{data.title.substr(0,18)}}<span v-if="data.title.length > 18">...</span></p>
        <!-- 封面图 -->
        <div>
            <div class="content" v-if="data.imgs.length > 0">
                <img :src="`${data.imgs[0]}?x-oss-process=image/resize,m_fill,h_344,w_750`">
            </div>
            <div class="content" v-else>
                <div class="text"><span v-html="HtmlToText(data.intro).substr(0, ContLen(data.pic))"></span><span v-if="HtmlToText(data.intro).length > ContLen(data.pic)">...</span></div>
                <!-- 判断文章是否有图 -->
                <div class="img" v-if="data.pic">
                    <img :src="`${data.pic}?x-oss-process=image/resize,m_fill,h_180,w_248`">
                </div>
            </div>
        </div>
        <!-- 操作按钮 -->
        <div class="action">
            <div class="left">
                <comp-avatar v-if="!isExchange" :src="data.user_photo" :level="data.userlv" size="56"></comp-avatar>
                <div v-if="!isExchange" class="pro-name">{{data.user_name}}</div>
                <div v-if="isExchange" class="pro-name exch-extlrat">作者：{{data.user_name}}</div>
                <div v-if="isExchange" class="pro-name exch-extlrat">{{data.create_time}}</div>
            </div>
            <div class="right">
                <!-- 点赞 -->
                <comp-liketool v-if="!isExchange" class="item"
                    :number="data.like_num"
                    :status="data.is_like"
                    :type="3"
                    :id="data.id" />
                <!-- 评论 -->
                <div class="item" v-if="!isExchange">
                    <i class="icon icon-huifu"></i>
                    <span class="number">{{data.comment_num}}</span>
                </div>
                <div class="item exch-extlrat" v-if="isExchange">
                    <i class="icon icon-renkanguo"></i>
                    <span class="number">{{data.view_num.toFixed()}} 人看过</span>
                </div>
                <!-- 分享 -->
                <!-- <div class="item" @click.stop>
                    <i class="icon icon-fenxiang"></i>
                    <span class="text">分享</span>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin';
    import compAvatar from '~components/compAvatar';
    import compLiketool from '~components/compTools/compLiketool';
    export default {
        name: 'comp-dataitem-zixun',
		mixins: [mixin],
        components: {
            compAvatar,
            compLiketool
        },
        data() {
            return {
            }
        },
        props: {
            isExchange: { // 是否是交易所
                type: Number,
                default: 0
            },
        },
        computed: {
            newCate(){
                // 分类     3 所有 资讯         6 资讯下的 黑钻出品   7 资讯下的 新闻资讯
                //          4 所有 活动         8 路演直播              9 空投活动              10 线下会议交流
                //          5 所有 帮助中心     11 常见问题             12 功能宝典
                //          13 产品进度         14 小白入门             15 玩转黑钻
                return this.$route.query.tab || '';
            },
        },
        methods: {
            goDetail() {
                let id = this.data.id;
                if(!this.isExchange) {
                    this.$router.push({
                        path: `/detail/3/${id}`,
                        query: {
                            tabs: this.newCate || this.data.type //路由的tab不存在时，如推荐列表等（用tabs的原因是，不与列表页的tab冲突，否则缓存机制会被computed里的影响）***
                        }
                    });
                } else {
                    this.$router.push({
                        path: `/extlevaluation/${id}`,
                    });
                }
            },
            ContLen(val) { //文章内容有图和没图时，列表页显示的字数
                return val? 45 : 80;
            },
            HtmlToText(h){
                let div = document.createElement('div');
                div.innerHTML = h;
                return div.innerText;
            },
        },
        mounted() {
            // setTimeout(() => {
            //     console.log(this.data);
            // }, 400);
        },
    }
</script>
