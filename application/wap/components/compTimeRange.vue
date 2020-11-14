<template>
    <div class="comp-time-range"  :class="{'active': state == 1,'visible': state != 0}" @touchmove="TouchMove" @click.stop="hide">
        <div class="time-range-wrapper" :class="{'actives': state == 1, 'hiddens': state == 2}" @touchmove="TouchMove" @click.stop>
            <div class="time-header">
                <div class="time-h-item" @click.stop>
                    <!--<i class="icon icon-Path3"></i>-->
                </div>
                <div class="time-h-item date">
                    <div class="date-item prev" :class="{'cannel': current == 0}" @click.stop="Prev">
                        <i class="icon icon-shouhui"></i>
                    </div>
                    <div class="date-item">{{ date }}</div>
                    <div class="date-item" :class="{'cannel': current == 1}" @click.stop="Next">
                        <i class="icon icon-shouhui"></i>
                    </div>
                </div>
                <div class="time-h-item right" @click.stop="GoRules">置顶规则</div>
            </div>
            <div class="time-wrapper">
                <div class="time-tip">
                    <div class="time-tip-item">
                        <div class="tip title">已选择</div>
                        <div class="tip">{{ sumHours }}小时</div>
                    </div>
                    <div class="time-tip-item center"></div>
                    <div class="time-tip-item">
                        <div class="tip title">需支付</div>
                        <div class="tip">{{ PickHzt }}黑钻</div>
                    </div>
                </div>
                <div class="time-wrapper-swiper" v-if="pannelDate.length > 0">
                    <comp-swiper class="main-swiper" ref="swiperFreedom" width="50%" @movend="SwiperMovend">
                        <comp-swiper-item v-for="(item, i) in pannelDate" :key="i">
                            <ul class="item-wrap">
                                <li class="item"
                                    ref="item"
                                    v-for="(data,index) in item"
                                    :key="index"
                                    :data-Str="`${i}|${index}`"
                                    :data-i="i"
                                    :data-index="index"
                                    :data-disabled="data.status"
                                    :class="{'disabled': data.status == 0 || data.status == 2}"
                                    @click.stop="Pick(data, index, i)">
                                    <div class="time">{{index}}:00</div>
                                    <div v-if="data.status == 2" class="hzt">已购买</div>
                                    <div v-else class="hzt">{{data.hzt}}黑钻</div>
                                </li>
                            </ul>
                        </comp-swiper-item>
                    </comp-swiper>
                </div>
            </div>
            <div class="time-bottom" :class="{'active': picked.length > 0}" @click.stop="Submits">
                <div class="bto-btn">置顶</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { compSwiper, compSwiperItem } from '~components/compSwiper';
    export default {
        name: "TimeRange",
        components: {
            compSwiper,
            compSwiperItem
        },
        data() {
            return {
                state: 0, //0: hidden, 1: showing, 2: active
                // 时间选择范围 --> 置顶
                date: '',
                picked: [], // 点击数据容器
                sumHours: 0,
                sumHzt: 0,
                pannelDate: [], // 数据容器
                current: 0, // 当前滚动下标
            }
        },
        props: {
            grade_id: {
                type: String,
                default: ''
            },
            type: { // 0 评级 4 公告 5 交易所评级
                type: Number,
                default: 0
            }
        },
        computed: {
            PickDate () {
                let D = new Date();
                if (this.picked[0].i == 1) {
                    D = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
                }
                let Y = D.getFullYear(),
                    M = D.getMonth() + 1,
                    Dt = D.getDate();
                M = M > 9 ? M : `0${M}`;
                Dt = Dt > 9 ? Dt : `0${Dt}`;
                return `${Y}-${M}-${Dt}`;
            },
            PickHzt () {
               return this.sumHzt.toString().split(".")[1] ? (this.sumHzt.toString().split(".")[1].length > 3 ? this.sumHzt.toFixed(3) : this.sumHzt) : this.sumHzt
            }
        },
        methods: {
            /**
             *  置顶时限选择器
             * */
            // 时间切换
            NowDate(type) {
                let D = new Date(),
                    Y = D.getFullYear(),
                    M = D.getMonth() + 1,
                    Dt = D.getDate(),
                    nowDay = '今天';
                M = M > 9 ? M : `0${M}`;
                if(type) {
                    Dt = Dt + 1;
                    nowDay = '明天'
                }
                Dt = Dt > 9 ? Dt : `0${Dt}`;
                this.date = `${nowDay} ${Y}-${M}-${Dt}`
            },

            // 滑动结束回调方法，联动等级swiper
            SwiperMovend(current) {
                this.current = current;
                if(current == 1) this.NowDate(current);
                else this.NowDate()
            },

            // 点击下一个
            Next() {
                this.$refs.swiperFreedom.Next()
            },

            // 点击上一个
            Prev() {
                this.$refs.swiperFreedom.Prev()
            },

            // 点击刷新
            Refresh() {
                this.ClearList();
                this.pannelDate = [];
                this.current = 0;
                this.NowDate();
                this.GetListData()
            },

            // 获取数据
            GetListData() {
                this.$ajax.get(this.$api.apply.get_top,{
                    type: this.type,
                    r_id: this.grade_id
                }).then(res => {
                    if (res.data && res.data.status == 1){
                        let Data = res.data.data;
                        if(Data.today){
                            this.pannelDate.push(Data.today);
                            if(Data.tomorrow){
                                this.pannelDate.push(Data.tomorrow)
                            }
                        }
                    }
                })
            },

            // 提交数据
            Submits() {
                if (this.picked.length == 0) return;
                let params = {
                    start_H: this.picked[0].index,
                    end_H: this.picked[0].index,
                    time_YMD: this.PickDate,
                    r_id: this.grade_id,
                    type: this.type,
                };
                if (this.picked[1]) params.end_H = this.picked[1].index;

                this.$dialog.confirm({
                    title: '确认置顶',
                    content: [
                        `共计选择: ${this.sumHours}小时`,
                        `需支付: ${this.PickHzt}黑钻`
                    ],
                    btns: ['确定','取消']
                }).then(() => {
                    this.$ajax.post(this.$api.apply.add_top, params).then(res => {
                        if (res.data.status == 1) {
                            this.$dialog.alert({
                                title: '置顶成功',
                                content: [
                                    `置顶将从${this.PickDate} ${this.picked[0].index}:00点开始，`,
                                    `到时请在首页点击评级按钮查看。`
                                ],
                                btns: ['知道了']
                            }).then(() => {
                                this.hide();
                            });
                        } else { // 置顶失败
                            this.$dialog.alert(res.message).then(() => {
                                this.Refresh();
                            });
                        }
                    })
                })
            },

            // 选择时间
            Pick(data, index, i){
                let Str = `${i}|${index}`,
                    Array = [], // 选择区域存在禁止选择时 使用
                    DocuEl = this.$refs.item,
                    Obj = { // 记录位置
                        Str,
                        index,
                        i,
                        data
                    };
                // 禁止点击
                if(data.status == 0 || data.status == 2) return;

                // 选择区域存在禁止选择时，选择数据重置为第一个禁止选择前的数据
                if(this.picked.length == 1 && this.picked[0] && this.picked[0].i === i){
                    for (let k = 0; k < DocuEl.length; k++) {
                        for (let n = this.picked[0] && this.picked[0].index+1; n < index; n++) {
                            if(this.picked[0] && this.picked[0].i == DocuEl[k].getAttribute('data-i') && n == DocuEl[k].getAttribute('data-index')){
                                if(DocuEl[k].getAttribute('data-disabled') == 0 || DocuEl[k].getAttribute('data-disabled') == 2){
                                    let N = DocuEl[k].getAttribute('data-i'),
                                        M = DocuEl[k].getAttribute('data-index'),
                                        DEObj = { // 记录位置
                                            Str: `${N}|${M-1}`,
                                            index: M-1,
                                            i: +N,
                                            data
                                        };
                                    // 此处 处理 选择时间范围内第一个禁止点击情况
                                    if(this.picked && this.picked[0].i === DEObj.i && this.picked[0].index === DEObj.index){
                                        DEObj = Obj;
                                        this.ClearList(DocuEl)
                                    }
                                    Array.push(DEObj)
                                }
                            }
                        }
                    }
                }

                // Array 不为空时 加载第一个
                if(Array.length !== 0) Obj = Array[0];

                /**
                 *  三种情况
                 *      1. picked数组两个值不同页
                 *      2. picked数组两个值同页
                 *      3. picked数组一个值，且第二次点击数据id 大于等于 picked 数组值
                 * */
                if(this.picked[0] && this.picked[0].i !== i || this.picked.length === 2 ||
                    this.picked[0] && this.picked[0].index >= index ||
                    this.picked[0] && this.picked[0].index === Obj.index){
                    this.ClearList(DocuEl)
                }

                // 点击获取数据
                this.picked.push(Obj);

                // 处理数据和时间
                let len = 1;
                if (this.picked[1]) len = this.picked[1].index - this.picked[0].index + 1;
                if (len === 1) {
                    this.sumHours = 1;
                    this.sumHzt = this.picked[0].data.hzt;
                } else if(len > 1) {
                    this.sumHours = 0;
                    this.sumHzt = 0;
                    for (let k = this.picked[0].index; k <= this.picked[1].index; k++) {
                        this.sumHours +=1;
                        if (this.picked[0].i == 0){
                            this.sumHzt += this.pannelDate[0][k].hzt
                        } else {
                            this.sumHzt += this.pannelDate[1][k].hzt
                        }
                    }
                }
                this.Active(DocuEl)
            },

            // 清空样式与this.picked 数组
            ClearList (DocuEl) {
                DocuEl = DocuEl || this.$refs.item;
                this.picked = [];
                this.sumHours = 0;
                this.sumHzt = 0;
                if(DocuEl){
                    for (let j = 0; j < DocuEl.length; j++){
                        DocuEl[j].classList.remove("active");
                        DocuEl[j].classList.remove("active-start");
                        DocuEl[j].classList.remove("active-end");
                        DocuEl[j].classList.remove("active-mid")
                    }
                }
            },

            // 样式控制
            Active(DocuEl){
                if(this.picked && this.picked.length>0){
                    for (let i = 0; i < DocuEl.length; i++){
                        for (let k = 0; k < this.picked.length; k++){
                            // 点击样式
                            if(this.picked[k].Str == DocuEl[i].getAttribute('data-Str')) {
                                DocuEl[i].classList.add("active");
                                if(this.picked.length > 1 && this.picked[0].index !== this.picked[1].index) {
                                    if (this.picked[0].Str == DocuEl[i].getAttribute('data-Str'))
                                        DocuEl[i].classList.add("active-start");
                                    else if (this.picked[this.picked.length - 1].Str == DocuEl[i].getAttribute('data-Str'))
                                        DocuEl[i].classList.add("active-end");
                                }
                            }
                            // 两次点击之间的时段数据样式
                            if(this.picked[0].i == this.picked[this.picked.length - 1].i){ // 同一页样式设置
                                for (let j = this.picked[0].index+1; j < this.picked[this.picked.length - 1].index; j++) {
                                    if(this.picked[0].i == DocuEl[i].getAttribute('data-i') && j == DocuEl[i].getAttribute('data-index')){
                                        DocuEl[i].classList.add("active-mid");
                                    }
                                }
                            }
                        }
                    }
                }
            },

            //规则跳转
            GoRules(){
                // this.$router.push('/user/help/main');
                this.$dialog.pannel({
                    title: "置顶规则",
                    content:  [
                        '1、置顶功能是通过支付黑钻使文章置顶到评级页顶端的功能，该功能可使被置顶的文章获得更多展示及点赞机会，合理运用还可获得更多的收益；',
                        '2、确认置顶成功后，系统则从该用户的钱包中扣除相应的黑钻；',
                        '3、置顶的起始时间必须是两天内的整点时间，一次性最多置顶24小时，置顶展示位最多可展示2篇评级；',
                        '4、若出现被踩过多、5分钟内自行删除、被他人成功举报、审核不通过被打回修改等情况，系统都将自动取消该文的置顶服务，且不退还黑钻；',
                        '5、违反社区规则或内容违法违规的文章，系统也会取消该次置顶服务且不退还黑钻，严重者还会追究相应责任；',
                        '6、如有疑问或更多合作请与黑钻官方联系，微信：“jiukou0920”。'
                    ]
                })
            },

            /**
             *  弹窗相关方法
             * */
            show() {
                console.log(this.type)
                this.GetListData();
                this.state = 1;
                this.current = 0;
                this.NowDate();
                return new Promise(resolve => {
                    this.$on('okEvent', () => {
                        this.hide();
                        resolve()
                    });
                });
            },

            hide(type){
                if(type == 1)
                    this.$emit("okEvent");
                else
                    Backdrop.hide();
                setTimeout(() =>{
                    this.ClearList();
                    this.pannelDate = [];
                    this.destroy()
                },0)
            },

            TouchMove(e){
                e && e.preventDefault();
            },

            destroy(){
                this.state = 2;
                setTimeout(() => {
                    this.state = 0;
                }, 300);
            },
        },
        created(){

        },
        mounted() {

        }
    }
