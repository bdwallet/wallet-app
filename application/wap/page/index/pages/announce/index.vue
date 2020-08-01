<template>
    <div class="announce">
        <!-- 项目方公告 -->
        <keep-alive exclude="announce-detail,announce-main">
            <router-view />
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: "announce"
};
</script>