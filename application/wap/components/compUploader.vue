<template>
	<div class="comp-uploader">
		<ul>
			<li v-for="(item,index) in DimgList" @click="ShowDelbtn(index)" :key="index" style="background-color: #efeff4">
				<img :src="item+'?x-oss-process=image/resize,m_lfit,h_160,w_160'" v-if="item!=''">
				<span class="txt" v-if="(index==DimgList.length-1)&&isloading">
					<comp-loading :process="uploadStatus" />
				</span>
				<div class="delzoom mixin-ease-in-out" @click="Delphoto(index)" v-show="showStatus[index]">
					<div class="blackzoom"></div>
					<i class="icon icon-shanchu"></i>
				</div>
			</li>
			<li class="addphoto" @click="Upload" v-show="DimgList.length<maxLength">
				<i class="icon icon-add-icon"></i>
			</li>
		</ul>
	</div>
</template>
<script type="text/javascript">
	import Uploader from '~components/Uploader';
    import compLoading from '~components/compTools/compLoading';
	import Global from '~script/global';
	import Ajax from '~script/http';
	import Api from '~script/api';
	import Dialog from '~components/compDialog/index.js';
	let timeout;
	export default {
		name: 'compUploader',
		components:{compLoading},
		data() {
			return {
				DimgList: [],
				showStatus: [],
				uploadStatus: 0, //1 上传中 0 未上传
				//uploadText:'上传中', //上传进度文本
			}
		},
		props: {
			//图片最大长度
			maxLength: {
				type: Number,
				default: 4,
			},
		},
		computed: {
			isloading() {
				return this.DimgList[this.DimgList.length - 1] == '';
			}
		},
		methods: {
			//图片上传进度处理  //弃用 后台返回太慢，一真100%;
			// UploadProcess(s){
			// 	if(s){
			// 		this.uploadText = `上传中${Math.floor(s.uploadedSize/s.totalSize*100)}%`;
			// 	}
			// },
			//开始上传
			UploadStart(){
				this.uploadStatus = 1;
				this.$emit('uploaded', '', '', false);
				this.SetDefaultImg();
			},
			//上传完成
			Uploaded(res){
				if (res.status == 1) {
					this.uploadStatus = 0;
					setTimeout(() => {
						this.$set(this.DimgList, this.DimgList.length - 1, res.data);
						this.$emit('uploaded', this.DimgList, 'change', true);
					}, 200);
				} else {
					this.uploadStatus = 0;
					Dialog.alert({
						title: '系统消息',
						content: res.message,
						btns: ['知道了']
					}).then((res) => {
						this.DimgList.splice(this.DimgList.length - 1, 1);
					});
				}
			},

			Upload() {
				// 测试compLoading组件用
				// if (this.uploadStatus) {
				// 	Dialog.alert({
				// 		title: '系统消息',
				// 		content: '图片上传中,稍等',
				// 		btns: ['知道了']
				// 	});
				// 	return false;
				// }
				// this.UploadStart();
				// setTimeout(() => {
				// 	this.Uploaded({status:1,data:"https://heizuan.oss-cn-shenzhen.aliyuncs.com/img//2123055c3a7b6861ad1007ecf62a1a09.jpg"});
				// }, 2000);
				// return false;
				if (this.uploadStatus) {
					Dialog.alert({
						title: '系统消息',
						content: '图片上传中,请稍等',
						btns: ['知道了']
					});
					return false;
				}
				if (Global.isApp && Global.isPro) { //APP端
					let appUploader = new HZApp.Uploader({
						//process:this.UploadProcess, //弃用 后台返回太慢，一直100%;
						start:this.UploadStart,
						success:this.Uploaded,
						error(err){
							console.log("上传失败！",JSON.stringify(err))
						}
					});
					appUploader.Init();
				} else {
					Uploader({
						url: Api.apply.upload_img,
						field: 'file',
						uploaded: this.Uploaded,
						fileChange: this.UploadStart,
					});
				}
			},
			ShowDelbtn(index) {
				clearTimeout(timeout);
				if (this.isloading) return false;
				this.showStatus.forEach((item, itemindex) => {
					this.$set(this.showStatus, itemindex, false);
				})
				this.$set(this.showStatus, index, !this.showStatus[index]);
				timeout = setTimeout(() => {
					this.ShowDelbtn(-1);
				}, 3000);
			},
			Delphoto(index) {
				let params = {
					img_url: this.DimgList[index],
				}
				Dialog.confirm({
					title: '您确定要删除此图片？',
					btns: ['删除', '取消']
				}).then((res) => {
					this.showStatus[index] = false;
					this.DimgList.splice(index, 1);
					this.$emit('uploaded', this.DimgList, 'change', true);
					Ajax.post(Api.apply.del_img, params).then(res => {
					});
				})
			},
			SetDefaultImg() {
				this.DimgList.push("");
			},
			initImglist(imgArray) {
				this.DimgList = imgArray;
				this.$emit('uploaded', this.DimgList, '', true);
			}
		},
		mounted() {}
	}
</script>
<style lang="less" scoped>
	@import "../assets/css/config";
	.comp-uploader {
		ul {
			display: flex;
			flex-wrap: wrap;
			li {
				position: relative;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 4.0rem;
				height: 4.0rem;
				margin-right: 0.4rem;
				margin-bottom: .4rem;
				overflow: hidden;
				&.addphoto {
					border: 0.025rem solid #ddd;
				}
				&:nth-child(4n) {
					margin-right: 0;
				}
				.icon {
					color: #ccc;
					font-size: 1.6rem;
				}
				img {
					width: 4.0rem;
					height: 4.0rem;
				}
				.delzoom {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					transform: translateY(0%);
					animation: uploading 0.2s 1;
					-webkit-animation: uploading 0.2s 1;
					@keyframes uploading {
						from {
							transform: translateY(100%)
						}
						to {
							transform: translateY(0%)
						}
					}
					@-webkit-keyframes uploading {
						from {
							transform: translateY(100%)
						}
						to {
							transform: translateY(0%)
						}
					}
					.blackzoom {
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						background-color: #474659;
						opacity: 0.8;
					}
					.icon {
						position: relative;
						z-index: 2;
						color: #fff;
						font-size: 1.0rem;
					}
				}
				.txt {
					position: absolute;
					width: 100%;
					height: 100%;
					left: 0;
					top: 0;
				}
			}
		}
	}
</style>