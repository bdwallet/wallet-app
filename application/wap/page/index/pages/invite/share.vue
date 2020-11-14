<template>
    <div class="invite-share" ref="canvas" :style="{ 'background-image':`url(${$assets.inviteBg})` }">
        <div class="share-wrap" :style="{'background-image':`url(${$assets.shareBg})` }">
            <div class="user-info">
                <div class="user-name">
                    <p class="name">@{{name}}</p>
                    <p class="name-tip">邀你来黑钻评级领取</p>
                </div>
                <div class="user-photo">
                    <img :src="user_photo" />
                </div>
            </div>
            
            <!-- canvas绘制icon 最为重要的一步 Start-->
            <div class="hzt">
                <span class="span-1">&#xe6a0;</span>
                <span class="span-2">&#xe6a0;</span>
                <span class="span-3">&#xe6a3;</span>
                <!--<span class="span-4">&#xe6a8;</span>-->
            </div>
            <!-- canvas绘制icon 最为重要的一步 End-->
           
            <div class="QR-code">
                <img :src="$route.query.url" >
            </div>
        </div>
        <img :src="imageData" v-if="imageData" class="share-img">
    </div>
</template>

<script>
    let Canvas = []; // 存储base64地址
    import drawCanvas from '~script/drawCanvas'
    export default {
        name: "share",
        data(){
            return{
                Url: 'https://heizuan.oss-cn-shenzhen.aliyuncs.com/h5images/',
                imageData: '',
                image:{
                    canvas_photo: '',
                    canvas_inviteBg: '',
                    canvas_shareBg: '',
                    canvas_QRCode: '',
                }
            }
        },
        computed:{
            user(){
                return this.$store.getters.userInfo;
            },
            name(){
                return this.user.user_name ? this.user.user_name : (this.user.user_nickname ? this.user.user_nickname : '夜雨凋枫·戚寒雨 ');
            },
            user_photo() {
                return this.user.user_photo ? this.user.user_photo : this.$assets.avatar;
            }
        },
        methods:{
            
            // 获取红色黑钻数
            getNumber(num){
                return Service.GetNumb(num);
            },
            
            // 生成图片
            drawCanvas(){
                drawCanvas.creatCanvas({
                    image: this.image,
                    imageData: this.imageData,
                    tipName: '邀你来黑钻评级领取',
                    name: this.name,
                    code: document.querySelector('.span-1').textContent,
                    code1: document.querySelector('.span-3').textContent
                }).then(res => {
                    this.imageData = res;
                });
            },

            // 转化oss背景图片为base64地址--> 解决跨域问题
            toBase64Url(index,Url,width,height){
                Canvas[index] = document.createElement('canvas');
                Canvas[index].width = width;
                Canvas[index].height = height;
                if(!Canvas[index].getContext) return false;
                let ctx = Canvas[index].getContext("2d");
                let img = new Image();
                img.src = Url;
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, width, height);
                    let database64 = Canvas[index].toDataURL("image/png", 1);
                    if (index == 1) {
                        this.image.canvas_photo = database64;
                        this.toBase64Url(2, `${this.Url}invite-bg.jpg` + '?timeStamp=' + new Date(), 375 * drawCanvas.DPR(), 667 * drawCanvas.DPR());
                    } else if (index == 2) {
                        this.image.canvas_inviteBg = database64;
                        this.toBase64Url(3, `${this.Url}share-bg.png` + '?timeStamp=' + new Date(), 319 * drawCanvas.DPR(), 519.5 * drawCanvas.DPR());
                    } else if (index == 3) {
                        this.image.canvas_shareBg = database64;
                        this.toBase64Url(4, this.$route.query.url + '?timeStamp=' + new Date(), 86 * drawCanvas.DPR(), 86 * drawCanvas.DPR());
                    } else if (index == 4) {
                        this.image.canvas_QRCode = database64;
                        if(!this.$global.isApp){ // 非app端
                            this.drawCanvas()
                        }
                    }
                }
            }
        },
        mounted () {
            Share.Ready({
                title: `您的好友“${this.user.user_name}”送你225黑钻，点击立即领取`,
                desc: '下载注册黑钻评级App，领取新人大礼包',
                link: `${location.origin}/invite/register/${this.$route.query.invid}`,
            });

            this.$dialog.mask({
                content: '长按保存图片或点击这里召唤好友领给黑钻吧',
                btn:1
            });

            this.toBase64Url(1,this.user_photo + '?timeStamp='+ new Date(),206 * drawCanvas.DPR(),315 * drawCanvas.DPR());
            
        },
        beforeRouteLeave(to, from, next){
            if(this.$dialog.getState() == 0) next();
            else this.$dialog.hide();
        }
    }
</script>
<style lang="less" scoped>
    .invite-share{
        position: relative;
        height: e("calc(100vh)");
        width: 100%;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        // padding: 3.125rem 0 1.325rem;
        overflow: hidden;
        .share-wrap{
            display: flex;
            width: 15.95rem;
            height: 25.975rem;
            margin: 0 auto;
            background-size: cover;
            padding: 0 1.125rem;
            background-repeat: no-repeat;
            flex-direction: column;
            .user-info{
                display: flex;
                align-content: center;
                justify-content: space-between;
                margin-top: 4.8rem;
                .user-name{
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    text-align: start;
                    .name{
                        color: #333;
                        font-size: .8rem;
                        margin-bottom: .2rem;
                    }
                    .name-tip{
                        color: #888;
                        font-size: .7rem;
                    }
                }
                .user-photo{
                    width: 3.15rem;
                    height: 3.15rem;
                    overflow: hidden;
                    border-radius: 50%;
                    img{
                        width: 100%;
                        height: 100%;
                        display: block;
                    }
                }
            }
            .hzt{
                font-family: 'icon' !important;
                color: #FF7270;
                font-size: 2.95rem;
                font-weight: bold;
                padding-top: .85rem;
                margin-left: 3rem;
                span{
                    margin-left: -1.5rem;
                    /*&.span-1{
                        margin: 0 -.4rem 0 0;
                    }
                    &.span-2{
                        margin: 0 -.4rem 0 -1.8rem;
                    }*/
                }
            }
            .QR-code{
                width: 4.5rem;
                height: 4.5rem;
                overflow: hidden;
                margin: 1.5rem auto 0;
                img{
                    width: 100%;
                    height: 100%;
                    display: block;
                }
            }
        }
        .share-img{
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            opacity:0;
            width: 100%;
            height: 100%;
        }
    }
</style>
