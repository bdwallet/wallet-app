<template>
    <div class="hotlist">
        <div class="h-l-top" :style="{backgroundImage:`url(${$assets.hotlistHeader})`}">
            <div class="h-l-t-rule"><span v-if="nowDate" @click.stop="ShowDialog">奖励规则</span></div>
            <div class="h-l-t-vol">VOL:{{ PickDate.year }}.{{ PickDate.month < 10 ? `0${PickDate.month}` : PickDate.month }}.{{ PickDate.date < 10 ? `0${PickDate.date}` : PickDate.date }}</div>
            <div class="h-l-t-hzt" v-if="nowDate"><span>至多瓜分</span>{{ max_hzt * 2 }}黑钻</div>
        </div>
        <div class="h-l-mid">
            <!-- 吸顶tab -->
            <div class="com-tab">
                <div class="tab-item">
                    <span :class="{'active': currentTab==1}" @click="Current(1)">达人榜</span>
                </div>
                <div class="tab-item">
                    <span :class="{'active': currentTab==0}" @click="Current(0)">新人榜</span>
                </div>
            </div>

            <!-- 榜单 -->
            <div class="h-l-m-list">
                <ul v-if="listdata.length > 0" class="h-l-m-l-main" :style="change">
                    <li class="h-l-m-l-item" v-for="(item, index) in listdata">
                        <div class="item-top">
                            <div class="ranking">
                                <div v-if="index == 0" :style="{backgroundImage:`url(${$assets.hotlistFirst})`}"></div>
                                <div v-else-if="index == 1" :style="{backgroundImage:`url(${$assets.hotlistSecond})`}"></div>
                                <div v-else-if="index == 2" :style="{backgroundImage:`url(${$assets.hotlistThird})`}"></div>
                                <div v-else> {{ index+1 }}</div>
                            </div>
                            <!-- 上榜人物信息 -->
                            <div class="comp-userinfo">
                                <div class="left" @click.stop="$router.push(`/user/homepage/${item.user_id}`)">
                                    <comp-avatar :src="item.grade.user_photo" :level="item.grade.level" :size="size" :itemid="item.grade.user_located_item_id" :border="false" />
                                    <div class="center" :style="{'margin-left':centerMarginLeft}">
                                        <div class="title">
                                            <comp-level :username="item.grade.user_name" :isOffiece="item.grade.level"/>
                                        </div>
                                        <div class="time">
                                            {{$service.Dater(item.grade.grade_create_time)}}
                                        </div>
                                    </div>
                                </div>
                                <div class="right" :class="{'news': currentTab == 0}">
                                    <!-- 黑钻 -->
                                    <div v-if="item.hzt">{{item.hzt}}<span>黑钻</span></div>
                                </div>
                            </div>
                        </div>
                        <div class="item-content" @click.stop="$router.push(`/detail/${item.grade.grade_type}/${item.grade.grade_id}`)">{{ `${item.grade.grade_intro.substring(0, 40)}...`}}</div>
                    </li>
                </ul>
                <comp-empty v-else text="暂无数据！" mainHeight="calc(100vh - 14.175rem)" />
            </div>
        </div>
        <div class="h-l-bot">
            <div class="left" @click.stop="ShowDatePicker">
                <i class="icon icon-qiandao"></i>
                <span>{{ PickDate.year }}-{{ PickDate.month < 10 ? `0${PickDate.month}` : PickDate.month }}-{{ PickDate.date < 10 ? `0${PickDate.date}` : PickDate.date }}</span>
            </div>
            <div class="right" v-if="$global.isApp" @click.stop="SharePicture">
                <i class="icon icon-Shape"></i>
                分享榜单
            </div>
        </div>
    </div>
</template>

