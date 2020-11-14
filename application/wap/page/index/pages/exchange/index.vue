<template>
    <div class="exchange">
        <!-- 平台信息 -->
        <comp-info scene="1" :_Object="DitemData" :gradeSatus="gradeSatus" :isProject="is_project"/>
        <!-- 平台公告 -->
        <div v-if="false || is_project" >
            <!-- 是平台方 -->
            <div class="pro-announce" v-if="announcedata && announcedata.length > 0">
                <comp-marquee :marqueeData="announcedata" />
            </div>
        </div>
        <div v-else-if="false" class="pro-announce" @click="$router.push('/recruit')">
            <!-- 不是平台方 -->
            <div class="not-pro">
                <p class="title">黑钻评级在找你</p>
                <p>如果你是平台方 赶紧申请入驻吧</p>
            </div>
        </div>

        <div class="com-tab" ref="actionbar">
            <div class="tab-item">
                <span :class="{'active':Dtab == 0}" @click="Toggle(0)">评级</span>
            </div>
            <div class="tab-item">
                <span :class="{'active':Dtab == 1}" @click="Toggle(1)">外评</span>
            </div>
            <div class="tab-item">
                <span :class="{'active':Dtab == 2}" @click="Toggle(2)">简介</span>
            </div>
        </div>

        <!-- 按钮点击 -->
        <comp-buttons v-if="Dtab == 0" ref="buttons" :_Object="btns" @select="GetButton"/>

        <keep-alive>
            <component :is="Dtab == 2 ? 'compIntro' : 'compDatalist'"
                :key="`${proid}-${Dtab}`"
                :scene="5"
                :type="Dtab == 0 ? 1 : 4"
                :size="5"
                show-order="0"
                :item-id="proid"
                :data="Dtab==2?DitemData:null"
                :keepState="false"
                :needscroll="false"
                :empty-txt="'抱歉，该交易所暂时还没有评级内容'"
                main-height="calc(100vh - 23.95rem)"/>
        </keep-alive>
        <div v-if="Dtab==0">
            <comp-ratings scene="1" :count="DitemData.item_user_num || DitemData.bourse_user_num" @update="UpdatePage"/>
        </div>
    </div>
</template>

