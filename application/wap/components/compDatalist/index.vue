<template>
	<div class="comp-data-list">
		<comp-scroll v-if="!(dataList.length == 0 && !loading)" ref="scroller" :needscroll='needscroll' :on-refresh="OnRefresh" :on-infinite="OnInfinite" @getScrollTop="SetScrollTop">
			<!-- scene==6为咨询等 scene==5&&type==4为项目详情页的外评 -->
			<!-- <ul v-if="scene==6 || (scene==5&&type==4)">
                <li v-for="(d,index) in dataList" :key="d">
				    <comp-dataitem-zixun :data="d" :index="index" />
                </li>
			</ul>
			<ul v-else-if="[1,4,5].includes(+scene)">
                <li v-for="(d,index) in dataList" :key="d">
				    <comp-dataitem-zixun v-if="[3].includes(+d.type)" :data="d" :index="index" />
				    <comp-dataitem-pingji v-else :data="d" :index="index" />
                </li>
			</ul> -->
			<ul>
                <li v-for="(d,index) in dataList" :key="d">
				    <comp-dataitem-zixun v-if="d.type==3" :data="d" :index="index" />
				    <comp-dataitem-pingji v-else :data="d" :index="index" />
                </li>
			</ul>
			<ul v-else-if="scene == 7">
				<li v-for="(d,index) in dataList" :key="d">
					<comp-dataitem-licai :data="d" :index="index" />
				</li>
			</ul>
			<ul v-else-if="scene == 8">
				<li v-for="(d,index) in dataList" :key="d">
					<comp-dataitem-licai2 :data="d" :index="index" />
				</li>
			</ul>
			<div v-if="!more" slot="infinite" class="text-center">
				<span class="line-fast"></span>
				<span class="txt-fast">没有更多内容</span>
				<span class="line-fast"></span>
			</div>
		</comp-scroll>
		<comp-empty v-if="dataList.length == 0 && !loading" :mainHeight="mainHeight" :text="emptyTxt" />
		<comp-loadings v-if="loading"/>
	</div>
</template>

