<template>
    <div class="comp-input-avatar" :style="{ width, height }" @click.stop="Upload" :uploading="uploading">
        <div v-if="!uploading">
            <img :src="src || $assets.avatar" />
            <div class="sub-title">设置头像</div>
        </div>
		<comp-loading v-else :process="uploadStatus" />
    </div>
</template>

<script>
    /**
     *  avatar 调用方法
     *  import compAvatar from '~components/compInput/avatar';
     *  <comp-avatar @arrow="crop"/>
     *  arrow 方法->上传完成后抛出返回数据(可以不传)
     * */
    import "./style";
    import uploader from '~components/Uploader';
    import compLoading from '~components/compTools/compLoading';
    export default {
        name: "avatar",
		components:{compLoading},
        data() {
            return {}
        },
        props: {
            src: {
                type: String,
                default: ""
            },
            height: {
                type: String,
                default: "4.975rem"
            },
            width: {
                type: String,
                default: "4.975rem"
            },
            uploading: Boolean
        },
        methods: {
			//开始上传
			UploadStart(){
				this.uploading = 1;
			},
			//上传完成
            Uploaded(res){
                this.uploading = 0;
                if (res.status == 1) {
                    this.$emit("arrow", res.data)
                } else {
                    this.$dialog.alert({
                        title: '系统消息',
                        content: res.message,
                        btns: ['知道了']
                    });
                }
            },
            Upload() {
                if (this.uploading){
					Dialog.alert({
						title: '系统消息',
						content: '图片上传中,请稍等',
						btns: ['知道了']
					});
					return false;
                }
                if(Global.isApp && Global.isPro){ //APP端
					let appUploader = new HZApp.Uploader({
						start:this.UploadStart,
						success:this.Uploaded,
						error(err){
							console.log("上传失败！",JSON.stringify(err))
						}
					});
					appUploader.Init();
                } else {
                    uploader({
                        url: this.$api.apply.upload_base_img,
                        field: 'file',
                        crop: {},
                        uploaded: this.Uploaded,
                        fileChange: this.UploadStart,
                        cancel: () => {
                            this.uploading = 0;
                        }
                    });
                }
            }
        }
    }
</script>
