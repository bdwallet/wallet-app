<template>
    <div class="layout-progress">
        <div class="progress-wrap">
            <div class="progress" v-for="(item, index) in option.length" :key="index">
                <div class="node" :class="[(index == 0 || index<=step) ? (index==option.length-1 && status==0? 'big warning' : 'big'):'']"></div>
                <div class="bar-box">
                    <div class="bar"></div>
                    <div class="bar" :class="[index < step ? 'rt':'']"></div>
                </div>
            </div>
        </div>
        <div class="progress-tip-wrap">
            <div :class="[(index == 0 || index <=step) ? (index==option.length-1 && status==0? 'warning' : 'colors'):'']" v-for="(item, index) in option" :key="index">
                {{ index==option.length-1 && status==0? item.failText : item.okText }}
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * @desc
     *  调用方法：
     *
     * <layout-progress :option="[{
                    okText:'提交认证',
                    failText:''
                },{
                    okText:'正在审核',
                    failText:''
                },{
                    okText:'认证成功',
                    failText:'认证失败'
                }]" :step='step' :status="status"></layout-progress>
     * */
    export default {
        name: 'layoutProgress',
        props: {
            step: {
                // 执行步骤
                type: Number,
                default: 0
            },
            status: {
                // 结果是否通过
                type: Boolean,
                default: 0   // 0:未通过  1：通过
            },
            option:{
                type:Array,
                default:[{
                    okText:'okText',
                    failText:'failText'
                }]
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/css/config";
    .layout-progress{
        height: auto;
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        background: #46476B;
        overflow: hidden;
        .progress-wrap{
            height: 2.15rem;
            width: 100%;
            display: flex;
            justify-content: center;
            background: transparent;
            padding: 0 .75rem .4rem;
            margin-top: 1rem;
            overflow: hidden;
            .progress{
                display: flex;
                width: 100%;
                height: auto;
                justify-content: flex-end;
                align-items: flex-start;
                flex-direction: column;
                padding-bottom: .3rem;
                transform: translateX(.3rem);
                .node{
                    width: .6rem;
                    height: .6rem;
                    z-index: 1;
                    border-radius: 50%;
                    background: @color-link;
                    border:.1rem solid #3D3E62;
                    transform: translate(-.3rem, .45rem);
                    .icon{
                        display: none;
                    }
                    &.mid{
                        width: .65rem;
                        height:.65rem;
                        border:.1rem solid #fff;
                    }
                    &.big{
                        position: relative;
                        width: .6rem;
                        height: .6rem;
                        border:none;
                        .icon{
                            position: absolute;
                            top: .1rem;
                            left:0;
                            right:0;
                            bottom:0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            line-height: 1;
                            font-size:.5rem;
                        }
                        &::after{
                            display: block;
                            width: .6rem;
                            height: .6rem;
                            content: '';
                            border-radius: 50%;
                            border:.3rem solid rgba(255,255,255,.06);
                            transform: translate(-.3rem,-.3rem);
                        }
                    }
                    &.warning{
                        background-color: #FF7270;
                    }
                }
                .bar-box{
                    position: relative;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    width: 100%;
                    height: .3rem;
                    background: @color-sub;
                    border-radius:.1rem;
                    border-top:.02rem solid #111;
                    border-bottom:.02rem solid #333;
                    .bar{
                        position: absolute;
                        //top:.1rem;
                        width:auto;
                        height: .2rem;
                        background: @color-link;
                        //border-radius:.1rem;
                        box-shadow: 0 0 .3rem .03rem rgba(0,198,255,0.4);
                        &.rt{
                            left:0;
                            right:0;
                        }
                    }
                    
                }
                &:last-child{
                    width: .6rem;
                    .bar-box{
                        width: 0;
                    }
                }
            }
        }
        .progress-tip-wrap{
            width: 100%;
            display: flex;
            line-height: .75rem;
            background: transparent;
            font-size: .6rem;
            justify-content: space-between;
            padding-top: .3rem;
            color:#BCBCBC;
            overflow: hidden;
            .colors{
                color: white;
            }
            .warning{
                color: #FF7270;
            }
        }
    }
</style>

