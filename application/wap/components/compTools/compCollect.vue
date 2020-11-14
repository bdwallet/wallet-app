<template>
    <div class="comp-collect" @click.stop="Play">
        <i class="icon" :class="status==1?'icon-shixing':'icon-kongxing'">
		    <div class="lottie" ref="lottie" :style="{zIndex:anim?1:-1}"></div>
        </i>
    </div>
</template>

<script>
import lottie from 'lottie-web';
export default {
    name:'compCollect',
    props:{
        status:0, //收藏状态 0未 1已
        type:0, //文章类型 0评级、1爆料、2话题 3（资讯，活动，帮助）4（项目公告）
        id:0, //文章编号
    },
    data(){
        return {
            anim: 0, //空制动画层的显示
            //timeout:0, //接口请求延时器，防止恶意刷接口
        };
    },
    methods:{
		Play(){
            if(this.type > 2) { //目前后台仅0评级 1爆料 2话题可收藏
                Dialog.tip("暂时不支持收藏该内容！");
                return;
            }
            Service.CheckLogin().then(() => {
                Service.CheckBind().then(() => {
                    if(this.status){ //已收藏状态
                        this.anim = 0;
                        this.status = 0;
                        this.$refs.lottie.innerHTML = '';
                    }else{ //未收藏状态
                        this.anim = 1;
                        this.status = 1;
                        lottie.loadAnimation({
    	                    container: this.$refs.lottie,
    	                    renderer: 'svg',
    	                    loop: false,
    	                    autoplay: false,
		            	    animationData: require('~json/xing.json'),
		            	    //path:'https://heizuan.oss-cn-shenzhen.aliyuncs.com/script/xing.json', //测试过，存在跨域问题
    	                    rendererSettings: ''
    	                }).play();
                    }
                    this.$emit("collected",1); //抛出点赞结果 为了处理详情页上下点赞按钮状态一致
                    this.Done();
                    // clearTimeout(this.timeout);
                    // this.timeout = setTimeout(() => {
                    //     this.Done();
                    // }, 1000);
                });
            });
        },
        Done(){
            Ajax.post(Api.apply.update_coll,{
                grade_id: this.id
            }).then(res => {
                // if(res.data.status == 1){ //收藏成功
                //     Dialog.tip("收藏成功！");
                // }
                // if(res.data.status == 2){// 取消收藏
                //     Dialog.tip("已取消收藏！");
                // }
                this.$store.commit("changeRefreshCollect", true);
            });
        }
    },
    mounted(){
        
    }
}
</script>

<style lang="less" scoped>
	@import "../../assets/css/config";
    .comp-collect{
        line-height: 1;
        .icon{
            position:relative;
            .lottie{
                position: absolute;
                top:-15%;
                left:-15%;
                right:-15%;
                bottom:-15%;
                z-index: 1;
                background: #FFF;
            }
            &.icon-shixing{
                color: @color-link !important;
            }
        }
    }
</style>