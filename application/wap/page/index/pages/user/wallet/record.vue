<template>
    <div class="wallet-record">
        <div class="com-tab">
            <div class="tab-item">
                <span :class="{'active':!type}" @click="Switch(0)">提现记录</span>
            </div>
            <div class="tab-item">
                <span :class="{'active':type}" @click="Switch(1)">充值记录</span>
            </div>
        </div>
        <div class="com-datalist">
            <comp-scroll class="page-content" :on-refresh="onRefresh" :on-infinite="onInfinite" v-if="list&&list.length>0">
                <ul class="ul">
                    <li v-for="item in list" :key="item">
                        <div class="main">
                            <div class="title">
                                <span class="name">{{type?Number(item.input_hzt).toFixed(2):Number(item.output_hzt).toFixed(2)}}黑钻</span>
                                <span class="num">{{getTxt(item)}}</span>
                            </div>
                            <div class="content">地址：{{item.address_content}}</div>
                            <div class="time">提交时间：{{type?item.input_create_time:item.output_create_time}}</div>
                        </div>
                    </li>
                </ul>
            </comp-scroll>
            <comp-empty v-if="!loading&&list.length <= 0" main-height='calc(100vh - 2.5rem)' text="暂无数据" />
        </div>
    </div>
</template>

<script>
    import compScroll from "~components/compScroll";
    import compEmpty from '~components/compEmpty';
    export default {
        name: "wallet-record",
        components: {
            compEmpty,
            compScroll
        },
        data() {
            return {
                type: 0, //tab切换
                list: [], //数据容器
                loading:1, //加载状态
                current_page: 1,
                page_size: 20,
                more: true, //标识是否还有更多未加载数据
            }
        },
        methods: {
            GetData(handle, isrefresh) {
                let p = {
                    current_page: this.current_page,
                    page_size: this.page_size,
                    sence: this.type
                };
                Ajax.get(Api.apply.get_record, p).then(res => {
                    let r = res.data;
                    if (r.status == 1) {
                        if (isrefresh) {
                            this.list = r.list;
                        } else {
                            this.list = this.list.concat(r.list);
                        }
                        this.more = r.list.length >= this.page_size;
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

            //TAB切换
            Switch(type) {
                if (type == this.type) return;
                this.list = [];
                this.loading = 1;
                this.current_page = 1;
                this.type = type;
                this.GetData(0,true);
            },
            //获取状态的文本 1申请中 2完成 -1用户取消 -2后台审核不通过' 3到账
            getTxt(obj){
                let s = this.type ? obj.input_status : obj.output_status;
                let txt = '';
                switch(s){
                    case '-2': txt='不通过';
                    break;
                    case '-1': txt='已取消';
                    break;
                    case '3': txt='已完成';
                    break;
                    case -2: txt='不通过';
                    break;
                    case -1: txt='已取消';
                    break;
                    case 3: txt='已完成';
                    break;
                    default: txt = '待确认';
                    break;
                }
                return txt;
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
            },
        },
        mounted() {
            this.GetData(0, true);
        }
    }
</script>