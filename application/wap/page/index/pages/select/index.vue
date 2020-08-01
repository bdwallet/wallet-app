<template>
    <div class="dropdown select-page">
        <comp-searchtool :show-btn="false" disabled="true"  @click.native="$router.push({path:`/search/${scene}`,query: {comefrom: 'select',broke:broke}})"  />
        <div class="rank">
            <div v-if="checked==0 || $route.query.broke=='1'">共{{totalNum}}个项目</div>
            <div v-else></div>
            <!-- 用于占位 -->
            <div class="checkbtn" :class="{'act':show}" @click="Toggle" v-if="broke==0">
                <div v-if="checked==0">全部</div>
                <div v-else-if="checked==1">未评过</div>
                <div v-else-if="checked==2&&userInfo.user_level>=5">可追评</div>
                <div v-else>已评过</div>
                <i class="icon icon-shouhui"></i>
            </div>
            <transition name="checkbox">
                <ul class="checkbox" v-if="show">
                    <li :class="{'act':checked==0}" @click="Toggle(0)">全部</li>
                    <li :class="{'act':checked==1}" @click="Toggle(1)">未评过</li>
                    <li :class="{'act':checked==2}" v-if="userInfo.user_level>=5" @click="Toggle(2)">可追评</li>
                    <li :class="{'act':checked==3}" v-else @click="Toggle(3)">已评过</li>
                </ul>
            </transition>
        </div>
        <project-list ref="ProList" :scene="scene" :order="3" :type="checked" @totalNum="getTotalNum" />
        <transition name="backdrop">
            <div class="backdrop" v-if="show" @click="show=!show"></div>
        </transition>
    </div>
</template>
<script>
import './style';
import compSearchtool from "~components/compSearchtool";
import projectList from "~components/projectList";
export default {
    name: "select",
    components: {
        compSearchtool,
        projectList
    },
    data() {
        return {
            totalNum: 0, //项目总数
            checked: 0, //切换筛选状态，0全部 1未评过 2可追评 3已评过
            show: 0 //显示遮罩层
        };
    },
    computed: {
        userInfo() {
            return this.$store.getters.userInfo;
        },
        broke() {
            return this.$route.params.broke;
        },
        scene(){
            return this.$route.params.type;
        }
    },
    methods: {
        Toggle(type) {
            this.show = !this.show;
            if (type >= 0) {
                this.checked = type;
                this.$refs.ProList.GetList(0, 1, this.checked, 1);
            }
        },
        getTotalNum(val) {
            this.totalNum = val; //获取交易所、项目总数
        }
    },
    mounted() {
        //处理用户筛选按钮的状态
        Share.Ready();
    }
};
</script>