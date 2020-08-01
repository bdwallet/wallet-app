<template>
	<div class="paper-write">
    <div class="content">
    	<div class="userinfo">
    		<div class="user_photo">
    			<img v-if="figureData.figure_user_photo" :src="figureData.figure_user_photo+'?x-oss-process=image/resize,m_lfit,h_80,w_80'">
    		</div>
    		<div>
    			<div class="user_name">{{figureData.figure_user_name}}</div>
    			<div class="user_post">{{figureData.figure_default_user_job}}</div>
    		</div>
    	</div>
    	<div class="write-wrap">
    		<div class="star-exponent">
    			<div class="star-title">可信度</div>
    			<div class="marking">
    				<div class="markstar" :class="[item<=score ? 'sprites-light-star':'sprites-dark-star']" @click="marking(item)" v-for="item in [1,2,3,4,5,6,7,8,9,10]"></div>
    			</div>
    		</div>
    		<div class="label">
    			<div class="label-title">贴标签</div>
    			<ul>
    				<li v-for="(item,index) in labelData" @click="selectLabel(item,index)" :data-label_type="item.label_type" v-if="showLabel(item)" :class="item.active?'active':''" >{{item.label_name}}</li>
    				<li v-if="score>=8||score<=3" style="visibility: hidden;"></li>
    			</ul>
    		</div>
    		<div class="edit-area">
    			<textarea placeholder="请写下您对Ta的评价，20-500字即可。" v-model="content" spellcheck="false" ></textarea>
    			<div class="edit-bottom">
	    			<div class="anony" @click="anony=!anony">
	    					<i class="iconfont" :class="anony?'icon-shixin-queren':'icon-xianxing-queren'"></i>
	    					 隐姓埋名
	    			</div>
	    			<div class="content-num">
	    				<span :style="{'color':(contentNum>=500)?'#ea1d38':''}">{{contentNum}}</span> / 500
	    			</div>
	    		</div>
    		</div>
				<div class="submit" :class="submitStatus?'sprites-orange-btn3':'sprites-blue-btn3'" @click="submit">
					{{submitStatus?'发送给黑钻评级':'我要提供情报'}}
				</div>
    	</div>
    </div>
    
	</div>
</template>

