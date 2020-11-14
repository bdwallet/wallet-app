import uploadIframe from './iframe'
import uploadForm from './form'
import uploadCrop from './crop'

export default {
	name: 'extUploader',
	components:{
		uploadIframe, // iframe代理
		uploadForm,// form表单代理
		uploadCrop // 图片预览与裁剪
	},
	props: {
		type:{
			type: String,
			default:'file'
		},
		field:{
			type: String,
			default:'file'
		},
		url:String,
		crop:Object,
		uploaded:Function,//上传完成回调
		uploading:Function,//上传中回调
		fileChange:Function,//选择图片文件后回调
		cancel:Function,//取消上传回调
	},
	data(){
		return{
			// 时间戳
			uid:new Date().getTime(),
			isCrop:false,
			cropInfo:{},
			src:''
		}
	},
	computed: {
		// 创建iframe代理
		iframeName(){
			return `extUploadIframe_${this.uid}`
		},
		// 创建表单
		formName(){
			return `extUploadForm_${this.uid}`
		}
	},
	methods: {
		// 表单提交后，iframe代理接受后台数据
		iframeReload(response){
			this.uploaded && this.uploaded(response)
			this.$destroy();
		},
		// 选择图片后
		selectFile(file){
			if(1024*1024*3<file[0].size){
				this.$dialog.tip({type:'other',content:'图片大小不能超过3M'})
				return false;
			}
			if(this.crop){
				if(file){
					this.src =  this.getImgUrl(file);
					this.isCrop = true;
				}else{
					alert('您浏览器不支持此功能，请更换或升级浏览器！');
				}
			}else{
				this.upload()
			}
			this.fileChange && this.fileChange()
		},
		// 获取本地图片地址，用于预览
		getImgUrl(file){
			let windowURL = window.URL || window.webkitURL;
			return windowURL.createObjectURL(file[0]);
		},
		// 提交表单，可传递新参数
		upload(info) {
			this.uploading && this.uploading(info);
			this.$refs.form.submit(info);
    	},

		// 图片裁剪完成后再次上传
		cropSave(){
			this.isCrop = false;
			let img = document.createElement('img');
			img.src = this.src;

			// sx,sy 	图片开始裁剪的坐标
			// sw,sh	需裁剪图片的大小
			let sx = this.cropInfo.origin.left
			let sy = this.cropInfo.origin.top
			let sw = this.cropInfo.origin.width
			let sh = this.cropInfo.origin.height


			var canvas = document.createElement('canvas');
			canvas.width = 300
			canvas.height = 300
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, sx, sy, sw, sh);
			var url = canvas.toDataURL("image/png");
			img.src = url;

			this.cropInfo.image = url
			this.upload(this.cropInfo);
			img = null;
			canvas = null;
		},
		// 裁剪实时信息
		onCrop(info){
			this.cropInfo = info;
			this.crop.cutting && this.crop.cutting(info)
		},
		// 关闭图片裁剪框
		cropClose(r){
			this.isCrop = false;
			this.cancel && this.cancel();
			this.$destroy();
		},

	},
	mounted() {
		// let main = document.getElementById('ext-uploader-main');
		// if(main)document.body.removeChild(main);
		document.body.appendChild(this.$el)
	},
	beforeDestroy() {
		document.body.removeChild(this.$el);
	}
};




