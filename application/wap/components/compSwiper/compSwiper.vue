<template>
    <div class="comp-swiper" :style="[{'width': width},height?{'height': height}:'']" @touchstart="touch?touchStart($event):undefined" @touchmove="touch?touchMove($event):undefined" @touchend="touch?touchEnd($event):undefined">
        <div class="swiper" ref="swiper" :style="{
                                  transform: 'translate3d(' + touchMoveX + 'px, 0,0)',
                                  webkitTransform: 'translate3d(' + touchMoveX + 'px, 0,0)'}">
            <slot></slot>
        </div>
        <div v-if="itemCount > 0 && pagination" class="swiper-pagination">
            <div v-for="(son,i) in itemCount" :key="i" class="circle" :class="{'current': cur == i}"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'compSwiper',
        props: {
            width: {
                type: String,
                default: '100%'
            },
            height: '',
            auto: { //自动滑动
                type: Boolean,
                default: false
            },
            touch: { //是否可拖拽
                type: Boolean,
                default: true
            },
            pagination: { //是否显示pagination
                type: Boolean,
                default: false
            },
            current: { //初始展示序号 与start有区别
                type: Number,
                default: 0
            },
            start: { //从start开始滚动，小于start不滚动，用于防止level页面 level 0不滚动
                type: Number,
                default: 0
            },
        },
        data() {
            return {
                container: undefined,
                cur: 0, //当前激活的index所引
                offsetX: 0, //当前左右移动的距离
                offsetY: 0, //当前上下移动的距离
                itemCount: 0, //元素总数
                clientWidth: 0,
                touchStartX: 0, // 触摸起始X坐标
                touchStartY: 0, // 触摸起始Y坐标
                touchMoveX: 0, // 拖拽移动距离
                touchMoveY: [], // 当前各各元素上下移动的距离集合
                interval: 0, // 自动播放timer
                moveState: 0, //标识移动方式是1：左右，2：上下 0：初始
                activateItem: undefined, //当前激活的item
            }
        },
        methods: {
            // Noop
            Noop() {},
            touchStart(e) {
                clearInterval(this.interval); // 清除自动播放
                this.touchStartX = e.changedTouches[0].pageX;
                this.touchStartY = e.changedTouches[0].pageY;
                this.activateItem = this.container.querySelectorAll('.comp-swiper-item')[this.cur].querySelectorAll('.list')[0];
                this.NoTransition();
            },
            touchMove(e) {
                if (e.touches.length > 1 || e.scale && e.scale !== 1) return; // 确保只滑动一次，防止多点连续滑动
                let dist = e.changedTouches[0].pageX - this.touchStartX;
                let drift = e.changedTouches[0].pageY - this.touchStartY;
                if (!this.moveState) this.moveState = Math.abs(dist) > Math.abs(drift) ? 1 : 2; //记录移动方式是左右还是上下
                if (this.activateItem && this.moveState == 2) {
                    this.offsetY = (this.touchMoveY[this.cur] || 0) + drift;
                    this.activateItem.style.webkitTransform = this.activateItem.style.transform = `translate3d(0,${this.offsetY}px,0)`;
                } else {
                    this.touchMoveX = dist - this.offsetX;
                }
                e.preventDefault()
            },
            touchEnd(e) {
                if (this.activateItem && this.moveState == 2) { //上下滑动
                    //let drift = e.changedTouches[0].pageY - this.touchStartY;
                    e.preventDefault();
                    this.ScrollActivate();
                } else { //左右滑动
                    let dist = e.changedTouches[0].pageX - this.touchStartX;
                    if (dist > 30) {
                        this.cur = this.cur <= this.start ? this.start : --this.cur
                        e.preventDefault();
                    } else if (dist < -30) {
                        this.cur = this.cur < this.itemCount - 1 ? ++this.cur : this.cur
                        e.preventDefault();
                    }
                    this.MoveActivate();
                }
                this.moveState = 0; //恢复移动方式初始值0
                this.auto && this.AutoPlay();
            },
            // 左右移动激活时动效
            MoveActivate() {
                this.offsetX = this.cur * this.clientWidth;
                this.touchMoveX = -this.offsetX;
                this.container.style.webkitTransition =
                    this.container.style.transition = '250ms';
                this.$emit('movend', this.cur);
            },
            // 上下移动激活时动效
            ScrollActivate() {
                let range = this.activateItem.clientHeight - this.activateItem.parentNode.clientHeight; //至多移动的距离范围
                let run = 0;
                if (this.offsetY < 0 && range > 0) { //上滑至底 或 元素本身并不需要滚动 则恢复原状态
                    if (-this.offsetY >= range) {
                        run = -range;
                    } else {
                        run = this.offsetY;
                    }
                }
                this.touchMoveY[this.cur] = run; //记录上一次移动距离
                this.activateItem.style.webkitTransition = this.activateItem.style.transition = '250ms';
                this.activateItem.style.webkitTransform = this.activateItem.style.transform = `translate3d(0,${run}px,0)`;
            },
            //去除动效
            NoTransition() {
                this.container.style.webkitTransition =
                this.container.style.transition = 'none';
                if(this.activateItem)
                    this.activateItem.style.webkitTransition =
                    this.activateItem.style.transition = 'none';
            },
            // 下一个
            Next() {
                this.NoTransition()
                this.cur = this.cur < this.itemCount - 1 ? ++this.cur : this.cur
                this.MoveActivate()
            },
            // 上一个
            Prev() {
                this.NoTransition()
                this.cur = this.cur <= this.start ? this.start : --this.cur
                this.MoveActivate()
            },
            // 跳转至index
            Go(index) {
                this.NoTransition()
                this.cur = index
                this.MoveActivate()
            },
            // 自动播放
            AutoPlay() {
                this.interval = setInterval(() => {
                    this.Go(this.cur == (this.itemCount - 1) ? 0 : ++this.cur);
                }, 3000);
            }
        },
        mounted() {
            this.container = this.$refs.swiper;
            // 子元素数量
            this.itemCount = this.container.querySelectorAll('.comp-swiper-item').length;
            // 子元素宽度
            this.clientWidth = this.container.getBoundingClientRect().width || this.container.offsetWidth;
            // 设置父级容器总宽度
            this.container.style.width = this.clientWidth * this.itemCount + 'px';
            this.current && this.Go(this.current); // 初始滑动到设置的位置
            if (this.start) { // 初始定位到设置的位置，默认为0
                this.touchMoveX = -this.start * this.clientWidth;
            }
            this.auto && this.AutoPlay();
        },
    }
</script>

<style lang="less">
    .comp-swiper {
        position: relative;
        z-index: 6;
        .swiper {
            display: flex;
            height: 100%;
        }
        .swiper-pagination {
            position: absolute;
            display: flex;
            width: 100%;
            height: .8rem;
            justify-content: center;
            align-items: center;
            bottom: 0.75rem;
            .circle {
                width: 0.25rem;
                height: 0.25rem;
                border-radius: 50%;
                margin-right: .5rem;
                background: rgba(255, 255, 255, .36);
                transition: all .2s;
                &:last-of-type {
                    margin-right: 0;
                }
                &.current {
                    transform: scale(1.2);
                    background: #EBC192;
                }
            }
        }
    }
</style>