<script>
	const name = 'write';
	//计时器
  let timeOut = null;
	/****用户输入文字字数计算方法******
	 **（英文、字母两个字符算1个字；
	 **中文一个字符算1个字。
	 **连续多个空格只算1个字，
	 **连续多行换行符只算1个字）*/
	String.prototype.gblen = function() {
		let __len = 0;
		for (let i = 0; i < this.length; i++) {
			if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
				__len += 1;
			} else {
				__len += 0.5;
			}
		}
		return Math.ceil(__len);
	}
	export default {
		name,
		components: {
		},
		data() {
			return {
				content:'',//提交内容
				score: 0,//打分
				labelData:[],//获取标签列表
				labelIds:[],//提交的标签id数组
				anony: false,//是否匿名 true:匿名 false:实名
				figureData:{},
			}
		},
		computed: {
			//当前输入文字字数
			contentNum() {
				return this.replaceContent(this.content).gblen();
			},
			submitStatus(){
				//是否满足可提交条件
				return this.contentNum>=20&&this.contentNum<=500&&this.score!=0&&this.labelIds.length>0&&this.labelIds.length<=3;
			},
		},
		methods: {
			marking(score){
				if(!(this.score<=3&&score<=3||this.score>=8&&score>=8||(3<this.score&&this.score<8&&3<score&&score<8))){
					this.labelIds = [];
					this.labelData.forEach((item,index)=>{
						item.active = false;
						this.$set(this.labelData,index,item);
					})
				}
				//动效
				let animate = ()=>{
          clearTimeout(timeOut);
          if(this.score == score) return;
          if(this.score < score) {
            this.score++;
          }else{
            this.score--;
          }
          settime();
        }
        let settime = ()=>{
          timeOut = setTimeout(animate, 40);
        };
        animate();
				//this.score = score;
			},	
			showLabel(item){
				let type = false;
				if(this.score<=3&&item.label_type==2){
					type = false
				}else if(this.score>=8&&item.label_type==3){
					type = false;
				}else if(this.score==0){
					type = false;
				}else{
					type = true;
				}
				return type;
			},
			//内容空格与回车处理函数(连续多个空格缩成1个空格；连续多行精简成1行) replace(/\n|\r\n/g,"<br>")
			replaceContent(content) {
				let regEx = /\n+|\r\n+/g;
				content = content.replace(regEx, '`');
				regEx = /\s+/g;
				content = content.replace(regEx, ' ');
				content = content.replace(/\`/g, '\n');
				return content;
			},
			selectLabel(item,index){
				if(this.labelIds.length==3&&(!item.active)){
					this.$dialog.tip({
							type: 'other',
							content: '最多只能选3个标签'
						});
					return false;
				}
				item.active = !item.active;
				this.$set(this.labelData,index,item);
				if(item.active){
					this.labelIds.push(item.label_id);
				}else{
					//过滤掉已选标签
					this.labelIds = this.labelIds.filter(itemfilter => itemfilter!=item.label_id);
				}
			},
			getFigure(){
				this.$ajax.get(this.$api.apply.get_figure_label_list,{
					current_page:1,
					page_size:10,
					figure_id:this.$route.params.id,
				}).then(res=>{
					this.labelData = res.data.label_data.labelData;
					this.figureData = res.data.figure_data;
					this.share();
				})
			},
			submit(){
					if(this.$store.getters.userInfo.user_is_attention != 1){
						this.$store.commit('changeShowWxcode', {status:true});
						return false;
					}
					if (!this.submitStatus){
						let errtxt = '';
						if(this.score==0&&this.labelIds.length==0&&this.contentNum==0){
							errtxt = ' 还没提供情报就想领悬赏,不合适吧!';
						}else if(this.score==0){
							errtxt = '信誉有没有全跟分数走,赶紧打个分先!';
						}else if(this.labelIds.length==0){
							errtxt = '标签贴一贴,是好是坏好分辨';
						}else if(this.labelIds.length<=0||this.labelIds.length>3){
							errtxt = '最多只能选3个标签';
						}else if(this.contentNum==0){
							errtxt = '写点有价值的情报再来领赏';
						}else if(this.contentNum<20||this.contentNum>500){
							errtxt = '字数需在20-500之间';
						}
						this.$dialog.tip({
							type: 'other',
							content: errtxt
						});
						return false;
					}
				let params = {
					open_id: this.$store.getters.userInfo.user_openid || 'olKD-0zwEkjDmVx16Om6YJep_OAY',//userid 10959 //olKD-0xiZnRaTv0RNPOPVgFW_uVg
					figure_id:this.$route.params.id,
					grade_content: this.content,
					grade_score:this.score,
					grade_type:this.anony?1:0,//true 匿名
					label_ids:this.labelIds,
				}
				this.$ajax.post(this.$api.apply.save_figure_grade,params).then(res=>{
					if(res.status==1){
							this.$dialog.tip({
								type: 'other',
								content: res.message,
							}).then(res=>{
								this.$router.replace(`/share/${this.$route.params.id+'/'+this.$store.getters.userInfo.user_id}`)
							});
					}else{
						this.$dialog.tip({
							type: 'other',
							content: data.message,
						});
					}
				}).catch(err=>{
					this.$dialog.tip({
							type: 'other',
							content: err.message,
						}).then(res=>{
							this.$router.replace('/archives');
						})
				})
			},
			share(){
					let href = location.href;
					let shareobj = this.$global.getShareTxt(this.figureData.figure_user_name,this.figureData.figure_grade);
					let wxShare = new WxShare(this.$route, {
						href: browser == "IOS" ? this.$store.getters.href : href,
						imgUrl: this.figureData.figure_user_photo,
						title: shareobj.shareTitle,
						desc: shareobj.sharedesc,
						link: `${this.$global.home}?link=/user/${this.$route.params.id}/home`,
						circleFunction() { //分享朋友圈成功回调
							//alert("分享朋友圈成功！");
						},
						friendFunction() { //分享给朋友成功回调
							//alert("分享给好友成功！");
						},
						errorFunction(res) { //config配置失败回调
							console.log("wxShare config error",res);
						}
					});
			}
		},
		beforeMount() {},
		mounted() {
			this.getFigure();
		},
		updated() {},
	}
</script>

<style lang="less" src="./style.less"></style>
