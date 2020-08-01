<template>
    <div class="ficial-list">
        <comp-banner />
        <comp-data-list scene="7" :keep-state="false" empty-txt="暂时无理财计划"/>
        <div class="user-by" @click.stop="GoUserByList">我购买的</div>
    </div>
</template>

<script>
    import compBanner from "~components/compBanner";
    import compDataList from "~components/compDatalist";
    export default {
        name: "ficial-list",
        components: {
            compBanner,
            compDataList
        },
        methods: {
            GoUserByList() {
                this.$router.push('/ficial-ment/purchistory-list')
            }
        }
    }
</script>

<style lang="less" scoped>
    .user-by{
        position: fixed;
        right: 0;
        bottom: 12rem;
        padding: .2rem .2rem .2rem .6rem;
        line-height: normal;
        font-size: .75rem;
        color: white;
        background:linear-gradient(136deg,rgba(234,204,149,1) 0%,rgba(178,144,84,1) 100%);
        border-radius: .75rem 0 0 .75rem;
    }
</style>
