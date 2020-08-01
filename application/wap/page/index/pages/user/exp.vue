<template>
	<div class="user-exp">
		<div class="detail" v-if="!loading||detailData.length>0">
			<!-- <div class="name-box">
				<div class="sort-name container">经验明细</div>
			</div> -->
			<div class="com-datalist">
				<comp-scroll class="page-content" :on-refresh="onRefresh" :on-infinite="onInfinite" v-if="detailData">
					<ul class="ul">
						<li v-for="item in detailData" :key="item">
							<div class="main">
								<div class="title">
									<span class="name">{{item.exp_desc}}</span>
									<span class="num">+{{item.exp_num}}</span>
								</div>
								<div class="time">{{item.exp_create_time}}</div>
							</div>
						</li>
					</ul>
				</comp-scroll>
			</div>
		</div>
		<div v-if="loading&&detailData.length <= 0" class="wallet-empty">
			<comp-empty main-height='calc(100vh - 2.5rem)' text="您还未获取过经验" />
		</div>
	</div>
</template>
<script>
	import compScroll from "~components/compScroll";
	import compEmpty from '~components/compEmpty';
	let page_size = 30;
	export default {
		name: "user-exp",
		components: {
			compEmpty,
			compScroll,
		},
		data() {
			return {
				detailData: [],
				more: true,
				loading: false,
				current_page: 1
			}
		},
		computed: {
			userInfo() {
				return this.$store.getters.userInfo;
			}
		},
		methods: {
			//获取明细数据
			getDate(done, isrefresh) {
				this.$ajax.post(this.$api.apply.get_exp_list, {
					current_page: this.current_page,
					intrgral_type: 0,
					page_size: page_size
				}).then((res) => {
					if (res.status == 1) {
						this.current_page++;
						if (isrefresh) {
							this.detailData = res.data;
						} else {
							this.detailData = this.detailData.concat(res.data);
						}
						this.more = res.data.length == page_size;
					} else if (res.status == 2) {
						this.more = false;
					} else {
						this.more = false
					}
					this.loading = true;
					done && done()
				}).catch(err => {
					this.loading = true;
					done && done();
					alert(err.message);
				})
			},
			onRefresh(done) {
				//上拉处理
				this.current_page = 1;
				this.more = true;
				this.getDate(done, true);
			},
			onInfinite(done) {
				if (this.more) {
					this.getDate(done)
				} else {
					done();
				}
			}
		},
		mounted() {
			//-1 审核未通过  -2 删除  1审核通过
			this.getDate();
			Share.Ready();
		}
	}
</script>