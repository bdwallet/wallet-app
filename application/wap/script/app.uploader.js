///上传类

import Vue from 'vue'
import Api from '~script/api';
import { DH_NOT_SUITABLE_GENERATOR } from 'constants';

class AppUploader {
    constructor(opts){
		const __DEFAULT = {
            count:1, //需要上传的图片数量
            auto:1, //选择图片后自动上传
            start:undefined,//上传中状态回调 上传任务开始调度
            process:undefined,//上传进度回调
            success:undefined,//上传成功回调
            error:undefined,//上传失败回调
        };
        
        this.option = Object.assign(__DEFAULT, opts),

        this.fileInfo = {}, //选择的图片文件信息
        this.fullPath = undefined, //图片系统路径
        this.path = ""; //压缩图片后，生成的路径 用于上传时的path
    }

    Init(){
        this.count = this.option.count;
        this.auto = this.option.auto;
        this.start = this.option.start;
        this.process = this.option.process;
        this.success = this.option.success;
        this.error = this.option.error;

        plus.nativeUI.actionSheet({
			title:"选择照片",
			cancel:"取消",
			buttons:[
				{title: "拍照"},
            	{title: "相册"}
            ],
        }, (e) => { //点击回调
            if(e.index == 1){//拍照
                this.CameraImg();
            }else if(e.index == 2){// 打开相册
                this.GalleryImg();
            }
        });
    }

    //上传
    Upload(){
        console.log("Upload start");
		let uper = plus.uploader.createUpload(Api.apply.upload_img, {method:'POST'}, (t,status) =>{
            try{
                let data = JSON.parse(t.responseText);
			    if(data.status == 1 && status == 200) {
                    console.log("上传成功 =》 in appUploader.js");
			    	this.success && this.success(data);
			    }else{
                    this.error && this.error(data);
                    console.log("上传失败");
                }
            } catch(err) {
                this.error && this.error(err);
                console.log("upload error",JSON.stringify(err));
            }
        });
        
        let rnd = Math.random().toString(36).substring(3, 6);
        
        console.log("Upload start rnd",rnd);

		uper.setRequestHeader('X-Requested-With','Hz-Pc-Request');
        uper.addFile(this.path, {key:"image"+rnd});
        console.log("Upload addFile path",this.fullPath);
        if(this.process){ //上传任务开始调度
            uper.addEventListener( "statechanged", s => {
                this.process(s); //s.totalSize  s.uploadedSize
            }, false );
        }
        //console.log("Upload process",this.process);
        uper.start();
        //console.log("Upload start",this.start);
        this.start && this.start();
    }


    //拍照
    CameraImg(){
        let c = plus.camera.getCamera();
        // 相机权限
        if(!this.CameraPermission()) return;
        c.captureImage(e => {
            //获取操作文件或目录对象
            plus.io.resolveLocalFileSystemURL(e, entry => { //entry 请求到的目录或文件对象
                let fullPath = entry.toLocalURL(); //toLocalURL: 获取目录路径转换为本地路径URL地址
                this.ZipResHandle(fullPath);
            }, e => {
                console.log("读取拍照文件错误：" + e.message);
            });
        }, err => {
            if(err.code == 11){
                if (plus.os.name == "iOS"){
                    plus.nativeUI.alert("您的相机权限没有打开，请在当前应用设置-隐私-相机来开打次权限");
                }else{
                    plus.nativeUI.alert("您的相机权限没有打开，请在应用列表中将权限打开");
                }
            }
        }, {
            filename: "_doc/" //拍照文件存放的路径
        });
    }

    //打开相册 选择单张
    GalleryImg(){
        plus.gallery.pick(fullPath => {
            this.ZipResHandle(fullPath);
        }, (error) => {
            if(error.code == 12){
                if (plus.os.name == "iOS"){
                    plus.nativeUI.alert("您的相册权限没有打开，请在当前应用设置-隐私-相册来开打次权限");
                }else{
                    plus.nativeUI.alert("您的相册权限没有打开，请在应用列表中将权限打开");
                }
            }else{
                this.GalleryPermission(error);
            }
        }, {filter:"image"});
    }

