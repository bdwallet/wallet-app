<template>
    <div class="concern-list">
        <!-- 关注列表 -->
        <comp-scroll v-if="dt_data.length > 0 && !loading" :on-refresh="OnRefresh" :on-infinite="OnInfinite" @getScrollTop="setScrollTop">
            <ul>
                <li class="list" v-for="item in dt_data" :key="item">
                    <comp-userinfo :source="item" :isTime="0" :concernShow="1" />
                </li>
            </ul>
        </comp-scroll>
        <comp-empty v-if="dt_data.length == 0 && !loading" class="noComment" mainHeight="calc(100vh)" text="还没有关注对象哦~" />
    </div>
</template>

<script>
    import compScroll from "~components/compScroll";
    import compEmpty from '~components/compEmpty';
    import compUserinfo from "~components/compUserinfo";
    export default {
        name: "concern-list",
        components: {
            compScroll,
            compUserinfo,
            compEmpty
        },
        data() {
            return {
                dt_data: [],
                dt_current_page: 1,
                dt_page_size: 20,
                dt_more: true,
                dt_uid: '', //缓存uid
                scrollTop: 0,
                loading: 1,
            };
        },
        computed: {
            refreshCon() {
                return this.$store.getters.refreshCon;
            }
        },
        methods: {
            GetData(handle, isrefresh) {
                if (isrefresh) {
                    this.dt_current_page = 1;
                    this.dt_more = true;
                }
                Ajax.get(Api.apply.get_att_list, {
                    user_id: this.dt_uid,
                    scene: 0, //0 被关注人列表  1： 关注人列表
                    current_page: this.dt_current_page,
                    page_size: this.dt_page_size
                }).then(res => {
                    let data = res.data;
                    if (data.status == 1) {
                        this.loading = 0;
                        if (isrefresh) {
                            this.dt_data = data.data;
                        } else {
                            this.dt_data = this.dt_data.concat(data.data);
                        }
                        this.dt_more = data.data.length >= this.dt_page_size;
                        this.dt_current_page++;
                        handle && handle();
                    } else {
                        Dialog.alert(res.message);
                        this.dt_more = false;
                        handle && handle();
                    }
                }).catch(err => {
                    this.$dialog.alert({
                        title: "系统消息",
                        content: err.message,
                        btns: ["好"]
                    });
                    handle && handle();
                });
            },
            OnRefresh(done) { // 下拉刷新
                this.GetData(done, true);
            },
            OnInfinite(done) { // 上拉加载
                if (this.dt_more) {
                    this.GetData(done);
                } else {
                    done();
                }
            },
            setScrollTop(value) {
                this.scrollTop = value;
            },
        },
        mounted() {
            //  this.GetData();
        },
        activated() {
            Share.Ready({
                title: `黑钻评级--“${this.$route.query.name}”关注的黑钻达人`,
                desc: "看看TA都关注了谁~",
                link: location.href,
            }); 
            if (this.dt_uid != this.$route.params.uid || this.refreshCon) {
                this.loading = 1;
                this.dt_uid = this.$route.params.uid;
                this.GetData(0, 1);
                this.scrollTop = 0;
            }
            document.body.scrollTop = this.scrollTop;
            document.documentElement.scrollTop = this.scrollTop;
        }
    };
</script>
