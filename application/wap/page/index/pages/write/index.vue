<template>
    <div class="article-write">
        <div class="marker-wrapper" v-if="isRatings">
            <div class="marker-label" :class="{current: score}">
                <div v-if="score">
                    <span class="num">{{score}}</span>
                    <span class="fen">分</span>
                </div>
                <span v-else>期待您的打分</span>
            </div>
            <comp-marker class="container" :score="score" @score="getScore" />
        </div>
        <!--<comp-marker v-if="isRatings" class="container" :set-score="score" :get-score="getScore" :key="itemId" />-->
        <div class="editor" :style="{'top':isRatings?'5.575rem':'0'}">
            <div class="writer" :class="isShowUploader?'':'writeHeight'">
                <div v-if="isRatings" class="placeholder" v-show="!showPlaceholder">
                    <p>请发表您对该项目的看法，100-10000字即可</p>
                    <p>可从以下维度展开分析:</p>
                    <p class="item">项目（项目可行性、解决方案）</p>
                    <p class="item">团队（技术团队、运营团队、投资人及顾问）</p>
                    <p class="item">生态建设（社群生态、商业推广）</p>
                    <p class="item">项目进展（履约情况、代码质量）</p>
                    <p class="item">代币经历（融资情况、流动性、持币结构）</p>
                    <p class="tip">tips：1、追评：需为对项目的新见解（不能与以往评级内容重复） 2、内容发布5分钟后不可删除和修改，请认真撰写</p>
                </div>
                <div v-else-if="isBroke" class="placeholder" v-show="!showPlaceholder">
                    <p>爆料侠，等你很久了。来，我们一起斩妖除魔！空气币、传销链，出来受死</p>
                    <p>黑幕、跑路、产品关停、维权投诉、打假、辟谣都可以爆，至少10字，不还价~</p>
                    <p class="tip">tips：1、内容发布5分钟后不可删除和修改，请认真撰写 2、新鲜出炉的黑料，并附有证明截图，更容易上推荐哟</p>
                </div>
                <div v-else class="placeholder" v-show="!showPlaceholder">
                    <p>这里有着对币圈最积极的用户，而发布公告会让用户及时了解项目进展，大力吸粉。至少10个字，不讲价哦~</p>
                    <p class="tip">tips:1、仅可发布自己项目的相关动态；不可转载资讯，或为其他项目方打广告 2、内容发布5分钟后不可删除和修改，请认真撰写 3、为了节省社区用户阅读时间，每日仅可发2条公告，请筛选重要事项发布</p>
                </div>
                <textarea class="textarea" @focus="onFocus" @blur="onBlur" v-model="content" @input="setStore" spellcheck="false"></textarea>
            </div>
            <transition name="tips">
                <comp-uploader v-show="isShowUploader" class="img-uplaoder" ref="uploader" :max-length="9" @uploaded="uploaded" />
            </transition>
        </div>
        <div class="foot-tool">
            <div class="article-name">
                <div v-if="itemAdName || isReCruits" class="pro-name">{{itemAdName|| isReCruits}}</div>
                <div v-else>
                    <!-- 布局占位符 -->
                </div>
                <div class="content-num">
                    <span :style="{'color':(contentNum>=conMaxlength)?'#ea1d38':''}">{{contentNum}}</span> /{{conMaxlength}}
                </div>
            </div>
            <div class="post-btn">
                <div class="btns">
                    <comp-anonymous style="margin-right:.75rem;" v-if="isBroke" :status="isNickName" @checked="changeName" />
                    <i class="icon icon-pic" @click="isShowUploader=!isShowUploader"></i>
                </div>
                <div class="submit" :class="{ok}" @click.stop="submit">发布</div>
            </div>
        </div>
    </div>
</template>

