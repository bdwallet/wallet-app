<template>
    <div class="article" :class="{tabsfixed:actionbarIsFixed}">
        <comp-info scene="2" :_Object="DitemData" :gradeSatus="gradeSatus" />
        <!-- 项目公告 START -->
        <!-- 有项目方入驻 -->
        <div v-if="DitemData.item_located_user_id">
            <div class="pro-announce" v-if="announcedata && announcedata.length > 0">
                <comp-marquee :marqueeData="announcedata" />
            </div>
        </div>
        <!-- 无项目方入驻 -->
        <div v-else class="pro-announce" @click="$router.push('/recruit')">
            <div class="not-pro">
                <p class="title">黑钻评级在找你</p>
                <p>如果你是项目方 赶紧申请入驻吧</p>
            </div>
        </div>
        <!-- 项目公告 END -->

        <div class="com-tab" ref="actionbar">
            <div class="tab-item">
                <span :class="{'active':Dtab == 0}" @click="Toggle(0)">评级</span>
            </div>
            <div class="tab-item">
                <span :class="{'active':Dtab == 1}" @click="Toggle(1)">爆料</span>
            </div>
            <div class="tab-item">
                <span :class="{'active':Dtab == 2}" @click="Toggle(2)">简介</span>
            </div>
        </div>
        <keep-alive>
            <component :is="Dtab<2?'compDatalist':'compIntro'"
                :key="`${proid}-${Dtab}`"
                :scene="Dtab<2?5:2"
                :type="Dtab==0?2:3"
                :size="Dtab==0?5:20"
                :item-id="proid"
                :data="Dtab==2?DitemData:null"
                :keepState="false"
                :needscroll="Dtab==0?false:true"
                :empty-txt="Dtab==0?'抱歉，该项目还没有评级内容':'抱歉，该项目还没有爆料内容'"
                main-height="calc(100vh - 23.95rem)"/>
        </keep-alive>
        <div v-if="Dtab==0">
            <comp-ratings scene="2" :count="DitemData.item_user_num" @update="UpdatePage"/>
        </div>
    </div>
</template>

