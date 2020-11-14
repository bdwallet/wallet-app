<template>
    <div class="user">
        <keep-alive exclude="user-wallet,user-level,user-setup,user-application,user-authentication,user-help">
            <router-view />
        </keep-alive>
    </div>
</template>
<script>
import "./style";
export default {
    name: "user"
};
</script>