<template>
    <div class="auth-form">
        <comp-prompt v-if="idcert.idcert_status == 2" bgColor="rgba(255,114,112,.1)" style="padding:.4rem .75rem;">{{idcert.idcert_fail_info}}</comp-prompt>
        <comp-prompt bgColor="#fff" color="#333" icon-color="#5682FF">为保障您的资金安全，请先完成实名认证。需填写您的真实信息，否则将不会通过审核或禁止提现。通过实名认证后，从次日起的100天内每日登录【访问任务中心即视为登录】，将获得累计200的黑钻积分。</comp-prompt>
        <div class="form">
            <div class="item">
                <div class="label">真实姓名</div>
                <comp-input v-model="name" placeholder="请填写真实姓名" />
            </div>
            <div class="item">
                <div class="label">身份证号</div>
                <comp-input v-model="number" reg="^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$" placeholder="请填写你的身份证号" />
            </div>
        </div>
        <div class="form picbox">
            <div class="text">1.①左手手持身份证，②右手比“V”，③张开嘴巴微笑露出牙齿。确保照片和身份证信息清晰可见。</div>
            <div class="text">2.身份证正反面照片，请保证四角完整、亮度均匀、照片清晰。</div>
            <div class="text">3.上传照片内容真实有效，无任何修改。</div>
            <div class="text">4.仅支持jpg、png图片格式，且每张照片不得大于3M。</div>
            <!-- 上传手持图片 -->
            <comp-uploader v-model="img" :src="$assets.idcertImgV3" />
            <!-- 上传身份证正面 -->
            <comp-uploader v-model="sfz" :src="$assets.idcertSfz" />
            <!-- 上传身份证反面 -->
            <comp-uploader v-model="sfz2" :src="$assets.idcertSfz2" />
            <div class="submit">
                <comp-input Type="button" value="提交申请" @arrow="Submit" :status="btnStatus" />
            </div>
        </div>
    </div>
</template>

<script>
    import compPrompt from '~components/compPrompt';
    import compUploader from '~components/compUploader2';
    import compInput from '~components/compInput/input';
    export default {
        components: {
            compPrompt,
            compUploader,
            compInput,
        },
        data() {
            return {
                name: '', //姓名
                number: '', //身份证
                img: '',//手持照片
                sfz:'',//身份证下面
                sfz2:'',//身份证反面
                loading: 0, //提交状态
                uploading: 0, //上传状态
            }
        },
        computed: {
            btnStatus() {
                return this.name && /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(this.number) && this.img && this.sfz && this.sfz2 ? 1 : 0;
            },
            idcert() {
                return this.$store.getters.userInfo.idcert_info;
            }
        },
        methods: {
            //提交数据
            Submit() {
                if (this.loading) return;
                this.loading = 1;
                Ajax.post(Api.apply.do_idcert, {
                    name: this.name,
                    idcert_num: this.number,
                    imga: this.sfz,
                    imgb: this.sfz2,
                    imgc: this.img,
                }).then(res => {
                    this.loading = 0;
                    let s = res.data.status;
                    if (s == 1) { //成功
                        this.$service.Update({
                            idcert_info: {
                                idcert_status: 0,
                                idcert_name: this.name,
                                idcert_num: this.number,
                                idcert_imga: this.sfz,
                                idcert_imgb: this.sfz2,
                                idcert_imgc: this.img
                            }
                        });
                        this.$emit("next", 2);
                    } else {
                        this.$dialog.alert(res.message);
                    }
                }).catch(e => {
                    this.$dialog.alert(e.message);
                    this.loading = 0;
                });
            }
        },
        mounted() {
            //当且仅当审核状态为审核中或不通时，才请求接口获取最新状态
            let d = this.idcert;
            // let s = d && d.idcert_status;
            // if (s == 0 || s == 2 || s == undefined) {
            //     Ajax.get(Api.apply.get_idcert).then(res => {
            //         let d = res.data;
            //         this.$service.Update({
            //             idcert_info: d
            //         });
            //     });
            // }
            if (d.idcert_name) {
                this.name = d.idcert_name;
                this.number = d.idcert_num;
                this.sfz = d.idcert_imga;
                this.sfz2 = d.idcert_imgb;
                this.img = d.idcert_imgc;
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../../../assets/css/config";
    .auth-form {
        background-color: @bgcolor-body;
        .layout-prompt {
            margin: 0 !important;
            padding: .75rem;
        }
        .form {
            margin-top: .25rem;
            padding: .75rem;
            background: #fff;
            .item {
                margin-bottom: .75rem;
                &:last-child {
                    margin: 0;
                }
                .label {
                    font-size: .75rem;
                }
            }
        }
        .picbox {
            margin-top: .25rem;
            padding-bottom: 1rem;
            .text {
                font-size: .7rem;
                color: #888;
                text-align: justify;
            }
            .submit {
                padding: 1rem 0;
            }
        }
    }
</style>