<script>
    import compAvatar from '~components/compAvatar';
    import compLevel from '~components/compLevel';
    import compEmpty from '~components/compEmpty';
    import drawCanvas from '~script/drawCanvas';
    export default {
        name: "hotlist",
        components: {
            compAvatar,
            compLevel,
            compEmpty
        },
        data() {
            return {
                //currentTab: 1, // tab激活  1:达人榜  0:新人榜
                centerMarginLeft: '.4rem',
                size: 80,
                max_hzt: "10000",
                tip: '',
                //PickDate: {},
                listdata: [], // 渲染数据列表
                rankdata: [], // 达人榜单数据
                newsdata: [], // 新人榜单数据

                Url: 'https://heizuan.oss-cn-shenzhen.aliyuncs.com/h5images/',
                imageData: { // 生成图片相关数据
                    shareHeader: '', // 头部背景
                    shareHeader1: '', // 头部背景
                    wrapBg: '', // 水印
                    user_super: '', // 超级评审员
                    user_project: '', // 项目 | 黑钻 官方
                    QRCode: '', // 新人榜二维码
                    QRCode1: '', // 达人榜二维码
                    first: '', // 第一
                    second: '', // 第二
                    third: '', // 第三
                    vol: '', // 多少期
                    max_hzt: '', // 至多瓜分多少黑钻
                    datalist: [], // 列表渲染数据
                    isNew: '', // 是否最新一期
                },
                shareRankDataList: [], // 达人榜分享数据，
                shareNewsDataList: [], // 新人榜分享数据
            }
        },
        computed: {
            change () {
                if(this.currentTab==1){
                    return {
                        backgroundImage: `url(${this.$assets.hotlistContentBg})`
                    }
                }else {
                    return {
                        backgroundImage: `url(${this.$assets.hotlistContentBg1})`
                    }
                }
            },
            // 当前tab
            currentTab(){
                return this.$route.query.tab;
            },
            // 当前时间
            currentTime(){
                return this.$route.query.time;
            },
            // 选择日期
            PickDate(){
                if(this.currentTime){
                    let array = this.currentTime.split('-'); // 日期
                    return {
                        year: +array[0],
                        month: this.ExcludZero(array[1]),
                        date: this.ExcludZero(array[2])
                    };
                }else{
                    let D = new Date(new Date().getTime() - 48 * 60 * 60 * 1000);
                    return {
                        year: D.getFullYear(),
                        month: D.getMonth() + 1,
                        date: D.getDate()
                    };
                }
            },
            // 是否是最新一期
            nowDate() {
                let D = new Date(),
                    time = new Date(this.PickDate.year, this.PickDate.month - 1, this.PickDate.date, D.getHours(), D.getMinutes(), D.getSeconds()).getTime();
                if(D.getTime() - time >= 72 * 60 * 60 * 1000){
                    this.imageData.isNew = 0;
                    return 0;
                } else {
                    this.imageData.isNew = 1;
                    return 1;
                }
            },
        },
        methods: {
            // 显示弹窗
            ShowDialog(){
                this.$dialog.pannel({
                    title: "奖励规则",
                    content:  [
                        '定义：评级热榜为替代官方推荐的一种筛选热门评级的方式。我们希望通过社区投票，选出更具共识的优质内容',
                        '一、发布的评级，怎样才能上榜？</br>' +
                        '①内容通过审核</br>' +
                        '②有很多高权重用户给文章点赞，同时收到的踩又比较少【①文章得分：发布24小时内，所获点赞总权重-点踩总权重。②每人每日前5次点赞，才能为文章贡献权重】。',
                        '二、用户权重如何计算？</br>' +
                        '根据用户所持的黑钻积分数，采用函数进行稀释。一方面避免持钻大V权力过于集中；另一方面避免水军购买一批手机号，刷点赞数。',
                        '三、达人榜、新人榜两个分榜有何区别？</br>' +
                        '为了避免大V抱团，特开辟新人榜，给予评级数小于50条的评审员成长、曝光的机会。',
                        '四、奖池问题</br>' +
                        '1、每日总奖池至多600黑钻，其中作者占80%，点赞者分20%。</br>' +
                        '2、作者奖励，如何分配？</br>'+
                        '①、分榜作者每日可分240黑钻奖池。【特殊：若分榜当日评级数小于10条，则作者奖池=当日评级数*24】</br>' +
                        '②、分榜前5名评级，将根据文章得分的比重，瓜分奖池。</br>' +
                        '3、点赞奖励，如何分配？</br>' +
                        '①、分榜点赞者每日可分60黑钻奖池。【特殊：若分榜当日评级数小于10条，则作者奖池=当日评级数*6】</br>' +
                        '②、分榜前5名评级的点赞者，将根据个人的权重，瓜分奖池。',
                        '五、为何看不到点赞数？为何点赞评级没有奖励？</br>' +
                        '1、为了避免大家点赞（投票）时跟票，评级发布后24小时内不显示点赞数。</br>' +
                        '2、点赞24小时内发布的评级，才有奖励哟（小秘密：发布24小时内的评级，发布时间是蓝色的）。',
                        '六、何时出榜单</br>' +
                        '3号发布的评级，4号会统计所收到的点赞、点踩【为保证公平，所有评级均只统计发布24小时内的赞、踩】，5号凌晨4点出榜单。'
                    ]
                })
            },

            // 获取数据
            GetHotlist(date) {
                this.$ajax.get(this.$api.apply.get_hot_grade, {
                    date_ymd: date || this.currentTime || ''
                }).then(res => {
                    if(res.data.status == 1){
                        this.max_hzt = this.imageData.max_hzt = res.data.max_hzt;
                        this.tip = res.data.content;
                        if(res.data.data.status == 1){
                            res.data.data.data.forEach(item => {
                                if(item.type == 1){
                                    if(item.grade_ids && item.grade_ids.length > 0) {
                                        item.grade_ids.forEach(data => {
                                            if(data.grade)
                                                this.rankdata.push(data);
                                        });
                                        // js中array是引用类型，也就是arrA和arrB的原数据存储地址是一样的，arrA和arrB都是对原数据的引用，所以修改其中一个，另一个也会改变。
                                        this.shareRankDataList = JSON.parse(JSON.stringify(this.rankdata));
                                        if(this.currentTab == 0) {
                                            if(Global.isApp && Global.isPro){
                                                this.ShareDate(this.shareRankDataList)
                                            }
                                        } else {
                                            this.listdata = this.rankdata;
                                            if(Global.isApp && Global.isPro){
                                                this.ShareDate(this.shareRankDataList,1)
                                            }
                                        }
                                    }
                                } else if (item.type == 0) {
                                    if(item.grade_ids && item.grade_ids.length > 0) {
                                        item.grade_ids.forEach(data => {
                                            if(data.grade)
                                                this.newsdata.push(data);
                                        });
                                        this.shareNewsDataList = JSON.parse(JSON.stringify(this.newsdata));
                                        if(this.currentTab == 0) {
                                           this.listdata = this.newsdata;
                                            if(Global.isApp && Global.isPro){
                                                this.ShareDate(this.shareNewsDataList,1)
                                            }
                                        } else {
                                            if(Global.isApp && Global.isPro){
                                                this.ShareDate(this.shareNewsDataList)
                                            }
                                        }
                                    }
                                }
                            })
                        }
                    }
                });
            },

            // 切换榜单
            Current(type){
                if(type == 1){
                    this.listdata = this.rankdata;
                    this.imageData.datalist = this.shareRankDataList;
                } else {
                    this.listdata = this.newsdata;
                    this.imageData.datalist = this.shareNewsDataList;
                }
                let D = this.PickDate;
                let time = `${D.year}-${D.month < 10 ? "0" + D.month : D.month}-${D.date < 10 ? "0" + D.date : D.date}`;
                this.$router.replace({
                    path:'/hotlist',
                    query:{
                        tab:type,
                        time
                    }
                });
                setTimeout(() => {
                    this.share();
                },300)

            },

            // 分享数据 type 存在表示初始生成图片是那种类型
            ShareDate(list,type){
                list.forEach(value => {
                    drawCanvas.toBase64Url(`${value.grade.user_photo}?timeStamp=` + new Date(), 80 * drawCanvas.DPR(), 80 * drawCanvas.DPR(), (callBackData) => {
                        value.grade.user_photo = callBackData;
                    });
                    value.grade.grade_intro = `${value.grade.grade_intro.substring(0, 40)}...`;
                });

                if(type){
                    this.imageData.datalist = list
                }
            },

            // 点击显示日历
            ShowDatePicker(){
                this.$dialog.datePicker({
                    currentdate: this.PickDate, // 当前选中时间
                    min_date: { // 设置阈值 --> 日历最小开始日期
                        year: 2019,
                        month: 7,
                        date: 28
                    }
                }).then(res => {
                    // 获取日期
                    let date = `${res.year}-${res.month < 10 ? "0" + res.month : res.month}-${res.date < 10 ? "0" + res.date : res.date}`;
                    this.imageData.vol = `VOL:${res.year}.${res.month < 10 ? "0" + res.month : res.month}.${res.date < 10 ? "0" + res.date : res.date}`;
                    // 更新数据
                    this.listdata = [];
                    this.rankdata = [];
                    this.newsdata = [];
                    this.shareRankDataList = [];
                    this.shareNewsDataList = [];
                    this.imageData.datalist = [];
                    this.GetHotlist(date);
                    this.$router.replace({
                        path:'/hotlist',
                        query:{
                            tab:1,
                            time:date
                        }
                    });
                    setTimeout(() => {
                        this.share(date);
                    },300)
                })
            },

            // 图片转base64
            ToBase64() {
                drawCanvas.toBase64Url(`${this.Url}share-hotlist.png?timeStamp=` + new Date(), 375 * drawCanvas.DPR(), 414 * drawCanvas.DPR(), (callBackData) => {
                    this.imageData.shareHeader = callBackData;
                    drawCanvas.toBase64Url(`${this.Url}share-hotlist-1.png?timeStamp=` + new Date(), 375 * drawCanvas.DPR(), 414 * drawCanvas.DPR(), (callBackData) => {
                        this.imageData.shareHeader1 = callBackData;
                        drawCanvas.toBase64Url(`${this.Url}water-mark.png?timeStamp=` + new Date(), 375 * drawCanvas.DPR(), 774 * drawCanvas.DPR(), (callBackData) => {
                            this.imageData.wrapBg = callBackData;
                            drawCanvas.toBase64Url(`${this.Url}offiece-icon.png?timeStamp=` + new Date(), 24 * drawCanvas.DPR(), 24 * drawCanvas.DPR(), (callBackData) => {
                                this.imageData.user_project = callBackData;
                                drawCanvas.toBase64Url(`${this.Url}assessor-icon.png?timeStamp=` + new Date(), 24 * drawCanvas.DPR(), 24 * drawCanvas.DPR(), (callBackData) => {
                                    this.imageData.user_super = callBackData;
                                    drawCanvas.toBase64Url(`${this.Url}hotlist-first.png?timeStamp=` + new Date(), 56 * drawCanvas.DPR(), 56 * drawCanvas.DPR(), (callBackData) => {
                                        this.imageData.first = callBackData;
                                        drawCanvas.toBase64Url(`${this.Url}hotlist-second.png?timeStamp=` + new Date(), 56 * drawCanvas.DPR(), 56 * drawCanvas.DPR(), (callBackData) => {
                                            this.imageData.second = callBackData;
                                            drawCanvas.toBase64Url(`${this.Url}hotlist-third.png?timeStamp=` + new Date(), 56 * drawCanvas.DPR(), 56 * drawCanvas.DPR(), (callBackData) => {
                                                this.imageData.third = callBackData;
                                                drawCanvas.toBase64Url(`https://heizuan.oss-cn-shenzhen.aliyuncs.com/images/qrcode/bangdan_pro0.png?timeStamp=` + new Date(), 200 * drawCanvas.DPR(), 200 * drawCanvas.DPR(), (callBackData) => {
                                                    this.imageData.QRCode = callBackData;
                                                    drawCanvas.toBase64Url(`https://heizuan.oss-cn-shenzhen.aliyuncs.com/images/qrcode/bangdan_pro1.png?timeStamp=` + new Date(), 200 * drawCanvas.DPR(), 200 * drawCanvas.DPR(), (callBackData) => {
                                                        this.imageData.QRCode1 = callBackData;
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            },

            // 点击分享图片
            SharePicture(){
                if(Global.isApp && Global.isPro){
                    if(this.imageData.datalist.length >0 && this.imageData.QRCode !== ''){
                        this.$dialog.tip("图片生成中···");
                        drawCanvas.creatHotlistCanvas({
                            type: this.currentTab,
                            imageData: this.imageData,
                            footip: '区块链项目听我给你说'
                        }).then(res => {
                            let type = 'png';
                            drawCanvas.saveImage(type, res).then(resolve => {
                                HZApp.Share.Show({ type: 'image', img: resolve });
                            });
                        })
                    }else {
                        this.$dialog.tip("请选择有效榜单分享")
                    }
                }
            },

            // 分享
            share (date) {
                let url = `/hotlist?tab=${this.currentTab}`;
                let D = this.PickDate;
                let time = `${D.year}-${D.month < 10 ? "0" + D.month : D.month}-${D.date < 10 ? "0" + D.date : D.date}`;
                date = date || this.currentTime || time;
                if(date)
                    url += `&time=${date}`;
                Share.Ready({
                    title: `评级热榜--${date}`,
                    desc: '社区投票，热门评级',
                    link: Global.host + url,
                    href: url,
                });
            },

            // 去零 转 数字类型
            ExcludZero(data) {
                if(/^0/.test(data)){
                    return +(data.slice(1))
                }else {
                    return +data
                }
            },

        },
        mounted() {
            this.ToBase64();
            let D = this.PickDate;
            this.imageData.vol = `VOL:${D.year}.${D.month < 10 ? "0" + D.month : D.month}.${D.date < 10 ? "0" + D.date : D.date}`;
            // 获取榜单数据
            this.GetHotlist();
            this.share();
        },
    }
</script>

<style lang="less" src="./style"></style>
