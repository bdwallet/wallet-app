<template>
    <div class="help-feedback">
        <div class="f-b-select">
            <div class="title">请选择问题类型（必填）</div>
            <comp-Select :checkOptions="checkOptions" @change="GetSelect"/>
        </div>
        <div class="f-b-editer f-b-item">
            <div class="title">请输入问题描述（必填，10字以上）</div>
            <div class="f-b-textarea">
                <textarea :placeholder="placeholder" ref="feedback" v-model="content" @click="OnFocus" spellcheck="false"></textarea>
            </div>
        </div>
        <div class="f-b-uploder f-b-item">
            <div class="title">请上传图片（选填）</div>
            <comp-uploader ref="uploader" @uploaded="Uploaded" :max-length='8'/>
        </div>
        <div class="f-b-btn f-b-item">
            <comp-input Type="button" value="提交" height="2.25rem" :status="status" @arrow="GoBackHere" />
        </div>
    </div>
</template>

<script>
    import compSelect from '~components/compInput/select';
    import compInput from '~components/compInput/input';
    import compUploader from '~components/compUploader';
    export default {
        name: "feedback",
        components: {
            compSelect,
            compUploader,
            compInput
        },
        data() {
            return {
                checkOptions: [], // 渲染单选框内容
                placeholder: '对现有功能不满？想要新功能优化建议？快来告诉我们吧~',
                isChecked: 0, // 是否选择
                selectType: null, // 选择的类型，0:产品建议，1:故障反馈，2:其他问题
                imgArray: [], // 上传的图片
                content: '', // textarea 输入的文字
            }
        },
        computed: {
            //当前输入文字字数
            contentNum() {
                let n = this.ReplaceContent(this.content).gblen();
                return Math.ceil(n/2);
            },

            // 判断按钮点击状态  计算属性不需要在data上声名 会发生冲突
            status() {
                return this.contentNum >= 10 && this.isChecked == 1
            }
        },
        methods: {
            // 获取意见反馈分类
            GetCate() {
                this.$ajax.get(this.$api.apply.feedback_get_cate).then(res => {
                    if(res.status == 1) {
                        res.data.forEach(item => {
                            this.checkOptions.push(item.feedbackcate_name);
                        });
                    }
                })
            },

            // 聚焦
            OnFocus(){
                this.$refs.feedback.focus()
            },

            // 设置 placeholder
            SetPlaceholder(val) {
                switch (+val) {
                    case 1:
                        this.placeholder = '产品建议：对现有功能不满？想要新功能优化建议？快来告诉我们吧~';
                        break;
                    case 2:
                        this.placeholder = '故障反馈：请提供您遇到的问题以及相关硬件情况，如：手机品牌，机型等信息。';
                        break;
                    case 3:
                        this.placeholder = '其他问题：天啦撸！你居然还遇到了其他问题，请描述说明一下吧~';
                        break;
                    default:
                        this.placeholder = '对现有功能不满？想要新功能优化建议？快来告诉我们吧~';
                        break
                }

            },

            // 获取 选择项index + 内容
            GetSelect(val){
                this.selectType = val && val.match(/\d+/)[0];
                this.SetPlaceholder(this.selectType);
                if(val) this.isChecked = 1;
            },

            // 上传图片完成后回调
            Uploaded(imglist, ischange) {
                if (ischange == 'change') {
                    this.change = true;
                }
                this.imgArray = imglist;
            },

            // 返回上一页
            GoBackHere(){
                let params = {
                    feedbackcate_id: this.selectType,
                    feedback_content: this.content,
                    feedback_img: this.imgArray
                };
                this.$ajax.post(this.$api.apply.feedback_submit,params).then(res => {
                    if(res.status == 1){
                        this.$dialog.alert({
                            title: '反馈成功',
                            content: '已收到反馈，请耐心等待结果。',
                            btns: ['知道了']
                        }).then(() => {
                            if(Global.isApp && Global.isPro){
                                HZApp.Back()
                            }else {
                                this.$router.go(-1);
                            }
                        });
                    }
                }).catch(err => {
                    this.$dialog.alert({
                        title: err.message,
                        content: err.data,
                        btns: ['知道了']
                    }).then(() => {});
                });
            },

            // 内容空格与回车处理函数(连续多个空格缩成1个空格；连续多行精简成1行) replace(/\n|\r\n/g,"<br>")
            ReplaceContent(content) {
                let regEx = /\n+|\r\n+/g;
                content = content.replace(regEx, '`');
                regEx = /\s+/g;
                content = content.replace(regEx, ' ');
                content = content.replace(/\`/g, '\n');
                return content;
            },

        },
        mounted () {
            this.selectType = null;
            this.checkOptions = [];
            this.imgArray = [];
            this.content = '';
            this.$refs.uploader.initImglist([]);
            this.GetCate();
        }
    }
</script>

<style lang="less">
    @import "../../../../../assets/css/config";
    .help-feedback{
        width: 100%;
        min-height: 100vh;
        .title{
            padding: .75rem 0;
            font-size: .7rem;
        }
        .f-b-item{
            padding: 0 .75rem .75rem;
        }
        .f-b-select{
            .title{
                padding: .75rem;
                background: @bgcolor-body;
            }
            .single-plural-check{
                background: #fff;
                padding: 0 .75rem;
            }
        }
        .f-b-editer{
            padding-bottom: 0;
            .f-b-textarea{
                padding: .5rem .5rem 0 .5rem;
                background: #F4F4F4;
            }
            textarea{
                width: 100%;
                height: 6.4rem;
                border: 0;
                background: transparent;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, PingFang SC, Helvetica Neue, STHeiti, Microsoft Yahei, Tahoma, Simsun, sans-serif;
                font-size: .6rem;
            }
            textarea::-webkit-input-placeholder {
                font-size: .6rem;
            }
            textarea:-moz-placeholder {
                font-size: .6rem;
            }
            textarea::-moz-placeholder {
                font-size: .6rem;
            }
            textarea:-ms-input-placeholder {
                font-size: .6rem;
            }
        }
        .f-b-uploder{
            li{
                background: #fff;
            }
        }
        .f-b-btn{
            padding-top: .75rem;
            padding-bottom :1.4rem;
        }
    }
</style>