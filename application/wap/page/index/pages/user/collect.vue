<template>
    <div class="user-collect">
        <div v-if="dt_data && dt_data.length > 0">
            <comp-datalist :data="dt_data" type="4" />
        </div>
        <comp-empty v-else-if="!loading" class="noComment" mainHeight="calc(100vh)" text="暂无收藏，赶快去看看吧~" >
            <div class="btn" @click="$router.push('/home')">去首页</div>
        </comp-empty>
    </div>
</template>

<script>
    import compEmpty from '~components/compEmpty';
    import compDatalist from '~components/compDatalist';
    import compScroll from "~components/compScroll";
    export default {
        name: 'user-collect',
        components: {
            compEmpty,
            compDatalist,
            compScroll
        },
        data() {
            return {
                dt_data: [],
                loading:true,
            }
        },
        computed: {
            refreshColl() {
                return this.$store.getters.refreshCollect;
            }
        },
        methods: {
            GetData(handle, isrefresh) {
                Ajax.get(Api.apply.get_coll_list, {
                        user_id: this.$route.query.uid,
                        current_page: 1,
                        page_size: 20
                    }).then(res => {
                        let data = res.data;
                        if(data.status == 1){
                            this.dt_data = data.data;
                        }else{
                            Dialog.alert(res.message);
                        }
                    }).catch(err => {
                        Dialog.alert(err.message);
                    })
            },
        },
        mounted() {
            Share.Ready();
            this.GetData();
        },
        activated() {
            if(this.refreshColl) {
                this.GetData();
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
        }
    }
</script>

<style lang="less" scoped>
@import "../../../../assets/css/config.less";
    .comp-empty{
        .btn{
            width: 8.25rem;
            height: 2.1rem;
            border-radius: .25rem;
            background-color: @color-link;
            color: #fff;
            font-size: .8rem;
            font-weight: 400;
            line-height: 2.1rem;
            text-align: center;
            margin-top: 1.2rem;
        }
    }
</style>

