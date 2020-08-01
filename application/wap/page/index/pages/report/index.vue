<template>
    <div class="report">
        <div class="r-select">
            <div class="title">请选择举报类型（必填）</div>
            <comp-Select :checkOptions="checkOptions" @change="GetSelect"/>
        </div>
        <div class="r-editer r-item">
            <div class="title">举报理由说明（选填）</div>
            <div class="r-textarea" @click="OnFocus">
                <textarea :placeholder="placeholder" ref="report" v-model="content" spellcheck="false"></textarea>
            </div>
        </div>
        <div class="r-btn r-item">
            <comp-input Type="button" value="提交" height="2.25rem" :status="status" @arrow="GoBackHere" />
        </div>
    </div>
</template>

<script>
    import compSelect from '~components/compInput/select';
    import compInput from '~components/compInput/input';
    export default {
        name: "report",
        components: {
            compSelect,
            compInput
        },
        data() {
            return {
                checkOptions: [], // 渲染单选框内容
                reportData: [], // 获取的数据
                placeholder: '请详细填写举报原因~',
                isChecked: 0, // 是否选择

                content: '', // 举报理由
                grade_type: '', // 被举报的内容的type类型
                grade_id: '', // 被举报内容的id
                comment_id: '', // 被举报的评论|回复id
                selectType: '', // 选择的类型
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
                return this.isChecked == 1 ? true : false;
            }
        },
        methods: {
            // 获取意见反馈分类
            GetCate() {
                this.$ajax.get(this.$api.apply.report_get_cate).then(res => {
                    if(res.status == 1) {
                        this.reportData = res.data;
                        res.data.forEach(item => {
                            this.checkOptions.push(item.report_cate_name);
                        });
                    }
                })
            },

            // 聚焦
            OnFocus(){
                this.$refs.report.focus()
            },

            // 设置 placeholder
            SetPlaceholder(val) {
                this.reportData.forEach(item =>{
                    if(+val == item.report_cate_id){
                        this.placeholder = item.report_cate_des
                    }
                })
            },

            // 获取 选择项index + 内容
            GetSelect(val){
                this.selectType = val && val.match(/\d+/)[0];
                this.SetPlaceholder(this.selectType);
                if(val) this.isChecked = 1;
            },

            // 返回上一页
            GoBackHere(){
                let params = {
                    report_cate: this.selectType, // 举报类型
                    report_type: this.grade_type, // 被举报的内容type类型
                    report_type_key: this.grade_id, // 被举报的内容id
                    report_comment_id: this.comment_id, // 被举报的评论|回复的id
                    report_content: this.content,  // 举报理由
                };
                this.$ajax.post(this.$api.apply.reprot_submit, params).then(res => {
                    if(res.status == 1){
                        this.$dialog.alert({
                            title: '举报完成',
                            content: '已收到您的反馈，非常感谢。',
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
                        //content: err.data,
                        btns: ['知道了']
                    }).then(() => {});
                });
            },
        },
        mounted () {
            this.selectType = null;
            this.checkOptions = [];
            this.GetCate();
            if(this.$route.query){
                let d = this.$route.query;
                this.grade_type = d.gradetype;
                this.grade_id = d.gradeid;
                if(d.commentid) this.comment_id = d.commentid;
            }
        }
    }
</script>

<style lang="less">
    @import "../../../../assets/css/config";
    .report{
        width: 100%;
        min-height: 100vh;
        .title{
            padding: .75rem 0;
            font-size: .7rem;
        }
        .r-item{
            padding: 0 .75rem .75rem;
        }
        .r-select{
            .title{
                padding: .75rem;
                background: @bgcolor-body;
            }
            .single-plural-check{
                background: #fff;
                padding: 0 .75rem;
            }
        }
        .r-editer{
            padding-bottom: 0;
            .r-textarea{
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
        .r-btn{
            padding-top: .75rem;
            padding-bottom :1.4rem;
        }
    }
</style>