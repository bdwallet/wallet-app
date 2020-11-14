<template>
    <div class="setup-profile">
        <layout-frame>
            <layout-form-info @next="Next" />
        </layout-frame>
    </div>
</template>

<script>
    import layoutFrame from '~layout/layoutFrame';
    import layoutFormInfo from '~layout/layoutFormInfo';
    export default {
        name: 'setup-profile',
        components: {
            layoutFrame,
            layoutFormInfo
        },
        methods:{
            //进行下一步,获取组件内的数据
            Next(dt){
                if(Global.isApp && Global.isPro){
                    HZApp.Back()
                }else {
                    this.$router.go(-1);
                }
                dt.info && Service.Update(dt.info);
                setTimeout(() => {
                    this.$dialog.tip("修改成功");
                }, 200);
            }
        },
        mounted() {
            Share.Ready();
        },
    }
</script>
