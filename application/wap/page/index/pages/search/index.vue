<template>
    <div class="search-page">
        <comp-searchtool
            v-model="keyword"
            placeholder="输入名称，如比特币或BTC"
            @search="getSearchVal"
        />

        <div v-if="Ddatalist && Ddatalist.length > 0">
            <project-list
                :scene="$route.params.type"
                :data="Ddatalist"
                :comefrom="comefrom"
                :keyword="keyword" />
        </div>

        <div v-if="showHistory&&searchHistory&&$route.params.type==2" class="hotitem">
            <div class="title container">
                <span>热门搜索</span>
            </div>
            <ul class="container">
                <li v-for="item in hotKeyWords" :key="item" @click="historySearch(item,1)">{{item}}</li>
            </ul>
        </div>
        <div v-if="showHistory&&searchHistory&&searchHistory.length>0&&$route.params.type==2" class="history">
            <div class="title container">
                <span>历史搜索</span>
                <i v-if="false" class="icon icon-shanchu" @click="delhistory"></i>
            </div>
            <ul class="container">
                <li v-for="item in searchHistory" :key="item" @click="historySearch(item)">{{item}}</li>
            </ul>
        </div>
        <div v-if="showEmpty">
            <comp-empty text="未搜到相关项目" mainHeight="calc(100vh - 7.0rem)">
                <div class="search-empty">
                    <img :src="$assets.searchEmptyIcon2" />
                    <div class="tip">抱歉，没有找到您需要的项目!</div>
                    <div class="sub" v-if="!isBroke" @click.stop="openTip">联系我们扩充</div>
                    <div class="sub" v-else @click.stop="GoToWrite">继续发布爆料</div>
                </div>
            </comp-empty>
        </div>
    </div>
</template>
<script>
import localStore from "~script/localStore";
import compEmpty from "~components/compEmpty";
import compSearchtool from "~components/compSearchtool";
import projectList from "~components/projectList";
export default {
    name: "search",
    components: {
        compSearchtool,
        projectList,
        compEmpty
    },
    data() {
        return {
            Ddatalist:[], //搜索结果列表

            showHistory: true,
            keyword: "",
            // searchKeyword: "", //点击历史搜索，热门搜索 更新搜索输入框的值
            searchHistory: [], //存储历史记录
            hotKeyWords: [], // 热门搜索
            showEmpty: false,
            isHistory: true
        };
    },
    computed: {
        comefrom() {
            return this.$route.query.comefrom;
        },
        isBroke() {
            return this.$route.query.broke == 1 ? 1 : 0;
        }
    },
    watch: {
        showHistory() {
            if (this.showHistory) {
                this.getSearchHistory();
            }
        }
    },
    methods: {
        //搜索结果扩充提示
        openTip() {
            this.$dialog.pannel({
                title: "联系我们扩充",
                content: [
                    "项目方入驻请扫描下方二维码",
                    "黑钻评级是免费的去中心化评级社区。我们会定期搜集用户关心的项目，同时也欢迎优质项目方自荐或用户推荐。请添加客服同事微信：jiukou0920",
                    `<p style="text-align: center;"><img style="width:5rem;height:5rem;" src="https://heizuan.oss-cn-shenzhen.aliyuncs.com/web/kefuewm.jpg" /></p>`
                ]
            });
        },

        // 发布爆料
        GoToWrite() {
            this.$router.push({
                path: "/write/1/0",
                query: {
                    pro: "其他"
                }
            });
        },
        
        // 获取搜索框里面的搜索词
        getSearchVal() {
            let key = this.keyword;
            this.showEmpty = false;
            this.showHistory = false;
            Ajax.get(Api.apply.search_item,{
				word: key,
				type: this.$route.params.type //1: 交易所 2：项目
			}).then(res => {
                if(res.data.length > 0)
                    this.Ddatalist = res.data;
                else
                    this.showEmpty = true;
			});
        },

        // 历史搜索 数据
        historySearch(val, type) {
            if (type == 1) { // 热门搜索 -> type==1 时 更新后台搜索词
                this.$ajax.post(this.$api.apply.update_search, {
                    search_word: val,
                    search_type: 0
                });
            }
            this.keyword = val;
            this.getSearchVal();
        },
        //获取本地搜索历史
        getSearchHistory() {
            if (localStore.get(Global.localStores.searchWord)) {
                this.searchHistory = eval(
                    localStore.get(Global.localStores.searchWord)
                );
            } else {
                this.searchHistory = [];
            }
        },
        //删除本地搜索历史
        delhistory() {
            localStore.remove(Global.localStores.searchWord);
            this.getSearchHistory();
        },
        //获取热门项目
        getHotWord() {
            Ajax.get(Api.apply.getHotWord).then(res => {
                this.hotKeyWords = res.data;
            });
        }
    },
    mounted() {
        this.getHotWord();
        this.getSearchHistory();
        Share.Ready();
    }
};
</script>
<style src="./style" lang="less" scoped>
</style>