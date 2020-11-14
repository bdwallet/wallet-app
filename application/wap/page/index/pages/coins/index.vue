<template>
    <div class="coins">
        <!-- 币圈资讯 -->
        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: "coins",
    activated(){
        console.log("in coins => index");
    }
};
</script>