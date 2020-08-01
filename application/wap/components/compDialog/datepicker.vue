<template>
    <div class="comp-dialog" :class="{'actives': state == 1, 'hiddens': state == 2}" @touchmove.prevent="TouchMove">
        <div class="dialog comp-datepicker datepicker">
            <div class="datepicker-wrap">
                <div class="datepicker-header">
                    <div @click.stop="switchMonth(-1)" class="datepicker-header-btn datepicker-header-btn-pre">
                        <i class="icon icon-shouhui"></i>
                    </div>
                    <div class="datepicker-header-btn datepicker-header-btn-day">
                        {{select.year}}-{{select.month > 9 ? select.month : `0${select.month}`}}
                    </div>
                    <div @click.stop="switchMonth(1)" class="datepicker-header-btn datepicker-header-btn-next">
                        <i class="icon icon-shouhui"></i>
                    </div>
                </div>
                <div class="datepicker-content">
                    <ul class="title">
                        <li>日</li>
                        <li>一</li>
                        <li>二</li>
                        <li>三</li>
                        <li>四</li>
                        <li>五</li>
                        <li>六</li>
                    </ul>
                    <ul class="weeks" v-for="week of list">
                        <li v-for="weekday of week" @click.stop="pick(weekday)"
                            :class="{
                                'flag': weekday.flag || disabledDate(weekday.text),
                                'active': !weekday.flag && weekday.text == current.date
                                     && select.month == current.month && select.year == current.year}">
                            {{weekday.text}}
                        </li>
                    </ul>
                </div>
                <!--点击确定|禁止|取消等按钮-->
                <div class="datepicker-bottom">
                    <div class="cancel" @click.stop="hide">取消</div>
                    <div class="sure" @click.stop="hide(1)">确定</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "datepicker",
        data() {
            return {
                state: 0, //0: hidden, 1: showing, 2: active
                current: '',    // 已选择的日期时间。yyyy-MM-dd
                select: {       // 已选择的日期对象
                    year: '', // 年
                    month: '', // 月
                    date: '', // 日
                    day: '' // 周几
                },
                currentMonthFirstDay: null, // 当前月的1号属于星期几
                currentMonthEndDate: null,  // 当前月的最后一天是几号
                currentMonthEndDay: null,   // 当前月的最后一天属于星期几
                lastMonthEndDate: null,     // 上个月的最后一天是几号
                list: [],   // 日历的二维数组
            }
        },
        props: {
            moment: {
                type: Number,
                default() { // 选定的初始值
                    return new Date().getTime() - 48 * 60 * 60 * 1000;
                }
            },
            min_date: { //设置阈值
                type: Object,
                default() {
                    return {
                        year: 2019,
                        month: 7,
                        date: 13
                    }
                }
            },
            currentdate: { //设置选择数据
                type: Object,
                default() {
                    return {}
                }
            },
        },
        watch: {
            select: {
                handler(newVal) {
                    let pre;
                    if (newVal.month == 1) {
                        pre = new Date(newVal.year - 1, 12, 0)
                    } else {
                        pre = new Date(newVal.year, newVal.month - 1, 0)
                    }
                    this.lastMonthEndDate = pre.getDate();
                    // 获取日历排表
                    this.getDateList()
                },
                deep: true
            }
        },
        created() {

        },
        filters: {
            // 日期格式过滤器
            dateFormat(val) {
                if (!val) {
                    return ''
                }
                return `${val.year}-${val.month}-${val.date}`.replace(/\d+/g, (a) => {
                    return (a.length === 4) ? a : ((a.length === 2) ? a : ('0' + a))
                })
            }
        },
        methods: {
            show(options) {
                if(options && options.min_date)
                    this.min_date = options.min_date; // 外部传入阈值
                if(options && options.currentdate){
                    this.currentdate = options.currentdate; // 外部传入选择的日期
                    let D = new Date();
                    this.moment = new Date(this.currentdate.year, this.currentdate.month - 1, this.currentdate.date, D.getHours(), D.getMinutes(), D.getSeconds()).getTime() ;
                }
                this.transform(this.moment);
                this.complete();

                Backdrop.show(() => {
                    this.hide();
                    this.destroy();
                });
                setTimeout(() => {
                    this.state = 1;
                }, 0);
                return new Promise(resolve => {
                    this.$on('okEvent', () => {
                        this.hide();
                        resolve(this.current)
                    });
                });
            },

            hide(type){
                if(type == 1)
                    this.$emit("okEvent");
                else
                    Backdrop.hide();
                setTimeout(() => {
                    this.$destroy()
                }, 300)
            },

            TouchMove(e){
                e && e.preventDefault();
            },

            getState(){
                return {
                    state: this.state,
                }
            },

            destroy(){
                this.state = 2;
                setTimeout(() => {
                    this.state = 0;
                    this.$destroy();
                }, 300);
            },
            /**
             * 将时间转化为具体的 年、月、日、星期
             **/
            transform(time) {
                const date = new Date(time);
                this.select.year = date.getFullYear();
                this.select.month = date.getMonth() + 1;
                this.select.date = date.getDate();
                this.select.day = date.getDay();
                this.currentMonthFirstDay =
                    new Date(this.select.year, this.select.month - 1, 1, 0).getDay();
                this.currentMonthEndDate =
                    new Date(this.select.year, this.select.month, 0).getDate();
                this.currentMonthEndDay =
                    new Date(this.select.year, this.select.month, 0).getDay()
            },
            /*
            * 计算出日历列表，二维数组
            * 第一层为星期，第二层为每星期的第几天
            */
            getDateList() {
                this.list = [];
                // 获取日历第一行的数据（需加上第一个星期中所包含上个月的几天）
                let temp = this.lastMonthEndDate - (this.currentMonthFirstDay - 1);
                let list = this.numberList(temp, this.lastMonthEndDate, true).concat(this.numberList(1, 7 - this.currentMonthFirstDay));
                this.list.push(list);
                temp = (7 - this.currentMonthFirstDay) + 1;

                /*
                * 剩下的行数
                */
                // 计算除了第一行剩下的天数
                const leftDays = this.currentMonthEndDate - (7 - this.currentMonthFirstDay);
                // 剩下的星期数
                const lineNumber = Math.ceil(leftDays / 7);
                // 包含下个月日历的天数
                const nextDays = 7 - (leftDays % 7);
                for (let i = 0; i < lineNumber; i++) {
                    if (i === lineNumber - 1 && nextDays > 0 && nextDays !== 7) {
                        this.list[lineNumber] = this.numberList(temp, this.currentMonthEndDate).concat(this.numberList(1, nextDays, true))
                    } else {
                        this.list.push(this.numberList(temp, temp + 6))
                    }
                    temp = temp + 7
                }
            },
            /*
            * 获得日历数组
            * start: 开始日
            * end: 结束日
            * flag： boolean值，判断是否属于本月
            */
            numberList(start, end, flag) {
                let list = [];
                for (let i = start; i <= end; i++) {
                    list.push({
                        text: i,
                        flag: !!flag
                    })
                }
                return list
            },
            /*
            * 切换月份， -1为当前月份-1，+1为当前月份+1
            */
            switchMonth(n) {
                let year = this.select.year;
                if (n===-1) {
                    const pre = this.select.month === 1 ? 12 : this.select.month - 1;
                    if (pre === 12) {
                        this.transform(new Date(year - 1, pre - 1, 1))
                    } else {
                        this.transform(new Date(year, pre - 1, 1))
                    }
                } else {
                    const next = this.select.month === 12 ? 1 : this.select.month + 1;
                    if (next === 1) {
                        this.transform(new Date(year + 1, next - 1, 1))
                    } else {
                        this.transform(new Date(year, next - 1, 1))
                    }
                }
            },

            // 判断日期
            disabledDate(time,type) {
                let min_date = new Date(this.min_date.year, this.min_date.month, this.min_date.date); // 月份需要减一
                if(type) { // 判断日期是否小于设置阈值日期 或 大于当前日期
                    let date = new Date(time);
                    if (date.getTime() < min_date.getTime() || date.getTime() >= (new Date().getTime() - 48 * 60 * 60 * 1000)){
                        return true
                    }
                } else { // 控制样式
                    if (this.select.year > new Date().getFullYear() || this.select.year < min_date.getFullYear()) {
                        return true
                    }
                    if(new Date().getFullYear() === min_date.getFullYear()){
                        if (this.select.month > (new Date().getMonth() + 1) || this.select.month < (min_date.getMonth() + 1)) {
                            return true
                        } else if (new Date().getMonth() === min_date.getMonth()){ // 当前月份与最小月份相同
                            if (time < min_date.getDate()){
                                return true
                            }else if (time > new Date(new Date().getTime() - 48 * 60 * 60 * 1000).getDate()){
                                return true
                            }
                        } else if (new Date().getMonth() !== min_date.getMonth()){
                            if (this.select.month === (new Date().getMonth() + 1)) {
                                if (time > new Date(new Date().getTime() - 48 * 60 * 60 * 1000).getDate()){
                                    return true
                                }
                            } else if (this.select.month === (min_date.getMonth() + 1)) {
                                if (time < min_date.getDate()){
                                    return true
                                }
                            }
                        }
                    } else {
                        if (this.select.year === new Date().getFullYear()) { // 大于当前时间的点击样式显示判断
                            if (this.select.month > (new Date().getMonth() + 1)) {
                                return true
                            } else if (this.select.month === (new Date().getMonth() + 1)) {
                                if (time > new Date(new Date().getTime() - 48 * 60 * 60 * 1000).getDate()){
                                    return true
                                }
                            }
                        } else if( this.select.year === min_date.getFullYear()) { // 小于设置的阈值时间的点击样式显示判断
                            if (this.select.month < (min_date.getMonth() + 1)) {
                                return true
                            } else if (this.select.month === (min_date.getMonth() + 1)) {
                                if ( time < min_date.getDate()){
                                    return true
                                }
                            }
                        }
                    }
                }

            },

            // 选择日期
            pick(day) {
                let time = null;
                if (!!day.flag) {
                    // 当页日历上可能还会显示部分上个月或者下个月的部分天数，根据标识来做判断
                    // 并对月份作出相应的处理
                    if (parseInt(day.text) > 15) {
                        time = new Date(this.select.year, this.select.month - 2, parseInt(day.text))
                    } else {
                        time = new Date(this.select.year, this.select.month, parseInt(day.text))
                    }
                } else {
                    time = new Date(this.select.year, this.select.month - 1, parseInt(day.text))
                }
                this.transform(time);
                this.complete()
            },

            // 更改选中时间并向父组件派发事件
            complete() {
                // 触发父组件的传过来的picked事件。三个参数: 年，月，日
                // this.$emit('picked', this.select.year, this.select.month, this.select.date);
                // 禁止点击当前日期之后的时间
                let date = new Date(this.select.year, this.select.month-1, this.select.date);
                if(this.disabledDate(date,1)) return;
                this.current = {
                    year: this.select.year,
                    month: this.select.month,
                    date: this.select.date,
                };
            }

        },
        destroyed() {
            let parent = this.$el.parentNode;
            parent.removeChild(this.$el);
        },
    }
