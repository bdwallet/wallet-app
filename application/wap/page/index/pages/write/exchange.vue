<template>
    <div class="write-exchange">
        <div class="write-wrapper">
            <ul class="markers">
                <li class="marker-item marker-title">期待您的打分</li>
                <li class="marker-item" v-for="(item, index) in data" :key="index">
                    <div class="item-left">{{item.name}}</div>
                    <comp-marker class="container item-center" :count="5" :score="item.score" :name="item.name" @score="GetScore"/>
                    <div class="item-right"></div>
                </li>
                <li class="marker-item">
                    <div class="item-left">总体评价</div>
                    <div class="item-center totality">
                        <div class="btn" v-if="assess">{{ assess }}</div>
                    </div>
                    <div class="item-right"></div>
                </li>
            </ul>
            <div class="editor write-e-editor">
                <div class="writer" :class="isShowUploader ? '':'writeEHeight'">
                    <div class="placeholder" v-show="!showPlaceholder">
                        <p>请发表您对该交易所的看法，100起底，不准超过10000字哦。</p>
                        <p class="item">团队实力 （创始团队、投资机构、运营时间）</p>
                        <p class="item">技术安全 （网络安全、系统稳定性、资金安全性、风险控制）</p>
                        <p class="item">交易情况 （上币质量、币种丰富度、交易活跃度、交易量占比）</p>
                        <p class="item">产品使用 （交互体验、功能设计、客服服务、手续费）</p>
                        <p class="item">社区建设 （UVC访问量、媒体关注人数、社区互动质量）</p>
                        <p class="item">运营情况 （交易所合规性、运营透明性、交易所信用）</p>
                        <p class="tip">tips：1、内容发布5分钟后不可删除和修改，请认真撰写；2、请尽量减少对该交易所公共知识的重复叙述；3、有独到见解、独树一帜的风格更佳。</p>
                    </div>
                    <textarea class="textarea" @focus="OnFocus" @blur="OnBlur" v-model="content" @input="SetStore" spellcheck="false"></textarea>
                </div>
                <transition name="tips">
                    <comp-uploader v-show="isShowUploader" class="img-uplaoder" ref="uploader" :max-length="9" @uploaded="Uploaded" />
                </transition>
            </div>
        </div>
        <div class="foot-tool">
            <div class="article-name">
                <div v-if="itemAdName || isReCruits" class="pro-name">{{itemAdName|| isReCruits}}</div>
                <!-- 布局占位符 -->
                <div v-else class="pro-name"></div>
                <div class="content-num">
                    <span :style="{'color':(contentNum>=conMaxlength)?'#ea1d38':''}">{{contentNum}}</span> /{{conMaxlength}}
                </div>
            </div>
            <div class="post-btn">
                <div class="btns">
                    <i class="icon icon-pic" @click="isShowUploader=!isShowUploader"></i>
                </div>
                <div class="submit" :class="{ok}" @click.stop="Submit">发布</div>
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
        name: "write-exchange",
        components: {
            compMarker,
            compUploader,
            compAnonymous
        },
        data() {
            return {
                cache_key: Global.localStores.exch,
                content: "", //项目评级内容
                submiting: false, //发布接口请求状态
                submitedScore: 100, //发布成功后获取的积分数,
                isShowUploader: false, //是否显示图片上传列表
                imgList: [], //上传的图片
                hasCache: false, //标识是否存在缓存数据
                cacheData: {}, //缓存数据容器
                imgUploadStatus: true, //图片上传状态，上传中不可提价 true 上传完成可提交
                isReCruits: "", // 项目方绑定项目简称

                score: [], // 分数
                btns: ["优质", "不错", "一般", "较差"], // 评价
                data: [
                    {name: '团队实力'},
                    {name: '技术安全'},
                    {name: '交易活跃度'},
                    {name: '产品使用'},
                    {name: '社区建设'},
                    {name: '运营情况'},
                ],
                dataScore: {}
            }
        },
        computed: {
            // 获取整体评价
            assess () {
                let starCount = 0;
                if(this.score.length < 6) return '';
                if(this.score.length === 6) {
                    for (let i = 0; i < this.score.length; i++) {
                        starCount += +this.score[i].score
                    }
                }
                if (starCount>= 24) return '优质';
                else if (starCount>= 18 && starCount <= 23) return '不错';
                else if (starCount>= 11 && starCount <= 17) return '一般';
                else if (starCount>= 1 && starCount <= 10) return '较差';
            },

            //当前输入文字字数
            contentNum() {
                let n = this.ReplaceContent(this.content).gblen();
                return Math.ceil(n / 2);
            },
            //是否达到发布要求 字数100以上并打分
            ok() {
                return (
                    this.contentNum >= this.conMinlength &&
                    this.contentNum <= this.conMaxlength && this.score.length===6
                );
            },
            userInfo() {
                return this.$store.getters.userInfo;
            },
            //控制是否显示 placeholder
            showPlaceholder() {
                return this.content;
            },
            //项目英文简写
            itemAdName() {
                return this.hasCache ? this.cacheData.item_ad_name : this.$route.query.pro;
            },
            //项目编号
            itemId() {
                return this.hasCache ? this.cacheData.item_id : this.$route.params.itemid;
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
                return 100;
            }
        },

        methods: {
            // 获取子组件 传来的 分数
            GetScore(val) {
                this.data.forEach(item => {
                    if(item.name == val.name) item.score = val.score;
                    if(val.name == '技术安全') this.dataScore.skill_score = val.score;
                    if(val.name == '交易活跃度') this.dataScore.deal_score = val.score;
                    if(val.name == '团队实力') this.dataScore.team_score = val.score;
                    if(val.name == '产品使用') this.dataScore.product_score = val.score;
                    if(val.name == '运营情况') this.dataScore.run_score = val.score;
                    if(val.name == '社区建设') this.dataScore.bbs_score = val.score;
                });
                // 用于控制总评是否显示
                if(this.score.length > 0) {
                    this.score = this.score.filter(obj => {
                        return  obj.name !== val.name
                    });
                    this.score.push(val)
                }else {
                    this.score.push(val)
                }
                this.SetStore()
            },

            OnFocus(e) {
                this.isShowUploader = false;
            },
            OnBlur(e) {
                if (!this.imgList.length) return false;
                this.isShowUploader = true;
            },
            //发布成功后提示已加黑钻
            SuccessTip() {
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
            },
            //图片上传后回调
            Uploaded(imglist, ischange, uploadStatus) {
                this.imgUploadStatus = uploadStatus;
                if (!this.imgUploadStatus) return false;
                this.imgList = imglist;
                this.SetStore();
            },
            //提交数据
            Submit() {
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
                let params = {
                    bourse_id: this.itemId,
                    content: this.ReplaceContent(this.content),
                    intro: this.ReplaceContent(this.content).substr(0, 200),
                    imgs: this.imgList,
                    team_score: this.dataScore.team_score,
                    skill_score: this.dataScore.skill_score,
                    deal_score: this.dataScore.deal_score,
                    product_score: this.dataScore.product_score,
                    run_score: this.dataScore.run_score,
                    bbs_score: this.dataScore.bbs_score,
                    type: 5
                };
                if(this.gradeId > 0) {
                    params.grade_id = this.gradeId
                }
                api = this.gradeId > 0 ? this.$api.apply.bourse_up_grade : this.$api.apply.issue_save;
                this.$ajax.post(api, params).then(res => {
                    if (res.data.status == 1) {
                        this.submitedScore = res.data.mission && res.data.mission[2].hzt;
                        this.SuccessTip(); //发表评级成功
                        this.RemoveStore(this.cache_key); //清楚草稿缓存
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
            ReplaceContent(content) {
                let regEx = /\n+|\r\n+/g;
                content = content.replace(regEx, "`");
                regEx = /\s+/g;
                content = content.replace(regEx, " ");
                content = content.replace(/\`/g, "\n");
                return content;
            },
            //读取缓存数据
            GetStore() {
                let _cache = localStore.get(this.cache_key);
                if (_cache) {
                    this.cacheData = _cache;
                    return true;
                }
                return false;
            },
            // 设置缓存数据
            SetStore() {
                let value = {
                    item_id: this.itemId,
                    item_ad_name: this.itemAdName || this.isReCruits,
                    content: this.content,
                    data: this.data,
                    score: this.score,
                    imgList: this.imgList,
                    dataScore: this.dataScore,
                };
                localStore.set(this.cache_key, value);
            },
            // 删除数据
            RemoveStore() {
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
            // 如果参数pro/itemid不存在，则跳转至首页页
            if (!this.itemId) {
                this.$router.push({
                    path: "/home"
                });
            }

            // @TODO 接口 还需处理
            if (this.gradeId > 0) {
                //如果评级ID存在则为修改
                this.$ajax.get(this.$api.apply.get_grade, {
                    grade_id: this.gradeId,
                    grade_type: 5  // 交易所评级
                }).then(res => {
                    let d = res.data.gradeData;
                    this.content = d.grade_content;
                    this.dataScore = {
                        skill_score: d.skill_score,
                        deal_score: d.deal_score,
                        team_score: d.team_score,
                        product_score: d.product_score,
                        run_score: d.run_score,
                        bbs_score: d.bbs_score,
                    };
                    this.score = this.data = [
                        {name: '技术安全', score: d.skill_score},
                        {name: '交易活跃度', score: d.deal_score},
                        {name: '团队实力', score: d.team_score},
                        {name: '产品使用', score: d.product_score},
                        {name: '运营情况', score: d.run_score},
                        {name: '社区建设', score: d.bbs_score}
                    ];
                    this.imgList = d.grade_imgs;
                    this.$refs.uploader.initImglist(this.imgList);
                });
            } else if (this.GetStore()) {  //获取本地缓存内容
                setTimeout(() => {
                    //处理页面进入后，此弹框闪退问题
                    this.$dialog.confirm({
                        title: "有未完成的草稿，是否继续编辑?",
                        btns: ["继续编辑", "放弃草稿"]
                    }).then(res => {
                        this.data = this.cacheData.data;
                        this.score = this.cacheData.score;
                        this.content = this.cacheData.content;
                        this.imgList = this.cacheData.imgList;
                        this.dataScore = this.cacheData.dataScore;
                        this.hasCache = true;
                        this.$refs.uploader.initImglist(this.imgList);
                        let __title = "发交易所评级";
                        document.title = __title;
                        if (Global.isApp) Titlebar.title = __title;
                    }).catch(() => {
                        this.RemoveStore();
                    });
                }, 500);
            }
            // 分享配置
            Share.Ready();
        }
    }
</script>

<style lang="less">
    .write-exchange{
        background: white;
        .markers{
            padding: .5rem .75rem;
            border-bottom: .025rem solid rgba(214, 214, 219, 1);
            .marker-item{
                display: flex;
                height: 1.85rem;
                align-items: center;
                font-family: PingFangSC-Medium PingFangSC;
                .item-left{
                    flex: 2;
                    color: rgba(51, 51, 51, 1);
                    font-size: .75rem;
                }
                .item-center{
                    flex: 5;
                    display: flex;
                    justify-content: space-around;
                    padding: 0;
                    .btn{
                        font-size: .75rem;
                        padding: 0 .35rem;
                        color: rgba(255, 181, 112, 1);
                    }
                }
                .item-right{
                    flex: 1;
                }
                .totality{
                    justify-content: flex-start;
                    padding-left: .5rem;
                }

            }
        }
        .editor{
            .writer{
                .placeholder{
                    p{
                        margin-bottom: 0;
                        font-size: .6rem;
                    }
                }
            }
        }
    }
</style>

