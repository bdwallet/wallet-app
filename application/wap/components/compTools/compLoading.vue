<template>
    <div class="comp-loading">
        <svg class="loading-svg" viewBox="0 0 75 25">
        	<path d="M10,0 H25 L15,25 H0 Z" class="path1" />
        	<path d="M35,0 H50 L40,25 H25 Z" class="path2" />
        	<path d="M60,0 H75 L65,25 H50 Z" class="path3" />
        </svg>
        <div class="line"></div>
        <div class="loading-text">{{DprocessText}}</div>
    </div>
</template>

<script>
    let timeout = 0;
    export default {
        name: 'compLoading',
        props: {
            content: {
                type: String
            },
            process:0,
        },
        data(){
            return {
                DprocessText:'', //进度文本
            }
        },
        methods:{
            Start(){
                if(!this.content){
                    this.DprocessText = '上传中...';
                    let t = 0;
                    timeout = setInterval(() => {
                        if(this.process == 0){
                            this.End();
                            return;
                        }
                        t += Math.ceil(Math.random() * 10);
                        if (t >= 99) {
                            t = 99;
                            clearInterval(timeout);
                        }
                        this.DprocessText = `上传中${t}%`;
                    }, 200);
                }else{
                    this.DprocessText = this.content;
                }
            },
            End(){
                this.DprocessText = "上传中100%";
                clearInterval(timeout);
            }
        },
        mounted(){
            this.Start();
        }
    }
</script>

<style lang="less" scoped>
    .comp-loading {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        background-color: #3a3a3a;
        overflow: hidden;
        .loading-svg {
            width: 1.8rem;
            .path1 {
                fill: #fff;
                animation: loading-path 1s .1s linear infinite;
            }
            .path2 {
                fill: #fff;
                fill-opacity: .23;
                animation: loading-path 1s .2s linear infinite;
            }
            .path3 {
                fill: #fff;
                fill-opacity: .62;
                animation: loading-path 1s .3s linear infinite;
            }
        }
        .loading-text {
            margin-top:.25rem;
            font-size: .7rem;
            color: #fff;
        }
    }
    @keyframes loading-path {
        0% {
            fill-opacity: .9;
        }
        50% {
            fill-opacity: .23;
        }
        100% {
            fill-opacity: .62;
        }
    }
</style>