</script>

<style lang="less" scoped>
    .comp-time-range {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 8;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.5);
        visibility: hidden;
        opacity: 0;
        -webkit-transition: .3s opacity linear;
        pointer-events:auto;
        transition: .3s opacity linear;
        &.visible{
            visibility: visible;
        }
        &.active {
            opacity: 1;
        }
        .time-range-wrapper{
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 10;
            width: 100vw;
            border-radius: .35rem .35rem 0 0;
            background: white;
            visibility: hidden;
            transition: all .3s;
            transform: translateY(100%);
            &.actives {
                visibility: visible;
                transform: translateY(0);
            }
            &.hiddens {
                visibility: visible;
                background: transparent;
                transform: translateY(100%);
            }
            .time-header {
                display: flex;
                text-align: center;
                justify-content: space-between;
                align-items: center;
                padding: .75rem;
                -webkit-tap-highlight-color: transparent;
                .time-h-item {
                    flex: 1;
                    &.right{
                        flex: 2;
                        font-size: .7rem;
                    }
                }
                .date {
                    flex: 6;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 0 1.8rem 0 2.8rem;
                    .date-item{
                        font-size: .8rem;
                        text-align: center;
                        i.icon{
                            font-size: .6rem !important;
                        }
                        &.prev{
                            i.icon{
                                &:before{
                                    display: inline-block;
                                    transform: rotate(180deg);
                                }
                            }
                        }
                        &.cannel{
                            i.icon{
                                color: #cecece;
                            }
                        }
                    }
                }
            }
            .time-wrapper {
                height: 16.5rem;
                .time-tip{
                    display: flex;
                    justify-content: center;
                    .time-tip-item{
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        .tip{
                            font-size: .8rem;
                            font-weight: bold;
                            color: #333;
                            &.title{
                                font-size: .6rem;
                                font-weight: normal;
                                color: #888;
                            }
                        }
                        &.center{
                            position: relative;
                            width: 3.5rem;
                            height: 2.02rem;
                            margin: 0 1.02rem;
                            &:before{
                                content: '';
                                position: absolute;
                                left: 0;
                                bottom: 50%;
                                width: 100%;
                                background: #979797;
                                height: .05rem;
                                transform: scaleY(.5);
                                -webkit-transform: scaleY(.5);
                                -moz-transform: scaleY(.5);
                                -ms-transform: scaleY(.5);
                                -o-transform: scaleY(.5);
                            }
                        }
                    }
                }
                .time-wrapper-swiper{
                    display: flex;
                    width: 200%;
                    overflow: hidden;
                    .item-wrap{
                        display: flex;
                        justify-content: space-between;
                        flex-wrap: wrap;
                        margin: .5rem 0;
                        .item{
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            width: 3.125rem;
                            height: 3.125rem;
                            margin-top: .2rem;
                            .time{
                                font-size: .8rem;
                                font-weight: bold;
                                color: #333;
                            }
                            .hzt{
                                font-size: .5rem;
                                color: #888;
                            }
                            &.disabled {
                                .time,.hzt{
                                    color: #cecece;
                                }
                            }
                            &.active {
                                background: #5682FF;
                                border-radius: .3rem;
                                .time,.hzt{
                                    color: white;
                                }
                            }
                            &.active-start {
                                background: #5682FF;
                                border-radius: .3rem 0 0 .3rem;
                                .time,.hzt{
                                    color: white;
                                }
                            }
                            &.active-mid{
                                background: rgba(86, 130, 255, 0.8);
                                .time,.hzt{
                                    color: white;
                                }
                            }
                            &.active-end {
                                background: #5682FF;
                                border-radius: 0 .3rem .3rem 0;
                                .time,.hzt{
                                    color: white;
                                }
                            }
                        }
                    }
                }
            }
            .time-bottom {
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 0.5rem .75rem;
                color: white;
                background: #DDDFE3;
                text-align: center;
                &.active{
                    background: #5682FF;
                }
            }
        }
    }
</style>
