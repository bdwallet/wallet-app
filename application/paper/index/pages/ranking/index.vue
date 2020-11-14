<template>
	<div class="paper-ranking" :class="{'night':!industry}">
		<div class="ranking-main">
			<div class="bg" v-if='industry'>
				<div class="bg-moon"></div>
				<div class="sprites-light-bird"></div>
				<div class="sprites-cloud1"></div>
				<div class="sprites-cloud2"></div>
				<div class="sprites-cloud3"></div>
			</div>
			<div class="bg" v-if='!industry'>
				<div class="sprites-wirefram"></div>
				<div class="sprites-moon1"></div>
				<div class="sprites-dark-bird1"></div>
				<div class="sprites-dark-bird2"></div>
			</div>
			<div :class="industry?'sprites-share-knives1':'sprites-share-knives3'" @click="jumpto(industry?3:2)"></div>
			<div class="sprites-share-knives2" @click="$router.push({path:'/archives'})"></div>
			<div class="wrap">
				<img class="rankingTop1" ref="rankingTop"  :src="`${$assets['paperRankingTop'+ (industry?'1':'2')]}`" alt="">
				<ul>
					<li v-for="(item,index) in figureData"  :data-index="index" v-if="item.length">
						 <div class="photo-frame" :style="{'backgroundImage': 'url('+`${$assets[(index==0?'paperRankingWindow':(index==1?'paperRankingWindows':'paperRankingBigWindows'))+ (industry?'1':'2')]}`+')'}"></div>  
						<div v-if="(index-1)%3==0" class="rankingMin" :style="{'backgroundImage': 'url('+`${$assets['paperRankingMin'+ (industry?'1':'2')]}`+')'}"></div>
						<div class="line-through" :style="{'backgroundImage': 'url('+`${$assets['paperRankingLine'+ (industry?'1':'2')]}`+')'}"></div>
						<div class="character">
							<div class="character-list" @click="gohome(itemchara)" v-for="(itemchara,insetIndex) in item" v-if="itemchara.figure_user_name||figureData.length<5">
								<div class="sort" :class="'sprites-ranking-sort'+(industry?'2':'1')" v-if="itemchara.index>=3" >{{+itemchara.index+1}}</div>
								<img class="figure_user_photo" v-if="itemchara.figure_user_name" :src="itemchara.figure_user_photo?itemchara.figure_user_photo:''">
								<div class="award" v-if="itemchara.figure_user_name" :class="awardClass(index,insetIndex)"></div>
								<div class="star" >{{itemchara.figure_user_name?'可信度：'+itemchara.figure_grade+'星':''}}</div>
								<div class="office">{{itemchara.figure_user_name}} <span v-if="itemchara.figure_default_user_job" style="position: relative;top: -2px;">|</span> {{itemchara.figure_default_user_job}}</div>
								<div class="call-btn" :class="industry?'active':''" @click.stop="itemchara.figure_user_name?$router.push({path:`/write/${itemchara.figure_id}`}):'return false;'">{{itemchara.figure_user_name?'提供情报':''}}</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
			<div class="bottombg" :style="{'backgroundImage': 'url('+`${$assets['paperRankingBottomBg'+ (industry?'1':'2')]}`+')'}"></div>
			<div class="bottom" v-show="!loading">
				<div class="beer" :style="{'backgroundImage': 'url('+`${$assets['paperRankingBottom'+ (industry?'1':'2')]}`+')'}"></div>
			</div>
		</div>
	</div>
</template>

<script>
	const name = 'ranking';
	//order:2 正序 3:逆序
	export default {
		name,
		components: {
		},
		data() {
			return {
				figureData:[],
				loading:true,
			}
		},
		computed: {
			industry(){
				return this.$route.params.type==2;//2.实业家 3.镰刀榜
			}
		},
		watch:{
			industry(){
				if(this.$route.params.type) this.getFiguerList();
			}
		},
		methods: {
			awardClass(out,inset){
				let award = '';
				if(out==0&&inset==0){
					//第一名
					award = this.industry?'sprites-medal1':'sprites-hook2';
				}else if(out==1&&inset==0){
					//第二名
					award = this.industry?'sprites-medal2':'sprites-hook4';
				}else if(out==1&&inset==1){
					//第三名
					award = this.industry?'sprites-medal3':'sprites-hook3';
				}else{
					//第四名以后
					award = this.industry?'sprites-medal4':'sprites-hook1';
				}
				return award;
			},
			jumpto(type){
				this.$router.push({
					path: `/ranking/${type}`
				})
			},
			getFiguerList(){
				let params = {
					open_id:this.$store.getters.userInfo.user_openid,
					current_page: 1,
					page_size: 100,
					order:this.$route.params.type,
				}
				this.$ajax.get(this.$api.apply.get_figure_list,params).then(res=>{
					if(res.status==1){
						let outArray = [];
						res.data.figureData.forEach((item, index) => {
							if(index){
								outArray[parseInt(index/2)+1] = [];
								item.index = index;
								outArray[parseInt((index+1)/2)][(index?(index-1)%2:index)] = item;
							}else if(index==0){
								outArray[0] = [];
								item.index = index;
								outArray[0][0] = item;
							}
						})
						this.figureData = outArray;
					}else if(res.status==2){
						//无数据加载 默认显示方式
						this.figureData = [[[]],[[],[]],[[],[]]];
					}
					this.share();
					this.loading = false;
					setTimeout(()=>{
						this.toTop(this.$refs.rankingTop.height-65);
					},500);
				}).catch(err=>{
					this.$dialog.tip({
						type: 'other',
						content: err.message,
					})
				})
			},
			toTop(scrollTop){
				let step = (scrollTop)/30; //每步的距离
				let maxscrolltop = document.getElementsByClassName('paper-ranking')[0].offsetHeight - document.body.offsetHeight;
				(function jump(){
						let scroll = document.getElementsByClassName('paper')[0].scrollTop;
						if(scroll < scrollTop&& maxscrolltop>scrollTop){
							document.getElementsByClassName('paper')[0].scrollTop = scroll+step;
							setTimeout(jump,10);
						}else{
							document.getElementsByClassName('paper')[0].scrollTop = scrollTop;
						}
					})();
			},
			share(){
				let href = location.href;
				let wxShare = new WxShare(this.$route, {
					href: browser == "IOS" ? this.$store.getters.href : href,
					imgUrl: this.$global.shareImg,
					title: this.industry?'良心指数爆表,看看谁是币圈实干家':'割韭菜哪家强，你心目中的韭菜大佬上榜了吗？',
					desc: this.$global.shareDesc,
					link: `${this.$global.home}?link=${this.$route.path}`,
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
			},
			gohome(obj){
					this.$router.push({
						path: `/user/${obj.figure_id}/home`,
						query: {
							name: obj.figure_user_name,
							avatar: obj.figure_user_photo,
							score: obj.figure_grade
						}
					});
			}
		},
		beforeMount() {},
		mounted() {
			this.getFiguerList();
		},
		updated() {
			
		},
	}
</script>

<style src="./style" lang="less">

</style>
