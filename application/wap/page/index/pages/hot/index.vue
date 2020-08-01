<template>
    <div class="hot">
        <!-- 热门活动 -->
        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: "hot"
};
</script>