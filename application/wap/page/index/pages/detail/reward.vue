<template>
    <div class="reward-list">
        <comp-scroll :on-refresh="OnRefresh" :on-infinite="OnInfinite" @getScrollTop="GetScrollTop">
            <ul>
                <li class="list" v-for="(item, i) in dt_give_data" :key="i">
                    <comp-userinfo :source="item"/>
                </li>
            </ul>
        </comp-scroll>
    </div>
</template>

<script>
    import compScroll from "~components/compScroll";
    import compUserinfo from "~components/compUserinfo";
    export default {
        name: "reward-list",
        components: {
            compScroll,
            compUserinfo
        },
        data() {
            return {
                dt_give_data: [],
                dt_current_page: 1,
                dt_page_size: 10,
                dt_more: true, //标识是否还有更多未加载数据
                dt_scrollTop: 0,
                dt_oldRid: '',
            };
        },
        computed: {
            params() {
                return this.$route.params;
            },
            rid() {
                return this.params.rid;
            }
        },
        methods: {
            GetData(handle, isrefresh) {
                let p = {
                    grade_type: this.params.gradetype,
                    grade_id: this.rid,
                    current_page: this.dt_current_page,
                    page_size: this.dt_page_size
                };
                this.$ajax.get(this.$api.apply.get_give_list, p).then(res => {
                    let r = res.data;
                    if (r.status == 1) {
                        if (isrefresh) {
                            this.dt_give_data = r.give_data;
                        } else {
                            this.dt_give_data = this.dt_give_data.concat(r.give_data);
                        }
                        this.dt_more = r.give_data.length >= this.dt_page_size;
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
            OnInfinite(done) {
                // 上拉加载
                if (this.dt_more) {
                    this.dt_current_page++;
                    this.GetData(done);
                } else {
                    done();
                }
            },
            OnRefresh(done) {
                // 下拉刷新
                this.dt_current_page = 1;
                this.dt_more = true;
                this.GetData(done, true);
            },
            GetScrollTop(value){
                this.dt_scrollTop = value;
            }
        },
        // mounted() {
        //     this.GetData();
        //     this.dt_oldRid = this.rid;
        // },
        activated() {
            if(this.dt_oldRid != this.rid || this.params.isRefresh){
                this.dt_oldRid = this.rid;
            }
            this.dt_give_data = [];
            this.dt_current_page = 1;
            this.dt_scrollTop = 0;
            this.GetData();
            document.body.scrollTop = this.dt_scrollTop;
            document.documentElement.scrollTop = this.dt_scrollTop;
        },
    };
</script>
<style lang="less">
@import "../../../../assets/css/config.less";
.reward-list {
    .scroll-inner {
        background-color: #fff;
        ul {
            .list {
                padding: 0.75rem 0.75rem 0;
                .comp-userinfo {
                    align-items: center;
                    border-bottom: 0.025rem solid @color-border-item;
                    padding-bottom: 0.75rem;
                }
            }
        }
    }
}
</style>
