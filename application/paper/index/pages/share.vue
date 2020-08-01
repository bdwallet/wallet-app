<template>
	<div class="paper-share" ref="paperShare">
    <div class="content">
    	<div class="content-title">
    		<div class="sprites-record-poiont"></div>
    		<div>上黑钻评级，知项目好坏</div>
    		<div class="sprites-record-poiont"></div>
    	</div>
    	<div class="dialog">
    		<span>{{figureGradeData.user_name}}</span>对ta的评价
    	</div>
    	<div class="user-photo sprites-photo-frame1">
    		<div class="press-save" v-show="showSharetxt">长按保存图片</div>
    		<img :src="figureData.figure_user_photo">
    		<div class="sprites-stamp1 animate" animate-style='{"attr":"transform","val":"scale(4)"}' animate-time="200"></div>
    	</div>
    	<div class="office">{{figureData.figure_user_name}}<span v-if="figureData.figure_default_user_job" style="position: relative;top: -2px;"> | </span>{{figureData.figure_default_user_job}}</div>
    	<div class="marking">
				<div class="markstar" :class="[item<=score ? 'sprites-light-star':'sprites-dark-star']"  v-for="item in [1,2,3,4,5,6,7,8,9,10]"></div>
			</div>
			<div class="appraisal">
				{{figureGradeData.grade_content}}
			</div>
			<div class="like" :class="figureGradeData.is_like?'current':''" @click.stop="doLike(figureGradeData)">
				<i class="iconfont icon-ic_dibu_dianzan"></i>
				<span>{{figureGradeData.grade_like_num > 0 ? figureGradeData.grade_like_num : '赞'}}</span>
			</div>
			<div class="btn-group">
				<div class="sprites-orange-btn2" @click="$router.push({path:'/archives'})">返回档案库</div>
				<div class="sprites-blue-btn2" @click="showBlack=true">喊朋友围观</div>
			</div>
			<img :src="imgurl" class="shareimg">
    </div>
    <div class="sharecanvasbox">
	    <div class="sharecanvas canvas" ref="canvas" :style="{'background-image':`url(${canvas_bg})`}">
	    	<div class="content">
		    	<div class="content-title">
		    		<div class="sprites-record-poiont" :style="{'background-image':`url(${canvas_icon})`}"></div>
		    		<div>上黑钻评级，知项目好坏</div>
		    		<div class="sprites-record-poiont" :style="{'background-image':`url(${canvas_icon})`}"></div> 
		    	</div>
		    	<div class="dialog">
		    		<span>{{figureGradeData.user_name}}</span>对ta的评价
		    	</div>
		    	<div class="user-photo sprites-photo-frame1" :style="{'background-image':`url(${canvas_icon})`}"> 
		    				 <img :src="canvas_photo" alt="">
		    		     <div class="sprites-stamp1" :style="{'background-image':`url(${canvas_icon})`}"></div>
		      </div> 
		    	<div class="office">{{figureData.figure_user_name}}|{{figureData.figure_default_user_job}}</div>
		    	<div class="marking">
						 <div class="markstar" :style="{'background-image':`url(${canvas_icon})`}" :class="[item<=score ? 'sprites-light-star':'sprites-dark-star']"  v-for="item in [1,2,3,4,5,6,7,8,9,10]"></div> 
					</div>
					<div class="appraisal">
						{{figureGradeData.grade_content}}
					</div>
					<div class="rcode">
						<img :src="canvas_code" alt=""> 
						<div class="rcode-txt">
							<p>长按识别二维码</p>
							<p>关注黑钻评级</p>
						</div>
					</div>
		    </div>
	    </div>
    </div>
    <div class="share" v-show="showBlack" @click="showBlack=false">
    	<img :src="$assets.shareChickBg" alt="">
			<div class="blackzoom"></div>
		</div>
	</div>
</template>

