<template>
    <div class="fileupload-box">
        <label for="fileUpload" class="fileload-text">选择文件:<span style="color:red">*</span></label>
        <div name="fileUpload"class="fileupload" id="fileUpload" >
            <div v-for="(fileName, index) in files" style="text-align:left;">
                <label class="fileload-text">{{fileName}}</label>
                <i class="fileload-text" style="margin-left:4px;cursor:pointer;font-weight:800" @click="removeFile(index)">&times</i>
            </div>
        </div>
        <div class="btns">
            <button @click="newFile()">浏览</button>
        </div>
        <div class="imgbox">
            <img :src="src||'static/img/avatar.0b272e3.jpg'" ref='imgshow'>
        </div>
        <input type="file" name="fileimport" ref='fileimport' style="display:none"  @change="setFilePath()">
    </div>    
</template>

<script>
import axios from 'axios';
export default {
    name: 'upload',
    data() {
        return {
            files:[],
            src:''
        }
    },
    props: {
        //上传接口
        url: {
            type: String,
            default: ''
        },
        //文件大小
        size:{
            type:String,
            default:''
        }
    },
    methods: {
        //点击弹出文件选择
        newFile(){
            this.$refs.fileimport.click();
        },
        setFilePath(){
            //非ie9
           if(this.$refs.fileimport.files &&this.$refs.fileimport.files[0]){
                let fileName,length;
                if (this.$refs.fileimport.value !== '') {
                    if (this.files.length >= 1) {
                        this.$refs.fileimport.value='';
                        alert('最多支持1个附件');
                        return;
                    }
                    if (this.$refs.fileimport.files[0].size > this.size*1024*1024) {
                        this.$refs.fileimport.value='';
                        alert('文件超出'+this.size+'M请重新选择');
                        return;
                    } 
                    if (!/\.(jpg|png|gif|bmp)$/.test(this.$refs.fileimport.files[0].name.toLowerCase())) {
                        this.$refs.fileimport.value='';
                        alert('文件格式不支持');
                        return;
                    }
                    length = this.$refs.fileimport.files[0].name.length;
                    fileName = this.$refs.fileimport.files[0].name;
                    if (length > 11) {
                        fileName = fileName.substr(0, 4) + '...' + fileName.substr(length - 7, 7);
                     }
                    if (this.files.indexOf(fileName) === -1) {
                        this.files.push(fileName);
                    } 
                }
                this.src =window.URL.createObjectURL(this.$refs.fileimport.files[0]);
           }else{

            if(!this.$refs.fileimport.value.match( /.jpg|.gif|.png|.bmp/i ) ){ 
                alert('图片格式无效！'); 
                this.$refs.fileimport.value='';
                return;
                    }
            let imgName = '...' +this.$refs.fileimport.value.substr(this.$refs.fileimport.value.length-8,this.$refs.fileimport.value.length ) ;
            if(this.files.length<=0){
              this.files.push(imgName);  
            }
            this.src=this.$refs.fileimport.value
            this.$refs.imgshow.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src=\"" + this.src + "\")";//增加滤镜
           }
        },
        removeFile(index) {
            this.src='';
            this.$refs.fileimport.value='';
            this.files.splice(index, 1);
        }
    }
}
/*update (e) {   // 上传照片  
            let file = e.target.files[0]
            let param = new FormData()  // 创建form对象
            param.append('file', file, file.name)  // 通过append向form对象添加数据
            param.append('chunk', '0') // 添加form表单中其他数据
            //console.log(param.get('file')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去
            let config = {
                headers: {'Content-Type': 'multipart/form-data'}
            }
    
            axios.post('http://172.19.26.60:8081/rest/user/headurl', param, config)
                .then(response => {
                  if (response.data.code === 0) {
                    self.ImgUrl = response.data.data
                  }
                  //console.log(response.data)
                })
            }*/

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang=less>
.fileupload-box{
    display: inline-block;
    max-height:32px;
    font-size: 0;
   .fileload-text{
        float:left;
        display: inline-block;
        height:32px;
        line-height: 32px;
        font-size: 14px;
        font-weight: normal;
        font-family:SimSun;
   }
   .fileupload{
        display: inline-block;
        border:1px solid #cdcdcd;
        background-color:#ebebeb;
        width:180px;
        height:32px;
        min-height:32px;
        padding:0px 5px 0px 12px;
   }
   .btns{
        float:right;
        button{
            border:1px solid #cdcdcd;
            background-color:#ebebeb;
            width:40px;
            height:32px;
            padding:5px;
            cursor:pointer;
        }
    }
    .imgbox{
        width:220px;
        height:220px;
        display: block;
        margin-top: 15px;
        margin-left: 70px;
        img{
            width:100%;
            height:100%;    
        }     
    }
    
    
}
</style>




