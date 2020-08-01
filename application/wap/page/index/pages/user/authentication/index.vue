<template>
    <div class="user-authentication">
        <layout-progress :option="[{
                                    okText:'提交认证',
                                    failText:''
                                },{
                                    okText:'正在审核',
                                    failText:''
                                },{
                                    okText:'认证成功',
                                    failText:'认证失败'
                                }]" :step='step' :status="status" />
        <component :is="comp" @next="Next" />
    </div>
</template>

<script>
    import layoutProgress from '~layout/layoutProgress';
    import form from './form';
    import going from './going';
    import success from './success';
    export default {
        name: 'user-authentication',
        components: {
            layoutProgress
        },
        data() {
            return {
                comp: form,
                status: 1,
            }
        },
        computed: {
            //认证状态 //-1未提交认证 0审核中 1审核通过 2审核失败
            idcert() {
                return this.$store.getters.userInfo.idcert_info.idcert_status;
            },
            step() {
                if (this.idcert == undefined || this.idcert == -1) {
                    this.comp = form;
                    return 0;
                } else if (this.idcert == 0) {
                    this.comp = going;
                    return 1;
                } else {
                    this.comp = success;
                    if (this.idcert == 2) {
                        this.status = 0;
                        this.comp = form;
                    }
                    return 2;
                }
            }
        },
        methods: {
            Next(res) {
                if (res == 2) {
                    this.comp = going;
                }
            }
        },
        mounted() {
            Share.Ready();
        },
    }
</script>