<script>
/**
 * @desc 列表组件
 * @scene 调用组件的场景 1：首页推荐、评级、爆料 4：个人主页列表 5：项目详情/交易所详情的评级列表
 * @data 用于从外部传入渲染数据，则组件本身不请求接口数据，下拉时，从第二页开始
 * @uid 用于查询指定用户的数据 个人主页
 * @itemId 用于查询指定项目数据 项目详情页、项目详情内的评级列表页
 * @emptyTxt 空页面时的提示方案
 * @needscroll 是否需要下拉加载
 *  **/
    import './style';
	import compScroll from "~components/compScroll";
	import compEmpty from '~components/compEmpty';
	import compDataitemPingji from "~components/compDataitem/pingji";
	import compDataitemZixun from "~components/compDataitem/zixun";
	import compDataitemLicai from "~components/compDataitem/licai";
	import compDataitemLicai2 from "~components/compDataitem/licai2";
	import compLoadings from "~components/compTools/compLoadings";
	export default {
		name: "compDataList",
		components: {
			compLoadings,
			compScroll,
			compEmpty,
			compDataitemPingji,
			compDataitemZixun,
			compDataitemLicai,
			compDataitemLicai2
		},
		props: {
			//调用接口的场景 1：首页推荐、评级、爆料 2：首页评级 3：首页爆料 4：个人主页列表 5：项目详情/交易所详情的评级
			scene:{
				default: 1,
			},
			// 个人主页TAB值 0：全部 1:评级项的全部 2：爆料 3：评级项的项目评级 4：评级项的交易所评级 5：公告 6：热榜/精选评级列表 ...
			// 列表类型  1 交易所评级 2 评级 3爆料

			// scene:1 => 0：推荐 1：评级 2：爆料
			// scene:8 => 0：全部 1：已下单 2：计息中 3：已回款
            type: 0,
            //父级直接给出渲染的数据
			data: {
				default: []
			},
			showOrder: { //控制排序TAB状态 0：不显示 1：最新 2：最热
				default: 0
			},
			//分页大小
			size: {
				default: 20
			},
			uid: {
				default: 0
			},
			itemId: {
				default: 0
			},
			emptyTxt: {
				default: '您还没有评级过任何项目'
			},
			mainHeight: {
				default: "calc(100vh - 10.5rem)"
			},
			keepState: {
				default: true
			},
			needscroll: {
				default: true
			}
		},
		data() {
			return {
				dataList: [], //评级列表数据窗口
				topList:[], //置顶数据列表容器，用于列表去重
				page: 1, //当前分页
				more: true, //是否还有未加载完的数据
				loading: true, //数据加载状态
				scrollTop: 0, //记录下拉位置，实现页面跳转后回到该页面的滚动定位
				reqStatus: true,
				hastopic: false, //是否有讨论话题
			}
        },
        computed:{
            //检测是否需要刷新页面，由路由地址内的参数refresh==1实现
            isRefresh(){
                return this.$route.query.refresh == 1;
			},
            emptyText() {
                let text = '';
                switch (+this.type) {
                    case 6:
                        text = '暂无黑钻评级出品'
                        break;
                    case 7:
                        text = '暂无新闻资讯'
                        break;
                    case 8:
                        text = '暂无路演直播'
                        break;
                    case 9:
                        text = '暂无空投活动'
                        break;
                    // case 10:
                    //     text = '暂无线下会议交流'
                    //     break;
                    case 11:
                        text = '暂无常见问题'
                        break;
                    case 12:
                        text = '暂无功能宝典'
                        break;
                    case 13:
                        text = '暂无产品进度'
                        break;
                    case 14:
                    case 15:
                        text = '暂无数据'
                        break;
                    default:
                        text = '暂无'
                        break;
                }
                return text;
            }
        },
		watch: {
			'data' (val, old) {
				if (val && val !== old) {
					this.dataList = val;
				}
            }
		},
		methods: {
			//获取数据列表 handle：获取数据后回调 isrefresh:是否重置数据 type：排序方式(1：最新 2：最热)
			GetDataList(handle, isrefresh, type) { //从外部传入数据，不再拉取
				if (!this.reqStatus) {
					handle && handle();
					return false;
				}
				if (isrefresh) {
					this.page = 1;
					this.more = true;
				}
				this.reqStatus = false;
				this.loading = true;
				let params = {
					scene: this.scene,
					type: this.type,
					page: this.page,
					size: this.size,
					order: type ? type : (this.showOrder ? this.showOrder : 1),
				};
				if(this.uid > 0)
					params.user_id = this.uid;
				if(this.itemId > 0)
					params.item_id = this.itemId;
				this.$ajax.get(this.$api.apply.list_get, params).then(res => {
					//grade_recommend 1.匿名
					let repeat_count = 0; //记录删除的重复数据数量，解决去重后，数据不足page_size长度出错问题
					this.loading = false;
					this.reqStatus = true;
					if (res.status == 1) {
						let d = res.data;
						handle && handle();
						if(this.page == 1){ //第一页返回全部总数
							this.$emit('getTotal', d.total); //项目主页article 中全部评级
						}
						// 去除重复列表数据 用于付费置顶列表的去重
						if((d.top_data && d.top_data.length > 0) || this.topList.length > 0) {
							let td = d.top_data; //缓存需要去重的数据
							this.topList = Object.assign([],td); //处理引用类型指针问题
							for (let i = 0; i < td.length; i++){
								for (let k = 0; k < d.list.length; k++) {
									if(td[i].id == d.list[k].id) {
										repeat_count++;
										this.topList.splice(i,1); //删除已去重的数据，减少性能消耗
										d.list.splice(k,1);
									}
								}
							}
						}
						if (isrefresh) {
							if(d.top_data && d.top_data.length > 0){
								this.dataList = d.top_data.concat(d.list);
							} else {
								this.dataList = d.list;
							}
						} else {
							if (d.top_data && d.top_data.length > 0){
								this.dataList = this.dataList.concat(d.top_data).concat(d.list);
							} else {
								this.dataList = this.dataList.concat(d.list);
							}
						}
						if (this.page == 1 && d.discuss_data && (this.$route.name == 'recommend' || (this.$route.name == 'user-homepage' && this.$route.params.uid == 20))) {
							this.dataList = d.discuss_data.concat(this.dataList);
							// banner数据，运营位数据
							this.$emit('getdata', d.banner_data, d.operation_data);
							this.hastopic = d.discuss_data.length;
						}
						this.more = d.list.length + repeat_count >= this.size; //repeat_count 解决去重后，数据不足page_size长度出错问题
						this.page++;
					} else {
						handle && handle();
						this.more = false;
					}
				}).catch(err => {
					this.loading = false;
					handle && handle();
				});
			},
			//下拉刷新处理函数
			OnRefresh(done) {
				this.GetDataList(done, true);
			},
			//上拉加载处理函数
			OnInfinite(done) {
				if (this.more) {
					this.GetDataList(done);
				} else {
					done();
				}
            },
            //重新获取数据 从第一页开始 用于父级调用
            Reload(){
				this.GetDataList(null, true);
				this.scrollTop = 0;
            },
			SetScrollTop(value) {
				this.scrollTop = value;
			},
		},
		//页面创建后触发
		mounted() {
			// if (!this.needscroll) return false;
			if(this.data && this.data.length > 0){ //从外部传入数据，不需要再拉取
				this.dataList = this.data;
				this.page = 2;
			} else
				this.GetDataList();
		},
		activated() {
			if (this.isRefresh) {
				this.Reload();
			}
			if (this.keepState) {
				document.body.scrollTop = this.scrollTop;
				document.documentElement.scrollTop = this.scrollTop;
			}
		},
	}
</script>
