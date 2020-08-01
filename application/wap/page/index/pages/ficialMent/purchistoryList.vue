<template>
    <div class="purchistory-list">
        <div class="com-tab">
            <div class="tab-item">
                <span :class="{'active':current(0)}" @click="TabClick(0)">全部</span>
            </div>
            <div class="tab-item relative">
                <span :class="{'active':current(1)}" @click="TabClick(1)">已下单</span>
            </div>
            <div class="tab-item">
                <span :class="{'active':current(2)}" @click="TabClick(2)">计息中</span>
            </div>
            <div class="tab-item">
                <span :class="{'active':current(3)}" @click="TabClick(3)">已回款</span>
            </div>
        </div>
        <comp-data-list :key="Dtab" scene="8" :type="+Dtab" :keep-state="false" empty-txt="暂无购买数据"/>
    </div>
</template>

<script>
    import compDataList from "~components/compDatalist";
    export default {
        name: "purhistoryList",
        components: {
            compDataList
        },
        data() {
            return {
                Dtab: 0,
                dataList: [],
                more: true,
                needscroll: true
            }
        },
        methods: {
            //Tab点击事件
            TabClick(key){
                //点击当前选项卡无效
                if(this.Dtab == key) return;
                this.Dtab = key;
            },
            current(value) {
                return this.Dtab == value;
            },
        }
    }
</script>

<style lang="less" scoped>
    .purchistory-list{
        .com-tab {
            .tab-item{
                span.active {
                    color: rgba(51, 51, 51, 1);
                    &::after {
                        background-color: rgba(51, 51, 51, 1);
                    }
                }
            }
        }
    }
</style>
