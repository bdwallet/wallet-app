<template>
    <div class="home-page">
        <div class="com-tab">
            <router-link
                tag="div"
                class="tab-item"
                v-for="item in $global.homeTab"
                :key="item"
                :to="item.to"
            >
                <span>{{item.title}}</span>
            </router-link>
        </div>
        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: "homePage"
};
</script>

<style lang="less">
.home-page {
    .home-main {
        width: 100%;
        overflow: hidden;
    }
}
</style>
