<template>
    <div class="comp-marquee">
        <div class="marquee-wrap" ref="marWrap">
            <ul class="marquee-content" ref="marCon" :style="{'transform': `translateY(${translateY}px)`, 'height': `${height}px`}">
                <li class="marquee-list" 
                    v-for="m in marqueeData" 
                    :key="m" 
                    @click="$router.push(`/user/homepage/${m.user_id}`)">{{m.intro.substr(0,75)}}<span v-if="m.intro.length > 75">...</span></li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'comp-marquee',
        props: {
            marqueeData: { //滚动数据
				type: Array,
				default: []
            }
        },
        data() {
            return {
                translateY: 0,
                height: '', // 所有公告的高度
                setInt: '',
                cur: 0, //激活的index
            }
        },
        methods: {
            setMarquee() {
                this.$nextTick(() => {
                    let con = this.$refs.marCon;
                    let len = con.children.length; // 子元素数量
                    let cHeight = window.getComputedStyle(con.children[0]).height;  // 子元素高度
                    cHeight = Number(cHeight.match(/\d{2,}/));
                    this.height = len * cHeight;
                    this.setInt = setInterval(() => {
                        if(this.cur >= len-1) this.cur = 0;
                        else this.cur++;
                        this.translateY = -this.cur * cHeight;
                        // console.log(this.translateY)
                    }, 2000);
                })
            }
        },
        mounted() {
            this.cur = 0;
            this.translateY = 0;
            this.setMarquee();
        },
        activated() {
            this.setMarquee();
        },
        deactivated() {
            clearInterval(this.setInt);
        }
    }
</script>

<style lang="less" scoped>
    @import '../assets/css/config.less';
    .comp-marquee {
		padding: .75rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
        .marquee-wrap {
            height: 2rem;
            overflow: hidden;
            .marquee-content {
                font-size: .7rem;
                font-weight: 400;
                color: @color-sub;
                line-height: 1.4;
                transition: all .5s linear;
                .marquee-list {
                    height: 2rem;
                    width: 100%;
                    line-height: 1rem;
                    white-space: normal;
                    word-wrap: break-word;
                    text-align: justify;
                    overflow: hidden;
                }
            }
        }
		
	}
</style>

