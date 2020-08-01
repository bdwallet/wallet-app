<template>
    <div class="user-help">
        <keep-alive exclude="feedback">
            <router-view />
        </keep-alive>
        
    </div>
</template>

<script>
    export default {
        name:'user-help'
    }
</script>