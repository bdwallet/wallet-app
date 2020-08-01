<template>
    <div class="single-plural-check">
        <div class="checkwrap" v-if="!type">
            <div class="item" v-for="(item, index) in checkOptions" :key="index">
                <input type="radio" :id="item" :value="(index + 1) + item" v-model="picked">
                <div class="single"></div>
                <label :for="item">{{ item }}</label>
            </div>
        </div>
        <div class="checkwrap" v-else>
            <div class="item" v-for="(item, index) in checkOptions" :key="index" >
                <input type="checkbox" :id="item" :value="(index + 1) + item" v-model="checkedNames">
                <div class="plural"></div>
                <label :for="item">{{ item }}</label>
            </div>
        </div>
    </div>

</template>

<script>
    /**
     * @desc
     *      <comp-Select type="1" :checkOptions="checkOptions" @change="GetSelect"/>
     *      @param {Number} [type = 0] - props传入的type 用于判断是否是复选框，默认值为0，默认是单选框
     *      @param [Array]  checkOptions - props传入的选择项数据
     *      @method change - 将选择的数据传给父级
     */
    export default {
        name: "select",
        data() {
            return {
                picked: "",
                checkedNames: []
            }
        },
        props: {
            type: {
                type: Number,
                default: 0
            },
            checkOptions: {
                type: Array,
                default: []
            }
        },
        updated() {
            // console.log("in comp => select.vue => updated");
            if (this.type) this.$emit('change',this.checkedNames);
            else this.$emit('change',this.picked)
        },
        mounted() {
            this.picked = "";
            this.checkedNames = []
        },
        activated() {
            this.picked = "";
            this.checkedNames = []
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/css/config";
    .single-plural-check{
        width: 100%;
        height: 100%;
        background: @bgcolor-body;
        .item{
            position: relative;
            display: flex;
            box-sizing: border-box;
            align-items: center;
            height: 2.5rem;
            .single,.plural{
                position: relative;
                width: 1rem;
                height: 1rem;
                margin-right: 1rem;
            }
            &::after {
                content: " "; /*不换行空格*/
                position: absolute;
                left: 0;
                bottom: 0;
                display: inline-block;
                width: 100%;
                height: .05rem;
                background: #BCBCBC;
                transform: scaleY(.5);
                -webkit-transform: scaleY(.5);
                -moz-transform: scaleY(.5);
                -ms-transform: scaleY(.5);
                -o-transform: scaleY(.5);

            }
            /*&:last-child{*/
            /*    &::after{*/
            /*        height: 0;*/
            /*    }*/
            /*}*/
            label{
                position: absolute;
                left: 0;
                top: 0;
                z-index: 2;
                display: flex;
                width: 100%;
                height: 100%;
                font-size: .75rem;
                align-items: center;
                color: #000;
                padding-left: 2rem;
            }

            // 单选
            input[type='radio'], input[type='checkbox']{
                width: 0;
                visibility: hidden;
                opacity: 0;
                margin: 0;
            }
            input[type="radio"] + .single::before, input[type='checkbox']:checked + .plural::before {
                content: " "; /*不换行空格*/
                position: absolute;
                z-index: 2;
                left: 0;
                bottom: .28rem;
                display: inline-block;
                width: .3rem;
                height: .5rem;
                margin-left: .3rem;
                border-right: .1rem solid #BCBCBC;
                border-bottom: .1rem solid #BCBCBC;
                transform: rotate(40deg);
                -webkit-transform: rotate(40deg);
                -moz-transform: rotate(40deg);
                -ms-transform: rotate(40deg);
                -o-transform: rotate(40deg);
            }
            input[type="radio"] + .single::after, input[type='checkbox'] + .plural::after {
                content: " "; /*不换行空格*/
                position: absolute;
                left: 0;
                top: 0;
                display: inline-block;
                width: .94rem;
                height: .94rem;
                border: .05rem #BCBCBC solid;
                border-radius: 50%;
            }
            input[type='radio']:checked + .single::before {
                border-color: #FFF;
            }
            input[type="radio"]:checked + .single::after {
                background: #5682FF;
                border-color: #5682FF;
            }

            // 复选
            input[type='checkbox'] + .plural::after{
                border: .025rem #606060 solid;
                border-radius: 0;
            }
            input[type='checkbox']:checked + .plural::before{
                border-color: #606060;
                bottom: .3rem;
                margin-left: -.2rem;
            }
        }
    }
</style>
