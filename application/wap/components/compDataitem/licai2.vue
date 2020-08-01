<template>
    <div class="comp-dataitem-licai2" @click="GoDetail">
        <div class="comp-item-wrap item-wrap">
            <div class="title">
                <div class="comp-item-left">{{data.finance_title}}</div>
                <div class="comp-item-right">{{Ttext}}</div>
            </div>
            <div class="sub-title">
                <div class="comp-item-left">{{data.bill_deposit_amount}}{{data.finance_currency}}</div>
                <div class="comp-item-right">{{data.bill_create_time}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from "./mixin";
    export default {
        name: "licai2",
        mixins: [mixin],
        computed: {
            Ttext () {
                if(this.data.bill_status == -1) return '已失效';
                if(this.data.bill_status == 0) return '已下单';
                if(this.data.bill_status == 1) return '已计息';
                if(this.data.bill_status == 2) return '已回款';
            }
        },
        methods: {
            GoDetail() {
                this.$router.push({
                    path: '/ficial-ment/purchistory-detail',
                    query: {
                        id: this.data.bill_id
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
