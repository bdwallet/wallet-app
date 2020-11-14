<template>
    <div class="project-ratings" :class="{'is-exchange':isExchange}">
        <div v-if="!isExchange" class="container com-pro-order comp-userbox">
            <div class="label">
                全部评级
                <span>({{DtotalNum}})</span>
            </div>
            <div class="order">
                <span :class="{'current':order==1}" @click="resetOrder(1)">最新</span>
                <span :class="{'current':order==2}" @click="resetOrder(2)">热门</span>
            </div>
        </div>
        <!-- 按钮点击 -->
        <comp-buttons class="container comp-buttons " v-if="isExchange" :_Object="btns" @select="GetButton"/>

        <keep-alive>
            <comp-datalist
                v-if="loading"
                :scene="5"
                :type="isExchange ? 1 : 2"
                :show-order="isExchange ? `${select}` : `${order}`"
                :keep-state="true"
                :item-id="itemId"
                :key="isExchange ? select+itemId : order+itemId"
                emptyTxt="快来发布第一条评级吧"
            />
        </keep-alive>
    </div>
</template>

<script>
    import compDatalist from '~components/compDatalist';
    import compButtons from "~components/currExch/compButtons";
    export default {
        name: "home",
        components: {
            compDatalist,
            compButtons
        },
        data() {
            return {
                order: 1,
                loading: false,
                //item_logo: this.$route.query.item_logo,
                item_num: this.$route.query.item_user_num,
                // item_intro: this.$route.query.item_intro,
                // item_grade: this.$route.query.item_grade,
                DtotalNum: 0, //评级总数

                // 交易所
                btns: { // 按钮点击
                    data: [
                        {id: 0, name: "全部"}, {id: 1, name: '超级评审员'},
                        {id: 2, name: "黑钻钻友"},{id: 3, name: "优秀"},
                        {id: 4, name: "一般"},{id: 5, name: "不错"},
                        {id: 6, name: "较差"}
                    ]
                },
                select: 0, // 选择
            };
        },
        computed: {
            isExchange() {
                return this.$route.query.isExchange
            },
            itemId(){
                return this.$route.params.itemid
            }
        },
        methods: {
            resetOrder(val) {
                return (this.order = val);
            },
            GetButton(val) {
                this.select = val.id
            },
            // 获取 交易所 分类数据
            GetGradeCount() {
                Ajax.get(Api.apply.get_bourse_gradecount, {
                    id: this.itemId
                }).then(res => {
                    if(res.status==1){
                        for (let i = 1; i <= res.data.length; i++) {
                            if(this.btns.data[i].id == i){
                                let str = this.btns.data[i].name.replace(/\((.+?)\)/g,'');
                                this.btns.data[i].name = `${str}(${ res.data[i-1]})`;
                            }
                        }
                    }
                });
            },
        },
        mounted() {
            this.loading = true;
            this.DtotalNum = this.$route.query.count;
        },
        activated() {
            if(this.isExchange) this.GetGradeCount();
            this.loading = true;
            let shareState = this.item_num >= 10;
            let intro = this.item_intro;
            // Share.Ready({
            //     imgUrl: this.item_logo,
            //     title: shareState
            //         ? `【黑钻评级】${this.item_num}名超级评审员给${
            //               this.$route.query.pro
            //           }打了${Number(this.item_grade).toFixed(1)}分,来说说你的看法。`
            //         : `【黑钻评级】${this.$route.query.pro}新鲜上架，抢先发布评级可得更多黑钻奖励`,
            //     desc: intro.length > 60 ? `${intro.substr(0, 60)}...` : intro,
            //     link: location.href
            // });
            Share.Ready();
        },
        deactivated() {
            this.loading = false;
        }
    };
</script>

<style lang="less" scoped>
    .project-ratings{
        padding-top: 2.3rem;
        &.is-exchange{
            padding-top: 0rem;
        }
        .comp-buttons{
            position: sticky;
            top: 0;
            left: 0;
            z-index: 7;
        }
    }
</style>
