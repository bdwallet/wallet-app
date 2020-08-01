<template>
    <div class="comp-menus" v-if="menus && menus.length > 0">
        <!-- 社区推荐运营位 -->
        <ul class="ul-main">
            <router-link tag="li" class="list" v-for="m in menus" :key="m.operation_id" :to="m.operation_url" >
                <div class="menus-icon">
                    <img class="img" :src="`${m.operation_img}?x-oss-process=image/resize,m_fill,h_90,w_90`" >
                    <span class="new" v-if="m.operation_url=='/hotlist?tab=1'">NEW</span>
                </div>
                <span class="title">{{m.operation_name}}</span>
            </router-link>
        </ul>

    </div>
</template>

<script>
    export default {
        name: 'comp-menus',
        props: {
            menus: {
                type: Array,
                default: []
            }
        }
    }
</script>

<style lang="less" scoped>
    @import '../assets/css/config.less';
    .comp-menus {
        background-color: @bgcolor-body;
        position: relative;
        z-index: 1;
        .ul-main {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: .75rem 1.4rem;
            .list {
                display: flex;
                flex-direction: column;
                align-items: center;
                // min-width: 3.25rem;
                .menus-icon {
                    position: relative;
                    width: 2.25rem;
                    height: 2.25rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .img {
                        width: 100%;
                    }
                    .new {
                        position: absolute;
                        font-size: .5rem;
                        height: .7rem;
                        line-height: .7rem;
                        padding: 0 .15rem;
                        background: @color-attention;
                        color: #FEFEFE;
                        border-radius: .375rem .375rem .375rem 0;
                        bottom: 0;
                        left: 60%;
                    }
                }
                .menus-icon-1 {
                    background:linear-gradient(180deg,rgba(237,209,189,1) 0%,rgba(232,184,158,1) 100%);
                }
                .menus-icon-2 {
                    background:linear-gradient(180deg,rgba(234,207,204,1) 0%,rgba(212,173,165,1) 100%);
                }
                .menus-icon-3 {
                    background:linear-gradient(180deg,rgba(174,214,229,1) 0%,rgba(146,190,199,1) 100%);
                }
                .title {
                    margin-top: .25rem;
                    font-size: .65rem;
                    color: @color-sub;
                    white-space: nowrap;
                }
            }
        }
    }
</style>


