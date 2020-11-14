<template>
    <div class="user-homepage">
        <div class="com-head">
            <div class="user-info">
                <div class="top">
                    <comp-avatar :src="integral.user_photo" :level="integral.level" size="170" :itemid="isProject" :border="0" />
                    <ul class="userdata">
                         <!-- @click="GoList('ratings')" -->
                        <li>
                            <div class="num">{{integral.user_grade_hot_num||0}}</div>
                            <div class="category">热门评级</div>
                        </li>
                        <li @click="GoList('contact/bans-list')">
                            <div class="num">{{integral.by_attention_num||0}}</div>
                            <div class="category">粉丝</div>
                        </li>
                        <li @click="GoList('contact/concern-list')">
                            <div class="num">{{integral.attention_num||0}}</div>
                            <div class="category">关注</div>
                        </li>
                    </ul>
                </div>
                <div class="bottom">
                    <comp-level :username="integral.user_name" :isOffiece="integral.level" :value="integral.user_level" align="left" />
                    <!-- 关注 -->
                    <div class="follow-btn" v-if="!isSelf && !isProject" :class="integral.is_attention? 'followed' : 'not-followed1'" @click="GoConcern(integral.user_id)">
                        <span class="icon icon-add-icon" v-if="!integral.is_attention"></span>{{integral.is_attention? '已关注' : '关注'}}
                    </div>
                </div>
            </div>
        </div>
        <div class="com-tab">
            <div class="tab-item">
                <span :class="{'active':current(0)}" @click="TabClick(0)">全部</span>
            </div>
            <div class="tab-item relative">
                <span :class="{'active':current(1)}" @click="TabClick(1)">评级 ({{integral.user_grade_num||0}})</span>
                <i class="icon icon-shouhui"></i>
                <ul class="drop" v-show="DshowDrop">
                    <li :class="{'current':Ddrop == 0}" @click.stop="DropClick(0)">全部</li>
                    <li :class="{'current':Ddrop == 1}" @click.stop="DropClick(1)">交易所</li>
                    <li :class="{'current':Ddrop == 2}" @click.stop="DropClick(2)">项目</li>
                </ul>
            </div>
            <div class="tab-item">
                <span :class="{'active':current(2)}" @click="TabClick(2)">爆料 ({{integral.user_grade_tip_off_num||0}})</span>
            </div>
            <div class="tab-item" v-if="isProject">
                <span :class="{'active':current(5)}" @click="TabClick(5)">公告 ({{integral.item_noti||0}})</span>
            </div>
        </div>
        <div class="article-ratings" v-if="uid">
            <comp-datalist :key="`${uid}${Dtype}${Ddrop}`" scene="4" :show-order="Dtype == 5 ? '0' : null" :type="Dtype" :uid="uid" @reduceNum="reduceNum" :emptyTxt="emptyTxt" mainHeight="calc(100vh - 15.95rem)" />
        </div>
    </div>
</template>

