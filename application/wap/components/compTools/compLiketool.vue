<template>
    <div class="comp-liketool" @click.stop="Done">
        <i class="icon" :class="iconClass">
		    <div class="lottie" ref="lottie" :style="{zIndex:anim?1:-1}"></div>
        </i>
        <span class="number">{{formart}}</span>
    </div>
</template>

<script>
import lottie from 'lottie-web';
export default {
    name:'compLiketool',
    props:{
        comptype:{//类型 1：点赞 -1：点踩
            default:1
        }, 
        number:0, //点赞、踩数
        status:0, //点赞、踩状态 0未赞、踩 1已赞 -1已踩
        type:0, //文章类型 0评级、1爆料、2话题 3（资讯，活动，帮助）4（项目公告）
        id:0, //文章编号
        commentid:0, //评论编号 点赞回复时用
    },
    data(){
        return {
			anim: 0, //空制动画层的显示
        };
    },
    computed:{
        //图标类名
        iconClass(){
            if(this.comptype == 1){ //点赞 icon-ding icon-ding2
                return this.status > 0 ? 'ding icon-ding2' : 'ding icon-ding';
            } else { //点踩 icon-cai icon-cai2
                return this.status == -1?'cai icon-cai2':'cai icon-cai';
            }
        },
        //动效josn文件
        json(){
            if(this.comptype == 1){ //点赞 icon-ding icon-ding2
                return require('~json/like.json');
            } else { //点踩 icon-cai icon-cai2
                return require('~json/lose.json');
            }
        },
		//处理点赞数显示，大于9999显示为9999+
        formart(){
            if (this.number > 0) {
				return this.number > 9999 ? "9999+" : this.number;
            } else
                return this.comptype==1?'赞':'踩';
        }
    },
    methods:{
        //实名认证弹窗
        ShowDialog(){
            this.$dialog.confirm({
                    title: "请先进行实名认证",
                    btns: ["去认证", "好的"]
                }).then(() => {
                    this.$router.push("/user/authentication");
                }).catch(() => {
            });
        },
        //业务前校验
        Done(){
            if (this.status > 0){ //已经点赞 这样判断的原因是 后端返回的状态有null 也有ID 都不统一
                Dialog.tip("您已点过赞");
                return;
            }
            if(this.status == -1){ //已经点踩
                Dialog.tip("您已点过踩");
                return;
            }
            this.Check();
        },
        Check(){
            Service.CheckLogin().then(() => {
                Service.CheckBind().then(() => {
                    if(this.comptype == -1){ //点踩需要实名认证
                        Service.CheckRealName().then(() => {
                            this.Play();
                        }).catch(() => {
                            this.ShowDialog();
                        });
                    }else
                        this.Play();
                });
            });
        },
		Play(){
            this.anim = 1;
            this.status = this.comptype; //网络延迟，提前先改变状态 防止重复动效
            //this.number = +this.number + 1; //防止网络延迟，提前点赞数量+1
		    lottie.loadAnimation({
    	        container: this.$refs.lottie,
    	        renderer: 'svg',
    	        loop: false,
    	        autoplay: false,
		    	animationData: this.json,
		    	//path:'https://heizuan.oss-cn-shenzhen.aliyuncs.com/script/like.json', //测试过，存在跨域问题
    	        rendererSettings: ''
    	    }).play();
            this.Submit();
        },
        Submit(){
            //点赞 评级、爆料、话题（资讯，活动，帮助）（项目公告）
            let params = {
                type: this.type,
                id: this.id,
                comment_id: this.commentid
            };
            if(this.comptype == -1){ //点踩时需要传这个参数
                params.status = -1; //0赞 -1踩
            }
            Ajax.post(Api.apply.common_like, params).then(res => {
                if (res.data.status == 1) {
                    if (res.data.mission[0]) {
                        let desc = this.type == 0 && !this.commentid ? '还有机会获得点赞分红，具体规则参见首页"评级热榜"':'';
                        this.$dialog.other("点赞成功", res.data.mission[2].hzt, desc); //待完成 和后台对接中间的黑钻数量参数
                    }
                    this.status = this.comptype; //改变点赞状态
                    this.number = +this.number + 1; //点赞数量+1
                    this.$emit("liked",this.comptype); //抛出点赞结果 为了处理详情页上下点赞按钮状态一致
                }else{
                    Dialog.tip(res.message);
                    this.Reset();
                }
            }).catch(err => {
                this.Reset();
                if(err.status == -20002) { //未名实认证
                    this.ShowDialog();
                }else{
                    Dialog.tip(err.message);
                }
            });
        },
        //点赞、踩失败，恢复所有状态
        Reset(){
            this.status = 0; //恢复状态
            this.anim = 0;
            this.$refs.lottie.innerHTML = '';
        }
    },
    mounted(){
        
    }
}
</script>

<style lang="less" scoped>
	@import "../../assets/css/config";
    .comp-liketool{
        line-height: 1;
        overflow: hidden;
        .icon{
            position:relative;
            .lottie{
                position: absolute;
                z-index: 1;
                background: #FFF;
            }
            &.ding{
                .lottie{
                    top:-20%;
                    left:-20%;
                    right:-20%;
                    bottom:-20%;
                }
            }
            &.cai{
                .lottie{
                    top:-50%;
                    left:-50%;
                    right:-10%;
                    bottom:-10%;
                }
            }
            &.icon-ding2,&.icon-cai2{
                color: @color-link !important;
            }
        }
    }
</style>