<template>
    <div class="newbie">
        <!-- 新手课堂 -->
        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: "newbie"
};
</script>