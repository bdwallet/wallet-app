<template>
    <div class="item pro-info">
        <div class="pro-head" v-if="_Object && (_Object.item_id || _Object.bourse_id)">
            <div class="left">
                <img :src="_Object.item_logo || _Object.bourse_logo || $assets.proItemNone"/>
                <div class="pro-name">{{_Object.item_cn_name || _Object.bourse_cn_name }}
                    <span v-if="(_Object.item_urrency_abbreviation&&_Object.item_cn_name)||(_Object.bourse_en_name && _Object.bourse_cn_name)">/</span>{{_Object.item_urrency_abbreviation || _Object.bourse_en_name}}
                </div>
            </div>
            <div class="right" v-if="scene==2" @click.stop="!enter && OpenTip()">项目方{{enter ? '已入驻':'申请入驻'}}</div>
        </div>
        <!-- 项目信息 -->
        <div class="pro-box" v-if="scene==2">
            <div class="top-title">
                <div class="left-title">
                    <span>黑钻评分</span>
                    <div class="mark" @click.stop="$dialog.msg('1000名投资经验丰富的超级评审员，本着真实客观的原则,从项目、团队、生态建设、项目进展、代币经历等维度考量，评出的综合评分。',$event)">
                        <i class="icon icon-gantanhao"></i>
                    </div>
                </div>
                <div class="time-box" v-if="_Object.item_firstissue_time>0">
                    <span>首发当周多20黑钻</span>
                    <comp-timetool class="timer" :value="_Object.item_firstissue_time" />
                </div>
            </div>
            <div class="box-top">
                <div class="left pro-left">
                    <div class="pro-score left"
                    >{{_Object&&_Object.item_id&&(_Object.item_grade>0) ? currentScore.toFixed(1):'—'}}</div>
                    <div class="pro-star left">
                        <ul class="xingxing">
                            <li v-for="item in [1,2,3,4,5,6,7,8,9,10]" :key="item">
                                <i v-if="_Object&&_Object.item_id&&(_Object.item_user_num>=10)"
                                   :class="['icon' ,GetIcon(_Object.item_grade,item),{'current': currentScore.toFixed()>= item }]"
                                ></i>
                                <i v-else class="icon icon-shixing"></i>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="right pro-right">
                    <div class="pro-item">
                        <div class="left score-interval">8-10分</div>
                        <div class="left score-img">
                            <div class="score-bg"></div>
                            <div class="score-draw" ref="draw1"></div>
                        </div>
                    </div>
                    <div class="pro-item">
                        <div class="left score-interval">4-7分</div>
                        <div class="left score-img">
                            <div class="score-bg"></div>
                            <div class="score-draw" ref="draw2"></div>
                        </div>
                    </div>
                    <div class="pro-item">
                        <div class="left score-interval">1-3分</div>
                        <div class="left score-img">
                            <div class="score-bg"></div>
                            <div class="score-draw" ref="draw3"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="_Object&&_Object.item_id" class="seen">
                <i class="icon icon-renkanguo"></i>
                <span>{{_Object.item_read_nun}}人看过</span>
            </div>
            <div class="box-linethrough"></div>
            <div class="box-bottom">
                <div class="left-box">
                    当前评级可得：{{ranklevel}}黑钻
                    <i class="icon icon-gantanhao"
                       @click.stop="$dialog.msg('评级越早，奖励越高。同一项目，会根据评级发布的先后实行阶梯式奖励：第1-100位：70黑钻，第101-300位：42黑钻，第301位后：21黑钻',$event)"
                    ></i>
                </div>
                <div class="center-line"></div>
                <div class="right-box">
                    <div v-if="_Object.cny_price" class="right"
                         :class="parseFloat(_Object.percent_change_1h) < 0 ? 'up' : 'down'">
                        <h3>¥{{parseInt(_Object.cny_price) > 0 ? parseFloat(_Object.cny_price).toFixed(2) : parseFloat(_Object.cny_price).toFixed(6)}}</h3>
                        <p v-if="_Object.percent_change_1h">
                            <span v-if="parseFloat(_Object.percent_change_1h) > 0">+</span>
                            {{parseFloat(_Object.percent_change_1h).toFixed(2)}}%
                        </p>
                    </div>
                    <div v-else class="right">
                        <h3>￥—</h3>
                        <p>— —</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 交易所信息 -->
        <div class="pro-box" v-else>
            <div class="top-title">
                <div class="ex-t-item rank">今日排名<span>{{_Object.bourse_rank ? _Object.bourse_rank : '—'}}</span></div>
                <div class="ex-t-item hot">热度
                    <i class="icon icon-redu"></i>
                    <span v-if="_Object.bourse_hot">{{_Object.bourse_hot}}<sup>o</sup></span>
                    <span v-else>—</span>
                </div>
                <div class="ex-t-item score">交易所得分<span class="ex-score">{{_Object.bourse_score ? _Object.bourse_score : '—'}}</span></div>
            </div>
            <div class="box-top">
                <div class="left pro-left">
                    <div class="left-item ts-amount">
                        24H交易额<span>￥{{ _Object.bourse_gmv ?  (+_Object.bourse_gmv).toFixed(2) : 0.00}}亿</span>
                    </div>
                    <div class="left-item ts-up" :class="{'ts-flow': isUp}">
                        资金净流入<span>{{_Object.bourse_inflow ? (+_Object.bourse_inflow).toFixed(2) : 0.00}}亿</span>
                    </div>
                    <div class="left-item ts-type">
                        <div class="title">类型</div>
                        <div class="type" v-for="(item, index) in _Object.label_data" :key="index">{{item.name}}</div>
                    </div>
                    <div class="box-linethrough left-item"></div>
                    <div class="box-bottom left-item">
                        <div v-if="_Object&&_Object.bourse_id" class="seen b-b-item">
                            <i class="icon icon-renkanguo"></i>
                            <span>{{_Object.bourse_view_num}}人看过</span>
                        </div>
                        <div class="center-line b-b-item"></div>
                        <div v-if="_Object&&_Object.bourse_id" class="write b-b-item">
                            <i class="icon icon-pinglun"></i>
                            <span>{{_Object.bourse_user_num}}人评过</span>
                        </div>
                    </div>
                </div>
                <div class="right pro-right">
                    <comp-radar :_Object="radarData"/>
                </div>
            </div>
        </div>
        <div class="commentSatus" v-if="gradeSatus.status" @click="$router.push({path:`/detail/${scene==2?0:5}/${gradeSatus.grade_id}`})">
            <div class="wrap-l">
                <img :src="$store.getters.userInfo.user_photo" />
                <span>我评过</span>
                {{$service.Dater(gradeSatus.create_time)}}
            </div>
            <div class="wrap-r">
                <span v-if="gradeSatus.status==1" style="color:#FF7270;">去追评</span>
                <span v-else>查看我的评级</span>
                <i class="icon icon-shouhui"></i>
            </div>
        </div>
    </div>
