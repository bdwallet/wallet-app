<template>
	<div class="comp-project-list">
		<!-- 首发项目列表 START -->
		<div class="starting" v-if="Dextralist && Dextralist.length>0">
			<img class="extra" :src="scene==1?$assets.selectExtra2:$assets.selectExtra">
			<ul>
				<li v-for="(o,i) in Dextralist" :key="o" @click="ProClick(o)">
					<div class="extra-info">
						<img :src="o.logo+'?x-oss-process=image/resize,m_lfit,h_160,w_160'">
						<div class="name">
							<div class="mian">{{scene==2?o.urrency:o.cn}}</div><!-- 交易所只显示中文名 -->
							<div class="desc" v-if="scene==2&&o.cn">{{o.cn}}</div>
						</div>
					</div>
					<comp-timetool :value="o.issue_time" :extraindex="i" class="timer" @Hideitem="Hideitem" />
				</li>
			</ul>
		</div>
		<!-- 首发项目列表 END -->
		<div class="title-bar" v-show="$route.name=='list'">
			<p class="name">名称</p>
			<p v-if="order==4" class="price">总市值/涨跌</p>
			<p v-else class="price">最新价/涨跌</p>
			<p class="score">评分</p>
		</div>
		<comp-scroll class="page-content" ref="scroller" :on-infinite="onInfinite" @getScrollTop="setScrollTop">
			<div slot="refresh"></div>
			<div>
				<div v-for="(outitem,key) in Ddatalist" :key="outitem">
					<div class="groupAlp" v-if="order==3">{{key}}</div>
					<ul class="container" v-if="outitem.length">
						<li v-for="(item,index) in outitem" :key="item" @click="ProClick(item)">
							<div class="info">
								<div class="ranking" v-if="scene == 1 && $route.name == 'prolist'" :class="[{'one': index == 0},{'two': index == 1},{'three': index == 2}]">{{index + 1}}<span v-if="index >2">.</span></div>
								<div class="projectlog">
									<img :src="(item.logo||$assets.logo)+'?x-oss-process=image/resize,m_lfit,h_80,w_80'">
									<div class="name">
										<h3>{{scene==2?item.urrency:item.cn}}</h3>
										<p v-if="scene==2&&item.cn">{{item.cn.substr(0,5)}}<span v-if="item.cn.length > 5">...</span></p>
										<p v-else-if="scene==2">{{item.en.substr(0,10)}}<span v-if="item.en.length > 10">...</span></p>
									</div>
								</div>
								<!-- 项目方搜索 不显示price -->
								<!-- <div v-if="comefrom!='announce'"> </div>-->
								<!-- 交易所显示热度 -->
								<div v-if="scene==1">
									<div class="hot" :class="HotCompute(item.hot)" v-if="item.hot">
										<i class="icon icon-redu"/><span>{{item.hot}}°</span>
									</div>
									<div class="hot" v-else>暂无</div>
								</div>
								<div v-else-if="scene==2">
									<div class="price" v-if="item.cny_price">
										<h3>{{GetPrice(item)}}</h3>
										<p v-if="item.price_change" :class="parseFloat(item.price_change) < 0 ? 'up' : 'down'"><span v-if="parseFloat(item.price_change) > 0">+</span>{{parseFloat(item.price_change).toFixed(2)}}%</p>
									</div>
									<div class="price" v-else>暂无</div>
								</div>
								<div class="score" :style="{'text-align': comefrom=='announce'? 'center':'right'}">
									<h3 v-if="item.score>0">{{item.score}}分</h3>
									<h3 v-else>—</h3>
									<p v-if="item.number>=10">{{item.number}}人评过</p>
									<p v-else-if="item.number>0&&item.number<10">仅{{item.number}}人评过</p>
									<p v-else-if="item.number==0">还没人评过</p>
									<p v-else>{{item.number}}</p>
								</div>
								<div class="enter"  v-if="comefrom=='announce'" :class="{'active': item.item_located_user_id && item.item_located_user_id != '0'}">
									<!-- 是否入驻 项目方搜索页才显示-->
									{{item.item_located_user_id && item.item_located_user_id != '0'? '已入驻' : '未入驻'}}
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div v-if="!more" slot="infinite" class="text-center">
				<span class="line-fast"></span>
				<span class="txt-fast">没有更多数据</span>
				<span class="line-fast"></span>
			</div>
		</comp-scroll>
	</div>
