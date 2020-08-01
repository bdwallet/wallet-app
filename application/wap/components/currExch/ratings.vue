<template>
	<div class="ratings">
		<div class="wrap showall" @click="GotoList" v-if="count>=5">
			查看全部评级({{count}})
		</div>
		<div class="wrap otherPro" v-if="DrandData && DrandData.length > 0">
			<div class="title">浏览该{{scene == 1 ? '交易所' : '项目'}}评级的人也在看</div>
			<div class="recommend">
				<ul>
					<li class="recommend-list" v-for="item in DrandData" :key="item" @click="gotoProInfo(item.id,item.urrency || item.cn)">
					    <img :src="item.logo">
					    <div class="alpha">{{item.urrency||item.cn}}</div>
					    <div class="score">{{item.score}}分</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
/**
 * @desc 项目详情页推荐列表组件
 * @scene 组件类型 1：交易所 2：项目
 * @count 该项目的评级总数
 *  **/
	export default {
		name: "article-ratings",
		data() {
			return {
				DrandData: [], //推荐数据列表
			}
		},
		props: {
			//1：交易所评级 2：项目评级
			scene:{
				default: 1,
			},
			//评级总数
			count: {
				default:0,
			},
		},
		methods:{
			GotoList(){
				let query ={
					pro: this.$route.query.pro,
					count: this.count,
				};
				if(this.scene == 1) {
					query = {
						pro: this.$route.query.pro,
						name: "全部",
						id: 0,
						isExchange: 1
					}
				}
				this.$router.push({
					path: `/project/${this.scene}/${this.$route.params.itemid}`,
					query
				});
			},
			//跳转到项目详情页
			gotoProInfo(id,cn) {
				let query = {
					pro: cn
				};
				if(this.scene == 1) this.$router.replace({path: `/exchange/${id}`, query});
				else this.$router.replace({path: `/article/${id}`, query});
				this.GetRandList();
				setTimeout(() => {
					this.$emit('update',id);
				}, 0);
			},
			GetRandList() {
				Ajax.get(Api.apply.rand_item,{
					id:this.$route.params.itemid,
					scene:this.scene
				}).then(res => {
					this.DrandData = res.data;
				});
			}
		},
		// mounted(){
		// 	this.GetRandList()
		// },
		activated(){
			this.GetRandList()
		}
	}
</script>