<script>
    import compDatalist from "~components/compDatalist";
    import compAvatar from "~components/compAvatar";
    import compLevel from "~components/compLevel";
    import drawCanvas from '~script/drawCanvas';
    import {constellation} from "../../../../../caijing/script/constellation";
    let oldTab = 0; //用于处理下拉选项卡的显示处理 只有当评级选项卡选中，再次点击，才会显示下拉选项卡
    export default {
        name: "user-homepage",
        components: {
            compDatalist,
            compAvatar,
            compLevel,
        },
        data() {
            return {
                integral: {},
                uid: 0,
                Dtab: 0, //0.全部 1.评级 2.爆料 3:公告
                Ddrop:0, //评级选项卡的下拉选项卡 0：全部 1：交易所评级 2：项目评级
                DshowDrop:0, //是否显示下拉选项卡
                Dtype:0, //组件接口传参 0：全部 1:评级项的全部 2：爆料 3：评级项的项目评级 4：评级项的交易所评级 5：公告
                isConcern: true, //是否已关注
                // 生成图片相关
                Url: 'https://heizuan.oss-cn-shenzhen.aliyuncs.com/h5images/',
                ImgUrl: '', // 本地图片地址
                imageData: {
                    user_photo: "",
                    user_super: '', // 超级评审员
                    user_project: '', // 项目 | 黑钻 官方
                    header: '', // 头部
                    wrapBg: '', // 内容区域水印
                    QRCode: '', // 二维码
                    Empty: '', // 没有数据时
                },
            };
        },
        computed: {
            uinfo() {
                return this.$store.getters.userInfo;
            },
            isSelf() {
                return this.uinfo.user_id == this.uid;
            },
            emptyTxt() {
                let text = "";
                switch (this.Dtab) {
                    case 0:
                        text = this.isSelf ?
                            "快来发布评级和爆料吧" :
                            "Ta还没有发布过评级和爆料";
                        break;
                    case 1:
                        text = this.isSelf ? "快来发布第一条评级吧" : "Ta还没有发布过评级";
                        break;
                    case 2:
                        text = this.isSelf ?
                            "快来发布第一条爆料吧" :
                            "Ta还没有发布过任何实名爆料";
                        break;
                    case 3:
                        text = this.isSelf ?
                            "快来发布第一条公告吧" :
                            "Ta还没有发布过任何公告";
                        break;
                    default:
                        break;
                }
                return text;
            },
            user_grade_like_num() {
                let likenum = this.integral.user_grade_like_num;
                return likenum > 1000 ? (likenum / 1000).toFixed(1) + "K" : likenum;
            },
            shareTitle() {
                return this.isSelf ? "我" : "Ta";
            },
            isOfficial() {
                if (this.integral.level == this.$global.userLevel.official) return 1;
                // 黑钻官方
                else if (this.integral.user_located_item_id) return 2;
                // 项目官方
                else return 0;
            },
            isProject() {
                let isProject = this.integral.user_located_item_id;
                return isProject;
            }
        },
        methods: {
            //Tab点击事件
            TabClick(key){
                if(oldTab == key) { //点击当前选项卡无效
                    if(key == 1) { //如果是评级选择卡
                        this.DshowDrop = !this.DshowDrop;
                    }
                    return;
                }
                this.DshowDrop = 0;
                this.Ddrop = 0; //恢复评级选项卡的下拉菜单为全部
                this.Dtab = this.Dtype = oldTab = key;
            },
            //下拉选项卡点击事件
            DropClick(key){
                this.Ddrop = key;
                this.DshowDrop = 0;
                if(key == 1)
                    this.Dtype = 4;
                else if(key == 2)
                    this.Dtype = 3;
                else // 点击全部时传1
                    this.Dtype = 1;
            },
            GoList(listname){
                this.$router.push({
                    path: `/user/${listname}/${this.uid}`,
                    query: {
                        name: this.integral.user_name,
                        bans: this.integral.by_attention_num || 0
                    }
                })
            },
            openTip() {
                this.$dialog.pannel({
                    title: "温馨提示",
                    content: [
                        "项目方入驻请扫描下方二维码",
                        "添加黑钻评级商务微信提交申请材料",
                        "(添加时请备注:认领+项目名称)",
                        `<p style="text-align: center;"><img style="width:5rem;height:5rem;" src="https://heizuan.oss-cn-shenzhen.aliyuncs.com/h5images/kefucode.png" /></p>`
                    ]
                });
            },
            current(value) {
                return this.Dtab == value;
            },
            reduceNum(gradeType, anonymType, status) {
                if (status == -1) return false;
                if (gradeType == 0) {
                    //评级
                    this.integral.user_grade_num = this.integral.user_grade_num - 1;
                } else if (gradeType == 1 && anonymType == 0) {
                    //实名爆料
                    if (this.integral.user_grade_tip_off_num <= 0) return false;
                    this.integral.user_grade_tip_off_num =
                        this.integral.user_grade_tip_off_num - 1;
                }
            },
            getUserIntegral() {
                this.$ajax.post(this.$api.apply.get_users, {
                    user_id: this.uid
                }).then(res => {
                    if (res.status == 1) {
                        this.integral = Object.assign({}, res.data.user_data);
                        if (Global.isApp && Global.isPro) {
                            // 生成图片
                            drawCanvas.toBase64Url(`${this.Url}user-share.jpg?timeStamp=` + new Date(), 375 * drawCanvas.DPR(), 427 * drawCanvas.DPR(), (callBackData) => {
                                this.imageData.header = callBackData;
                                drawCanvas.toBase64Url(`${this.Url}water-mark.jpg?timeStamp=` + new Date(), 375 * drawCanvas.DPR(), 1053 * drawCanvas.DPR(), (callBackData) => {
                                    this.imageData.wrapBg = callBackData;
                                    drawCanvas.toBase64Url(`${this.Url}offiece-icon.png?timeStamp=` + new Date(), 24 * drawCanvas.DPR(), 24 * drawCanvas.DPR(), (callBackData) => {
                                        this.imageData.user_project = callBackData;
                                        drawCanvas.toBase64Url(`${this.Url}assessor-icon.png?timeStamp=` + new Date(), 24 * drawCanvas.DPR(), 24 * drawCanvas.DPR(), (callBackData) => {
                                            this.imageData.user_super = callBackData;
                                            drawCanvas.toBase64Url(`${res.data.img}?timeStamp=` + new Date(), 200 * drawCanvas.DPR(), 200 * drawCanvas.DPR(), (callBackData) => {
                                                this.imageData.QRCode = callBackData;
                                                drawCanvas.toBase64Url(`${res.data.user_data.user_photo}?timeStamp=` + new Date(), 146 * drawCanvas.DPR(), 146 * drawCanvas.DPR(), (callBackData) => {
                                                    this.imageData.user_photo = callBackData;
                                                    let list = []; // 列表
                                                    if (res.data.grade_data.length > 1) {
                                                        res.data.grade_data.forEach(item => {
                                                            let O = {};
                                                            O.grade_intro = item.grade_intro.length > 40 ? item.grade_intro.substring(0, 40) + "..." : item.grade_intro;
                                                            list.push(O)
                                                        });
                                                        this.isSuper(res.data.user_data, list)
                                                    } else {
                                                        drawCanvas.toBase64Url(`${this.Url}search-empty-icon.png?timeStamp=` + new Date(), 360 * drawCanvas.DPR(), 278 * drawCanvas.DPR(), (callBackData) => {
                                                            this.imageData.Empty = callBackData;
                                                            this.isSuper(res.data.user_data, list)
                                                        })
                                                    }
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        }
                        this.share()
                    }
                });
            },
            // 判断是否有评审员|官方标签
            isSuper(item, list) {
                let G = this.$global.userLevel,
                    HZ = '黑钻', // 黑钻官方
                    footip = "上黑钻评级，知项目好坏",
                    isSuper = 0;
                // 项目|黑钻官方
                if (item.user_located_item_id || item.level == G.official) {
                    isSuper = 2;
                    footip = "了解项目方最新动态";
                    if (item.user_located_item_id) {
                        HZ = '项目';
                    }
                } else if (item.level == G.assessor || item.level == G.assessorRobot) { //  //超级评审员、评审机器人
                    isSuper = 1;
                    footip = "区块链项目听我给你说";
                }
                this.createImage(item, list, isSuper, HZ, footip);
            },
            // 生成图片
            createImage(item, list, isSuper, HZ, footip) {
                this.imageData.text = list;
                let user = {
                    user_name: item.user_name,
                    attention: item.attention_num, //关注
                    attentioned: item.by_attention_num, //被关注
                    hot: item.user_grade_hot_num, // 精选评级
                };
                this.imageData.user = user;
                drawCanvas.creatUserCanvas({
                    isSuper,
                    HZ, // 黑钻|项目官方
                    imageData: this.imageData,
                    footip,
                }).then(res => {
                    let type = 'png';
                    drawCanvas.saveImage(type, res).then(resolve => {
                        this.ImgUrl = resolve;
                        this.share("image");
                    });
                })
            },
            share(type) {
                type = type || '';
                let isSuper = (this.integral.level == 3 || this.integral.level == 21) && this.integral.user_grade_num > 0;
                Share.Ready({
                    imgUrl: isSuper ? this.integral.user_photo : 0,
                    title: this.isProject ?
                        `我是项目官方，来看我们的最新公告吧！` :
                        (isSuper ?
                            `我是超级评审员${this.integral.user_name}，来给我写的评级点个赞！` :
                            `${this.integral.user_name}的个人主页`),
                    desc: this.isProject ?
                        `项目最新公告，尽在黑钻评级` :
                        (isSuper ?
                            "走过路过不错过，抬抬手指点个赞" :
                            "了解一下，万一哪天我火了呢"),
                    link: isSuper ? location.href : 0,
                    pictures: this.ImgUrl,
                    type,
                });
            },
            GoConcern(id) {
                Service.UpdateAtt(id,() => { //关注
                    this.integral.is_attention = 1;
                    this.integral.by_attention_num++; //点击关注，粉丝数+1
                },() => { //取消关注
                    this.integral.is_attention = 0;
                    this.integral.by_attention_num--; //点击关注，粉丝数-1
                });
            }
        },
        activated() {
            if (this.uid != this.$route.params.uid || this.isSelf) {
                //用户自己的个人主页不缓存，保证等级实时
                this.uid = this.$route.params.uid;
                this.getUserIntegral();
            } else {
                this.share();
            }
        }
    };
</script>
