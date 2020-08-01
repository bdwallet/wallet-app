<template>
    <div class="circle-progress">
        <div class="circleProgress-wrapper">
            <div class="wrapper right">
                <div
                    class="circleProgress rightcircle"
                    :style="{'transform':`rotate(${angleRight}deg)`}"
                ></div>
            </div>
            <div class="wrapper left">
                <div
                    class="circleProgress leftcircle"
                    :style="{'transform':`rotate(${angleLeft}deg)`}"
                ></div>
            </div>
            <span>{{t}}s</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "circle-progress",
    props: {
        time: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            angleRight: -45, //初始值
            angleLeft: -45, //初始值
            timeout: 0, //计时器
            t: this.time, //倒计时长
        };
    },
    methods: {
        // 倒计时
        record() {
            this.angleRight=-45;
            this.angleLeft=-45;
            this.t = this.time;
            let i = 1;
            let half = this.t / 2;
            let angle = 180 / half;
            this.timeout = setInterval(() => {
                if(this.t > 0){
                    this.t--;
                    if (this.t >= half) {
                        this.angleRight = i++ * angle -45;
                        
                    } else {
                        if(this.time % 2 != 0){
                            this.angleRight = 135;
                        }
                        this.angleLeft = (i++ - half) * angle -45;
                    }
                }else{
                    this.$emit('Next');
                    this.clear();
                }
            }, 1000);
        },
        // 计时器复原
        clear(){
            clearInterval(this.timeout);
        }
    }
};
</script>


<style lang="less">
.circle-progress {
    .circleProgress-wrapper {
        position: relative;
        display: flex;
        width: 3.6rem;
        height: 3.6rem;
        justify-content: center;
        align-items: center;
        font-size: 1rem;
        font-weight: bold;
        color: #fff;
        .wrapper {
            width: 1.8rem;
            height: 3.6rem;
            position: absolute;
            top: 0;
            overflow: hidden;
        }
        .right {
            right: 0;
        }
        .left {
            left: 0;
        }
        .circleProgress {
            width: 3.6rem;
            height: 3.6rem;
            border: .15rem solid transparent;
            border-radius: 50%;
            position: absolute;
            top: 0;
        }
        .rightcircle {
            border-top: .15rem solid #333;
            border-right: .15rem solid #ffb188;
            border-bottom: .15rem solid #ffb188;
            border-left: .15rem solid #333;
            right: 0;
        }
        .leftcircle {
            border-top: .15rem solid #ffb188;
            border-right: .15rem solid #333;
            border-bottom: .15rem solid #333;
            border-left: .15rem solid #ffb188;
            left: 0;
        }
    }
}
</style>