</template>

<script>
    import compRadar from '~components/compTools/compRadar';
    import compTimetool from "~components/compTools/compTimetool";
    export default {
        name: "compInfo",
        components: {
            compRadar,
            compTimetool
        },
        data () {
            return {
                currentScore: 0,
                defaulticon: "icon-shixing",
                radar: {
                    sidesNum: 6, // 多少个多边形
                    isGradient: 1, // 是否是背景渐变填充
                    isArea: 0, // 数据区域是否填充
                    isArc: 0, // 是否为圆形
                    dataArr: [ // 数据
                        { name: "技术安全", value: 35},
                        { name: "团队实力", value: 40},
                        { name: "产品使用", value: 10},
                        { name: "交易活跃度", value: 30},
                        { name: "运营情况", value: 90},
                        { name: "社区建设", value: 10},
                    ]
                }
            }
        },
        props: {
            // 1：交易所 2：项目
            scene: {
                type: Number,
                default: 0
            },
            gradeSatus: { // 是否评过
                type: Object,
                default: {}
            },
            _Object: { // 基本信息
                type: Object,
                default: {}
            }
        },
        computed: {
            // 是否已经入驻
            enter(){
                return this._Object.item_located_user_id > 0;
            },
            //计算当前项目评级人数所处位置 1-100: 70 101-300: 42 301-: 21
            ranklevel() {
                if(this._Object.item_user_num){
                    let num = this._Object && this._Object.item_user_num;
                    let level = 70;
                    if (num >= 100 && num < 300) {
                        level = 42;
                    } else if (num >= 300) {
                        level = 21;
                    }
                    return level;
                }
            },
            radarData() {
                if(this._Object.bourse_statistics){
                    for(let n = 0; n < this.radar.dataArr.length; n++){
                        if(this.radar.dataArr[n].name == '技术安全') this.radar.dataArr[n].value = this._Object.bourse_statistics.skill_score;
                        if(this.radar.dataArr[n].name == '交易活跃度') this.radar.dataArr[n].value = this._Object.bourse_statistics.deal_score;
                        if(this.radar.dataArr[n].name == '团队实力') this.radar.dataArr[n].value = this._Object.bourse_statistics.team_score;
                        if(this.radar.dataArr[n].name == '产品使用') this.radar.dataArr[n].value = this._Object.bourse_statistics.product_score;
                        if(this.radar.dataArr[n].name == '运营情况') this.radar.dataArr[n].value = this._Object.bourse_statistics.run_score;
                        if(this.radar.dataArr[n].name == '社区建设') this.radar.dataArr[n].value = this._Object.bourse_statistics.bbs_score;
                    }
                    return this.radar
                }
            },
            isUp() {
                if(this.scene == 1) {
                    return /-/.test(this._Object.bourse_inflow)
                }
            }
        },
        watch:{
            '_Object': function (val, old) {
                 this.currentScore = 0;
                 this.scene == 2 && val && val !== old && this.Animate();
            },
            deep: true
        },
        methods: {
            //点击倒计时的提示消息
            ShowTip() {
                this.$dialog.tip("项目首发当周，评级获100额外黑钻");
            },
            OpenTip() {
                this.$dialog.pannel({
                    title: "温馨提示",
                    content: [
                        `${this.scene == 1 ? "平台" : "项目"}方入驻请扫描下方二维码`,
                        "添加黑钻评级商务微信提交申请材料",
                        `(添加时请备注:认领+${this.scene == 1 ? "平台" : "项目"}名称)`,
                        `<p style="text-align: center;"><img style="width:5rem;height:5rem;" src="https://heizuan.oss-cn-shenzhen.aliyuncs.com/h5images/kefucode.png" /></p>`
                    ]
                });
            },
            GetIcon(item_grade, item) {
                let grade = item_grade;
                return Number(item_grade).toFixed() == item &&
                Number(item_grade) < item
                    ? this.defaulticon
                    : "icon-shixing";
            },
            Animate() {
                let _this = this;
                setTimeout(function() {
                    if (_this.$refs.draw1 && _this._Object.item_statistics) {
                        _this.$refs.draw1.style.width =
                            _this._Object.item_statistics[2] * 100 + "%";
                        _this.$refs.draw2.style.width =
                            _this._Object.item_statistics[1] * 100 + "%";
                        _this.$refs.draw3.style.width =
                            _this._Object.item_statistics[0] * 100 + "%";
                    }
                });
                let grade = this._Object.item_grade;
                if (grade) {
                    let timer = setInterval(function() {
                        if (Number(grade).toFixed() <= _this.currentScore.toFixed()) {
                            _this.defaulticon = "icon-banxing";
                            clearInterval(timer);
                        } else {
                            if (Number(grade).toFixed() <= _this.currentScore + 1) {
                                _this.currentScore = Number(grade);
                            } else {
                                _this.currentScore++;
                            }
                        }
                    }, 100);
                }
            },
        },
    }
