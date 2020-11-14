<template>
    <div class="layout-form form-main">
        <comp-avatar class="avatar" :src="avatar" @arrow="getImg" :uploading="uploading" />
        <comp-input placeholder="请设置您的昵称" v-model="nick" Type="text" reg="^[A-Za-z0-9_\u4e00-\u9fa5]{4,16}$" />
        <comp-prompt>1、昵称、头像三个月才能修改1次，请慎重填写<br />2、昵称需为4-20个字符，仅支持中英文、数字、“_”</comp-prompt>
        <comp-input class="nextbtn" value="完成" Type="button" @arrow="clickEvent" :status="btnState" />
        <div v-if="params.jump" class="jumpbtn"><span @click="jump">跳过</span></div>
    </div>
</template>

<script>
    import "./style";
    import compInput from '~components/compInput/input';
    import compAvatar from '~components/compInput/avatar';
    import compPrompt from '~components/compPrompt';
    let oldAvatar, oldNick;
    export default {
        name: 'layoutFormLogin',
        components: {
            compInput,
            compAvatar,
            compPrompt
        },
        props: {
            params: {
                type: Object,
                default: {}
            },
        },
        data() {
            return {
                uploading: 0, //上传状态
                avatar: '', //头像
                nick: '', //昵称
            }
        },
        computed: {
            btnState() {
                let len = this.nick.gblen();
                return /^[A-Za-z0-9_\u4e00-\u9fa5]+$/.test(this.nick) && len >= 4 && len <= 20;
            }
        },
        methods: {
            //获取上传头像地址
            getImg(src) {
                this.avatar = src;
            },
            //点击事件处理
            clickEvent() {
                if (this.uploading) {
                    this.$dialog.alert("图片上传中");
                    return false;
                }
                let d = {};
                if (this.avatar != oldAvatar)
                    d.user_photo = this.avatar;
                if (this.nick != oldNick){
                    d.user_name = this.nick;
                }
                if (this.nick == oldNick && this.avatar == oldAvatar){
                    this.$router.go(-1);
                    return;
                }
                if (d.user_photo || d.user_name) {
                    Ajax.post(Api.apply.set_user_info, {
                        type: 0,
                        set_data: JSON.stringify(d)
                    }).then(r => {
                        let s = r.data.status;
                        if (s == 1) {
                            this.$emit('next', {
                                next: 0,
                                info: d
                            });
                        } else if(s == -40001){ //"昵称需为4-20个字符\r仅支持中英文、数字、“_”"
                            this.$dialog.alert({title:"昵称需为4-20个字符<br />仅支持中英文、数字、“_”",btns:["好的"]});
                        } else if(s == -40002){ //昵称重复
                            this.$dialog.alert({title:"昵称与别人的重复啦<br />换一个吧！",btns:["好的"]});
                        } else {
                            this.$dialog.alert(r.message);
                        }
                        //let url = this.$route.query.url;
                        //this.$router.replace(url || "/user/main");
                        //this.$destroy();
                    });
                } else {
                    this.$emit('next', {
                        next: 0
                    });
                }
            },
            //跳过点击事件
            jump() {
                this.$emit('next', {
                    next: 0,
                });
            }
        },
        mounted() {
            let uinfo = this.$store.getters.userInfo,
                ps = this.params;
            //初始头像昵称
            this.avatar = oldAvatar = ps.img_url || uinfo.user_photo;
            this.nick = oldNick = ps.user_name || uinfo.user_name;
        }
    }
</script>