<script>
    import compMarker from "~components/compTools/compMarker";
    import compUploader from "~components/compUploader";
    import compAnonymous from "~components/compAnonymous";
    import localStore from "~script/localStore";
    export default {
        name: "write",
        components: {
            compMarker,
            compUploader,
            compAnonymous
        },
        data() {
            return {
                cache_key: Global.localStores.ratings,
                content: "", //项目评级内容
                score: 0, //项目打分
                submiting: false, //发布接口请求状态
                submitedScore: 100, //发布成功后获取的积分数,
                isNickName: 0, //匿名实名标识  0(实名), 1(匿名)
                isShowUploader: false, //是否显示图片上传列表
                imgList: [], //上传的图片
                hasCache: false, //标识是否存在缓存数据
                cacheData: {}, //缓存数据容器
                imgUploadStatus: true, //图片上传状态，上传中不可提价 true 上传完成可提交
                isReCruits: "" // 项目方绑定项目简称
            };
        },
        computed: {
            //当前输入文字字数
            contentNum() {
                let n = this.replaceContent(this.content).gblen();
                return Math.ceil(n / 2);
            },
            //是否达到发布要求 字数100以上并打分
            ok() {
                return (
                    this.contentNum >= this.conMinlength &&
                    this.contentNum <= this.conMaxlength &&
                    (!this.isRatings || (this.isRatings && this.score > 0))
                );
            },
            userInfo() {
                return this.$store.getters.userInfo;
            },
            //控制是否显示 placeholder
            showPlaceholder() {
                return this.content;
            },
            //标识将要发布的内容是否为评级
            isRatings() {
                return this.hasCache ?
                    this.cacheData.isRatings == 0 :
                    this.$route.params.type == 0;
            },
            //标识将要发布的内容是否为爆料
            isBroke() {
                return this.hasCache ?
                    this.cacheData.isBroke == 1 :
                    this.$route.params.type == 1;
            },
            //项目英文简写
            itemAdName() {
                return this.hasCache ?
                    this.cacheData.item_ad_name :
                    this.$route.query.pro;
            },
            //项目编号
            itemId() {
                return this.hasCache ?
                    this.cacheData.item_id :
                    this.$route.params.itemid;
            },
            //修改操作的评级ID
            gradeId() {
                return this.$route.query.id;
            },
            //发布内容最大长度
            conMaxlength() {
                return 10000;
            },
            //发布内容最小长度
            conMinlength() {
                return this.isRatings ? 100 : 10;
            }
        },
        methods: {
            onFocus(e) {
                this.isShowUploader = false;
            },
            onBlur(e) {
                if (!this.imgList.length) return false;
                this.isShowUploader = true;
            },
            //获取分数
            getScore(val) {
                this.score = val.score;
                this.setStore();
            },
            //发布成功后提示已加黑钻
            successTip() {
                if (this.isRatings) {
                    this.$dialog.other("评级发布成功", this.submitedScore, "").then(() => {
                        if (Global.isApp && Global.isPro) {
                            HZApp.Reload("/home/ratings");
                        } else {
                            this.$router.replace({
                                path: "/home/ratings",
                                query: {
                                    refresh: 1
                                }
                            });
                        }
                    });
                } else if (this.isBroke) {
                    if (!this.submitedScore) {
                        this.$dialog.alert("爆料发布成功").then(res => {
                            if (Global.isApp && Global.isPro) {
                                HZApp.Reload("/home/disclosures");
                            } else {
                                this.$router.replace({
                                    path: "/home/disclosures",
                                    query: {
                                        refresh: 1
                                    }
                                });
                            }
                        });
                    } else {
                        this.$dialog
                            .other(
                                "爆料发布成功",
                                this.submitedScore,
                                "爆料上推荐，还将获得100额外奖励"
                            )
                            .then(() => {
                                if (Global.isApp && Global.isPro) {
                                    HZApp.Reload("/home/disclosures");
                                } else {
                                    this.$router.replace({
                                        path: "/home/disclosures",
                                        query: {
                                            refresh: 1
                                        }
                                    });
                                }
                            });
                    }
                } else {
                    this.$dialog.alert("公告发布成功").then(() => {
                        if (Global.isApp && Global.isPro) {
                            HZApp.Reload("/announce/main?tab=1");
                        } else {
                            this.$router.replace({
                                path: "/announce/main?tab=1",
                                query: {
                                    refresh: 1
                                }
                            });
                        }
                    });
                }
            },
            //匿实名选择后回调
            changeName(v) {
                this.isNickName = v;
                this.setStore();
            },
            //图片上传后回调
            uploaded(imglist, ischange, uploadStatus) {
                this.imgUploadStatus = uploadStatus;
                if (!this.imgUploadStatus) return false;
                this.imgList = imglist;
                this.setStore();
            },
            //提交数据
            submit() {
                if (!this.ok || this.submiting) return;
                if (!this.imgUploadStatus) {
                    this.$dialog.alert({
                        title: "系统消息",
                        content: "图片上传中，请上传完成后提交",
                        btns: ["好"]
                    });
                    return false;
                }
                this.submiting = true;
                let api = null;
                let params = {};
                if (this.isRatings || this.isBroke) {
                    api = this.gradeId > 0 ? this.$api.apply.update_grade : this.$api.apply.issue_save;
                    params = {
                        item_id: this.itemId ? this.itemId : 0, // 爆料可以为 0
                        item_ad_name: this.itemAdName ? this.itemAdName : "",
                        grade_content: this.replaceContent(this.content),
                        grade_score: this.score,
                        grade_intro: this.replaceContent(this.content).substr(0, 200),
                        grade_type: this.isRatings ? 0 : 1, //类型 0:评级 1:爆料
                        grade_imgs: this.imgList, //图片列表
                        grade_anonymity: this.isNickName, //匿名状态 0:实名 1:匿名
                        grade_id: this.gradeId || 0,
                        type: this.isRatings ? 1 : (this.isBroke ? 2 : 4)
                    };
                } else {
                    api = this.$api.apply.itemnoti_update;
                    params = {
                        itemnoti_item_id: this.userInfo.user_located_item_id,
                        itemnoti_content: this.replaceContent(this.content),
                        itemnoti_img: this.imgList
                    };
                }
                this.$ajax.post(api, params).then(res => {
                    if (res.data.status == 1) {
                        this.submitedScore =
                            res.data.mission && res.data.mission[2].hzt;
                        this.successTip(); //发表评级成功
                        this.removeStore(this.cache_key); //清楚草稿缓存
                    } else {
                        this.$dialog.alert({
                            title: "系统消息",
                            content: res.message,
                            btns: ["好"]
                        });
                    }
                    this.submiting = false;
                }).catch(err => {
                    this.submiting = false;
                    if (err.status == -20002) {
                        this.$dialog.alert({
                            title: "系统消息",
                            content: "登录超时",
                            btns: ["好"]
                        }).then(() => {
                            Service.Login();
                        });
                    } else {
                        this.$dialog.alert({
                            title: "系统消息",
                            content: err.message,
                            btns: ["好"]
                        });
                    }
                });
            },
            //内容空格与回车处理函数(连续多个空格缩成1个空格；连续多行精简成1行) replace(/\n|\r\n/g,"<br>")
            replaceContent(content) {
                let regEx = /\n+|\r\n+/g;
                content = content.replace(regEx, "`");
                regEx = /\s+/g;
                content = content.replace(regEx, " ");
                content = content.replace(/\`/g, "\n");
                return content;
            },
            //读取缓存数据
            getStore() {
                let _cache = localStore.get(this.cache_key);
                if (_cache) {
                    this.cacheData = _cache;
                    return true;
                }
                return false;
            },
            setStore() {
                let value = {
                    item_id: this.itemId,
                    item_ad_name: this.itemAdName || this.isReCruits,
                    content: this.content,
                    score: this.score,
                    isRatings: this.isRatings ? 0 : 1,
                    isBroke: this.isBroke,
                    imgList: this.imgList,
                    isNickName: this.isNickName
                };
                localStore.set(this.cache_key, value);
            },
            removeStore() {
                localStore.remove(this.cache_key);
            },
            // 获取项目方绑定的项目简称
            GetDetection() {
                this.$ajax.get(this.$api.apply.itemnoti_check_update).then(res => {
                    if (res.status == 1) {
                        this.isReCruits = res.data.item_urrency_abbreviation;
                    }
                });
            }
        },
        beforeMount() {},
        mounted() {
            // 无法更改app title
            if (!this.isRatings && this.isBroke) {
                document.title = "发爆料";
                if (Global.isApp) Titlebar.title = "发爆料";
            } else if (!this.isRatings && !this.isBroke) {
                document.title = "发布公告";
                if (Global.isApp) Titlebar.title = "发布公告";
                this.GetDetection();
            }
            //如果参数pro/itemid不存在，则跳转至首页页
            if (!this.itemId && this.isRatings) {
                this.$router.push({
                    path: "/home"
                });
            }
            if (this.gradeId > 0) {
                //如果评级ID存在则为修改
                this.$ajax.get(this.$api.apply.get_grade, {
                    grade_id: this.gradeId,
                    grade_type: this.isRatings ? 0 : 1
                }).then(res => {
                    let d = res.data.gradeData;
                    this.content = d.grade_content;
                    this.score = d.grade_score;
                    this.imgList = d.grade_imgs;
                    this.isNickName = d.user_anonymity == 1 ? 1 : 0;
                    this.$refs.uploader.initImglist(this.imgList);
                });
            }
            //获取本地缓存内容
            else if (this.getStore()) {
                setTimeout(() => {
                    //处理页面进入后，此弹框闪退问题
                    this.$dialog.confirm({
                        title: "有未完成的草稿，是否继续编辑?",
                        btns: ["继续编辑", "放弃草稿"]
                    }).then(res => {
                        this.score = this.cacheData.score;
                        this.content = this.cacheData.content;
                        this.isNickName = this.cacheData.isNickName;
                        this.imgList = this.cacheData.imgList;
                        this.hasCache = true;
                        this.$refs.uploader.initImglist(this.imgList);
                        let __title = this.cacheData.isRatings ? this.cacheData.isBroke ? "发爆料" : "发布公告" : "发评级";
                        document.title = __title;
                        if (Global.isApp) Titlebar.title = __title;
                    }).catch(() => {
                        this.removeStore();
                    });
                }, 500);
            }
            //分享配置
            Share.Ready();
        }
    };
</script>
<style src="./style" lang="less">

</style>
