<template>
    <div class="comp-banner">
        <!-- banner -->
        <comp-swiper v-if="dt_data && dt_data.length" :height="type==2?'8rem':'7rem'" :auto="true" :pagination="true">
			<comp-swiper-item v-for="item in dt_data" :key="item.banner_id">
				<img :src="`${item.banner_photo}?x-oss-process=image/resize,m_fill,h_${(type==2?8:7)*40},w_750`" @click="$service.OpenUrl(item.banner_url)" />
			</comp-swiper-item>
		</comp-swiper>
    </div>
</template>
<script>
    import {
        compSwiper,
        compSwiperItem
    } from '~components/compSwiper';
    export default {
        name: 'comp-banner',
        components: {
            compSwiper,
            compSwiperItem
        },
        props: {
            // banner类型 2首页推荐 3币圈咨询 4热门活动 5项目公告
            type: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                dt_data: []
            }
        },
        methods: {
            getData(){
                this.$ajax.post(this.$api.apply.banner_get_list, {
                    type: this.type
                }).then(res => {
                    if(res.status == 1){
                        this.dt_data = res.data;
                    }else{
                        this.$dialog.alert(res.message);
                    }
                }).catch(err => {
                    this.$dialog.alert(err.message);
                })
            }
        },
        mounted() {
            this.getData();
        },
    }
</script>

<style lang="less" scoped>
    .comp-banner{
        overflow: hidden;
    }
</style>
