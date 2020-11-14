<template>
    <!-- 有示例图片的上传组件  -->
    <div class="comp-uploader2">
        <div class="">
            <div class="com-rect">
                <div class="border">
                    <img :src="src" />
                </div>
            </div>
            <p>参考图例</p>
        </div>
        <div>
            <div class="com-rect" @click="Upload">
                <div class="border">
                    <i v-show="!value && !uploading" class="icon icon-add-icon"></i>
                    <img v-show="value && !uploading" :src="value" />
                    <comp-loading v-if="uploading" :process="uploading" />
                </div>
            </div>
            <p>上传照片</p>
        </div>
    </div>
</template>
<script>
    import Uploader from '~components/Uploader';
    import compLoading from '~components/compTools/compLoading';
    export default {
        name: 'compUploader2',
        components:{
            compLoading
        },
        props:{
            value:'', //上传结果图片路径
            src:'', //示例图片展示
        },
        data(){
            return {
                uploading:0, //上传状态
            }
        },
        methods:{
            //上传结束
            End(res) {
                this.uploading = 0;
                setTimeout(() => {
                    if (res.status == 1) {
                        //this.img = res.data;
                        this.$emit('input',res.data);
                    } else {
                        this.$dialog.alert({
                            title: '系统消息',
                            content: res.message,
                            btns: ['知道了']
                        });
                    }
                }, 200);
            },
            //上传图片
            Upload() {
                if (this.uploading) return;
                if(Global.isApp && Global.isPro){ //APP端
					let appUploader = new HZApp.Uploader({
						start:() => {this.uploading = 1;},
						success:this.End,
						error(err){
							console.log("上传失败！",JSON.stringify(err))
						}
					});
					appUploader.Init();
                }else{
                    Uploader({
                        url: this.$api.apply.upload_img,
                        field: 'file',
                        uploaded: this.End,
                        fileChange: () => {this.uploading = 1;},
                        cancel: () => {
                            this.uploading = 0;
                        }
                    });
                }
            },
        }
    }
</script>
<style lang="less" scoped>
    @import "../assets/css/config";
    .comp-uploader2 {
        display: flex;
        justify-content: space-between;
        margin-top: .7rem;
        .com-rect {
            width: 8.25rem;
            height: 5rem;
            .border {
                width: 100%;
                height: 100%;
                background: @bgcolor-body;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    max-width: 100%;
                    max-height: 100%;
                }
            }
        }
        .icon {
            font-size: 2rem;
            color: #BCBCBC;
        }
        p{
            margin-top:.2rem;
            text-align: center;
            font-size: .45rem;
            color: #5682FF;
        }
    }
</style>
