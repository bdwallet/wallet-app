<template>
    <div class="recruit">
        <div class="bg-box">
            <div class="bg" :style="{backgroundImage:`url(${$assets.recruitBg1})`}"></div>
            <div class="bg" :style="{backgroundImage:`url(${$assets.recruitBg2})`}"></div>
            <div class="bg" :style="{backgroundImage:`url(${$assets.recruitBg3})`}"></div>
            <div class="bg" :style="{backgroundImage:`url(${$assets.recruitBg4})`}"></div>
            <div class="bg" :style="{backgroundImage:`url(${$assets.recruitBg5})`}"></div>
            <div class="bg" :style="{backgroundImage:`url(${$assets.recruitBg6})`}"></div>
            <div class="bg" :style="{backgroundImage:`url(${$assets.recruitBg7})`}"></div>
            <div class="bg" :style="{backgroundImage:`url(${$assets.recruitBg8})`}"></div>
        </div>
        <div class="btn">
            <comp-input type="button" value="立即申请" @arrow="Submit" :status="1" />
        </div>
    </div>
</template>

<script>
import compInput from "~components/compInput/input";
export default {
    name: "index",
    components: {
        compInput
    },
    methods: {
        Submit() {
            if (Global.isApp && Global.isPro) {
                plus.runtime.openURL("http://cci0108pakkc3p4g.mikecrm.com/mZYen0Z");
            } else {
                window.location.href = "http://cci0108pakkc3p4g.mikecrm.com/mZYen0Z";
            }
        }
    }
};
</script>

<style lang="less" src="./style" scoped></style>