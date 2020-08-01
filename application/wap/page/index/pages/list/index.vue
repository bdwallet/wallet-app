<template>
    <div class="list-page">
        <div class="com-tab">
            <div class="tab-item" :class="{'current':Dtab==1}" @click="Goto(1)">
                <span>交易所</span>
            </div>
            <div class="tab-item" :class="{'current':Dtab==2}" @click="Goto(2)">
                <span>项目</span>
            </div>
        </div>
        <comp-searchtool @click.native="$router.push(`/search/${Dtab}`)" :placeholder="Dtab == 1 ? '搜索交易所' : '搜索项目'"  />
        <div class="rank">
            <div class="rankway" v-if="Dtab==1">
                <span :class="Current(0)" @click="Order(0)">全部</span>
                <span v-for="obj in OrderArr" :key="obj" :class="Current(obj.label_id)" @click="Order(obj.label_id)">{{obj.label_name}}</span>
            </div>
            <div class="rankway" v-else>
                <span :class="Current(1)" @click="Order(1)">最新</span>
                <span :class="Current(2)" @click="Order(2)">评分</span>
                <span :class="Current(4)" @click="Order(4)">市值</span>
            </div>
            <div class="pronum" v-if="Dtab==1&&Dtype==0 || Dtab == 2">共{{Dtotal[Dtab]}}个项目</div>
        </div>
        <keep-alive>
            <project-list ref="ProList" :key="Dtab" :scene="Dtab" :type="Dtype" :order="Dorder" @totalNum="getTotalNum" />
        </keep-alive>
    </div>
</template>
<script>
import projectList from "~components/projectList";
import compSearchtool from "~components/compSearchtool";
export default {
    name: "list",
    components: {
        compSearchtool,
        projectList
    },
    data() {
        return {
            Dtotal: {},//项目总数
            OrderArr:[],//交易所筛选标签
            Dorder: 0,//排序方式 交易所（0：Type传标签ID查询 1：与项目查询一至【0：全部 1：未评过 2：可追评 3：已评过】） 项目查询（1：最新 2：评分 3：字母 4：市值）
            Dtype: 0,//筛选方式
            Dtab: 1, //TAB标识 1:交易所 2：项目
        };
    },
    methods: {
        Goto(tab){
            this.Dtab = tab;
            this.Dorder = tab == 1 ? 0 : 1;
            this.Dtype = 0;
            this.$router.replace(`/list?tab=${tab}`);
        },
        getTotalNum(val) {
            this.$set(this.Dtotal,this.Dtab,val); //获取交易所、项目总数
        },
        //筛选按钮样式
        Current(type) {
            if(this.Dtab == 1)
                return this.Dtype == type ? 'current' : '';
            else
                return this.Dorder == type ? "current" : "";
        },
        //列表筛选排序切换
        Order(key){
            if((this.Dtab == 1 && this.Dtype == key) || (this.Dtab == 2 && this.Dorder == key)) return;
            if(this.Dtab == 1){
                this.Dtype = key;
                this.DOrder = 0;
            }
            else
                this.Dorder = key;
            setTimeout(() => {
                this.$refs.ProList.Reload(v=>{
                    this.Dtotal[this.Dtab] = v;
                });
            }, 0);
        },
    },
    mounted(){
        //获取交易所排序类型标签
        Ajax.get(Api.apply.get_search_label).then(res => {
            this.OrderArr = res.data;
        });
    },
    activated() {
        Share.Ready({
            title: "【黑钻评级】海量项目库，你想看的区块链项目这都有",
            desc: "全球首家“评审团”式区块链评级社区，带您多角度解析600+项目",
            link: location.href
        });
    }
};
</script>
<style src="./style" lang="less">
</style>