</template>
<script>
	import './style';
	import localStore from '~script/localStore';
	import compScroll from "~components/compScroll";
	import compTimetool from "~components/compTools/compTimetool";
	export default {
		name: 'project-list',
		components: {
			compScroll,
			compTimetool
		},
		data() {
			return {
				Dextralist: [], //首发项目列表
				Ddatalist: [], //所有项目列表
				Darr: [], //字母排序临时数据容器
				scrollTop: 0,
				more: true,
				current_page: 1,
				page_size: 20,
			}
		},
		props: {
			scene:{ //组件类型 1：交易所 2：项目
				default:1
			},
			data:{ //外部传入的需要渲染的数据 如：搜索页
				default:[]
			},
			order: { //排序方式 1：最新 2：评分 3：字母 4：市值
				default: 1
			},
			type: { //筛选方式 0：全部 1：未评过 2：可追评 3：已评过
				default: 0
			},
			comefrom: { //判断上页路由
				default: ''
			},
			keepState: { // 定位浏览历史
				default: true
			},
			keyword: {
				default: ''
			},
		},
		computed: {
			broke() {
				let b = this.$route.params.broke;
				if(b == undefined)
					b = 0;
				return b;
			}
		},
		watch:{
			"data"(val){ //监听外部传来的数据 进行渲染
				if(val)
					this.$set(this.Ddatalist, 0, val);
			}
		},
		methods: {
			// gotoRatingInfo(grade_id) {
			// 	this.$router.push({
			// 		path: `/detail/0/${grade_id}`,
			// 	});
			// },
			//项目点击事件
			ProClick(obj){
				//如果为搜索页，则记录搜索词
				this.SaveSearchWord();
				if(this.comefrom == 'select' || this.order == 3){
					this.Push(obj);
				}else
					this.goProject(obj);
			},
			//记录关键词
			SaveSearchWord() {
				if (this.$route.name == "search") {
					if (this.keyword != "") {
						this.$ajax.post(this.$api.apply.update_search, {
							search_word: this.keyword,
							search_type: 1
						});
						let sw = localStore.get(Global.localStores.searchWord);
						let word = [];
						if (sw) {
							word = eval(sw);
							word.unshift(this.keyword);
							word = Array.from(new Set(word));
							if (word.length > 10) {
								word = word.slice(0, 10)
							}
						} else {
							word.push(this.keyword)
						}
						localStore.set(Global.localStores.searchWord, word, 86400 * 30)
					}
				}
			},
			//发布处理，跳转至相应发布页
			Push(obj) {
				let path = {
					path: `/write/${this.broke}/${obj.id}`,
					query: {
						pro: obj.urrency,
					}
				};
				if(this.broke == 1){ // 爆料
					this.$router.push(path);
				} else {
					Service.CheckGrade(this.scene,obj.id).then(res => { //可发布
						if(res.data.grade_id > 0){ //有grade_id为追评，先跳转至详情页
							this.$router.push(`/detail/${this.scene==2?0:5}/${res.data.grade_id}`);
						} else { //无grade_id为发评级，跳转至发布页
							if(this.scene == 1) { //发布交易所评级
								path.path = `/writexch/${this.broke}/${obj.id}`;
								path.query.pro = obj.cn;
							}
							this.$router.push(path);
						}
					}).catch(res => { //不可发布
						let grade_id = res.data.grade_id
						if (res.data.status == 2) { //原因为未到追请时间
							this.$dialog.alert({
								title: '暂不可追评',
								content: '距上次发布内容未满100天，请耐心等待',
								btns: ['知道了']
							});
						} else if(res.data.status == 4) { //原因为前一条评级未通过审核
							this.$router.push(`/detail/${this.scene==2?0:5}/${res.data.grade_id}`);
						} else { //原因为等级未到5级
							this.$dialog.confirm({
								title: '您已评过该项目',
								content: 'LV5等级以上的超级评审员才可追评',
								btns: ['做任务升级', '好的']
							}).then((res) => {
								this.$router.replace('/user/task');
							})
						}
					});
				}
			},
			//跳转至详情页
			goProject(item) {
				let path = {
					path: `/article/${item.id}`,
					query: {
						pro: item.urrency,
					}
				};
				if(this.scene == 1){
					path.query.pro = item.cn;
					path.path = `/exchange/${item.id}`;
				}
				this.$router.push(path);
			},
			onInfinite(done) {
				if (this.more && this.current_page != 1) {
					this.GetList(done);
				} else {
					done();
				}
			},
			setScrollTop(value) {
				this.scrollTop = value;
			},
			//获取项目列表 isRefresh：是否为刷新
			GetList(done, isRefresh, istype, repeat) {
				if (isRefresh) {
					this.current_page = 1;
					this.Darr = [];
				}
				let params = {
					current_page: this.current_page,
					page_size: this.page_size,
					order: this.order, //排序方式 交易所查询（0：is_type传标签ID查询 1：与项目查询一至） 项目查询（1：最新 2：评分 3：字母 4：市值）
					// item: this.keyword, // 搜索页关键词
					is_type: istype==undefined ? this.type : istype,// 0：全部 1：未评过 2：可追评 3：已评过 或者为交易所标签ID
					scene:this.scene,
				};
				this.$ajax.get(this.$api.apply.get_list, params).then((res) => {
					if (res.status == 1) {
						if(repeat){ // 仅针对项目选择页 重置首发项目的缓存问题
							this.Dextralist = [];
						}
						if(res.data.first_item.length > 0){ // 后台接口仅返回一次该数据
							this.Dextralist = res.data.first_item;
						}
						if (this.current_page == 1) { // 只有第一次请求时向外抛出项目总数
							this.$emit('totalNum', res.data.total)
						}
						if (this.order == 3) {
							res.data.all_item.forEach((item, index) => {
								if(!this.Darr[item.initial]){
									this.Darr[item.initial] = [];
								}
								this.Darr[item.initial].push(item);
							});
							this.Ddatalist = Object.assign({}, this.Darr)
						} else {
							this.Darr = this.Darr.concat(res.data.all_item);
							this.$set(this.Ddatalist, 0, this.Darr)
						}
						this.more = res.data.all_item.length >= this.page_size;
						this.current_page++;
					}
					done && done(res.data.total);
				}).catch(err => {
					done && done();
				})
			},
			//计算价格、市值
			GetPrice(obj) {
				let r = '';
				if (this.order == 4) {
					let integer = obj.price.replace(/\.\d*/, '');
					if (integer.length >= 9) { //亿为单位
						r = '￥' + integer.slice(0, integer.length - 8) + '.' + integer.slice(integer.length - 8, integer.length - 6) + '亿';
					} else if (integer.length >= 5) { //万为单位
						r = '￥' + integer.slice(0, integer.length - 4) + '.' + integer.slice(integer.length - 4, integer.length - 2) + '万';
					} else if (integer > 0) { //保留两位小数
						r = `￥${parseFloat(obj.price).toFixed(2)}`;
					} else { //保留6位小数
						r = `￥${parseFloat(obj.price).toFixed(6)}`;
					}
				} else {
					r = `¥${parseInt(obj.cny_price) > 0 ? parseFloat(obj.cny_price).toFixed(2) : parseFloat(obj.cny_price).toFixed(6)}`;
				}
				return r;
			},
			//首发倒计时结束时，隐藏项目
			Hideitem(index) {
				this.Dextralist.splice(index, 1);
			},
        	//热度计算 返回样式类名
        	HotCompute(score){
				let cls = "";
				if(score > 100)
					cls = 'high';
				else if(score > 61)
					cls = 'mid';
				else if(score > 31)
					cls = 'low';
				return cls;
        	},
			//重新加载数据，从第一页开始，用于父级调用
			Reload(handle){
				document.body.scrollTop = 0;
				document.documentElement.scrollTop = 0;
				this.GetList(handle,1);
			}
		},
		mounted() {
			if(this.data && this.data.length > 0){
				this.$set(this.Ddatalist, 0, this.data);
			} else
				this.GetList();
		},
		activated() {
			if (this.keepState) {
				document.body.scrollTop = this.scrollTop;
				document.documentElement.scrollTop = this.scrollTop;
			}
		},
	}
</script>
