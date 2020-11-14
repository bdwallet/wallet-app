<template>
    <div class="comp-dialog"  :class="{'active': state == 1, 'hidden': state == 2}" @touchmove.prevent="TouchMove">
        <div class="dialog answer-dialog" style="width: 100%;" @click.stop>
            <div class="bg1"> 
                <!-- bg1 bg2 放背景  两张图 一张需要旋转 -->
                <div class="bg2">
                    <circle-progress @Next="Submit" :time="time" ref="circlePro"/>
                    <div class="answer-wrap">
                        <div class="question" :class="{'active': isActive}">
                            <div class="title">{{question.question_content}}</div>
                            <ul class="options" v-if="question.answer">
                                <li
                                    v-for="answer in question.answer"
                                    :key="answer"
                                    :class="current == answer? (isRight? 'success' : 'error') : ''"
                                    @click.once="Submit(answer)"
                                >
                                    <span>{{answer}}</span>
                                    <i class="icon" :class="current == answer? (isRight? 'icon-Path' : 'icon-Pathni') : ''"></i>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import circleProgress from "~components/circleProgress";
export default {
    name: "answer",
    components: {
        circleProgress
    },
    data() {
        return {
            current: '', // 选择的选项及正确选项 0：选择的选项 1：正确选项
            isActive: false, //题目切换动效
            time: 0, //计时
            isRight: false, //是否正确
            question: {}, //题目
            answer: '', //答案
            state: 0, //0: hidden, 1: showing, 2: active
            clickState: 0,//防止频繁点击
        };
    },
    methods: {
        show() {
            this.state = 1;
            this.GetData('', 1).then(res => {
                this.$refs.circlePro.record();
            }).catch(err => {
                this.$dialog.alert(err.message).then(() => {
                    this.hide();
                });
            })
        },
        hide() {
            this.destroy()
        },
        destroy(){
            this.state = 2;
            setTimeout(() => {
                this.state = 0;
                this.$destroy()
            }, 300);
        },
        TouchMove(e){
            e && e.preventDefault();
        },
        GetData(answer, isfirst){
            //获取题目,提交答案
            return new Promise((resolve, reject) => {
                answer = answer || '';
                let params = {
                    question_id: this.question.question_id || '', //问题id
                    answer: answer || '', //答案
                    is_first: isfirst || 0//是否第一次进入
                };
                this.$ajax.post(this.$api.apply.answer_question,params).then(res => {
                    if(res.status == 1){
                        if(isfirst) this.Render(res);
                        resolve(res);
                    }else{
                        reject(res);
                    }
                }).catch(err => {
                    reject(err);
                })
            })
            
        },
        Render(res){//渲染数据
            let data = res.data;
            this.time = data.answer_time;
            this.question = data.question_data;
            this.isRight = data.is_right;
        },
        Submit(answer) {
            // 提交答案
            if(this.clickState){
                return;
            }
            this.clickState = 1;
            answer = answer || '';
            this.GetData(answer).then(res => {
                this.isRight = res.data.is_right;
                this.current = answer;
                this.$refs.circlePro.clear(); //暂停倒计时
                if(JSON.stringify(res.data.question_data) === '[]'){
                    setTimeout(() => {
                        this.$dialog.alert({
                            title: '恭喜您通过人机检测',
                            content: '感谢您的积极配合。机器人作恶，我们严惩不贷',
                            btns: ['知道了']
                        }).then(() => {
                            setTimeout(() => {
                                this.hide();
                            }, 300);
                        });
                    }, 1000);
                }else{
                    this.Next(res);
                }
            }).catch(err => {
                this.$refs.circlePro.clear(); //暂停倒计时
                if(err.status == -20002) {
                    this.Next();
                    this.GetData();
                }else{
                    this.current = answer;
                    this.isRight = err.data.is_right || false;
                    console.log(this.current)
                    setTimeout(() => {
                        this.$dialog.alert({
                            title: err.message,
                            btns: ['知道了'],
                            backdropClick: 0
                        }).then(() => {
                            this.question = {};
                            this.hide();
                        });
                    }, 500);
                }
            });
        },
        Next(res){
            setTimeout(() => {
                this.isActive = true;
                this.$refs.circlePro.record();
                setTimeout(() => {
                    this.Render(res);
                    this.clickState = 0;
                    this.current = '';
                    this.isActive = false;
                }, 200);
            }, 500);
        }
    },
    destroyed() {
        let parent = this.$el.parentNode;
        parent.removeChild(this.$el);
    }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/config";
.comp-dialog{
    width: 100%;
    z-index: 7;
    position: fixed;
    top: 0;
    left: 0;
    transform: none;
    .answer-dialog {
        width: 100%;
        height: 100vh;
        .bg1{
            width: 100%;
            height: 100%;
            background: url("@{hosturl}article-bg.png") top left / 30% no-repeat,
                linear-gradient(313deg, rgba(29, 29, 29, 1) 0%, rgba(91, 91, 90, 1) 100%);
            transform: rotate(180deg);
            .bg2{
                width: 100%;
                height: 100%;
                background: url("@{hosturl}article-bg.png") top left / 30% no-repeat;
                transform: rotate(180deg);
                display: flex;
                flex-direction: column;
                align-items: center;
                .circle-progress {
                    margin: 1rem 0;
                }
                .answer-wrap {
                    width: 15.5rem;
                    height: auto;
                    background-color: #fff;
                    box-shadow: 0 0.2rem 0.35rem 0 rgba(86, 130, 255, 0.1);
                    border-radius: 0.7rem;
                    padding: 1rem;
                    .remark {
                        font-size: 0.6rem;
                        color: @color-dec;
                        line-height: 1.4;
                        font-weight: 400;
                        text-align: right;
                    }
                    .question {
                        font-size: .75rem;
                        color: @color-sub;
                        line-height: 1.4;
                        font-weight: 400;
                        transition: .2s all ease-in; 
                        transform: scale(1);
                        .title{
                            font-size: .75rem;
                            font-weight: 600;
                            padding-top: .2rem;
                        }
                        .options {
                            li {
                                list-style-type: upper-alpha;
                                width: 100%;
                                height: 2.5rem;
                                background: #f3f3f3;
                                border-radius: 1.175rem;
                                margin-top: 0.8rem;
                                line-height: 2.5rem;
                                font-size: 0.8rem;
                                padding: 0 1.2rem;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                &.success {
                                    background: #5682ff;
                                    color: #fff;
                                }
                                &.error {
                                    background: #ff7270;
                                    color: #fff;
                                }
                            }
                        }
                        &.active{
                            transform: scale(0);
                        }
                    }
                }
            }
        }
    }
}
</style>