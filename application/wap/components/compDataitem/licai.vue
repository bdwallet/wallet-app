<template>
    <div class="comp-dataitem-licai container" @click="GoMain">
        <div class="rush" v-if="data.finance_status == 1">
            <img :src="$assets.iconFicialHot" />
        </div>
        <div class="sold-out" v-if="data.finance_status == -1">
            <img :src="$assets.iconFicialEnd" />
        </div>
        <div class="licai-item">
            <div class="left item-title"><span class="main-title">{{(+data.finance_basics_return).toFixed(1)}}</span>%<span v-if="data.finance_add_return&&data.finance_add_return != 0.00">+{{(+data.finance_add_return).toFixed(1)}}%</span></div>
            <div class="right item-sub-title">{{data.finance_title.length >= 11 ? data.finance_title.substring(0,11)+"..." : data.finance_title}}</div>
        </div>
        <div class="licai-item">
            <div class="left">年化收益率</div>
            <div class="right">{{data.finance_intro}}</div>
        </div>
        <div class="licai-item">
            <div class="left" v-if="data.finance_status == 1">剩余：{{data.odd_limit}}</div>
            <div class="right start" v-if="data.finance_status == 0"><i class="icon icon-shizhong"></i>{{data.finance_raise_start}}</div>
            <div class="right end" v-if="data.finance_status == 1"><i class="icon icon-shizhong"></i>{{endtime}}</div>
        </div>
    </div>
</template>

<script>
    import mixin from "./mixin";
    export default {
        name: "compDataitemLicai",
        mixins: [mixin],
        computed: {
            endtime() { // 结束时间
                let endtime = new Date(this.data.finance_raise_start).getTime(),
                    keepday = this.data.finance_raise_day * 24 * 60 * 60 * 1000,
                    dtime = new Date(endtime + keepday),
                    dy = dtime.getFullYear(),
                    dm = (dtime.getMonth() + 1) > 9 ? dtime.getMonth() + 1 : `0${dtime.getMonth() + 1}`,
                    dd = dtime.getDate() > 9 ? dtime.getDate() : `0${dtime.getDate()}`,
                    dh = dtime.getHours() > 9 ? dtime.getHours() : `0${dtime.getHours()}`,
                    dmm = dtime.getMinutes() > 9 ? dtime.getMinutes() : `0${dtime.getMinutes()}`,
                    ds = dtime.getSeconds() > 9 ? dtime.getSeconds() : `0${dtime.getSeconds()}`;
                return `${dy}-${dm}-${dd} ${dh}:${dmm}:${ds}`;
            }
        },
        methods: {
            // 跳转详情
            GoMain() {
                this.$router.push({
                    path: '/ficial-ment/main',
                    query: {
                        id: this.data.finance_id
                    }
                })
            }
        },
    }
</script>