<script>
	let canvas = [];
	import html2canvas from 'html2canvas';
	
	const name = 'share';
	export default {
		name,
		components: {
		},
		data() {
			return {
				score: 0,
				figureData:{},
				figureGradeData:{},
				imgurl:'',//分享图片
				showBlack:false,//分享蒙版是否显示
				canvas_photo:'',
				canvas_bg:'',
				canvas_icon:'',
				canvas_code:'',

			}
		},
		computed:{
			showSharetxt(){
				return this.$browser!='IOS'&&this.imgurl;
			}
		},
		methods: {
			share(){
					let sharedesc = '';
					if(this.score>=1&&this.score<=4){
						sharedesc = '不管你愿或不愿，他就在这里，割你到底 ';
					}else if(this.score>4&&this.score<=7){
						sharedesc = '币圈都是黑庄？不，你只是被黑庄蒙蔽了双眼';
					}else if(this.score>7&&this.score<=10){
						sharedesc = '不喊暴富的口号，不诓无辜的韭菜眼';
					}
					let href = location.href;
					let _this = this;
					let wxShare = new WxShare(this.$route, {
						href: browser == "IOS" ? this.$store.getters.href : href,
						imgUrl: this.figureData.figure_user_photo,
						title: this.figureGradeData.grade_type==1?`有人给币圈大佬${this.figureData.figure_user_name}评了${this.figureGradeData.grade_score}分，只因...`:`${this.figureGradeData.user_name}给币圈大佬${this.figureData.figure_user_name}评了${this.figureGradeData.grade_score}分，只因...`,
						desc: sharedesc,
						link: `${this.$global.shareout}/${this.$route.params.figuerId}/${this.$route.params.userId}`,
						circleFunction() { //分享朋友圈成功回调
							//alert("分享朋友圈成功！");
							if(_this.$store.getters.userInfo.user_id==_this.$route.params.userId&&_this.figureGradeData.grade_share==0){
								_this.sharecount();
							}
						},
						friendFunction() { //分享给朋友成功回调
							//alert("分享给好友成功！");
							if(_this.$store.getters.userInfo.user_id==_this.$route.params.userId&&_this.figureGradeData.grade_share==0){
								_this.sharecount();
							}
						},
						errorFunction(res) { //config配置失败回调
							console.log("wxShare config error",res);
						}
					});
			},
			sharecount(){
				let params = {
					open_id:this.$store.getters.userInfo.user_openid,
					figure_grade_id:this.figureGradeData.grade_id,
				}
				this.$ajax.post(this.$api.apply.share_figure_grade,params).then(res=>{
					console.log(res);
				}).catch(err=>{
					console.log(err);
				})
			},
			savecanvas(index,imgsrc,width,height){
        canvas[index] = document.createElement('canvas');
        canvas[index].width = width;
        canvas[index].height = height;
        if(!canvas[index].getContext) return false;
        let ctx = canvas[index].getContext("2d");
        let img = new Image();
        img.src = imgsrc;
        img.crossOrigin="anonymous"; //处理安卓跨域问题
        img.onload = (()=>{
        	 ctx.drawImage(img,0,0,width,height);
            let database64 = canvas[index].toDataURL("image/png",1);
            if(index==1){
            	this.canvas_photo = database64;
            	this.savecanvas(2,'https://heizuan.oss-cn-shenzhen.aliyuncs.com/paper/paper-main-bg.jpg'+'?timeStamp='+new Date(),375*3,602*3);
            }else if(index==2){
            	this.canvas_bg = database64;
            	this.savecanvas(3,'https://heizuan.oss-cn-shenzhen.aliyuncs.com/paper/shareicon.png'+'?timeStamp='+new Date(),112*3,278*3);
            }else if(index==3){
            	this.canvas_icon = database64;
            	this.savecanvas(4,'https://heizuan.oss-cn-shenzhen.aliyuncs.com/images/hzpjewm.jpg'+'?timeStamp='+new Date(),70*3,70*3);
            }else if(index==4){
            	this.canvas_code = database64;
            	this.toImage();
            }
        })
	    },
	    toImage(){
	    	let canvas = document.querySelector('.canvas');
        let that = this;
        let imgData = ''; 
        html2canvas(canvas,{scale:3,logging:false,useCORS:true}).then(function(canvas) {
            let type = 'image/jpeg';
            imgData = canvas.toDataURL(type);
            that.imgurl = imgData;
        });
	    },
	    doLike(item){
	    	if (this.$store.getters.userInfo.user_is_attention != 1) {
					this.$store.commit('changeShowWxcode', {
						status: true
					});
					return false;
				}
				if (item.is_like == 1){
					this.$dialog.tip({
							type: 'other',
							content: '您已点过赞'
						});
					 return;
				}
				let params = {
					open_id: this.$store.getters.userInfo.user_openid,
					grade_id: item.grade_id
				}
				this.$ajax.post(this.$api.apply.figure_grade_like, params).then(res => {
					if (res.data.status == 1) {
						item.is_like = 1;
						item.grade_like_num = +item.grade_like_num + 1;
						this.figureGradeData.is_like = 1;
					} else {
						console.log(res);
					}
				}).catch(err => {
					console.log(err);
				})
			},
			//获取
			getFigure(){
				let params = {
					figure_id: this.$route.params.figuerId,
					current_page: 1,
					page_size: 10,
					order:0,
					open_id: this.$store.getters.userInfo.user_openid,
					user_id:this.$route.params.userId,
					label_id:0,
				}
				this.$ajax.get(this.$api.apply.get_figure,params).then(res=>{
					if(res.status==1){
						this.figureData = res.data.figureData;
						this.figureGradeData = res.data.figureGradeData.gradeData[0];
						this.score = this.figureGradeData.grade_score;
						 this.animateStart("animate");
						this.savecanvas(1,this.figureData.figure_user_photo+'?timeStamp='+new Date(),234,306);
						this.share();
					}
				}).catch(err=>{
					console.log(err);
				})
			}
		},
		beforeMount() {},
		mounted() {
			this.animateBeFore();
			this.getFigure();

		},
		updated() {},
	}
</script>

