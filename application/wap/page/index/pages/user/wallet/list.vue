<template>
    <div class="wallet-list">
        <div class="com-datalist" v-if="data.length > 0">
            <comp-scroll class="page-content" :on-refresh="onRefresh" :on-infinite="onInfinite" v-if="data">
                <ul class="ul">
                    <li v-for="item in data" :key="item">
                        <div class="main">
                            <div class="title">
                                <span class="name">{{ item.stay_desc }}</span>
                                <span class="num">{{ item.stay_hzt>0?'+':''}}{{ item.stay_hzt }}</span>
                            </div>
                            <div class="time">{{ item.stay_create_time }}</div>
                        </div>
                    </li>
                </ul>
            </comp-scroll>
        </div>
        <div v-if="data.length <= 0" class="wallet-empty">
            <comp-empty main-height='calc(100vh - 3.5rem)' text="您还未获取过黑钻" />
            <div class="fast-konw">
                <span class="line-fast"></span>
                <span class="txt-fast" @click="gotohelp(2)">快速了解获取方法</span>
                <span class="line-fast"></span>
            </div>
        </div>
    </div>
</template>

<script>
    import compScroll from "~components/compScroll";
    import compEmpty from '~components/compEmpty';
    export default {
        name: "wallet-list",
        components: {
            compEmpty,
            compScroll,
        },
        data() {
            return {
                data: [],
                more: true,
                current_page: 1,
                page_size: 10
            }
        },
        methods: {
            getDate(done, isrefresh) {
                this.$ajax.get(this.$api.apply.get_stay_list,{
                    current_page:this.current_page,
                    page_size:this.page_size
                }).then(res => {
                    if (res.status == 1) {
                        let d = res.data;
                        this.current_page++;
                        if (isrefresh) {
                            this.data = d.stay_data;
                        } else {
                            this.data = this.data.concat(d.stay_data);
                        }
                        this.more = d.stay_data.length >= this.page_size;
                    } else {
                        this.more = false
                    }
                    done && done()
                }).catch(err => {
                    done && done()
                })
            },
            gotohelp(val) {
                this.$router.push({
                    path: '/user/help/main',
                    query: {
                        index: val
                    }
                })
            },
            //上拉处理
            onRefresh(done) {
                this.current_page = 1;
                this.more = true;
                this.getDate(done, true);
            },
            //下拉加载
            onInfinite(done) {
                if (this.more) {
                    this.getDate(done)
                } else {
                    done();
                }
            }
        },
        mounted() {
            this.getDate();
        }
    }
</script>
