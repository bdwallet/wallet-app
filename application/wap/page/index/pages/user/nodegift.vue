<template>
    <div class="user-nodegift">
        <div class="banner">
            <img :src="$assets.nodegiftImg" >
            <div class="tip">
                <p>添加客服微信：jiukou0920</p>
                <p>了解更多节点权益</p>
            </div>
        </div>
        <div class="com-tab">
            <div class="tab-item"><span>中奖日期</span></div>
            <div class="tab-item"><span>地址</span></div>
            <div class="tab-item"><span>黑钻数量</span></div>
        </div>
        <comp-scroll class="list" v-if="Dlist.length>0" :on-infinite="onInfinite">
            <ul>
                <li v-for="d in Dlist" :key="d">
                    <div class="time">{{$service.Dater(d.node_gift_time,'YYYY-MM-DD')}}</div>
                    <div class="addr" @click="$service.OpenUrl(d.node_gift_url)">{{d.hide_adress}}</div>
                    <div class="num">{{d.node_gift_hzt}}</div>
                </li>
            </ul>
        </comp-scroll>
    </div>
</template>

<script>
    import compScroll from "~components/compScroll";
    export default {
        name:'user-nodegift',
        components: {
            compScroll,
        },
        data(){
            return {
                Dcurrent_page: 1,
                Dpage_size: 20,
                Dmore: 1,
                Dlist:[],
            }
        },
        methods:{
            GetList(done, isrefresh) {
                Ajax.get(Api.apply.get_node_gift,{
                    current_page:this.Dcurrent_page,
                    page_size:this.Dpage_size
                }).then(res => {
                    if (res.status == 1) {
                        let d = res.data;
                        this.Dcurrent_page++;
                        if (isrefresh) {
                            this.Dlist = d;
                        } else {
                            this.Dlist = this.Dlist.concat(d);
                        }
                        this.Dmore = d.length >= this.Dpage_size;
                    } else {
                        this.Dmore = false
                    }
                    done && done();
                }).catch(err => {
                    done && done();
                })
            },
            //上拉处理
            // onRefresh(done) {
            //     this.Dcurrent_page = 1;
            //     this.Dmore = true;
            //     this.GetList(done, true);
            // },
            //下拉加载
            onInfinite(done) {
                if (this.Dmore) {
                    this.GetList(done);
                } else {
                    done();
                }
            }
        },
        mounted(){
            this.GetList();
            Share.Ready({
                title: '黑钻评级--每日锦锂',
                desc: '幸运大奖，节点尊享',
                link: location.href,
            });
        }
    }
</script>