</script>

<style lang="less" scoped>
    .comp-dialog{
        top: inherit;
        bottom: 0 !important;
        transform: translate(-50%, 100%);
        &.actives{
            visibility: visible;
            transform: translate(-50%, 0);
        }
        &.hiddens{
            visibility: visible;
            background: transparent;
            transform: translate(-50%, 100%);
        }
        .datepicker {
            width: 100vw;
            border-radius: .35rem .35rem 0 0;
            .datepicker-wrap {
                z-index: 9;
                .datepicker-header {
                    display: flex;
                    text-align: center;
                    .datepicker-header-btn {
                        padding: .75rem;
                        cursor: pointer;
                        &:hover {
                            color: #008afe;
                        }
                    }
                    .datepicker-header-btn-pre, .datepicker-header-btn-next {
                        flex: 1;
                    }
                    .datepicker-header-btn-pre{
                        .icon-shouhui:before{
                            display: inline-block; // i现在是字体图形，而不是一张图，你可以把现在i 看成一个文字 ，你给文字加旋转样式肯定是没有效果的，
                            transform: rotate(180deg);
                        }
                    }
                    .datepicker-header-btn-day {
                        flex: 8;
                    }
                }
                .datepicker-content {
                    display: flex;
                    flex-direction: column;
                    height: 14.35rem;
                    overflow: hidden;
                    ul{
                        display: flex;
                        justify-content: space-between;
                        li{
                            flex: 1;
                            justify-content: center;
                            align-items: center;
                            padding: .5rem 0;
                        }
                    }
                    ul.title{
                        li{
                            background: #eee;
                        }
                    }
                    ul.weeks{
                        li{
                            &.active, &.active:hover {
                                color: #fff;
                                background: #008afe;
                            }
                            &.flag {
                                color: #999;
                            }
                        }
                    }
                }
                .datepicker-bottom {
                    display: flex;
                    justify-content: flex-end;
                    &>div{
                        padding: .75rem 0;
                        margin: 0 .75rem;
                    }
                }
            }
        }
    }
</style>
