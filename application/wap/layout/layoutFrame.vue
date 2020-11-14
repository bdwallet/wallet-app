<template>
    <div class="layout-frame" :style="{padding: padding}">
        <div class="head" v-show="showhead">
            <img class="logo" :src="$assets.logoText" />
            <div class="desc">
                <div class="line l"></div>
                <span>上黑钻评级 知项目好坏</span>
                <div class="line"></div>
            </div>
        </div>
        <slot />
    </div>
</template>

<script>
    import "./style";
    export default {
        name: 'layoutFrame',
        props: {
            showhead: {
                type: Boolean,
                default: false
            },
            padding: {
                type: String,
                default: '0 1.4rem'
            }
        },
    }
</script>