<script>
import './style';
import compInfo from "~components/currExch/compInfo";
import compMarquee from "~components/compMarquee";
import compIntro from "~components/currExch/introduction";
import compRatings from "~components/currExch/ratings";
import compDatalist from "~components/compDatalist";
import drawCanvas from '~script/drawCanvas';
let oldProid = 0;
export default {
    name: "article",
    components: {
        compInfo,
        compMarquee,
        compRatings,
        compDatalist,
        compIntro
    },
    data() {
        return {
            Dtab: 0, //选项卡TAB 0：评级 1：爆料 2：简介
            // Dcomp: 'compRatings', //选择卡对应组件名
            DitemData: {}, //项目信息数据容器
            grade_data: [],
            needShare: true,
            gradeSatus: {},
            showContact: false, //项目方入住提示
            showRule: false, //点击黑钻数
            announcedata: [], //项目公告数据容器

            // 生成图片相关
            Url: 'https://heizuan.oss-cn-shenzhen.aliyuncs.com/h5images/',
            ImgUrl: '', // 本地图片地址
            imageData:{
                user_photo: [],
                user_super: '', // 超级评审员
                user_project: '', // 项目 | 黑钻 官方
                logo: "",
                header: '', // 头部
                wrapBg: '', // 内容区域水印
                goldBg: '', // 屎黄背景图
                QRCode: '', // 二维码
            },
        };
    },
    computed: {
        //项目id编号
        proid(){
            return this.$route.params.itemid;
        },
        // comps(){
        //     let tab = this.Dtab;
        //     if(tab == 0)
        //         this.Dcomp = 'compRatings';
        //     else if (tab == 1)
        //         this.Dcomp = 'compDatalist';
        //     else
        //         this.Dcomp = 'compIntro';
        // }
    },
    methods: {
        //选项卡TAB切换
        Toggle(tab){
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
            this.Dtab = tab;
        },
        //获取项目信息
        getProject() {
            Ajax.get(Api.apply.item_info, {id:this.proid}).then(res => {
                if (res.status == 1) {
                    this.DitemData = res.data;
                    this.grade_data = res.data.share_grade;
                    this.Share();
                }
            }).catch(err => {
                this.$dialog.alert(err.message);
            });
        },
        Share() {
            if (!this.needShare || !this.DitemData.item_id) return false;
            let shareState = this.DitemData.item_user_num >= 10;
            let intro = this.DitemData.intro;
            if(Global.isApp && Global.isPro) {
                // 生成图片
                drawCanvas.toBase64Url(`${this.Url}new-project-share.jpg?timeStamp=`+ new Date(), 375 * drawCanvas.DPR(), 308 * drawCanvas.DPR(),(callBackData) => {
                    this.imageData.header = callBackData;
                    drawCanvas.toBase64Url(`${this.Url}water-mark.jpg?timeStamp=`+ new Date(), 375 * drawCanvas.DPR(), 1053 * drawCanvas.DPR(),(callBackData) => {
                        this.imageData.wrapBg = callBackData;
                        drawCanvas.toBase64Url(`${this.Url}gold-bg.jpg?timeStamp=`+ new Date(), 120 * drawCanvas.DPR(), 120 * drawCanvas.DPR(),(callBackData) => {
                            this.imageData.goldBg = callBackData;
                            drawCanvas.toBase64Url(`${this.Url}offiece-icon.png?timeStamp=` + new Date(), 24 * drawCanvas.DPR(), 24 * drawCanvas.DPR(), (callBackData) => {
                                this.imageData.user_project = callBackData;
                                drawCanvas.toBase64Url(`${this.Url}assessor-icon.png?timeStamp=` + new Date(), 24 * drawCanvas.DPR(), 24 * drawCanvas.DPR(), (callBackData) => {
                                    this.imageData.user_super = callBackData;
                                    drawCanvas.toBase64Url(`${this.DitemData.item_url_qrcode}?timeStamp=` + new Date(), 200 * drawCanvas.DPR(), 200 * drawCanvas.DPR(), (callBackData) => {
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
                                                        O.grade_score = `${item.grade_score}分`;
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
                                                intro = this.DitemData.intro
                                            }
                                        } catch (e) {
                                            if (e.message !== "已经拿到想要的数据了~") throw e;
                                        }
                                        if (this.DitemData.item_logo) {
                                            drawCanvas.toBase64Url(`${this.DitemData.item_logo}?timeStamp=` + new Date(), 88 * drawCanvas.DPR(), 88 * drawCanvas.DPR(), (callBackData) => {
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
                imgUrl: this.DitemData.item_logo,
                title: shareState
                    ? `【黑钻评级】${
                        this.DitemData.item_user_num
                        }名超级评审员给${
                        this.DitemData.item_urrency_abbreviation
                        }打了${Number(this.DitemData.item_grade).toFixed(
                        1
                    )}分,来说说你的看法。`
                    : `【黑钻评级】${this.DitemData.item_urrency_abbreviation}新鲜上架，抢先发布评级可得更多黑钻奖励`,
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
            let nickname =  this.DitemData.item_urrency_abbreviation,
                Type = 7;
            if(this.DitemData.item_urrency_abbreviation && this.DitemData.item_cn_name){
                nickname = `${this.DitemData.item_urrency_abbreviation}/${this.DitemData.item_cn_name}`
            }
            let text = {
                personal: this.DitemData.item_user_num || "—", // 多少人评过
                gradeScore: this.DitemData.item_grade > 0 ? this.DitemData.item_grade : '—', // 项目总分
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

        // 更新页面数据
        UpdatePage() {
            if (this.proid != oldProid) {
                this.Dtab = 0; //更换项目后，将TAB重置到评级选项卡
                oldProid = this.proid;
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                // this.Dtab = "ratings";
                this.DitemData = [];
                this.rand_item_data = [];
                this.getProject();
            }
        },


        CheckGrade() {
            if (Service.isLogin()) {
                Service.CheckGrade(2,this.proid).then(res => { //可发布
                    this.gradeSatus = res.data;
                }).catch(() =>{});
            }
        },

        getAnnounceData() {
            // 获取项目公告 获取最新3条
            Ajax.post(Api.apply.itemnoti_get_list, {
                page: 1,
                pagesize: 3,
                order: 0, // 0最新  1热门
                itemnoti_item_id: this.proid //项目id 指定返回某个项目的公告
            }).then(res => {
                if (res.status == 1) {
                    let d = res.data;
                    this.announcedata = d.data;
                } else {
                    this.$dialog.alert(res.message);
                }
            }).catch(err => {
                this.$dialog.alert(err.message);
            });
        }
    },
    mounted() {
        // this.getProject();
        // this.getAnnounceData();
    },
    activated() {
        this.UpdatePage();
        this.Share();
        this.CheckGrade();
        this.getAnnounceData();
    }
};
</script>