<script>
    import compIntro from "~components/currExch/introduction";
    import compRatings from "~components/currExch/ratings";
    import compMarquee from "~components/compMarquee";
    import compInfo from "~components/currExch/compInfo";
    import compButtons from "~components/currExch/compButtons";
    import compDatalist from "~components/compDatalist";
    import drawCanvas from "~script/drawCanvas";
    let scrollTop = 0;
    let oldProid = 0;
    export default {
        name: "exchange",
        components: {
            compIntro,
            compRatings,
            compInfo,
            compMarquee,
            compDatalist,
            compButtons
        },
        data() {
            return {
                Dtab: 0, //选项卡TAB 0：评级 1：爆料 2：简介
                DitemData: {}, //项目信息数据容器
                grade_data: [],
                needShare: true,
                gradeSatus: {},
                showContact: false, //项目方入住提示
                showRule: false, //点击黑钻数
                announcedata: [], //项目公告数据容器
                btns: { // 按钮点击
                    title: "热门评级",
                    data: [
                        {id: 0, name: "全部"}, {id: 1, name: '超级评审员'},
                        {id: 2, name: "黑钻钻友"},{id: 3, name: "优秀"},
                        {id: 4, name: "一般"},{id: 5, name: "不错"},
                        {id: 6, name: "较差"}
                    ]
                },

                // 生成图片相关
                Url: 'https://heizuan.oss-cn-shenzhen.aliyuncs.com/h5images/',
                ImgUrl: '', // 本地图片地址
                imageData:{
                    user_photo: [],
                    user_level: [],
                    item_logo: "",
                    header: '', // 头部
                    wrapBg: '', // 内容区域水印
                    goldBg: '', // 屎黄背景图
                    QRCode: '', // 二维码
                },
            };
        },
        computed: {
            is_project() {
                //是否是项目方
                return this.DitemData.bourse_located_user == 1 ? 1 : 0;
            },
            //项目id编号
            proid(){
                return this.$route.params.itemid;
            }
        },
        methods: {
            //选项卡TAB切换
            Toggle(tab){
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                this.Dtab = tab;
            },

            // 跳转
            GetButton (val){
                this.$router.push({
                    path: `/project/1/${this.$route.params.itemid}`,
                    query:{
                        pro: this.$route.query.pro,
                        name: val.name,
                        id: val.id,
                        isExchange: 1
                    },
                });
            },

            // 获取项目信息
            GetProject() {
                let params = {
                    id: this.proid,
                };
                this.$ajax.get(this.$api.apply.get_bourse_info, params).then(res => {
                    if (res.status == 1) {
                        this.DitemData = res.data;
                        this.grade_data = res.data.share_grade;
                        this.Share();
                    }
                }).catch(err => {
                    this.$dialog.alert(err.message);
                });
            },

            // 处理标签
            RemoveHTMLTag(str){
                str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
                str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
                str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
                return str;
            },

            Share() {
                if (!this.needShare || !this.DitemData.bourse_id) return false;
                let shareState = this.DitemData.bourse_user_num >= 1;
                let intro = this.DitemData.intro;
                if(Global.isApp && Global.isPro) {
                    // 生成图片
                    drawCanvas.toBase64Url(`${this.Url}new-exchange-share.jpg?timeStamp=`+ new Date(), 375 * drawCanvas.DPR(), 308 * drawCanvas.DPR(),(callBackData) => {
                        this.imageData.header = callBackData;
                        drawCanvas.toBase64Url(`${this.Url}water-mark.jpg?timeStamp=`+ new Date(), 375 * drawCanvas.DPR(), 1053 * drawCanvas.DPR(),(callBackData) => {
                            this.imageData.wrapBg = callBackData;
                            drawCanvas.toBase64Url(`${this.Url}gold-bg.jpg?timeStamp=`+ new Date(), 120 * drawCanvas.DPR(), 120 * drawCanvas.DPR(),(callBackData) => {
                                this.imageData.goldBg = callBackData;
                                drawCanvas.toBase64Url(`${this.Url}offiece-icon.png?timeStamp=` + new Date(), 24 * drawCanvas.DPR(), 24 * drawCanvas.DPR(), (callBackData) => {
                                    this.imageData.user_project = callBackData;
                                    drawCanvas.toBase64Url(`${this.Url}assessor-icon.png?timeStamp=` + new Date(), 24 * drawCanvas.DPR(), 24 * drawCanvas.DPR(), (callBackData) => {
                                        this.imageData.user_super = callBackData;
                                        drawCanvas.toBase64Url(`${this.DitemData.bourse_url_qrcode}?timeStamp=` + new Date(), 200 * drawCanvas.DPR(), 200 * drawCanvas.DPR(), (callBackData) => {
                                            this.imageData.QRCode = callBackData;
                                            let list = [], // 列表
                                                intro = ''; // 简介
                                            // 获取列表前两条
                                            try {
                                                if (this.grade_data.length > 0) {
                                                    this.grade_data.forEach((item, index) => {
                                                        if (index <= 1) {
                                                            let O = {};
                                                            O.user_name = item.user_name;
                                                            O.grade_score = Service.GetEvaluate(item.grade_score);
                                                            console.log(Service.GetEvaluate(item.grade_score));
                                                            O.grade_intro = item.grade_intro.length > 40 ? item.grade_intro.substring(0, 40) + "..." : item.grade_intro;
                                                            O.user_photo = item.user_photo;
                                                            O.level = item.level;
                                                            O.user_located_item_id = item.user_located_item_id;
                                                            list.push(O)
                                                        } else {
                                                            throw new Error("已经拿到想要的数据了~")
                                                        }
                                                    });
                                                } else {
                                                    intro = this.RemoveHTMLTag(this.DitemData.intro)
                                                }
                                            } catch (e) {
                                                if (e.message !== "已经拿到想要的数据了~") throw e;
                                            }
                                            if (this.DitemData.bourse_logo) {
                                                drawCanvas.toBase64Url(`${this.DitemData.bourse_logo}?timeStamp=` + new Date(), 88 * drawCanvas.DPR(), 88 * drawCanvas.DPR(), (callBackData) => {
                                                    this.imageData.logo = callBackData;
                                                    this.ListFormat(list, intro)
                                                })
                                            } else {
                                                this.ListFormat(list, intro)
                                            }
                                        })
                                    })
                                })
                            })
                        })
                    })
                }
                Share.Ready({
                    imgUrl: this.DitemData.bourse_logo,
                    title: shareState ? `【黑钻评级】${this.DitemData.bourse_user_num}名超级评审员给${this.DitemData.bourse_cn_name || this.DitemData.bourse_en_name}打了${Number(this.DitemData.bourse_score).toFixed(1)}分,来说说你的看法。`
                        : `【黑钻评级】${this.DitemData.bourse_cn_name || this.DitemData.bourse_en_name}新鲜上架，抢先发布评级可得更多黑钻奖励`,
                    desc: intro.length > 60 ? `${intro.substr(0, 60)}...` : intro,
                    link: location.href,
                });
                this.needShare = false;
            },

            // list 数据处理 Share内
            ListFormat(list,intro){
                if(list.length > 0) {
                    drawCanvas.toBase64Url(`${list[0].user_photo}?timeStamp=` + new Date(), 83 * drawCanvas.DPR(), 83 * drawCanvas.DPR(), (callBackData) => {
                        this.imageData.user_photo.push(callBackData);
                        if (list.length > 1) {
                            drawCanvas.toBase64Url(`${list[1].user_photo}?timeStamp=` + new Date(), 83 * drawCanvas.DPR(), 83 * drawCanvas.DPR(), (callBackData) => {
                                this.imageData.user_photo.push(callBackData);
                                this.createImage(list,intro);
                            })
                        }else {
                            this.createImage(list,intro);
                        }
                    })
                }else{
                    this.createImage(list,intro);
                }
            },

            // 生成图片
            createImage(list,intro){
                // 生成图片
                let nickname =  this.DitemData.bourse_cn_name,
                    Type = 8;
                if(this.DitemData.bourse_en_name && this.DitemData.item_cn_name){
                    nickname = `${this.DitemData.bourse_en_name}/${this.DitemData.item_cn_name}`
                }
                let text = {
                    personal: this.DitemData.bourse_user_num || "—", // 多少人评过
                    gradeScore: this.DitemData.bourse_score > 0 ? this.DitemData.bourse_score : '—', // 项目总分
                    nickname: nickname || "",
                    text: null
                };

                if(list.length > 0) {
                    text.text = list
                } else {
                    text.text = intro.length > 180 ? intro.substring(0, 180) + "..." : intro;
                }

                this.imageData.text = text;

                drawCanvas.creatDetailCanvas({
                    Type,
                    imageData: this.imageData,
                    footip: "查看该项目更多评级",
                }).then(res => {
                    let type = 'png';
                    drawCanvas.saveImage(type,res).then(resolve =>{
                        this.ImgUrl = resolve;
                        Share.Ready({
                            pictures: this.ImgUrl,
                            type: "image"
                        })
                    });
                })
            },

            UpdatePage(val) {
                if (this.proid != oldProid) {
                    this.Dtab = 0; //更换项目后，将TAB重置到评级选项卡
                    oldProid = this.proid;
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    this.DitemData =  {};
                    this.GetProject();
                    this.GetGradeCount();
                } else {
                    document.body.scrollTop = scrollTop;
                    document.documentElement.scrollTop = scrollTop;
                }
            },

            CheckGrade() {
                if (Service.isLogin()) {
                    Service.CheckGrade(1,this.proid).then(res => { //可发布
                        this.gradeSatus = res.data;
                    }).catch(res => {
                        this.gradeSatus = res.data;
                    });
                }
            },

            // 获取交易所评级分类数据
            GetGradeCount() {
                Ajax.get(Api.apply.get_bourse_gradecount, {
                    id: this.proid,
                }).then(res => {
                    if(res.status==1){
                        for (let i = 1; i <= res.data.length; i++) {
                            if(this.btns.data[i].id == i){
                                let str = this.btns.data[i].name.replace(/\((.+?)\)/g,'');
                                this.btns.data[i].name = `${str}(${ res.data[i-1]})`;
                            }
                        }
                        if(this.$refs.buttons) this.$refs.buttons.current = '';
                    }
                });
            },

            // GetAnnounceData() {
            //     // 获取平台公告 获取最新3条
            //     this.$ajax.post(this.$api.apply.itemnoti_get_list, {
            //         page: 1,
            //         pagesize: 3,
            //         order: 0, // 0最新  1热门
            //         itemnoti_item_id: this.proid //项目id 指定返回某个项目的公告
            //     }).then(res => {
            //         if (res.status == 1) {
            //             let d = res.data;
            //             this.announcedata = d.data;
            //         } else {
            //             this.$dialog.alert(res.message);
            //         }
            //     }).catch(err => {
            //         this.$dialog.alert(err.message);
            //     });
            // }
        },
        mounted() {
            // this.GetProject();
            // this.GetAnnounceData();
        },
        activated() {
            this.UpdatePage();
            this.CheckGrade();
            this.Share();
            // this.GetAnnounceData();
        },
        deactivated() {
            scrollTop =
                document.body.scrollTop || document.documentElement.scrollTop;
            this.needShare = true;
        }
    };
</script>