</script>

<style lang="less" scoped>
    @import "../../assets/css/config";
    .pro-info{
        padding: .75rem .75rem .3rem;
        background-color: #F3F3F3;
        .pro-head{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left{
                flex: 1;
                display: flex;
                align-items: center;
                font-size: 0;
                img{
                    width: 1.55rem;
                    height: 1.55rem;
                    border-radius: .25rem;
                }
                .pro-name{
                    margin-left: .45rem;
                    font-size: 1rem;
                }
            }
            .right{
                border-radius: 0.2rem;
                text-align: center;
                font-size: .6rem;
                color: @color-dec;
                background: #fff;
                padding: .2rem .4rem;
            }
        }
        .pro-box{
            position: relative;
            width: 100%;
            padding: 0.6rem;
            margin-top:.75rem;
            justify-content: center;
            color: #888;
            background: url('@{hosturl}article-bg.png') top left/25% no-repeat, linear-gradient(313deg,rgba(29,29,29,1) 0%,rgba(91,91,90,1) 100%);
            // background: linear-gradient(313deg,rgba(29,29,29,1) 0%,rgba(91,91,90,1) 100%), url('@{hosturl}article-bg.png') no-repeat;
            // background-size: 30%;
            // background-position: top left;
            box-shadow: 0 0 .1rem 0 rgba(0,0,0,0.3), 0 0 .175rem .05rem rgba(0,0,0,0.3);
            border-radius: .2rem;
            border: .05rem solid #FFE6A9;
            .top-title{
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 0.65rem;
                .left-title{
                    display: flex;
                    align-items: center;
                    color: @color-basics;
                    i{
                        color: #BCBCBC;
                    }
                }
                .mark{
                    position: relative;
                    text-align: center;
                    i{
                        display: inline-block;
                        padding: 0.3rem;
                        font-size: 0.6rem;
                        color: @color-time;
                    }
                }
                .time-box{
                    display: flex;
                    position: relative;
                    align-items: center;
                    padding: 0 0.3rem;
                    font-size: .6rem;
                    background:rgba(253,253,253,0.1);
                    box-shadow:0 0 .075rem 0 rgba(0,0,0,0.5);
                    border-radius: .5rem;
                    color:@color-time;
                    .timer{
                        display: flex;
                        align-items: center;
                        i{
                            margin-right: 0.25rem;
                        }
                    }
                    span{
                        line-height: 1;
                        margin-right: 0.2rem;
                    }
                    .icon{
                        margin-right: 0;
                    }
                }
                .circle{
                    width: 0.4rem;
                    height: 0.4rem;
                    border-radius: 50%;
                }
                /** 交易所 title start **/
                .ex-t-item {
                    display: flex;
                    align-items: center;
                    color: @color-basics;
                    font-size: .75rem;
                    span{
                        margin-left: .3rem;
                        font-size: .9rem;
                    };
                    &.score{
                        span{
                            color: rgba(255, 177, 136, 1);
                        }
                    }
                    &.hot{
                        sup{
                            font-size: .6rem;
                            align-self: baseline;
                            vertical-align: super;
                        }
                    }
                }
                /** 交易所 title end **/
            }
            .box-top{
                display: flex;
                justify-content: space-between;
                margin-top: 0.5rem;
                .pro-left{
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding-top: .5rem;
                    .pro-score{
                        font-size: 1.5rem;
                        font-weight:500;
                        color:@color-basics;
                        text-shadow: 0 .05rem .1rem rgba(0,0,0,0.5);
                        text-align: center;
                    }
                    .pro-star{
                        display: flex;
                        .xingxing{
                            display: flex;
                            margin-bottom: 0.25rem;
                            li{
                                margin-right:.05rem;
                                line-height: 1;
                                font-size: .6rem;
                                .icon{
                                    font-size: 0.5rem;
                                    transition:All .2s;
                                    -webkit-transition: All .2s;
                                    color:#EFEFF4;
                                    &.current{
                                        color:#FFB188;
                                    }
                                }
                            }
                        }
                        .pro-desc{
                            margin-top:.5rem;
                            font-size: .6rem;
                            color:#EFEFF4;
                            font-weight: 300;
                        }
                    }
                    /** 交易所 box start **/
                    .left-item{
                        color: white;
                        font-size: .7rem;
                        width: 8.375rem;
                        span{
                            margin-left: .3rem;
                        }
                        &.ts-amount{
                            span{
                                color: rgba(136, 198, 143, 1);
                            }
                        }
                        &.ts-up{
                            span{
                                color: rgba(136, 198, 143, 1);
                            }
                        }
                        &.ts-flow{
                            span{
                                color: rgba(255, 114, 112, 1);
                            }
                        }
                        &.ts-type{
                            display: flex;
                            flex-wrap: wrap;
                            font-size: .5rem !important;
                            color: rgba(188, 188, 188, 1);
                            .title{
                                margin-right: .2rem;
                            }
                            .type{
                                color: rgba(106, 64, 41, 1);
                                padding: 0 .1rem;
                                margin-right: .2rem;
                                background: linear-gradient(135deg,rgba(248,213,188,1) 0%,rgba(255,177,136,1) 100%);
                                border-radius: .055rem;
                            }
                        }
                        &.box-linethrough{
                            margin: 0 !important;
                        }
                        .b-b-item{
                            color: rgba(188, 188, 188, 1);

                            text-align: left;
                            margin-top: 0 !important;
                            i{
                                font-size: 0.55rem;
                                margin-right: 0 !important;
                            }
                            span{
                                font-size: .45rem;
                                margin-left: 0;
                            }
                            &.center-line{
                                height: .7rem;
                                margin: 0 .2rem;
                            }
                        }
                    }
                    /** 交易所 box end **/
                }
                .pro-center{
                    display: none;
                }
                .pro-right{
                    .pro-item{
                        display: flex;
                        flex-flow:row;
                        align-items: center;
                        margin-top:.1rem;
                        .score-interval{
                            width: 2rem;
                            flex-shrink:0;
                            text-align: right;
                            font-size: .6rem;
                            color:#ccc;
                        }
                        .score-img{
                            position: relative;
                            width: 6.9rem;
                            flex: 1;
                            margin-left:.6rem;
                            overflow: hidden;
                            border-radius: .4rem;
                            .score-bg{
                                width: 100%;
                                height: .4rem;
                                border-radius: .4rem;
                                background:#000000;
                                opacity:0.35;
                            }
                            .score-draw{
                                position: absolute;
                                top:0;
                                left:0;
                                z-index: 2;
                                width: 0;
                                height: .4rem;
                                border-radius: .4rem;
                                background:linear-gradient(180deg,rgba(248,213,188,1) 0%,rgba(255,177,136,1) 100%);
                                -webkit-transition:All 1.2s;
                                transition:All 1.2s;
                            }
                        }
                    }
                }
            }
            .seen{
                margin-top: 0.2rem;
                font-size: 0.55rem;
                text-align: right;
                color: @color-time;
                .icon{
                    margin-right: 0.2rem;
                    font-size: 0.55rem;
                }
            }
            .box-linethrough{
                height: .1rem;
                margin:0.2rem 0 0.4rem;
                background: rgba(255,255,255,0.08);
            }
            .box-bottom{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .score-level{
                    position: relative;
                    width: 7.5rem;
                    height: 0.05rem;
                    background: #979797;
                    .data{
                        position: absolute;
                        display: flex;
                        justify-content: center;
                        width: 0.25rem;
                        height: 0.25rem;
                        font-size: 0.5rem;
                        line-height: 1.2rem;
                        left: 100px;
                        border-radius: 50%;
                        background: #D8D8D8;
                    }
                    .txt{
                        display: flex;
                        position: relative;
                        justify-content: space-between;
                        position: absolute;
                        bottom: 0.5rem;
                        left: 0.9rem;
                        height: 0.8rem;
                        min-width: 3.25rem;
                        padding: 0 0.1rem;
                        line-height: 0.8rem;
                        font-size: 0.5rem;
                        color: #FFFFFF;
                        background: #FF7270;
                        i{
                            font-size: 0.6rem;
                            margin-left: 0.1rem;
                        }
                    }
                    .data-200{
                        left: 0;
                        top: -0.1rem;
                    }
                    .data-100{
                        left: 2.5rem;
                        top: -0.1rem;
                    }
                    .data-50{
                        left: 5.0rem;
                        top: -0.1rem;
                    }
                    .data-10{
                        left: 7.5rem;
                        top: -0.1rem;
                    }
                }

                .left-box{
                    font-size: 0.6rem;
                    color: @color-basics;
                    i{
                        display: inline-block;
                        margin-left: 0.3rem;
                        font-size: 0.6rem;
                        color: @color-time;
                    }
                }
                .center-line{
                    position: relative;
                    width: 0.075rem;
                    height: 1.4rem;
                    background: rgba(255,255,255,0.08);
                }
                .right-box{
                    padding-right: 0.3rem;
                    .up{
                        color: #FF7270;
                    }
                    .down{
                        color: #33CF7E;
                    }
                    .right{
                        display: flex;
                        align-items: center;
                        h3{
                            margin-right: 0.4rem;
                            font-size: 0.9rem;
                        }
                        p{
                            font-size: 0.6rem;
                        }
                    }

                }
            }
        }
        .commentSatus{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: .35rem .5rem;
            margin-top: .3rem;
            font-size: 0.55rem;
            color: #999;
            background:rgba(255,255,255,0.8);
            box-shadow: 0 .05rem .1rem 0 rgba(0,0,0,0.12);
            border-radius: 0.2rem;
            img{
                display: block;
                width: 1.6rem;
                height: 1.6rem;
                margin-right: 0.3rem;
                border-radius: 50%;
            }
            i{
                font-size: 0.35rem;
                color: #BCBCBC;
                margin-left: 0.5rem;
            }
            .wrap-l{
                display: flex;
                align-items: center;
                span{
                    margin-right: 0.2rem;
                    color: #888;
                }
            }
            .wrap-r{
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }
    }
</style>