    //获取本地图片地址
    ZipResHandle(fullPath){
        this.fullPath = fullPath;
        plus.io.resolveLocalFileSystemURL(fullPath, entry => { //entry 请求到的目录或文件对象
            entry.file(file => { // 获取文件信息
                this.fileInfo = file;
                this.ZipPicture();
            })
        });
    }
    // 压缩图片
    ZipPicture(){
        let dst = '_downloads/' + this.fileInfo.name;// 转换目标图片的路径
        this.path = dst;
        let conf = {
            src: this.fullPath,
            dst,
            overwrite:true, // 是否覆盖
            format:'jpg',
            quality: 80, //清晰度
            //width:'1024px',
        };

        plus.zip.compressImage(conf, data => {
            this.ZipSuccess(data);
        }, err => {
            this.ZipError(err);
        });
    }
    // 压缩图片成功回调
    ZipSuccess(res){
        console.log("in ZipSuccess",JSON.stringify(res));
        
        this.Upload();
    }
    // 压缩图片失败回调
    ZipError(err){
        console.log("in ZipError",JSON.stringify(err));
        
        this.Upload();
    }

    //图片文件转Base64
    PictureToBase64(src){
        let canvas = document.createElement('canvas'),//创建canvas元素
            ctx = canvas.getContext('2d'),
            img = new Image(); //通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片，相比 createElement() 创建 <img> 省去了 append()，也就避免了文档冗余和污染
        img.crossOrigin = 'Anonymous';
        img.src = src; // 图片预览
        img.onload = () => {
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img,0,0,);
            this.pictureForBase64 = canvas.toDataURL('image/jpeg', 1);
            canvas = null;
        };
    }

    //Base64转图片文件
    Base64ToPicture(){
        let arr = this.pictureForBase64.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        this.pictureFile = new File([u8arr], this.fileInfo.name, {type:mime});
    }

    //打开相机失败，请求系统权限
    CameraPermission(){
        let cameraPermission = plus.navigator.checkPermission("CAMERA");
        if( cameraPermission == "denied" ){// 阻塞
            if (plus.os.name == "iOS") {
                plus.nativeUI.alert("您的相机权限没有打开，请在当前应用设置-隐私-相机来开打次权限", (event) =>{
                    plus.runtime.openURL('prefs:root=Privacy');
                })
            } else if (plus.os.name == "Android") {
                plus.nativeUI.alert("您的相机权限没有打开，请在应用列表中将权限打开", () =>{
                    let main = plus.android.runtimeMainActivity();
                    let Intent = plus.android.importClass("android.content.Intent");
                    let mIntent = new Intent('android.settings.APPLICATION_SETTINGS');
                    main.startActivity(mIntent);
                });
            }
            return false
        }else{
            return true
        }
    }

    //打开相册失败，请求系统权限
    GalleryPermission(){
        let galleryPermission = plus.navigator.checkPermission("GALLERY");
        if (plus.os.name == "iOS") {
            if (e.code == 8) {
                plus.nativeUI.alert("您的相册权限未打开，请在当前应用设置-隐私-相册来开打次权限", (event) =>{
                    plus.runtime.openURL('prefs:root=Privacy');
                })
            }
        } else if (plus.os.name == "Android") {
            if (e.code != 12) {
                plus.nativeUI.alert("您的相册权限未打开，请在应用列表中将您的权限打开", () =>{
                    // var android = plus.android.importClass('com.android.settings');
                    let main = plus.android.runtimeMainActivity();
                    let Intent = plus.android.importClass("android.content.Intent");
                    let mIntent = new Intent('android.settings.APPLICATION_SETTINGS');
                    main.startActivity(mIntent);
                });
            }
        }
    }

    //预览图片
    PreviewPicture(imgLists,current) {
        plus.nativeUI.previewImage(imgLists,{current});
    }
}

export default AppUploader;
