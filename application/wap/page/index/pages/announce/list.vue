<template>
    <div class="dropdown announce-list">
        <!-- 项目方列表 -->
		<comp-searchtool @click.native="$router.push({path:`/search/2`,query: {comefrom: 'announce'}})" />
		<div class="rank" >
			<div v-if="checked==0">共{{totalNum}}个项目</div>
			<div v-else></div> <!-- 用于占位 -->
			<div class="checkbtn" :class="{'act':show}" @click="toggle">
				<div v-if="checked==0">全部</div>
				<div v-else-if="checked==1">已入驻</div>
				<div v-else-if="checked==2">未入驻</div>
				<i class="icon icon-shouhui"></i>
			</div>
			<transition name="checkbox">
				<ul class="checkbox" v-if="show">
					<li :class="{'act':checked==0}" @click="toggle(0)">全部</li>
					<li :class="{'act':checked==1}" @click="toggle(1)">已入驻</li>
					<li :class="{'act':checked==2}" @click="toggle(2)">未入驻</li>
				</ul>
			</transition>
		</div>
        <div class="pro-list">
            <comp-scroll class="page-content" ref="scroller" :on-refresh="OnRefresh" :on-infinite="OnInfinite">
                <ul class="container" v-if="dt_housed_data.length">
                    <li v-for="item in dt_housed_data" :key="item" @click="$router.push(`/article/${item.item_id}?pro=${item.item_urrency_abbreviation}`)">
                        <div class="info">
                            <div class="projectlog">
                                <img :src="(item.item_logo||$assets.logo)+'?x-oss-process=image/resize,m_lfit,h_80,w_80'">
                                <div class="name">
                                    <h3>{{item.item_urrency_abbreviation}}</h3>
                                    <p v-if="item.item_cn_name">{{item.item_cn_name.substr(0,5)}}<span v-if="item.item_cn_name.length > 5">...</span></p>
                                    <p v-else>{{item.item_en_name.substr(0,10)}}<span v-if="item.item_en_name.length > 10">...</span></p>
                                </div>
                            </div>
                            <div class="score" style="text-align: center;">
                                <h3 v-if="item.item_user_num>=10">{{item.item_grade}}分</h3>
                                <h3 v-else>—</h3>
                                <p v-if="item.item_user_num>=10">{{item.item_user_num}}人评过</p>
                                <p v-else-if="item.item_user_num>0&&item.item_user_num<10">仅{{item.item_user_num}}人评过</p>
                                <p v-else-if="item.item_user_num==0">还没人评过</p>
                                <p v-else>{{item.item_user_num}}</p>
                            </div>
                            <div class="enter" :class="{'active': item.item_located_user_id && item.item_located_user_id != '0'}">
                                <!-- 是否入驻 -->
                                {{item.item_located_user_id && item.item_located_user_id != '0'? '已入驻' : '未入驻'}}
                            </div>
                        </div>
                    </li>
                </ul>
            </comp-scroll>
        </div>
        <transition name="backdrop">
            <div class="backdrop" v-if="show" @click="show=!show"></div>
        </transition>
    </div>
</template>

<script>
    import compSearchtool from '~components/compSearchtool';
    import localStore from '~script/localStore';
    import compScroll from "~components/compScroll";

    export default {
        name: 'announce-list',
        components: {
            compSearchtool,
            compScroll
        },
        data() {
            return {
                totalNum: 0, //项目总数
                checked: 1, //切换筛选状态 0: 全部  1：已入驻  2：未入驻
                show:0, //显示遮罩层
                dt_more: 1,
                dt_current_page:1,
                dt_page_size: 20,

                dt_housed_data: [], //所有项目方数据
            }
        },
        methods: {
            //计算价格、市值
			getPrice(obj) {
				let r = '';
				if (this.orderType == 4) {
					let integer = obj.market_cap.replace(/\.\d*/, '');
					if (integer.length >= 9) { //亿为单位
						r = '￥' + integer.slice(0, integer.length - 8) + '.' + integer.slice(integer.length - 8, integer.length - 6) + '亿';
					} else if (integer.length >= 5) { //万为单位
						r = '￥' + integer.slice(0, integer.length - 4) + '.' + integer.slice(integer.length - 4, integer.length - 2) + '万';
					} else if (integer > 0) { //保留两位小数
						r = `￥${parseFloat(obj.market_cap).toFixed(2)}`;
					} else { //保留6位小数
						r = `￥${parseFloat(obj.market_cap).toFixed(6)}`;
					}
				} else {
					r = `¥${parseInt(obj.cny_price) > 0 ? parseFloat(obj.cny_price).toFixed(2) : parseFloat(obj.cny_price).toFixed(6)}`;
				}
				return r;
			},
            toggle(type){
                this.show = !this.show;
                if(type >= 0){
                    this.checked = type;
                    localStore.set(Global.localStores.selectChecked,this.checked,3600*24*30);
                    this.getData(0,1);
                }
            },
            getData(handle, isrefresh) {
                if(isrefresh){
                    this.dt_current_page = 1;
                    this.dt_more = 1;
                }
                let params = {
                    page: this.dt_current_page,
                    pagesize: this.dt_page_size,
                    order:  1, //排序 1入驻时间
                    located: this.checked  //0全部 1已入驻 2未入驻
                }
                this.$ajax.post(this.$api.apply.itemnoti_located_list, params).then(res => {
                    if(res.status == 1){
                        let d = res.data;
                        if(isrefresh){
                            this.dt_housed_data = d.data;
                        }else{
                            this.dt_housed_data = this.dt_housed_data.concat(d.data);
                        }
                        this.totalNum = d.total;
                        this.dt_more = d.data.length >= this.dt_page_size ? 1 : 0;
                        handle && handle();
                    }else{
                        this.$dialog.alert(res.message);
                    }
                }).catch(err => {
                    this.$dialog.alert(err.message);
                    handle && handle();
                })
            },
            OnInfinite(done) {
				// 上拉加载
				if (this.dt_more) {
					this.dt_current_page++;
					this.getData(done);
				} else {
					done();
				}
            },
            OnRefresh(done) {
				// 下拉刷新
				this.getData(done, 1);
			},
        },
        mounted() {
            this.getData();
        },
    }
</script>

<style lang="less" scoped>
    @import "../../../../assets/css/config";
    .pro-list {
        padding-top: 4.5rem;
        // min-height: 100vh;
        .groupAlp{
            color: @color-dec;
            font-size: 0.5rem;
            line-height: 1.1rem;
            background-color: @bgcolor-body;
            padding: 0 0.75rem;
        }
        ul{
            li{
                border-bottom: 0.025rem solid @color-border-item;
                .info{
                    display: flex;
                    height: 3.65rem;
                    align-items: center;
                    h3{
                        color: @color-title;
                        font-size: 0.8rem;
                    }
                    p{
                        font-size: .6rem;
                        &.up{
                            color:#FF7270;
                        }
                        &.down{
                            color:#33CF7E;
                        }
                    }
                    .projectlog{
                        display: flex;
                        width: 6.8rem;
                        align-items: center;
                        img{
                            width: 2.0rem;
                            height: 2.0rem;
                        }
                        .name{
                            margin-left: .75rem;
                            .nowrap;
                        }
                    }
                    
                    .price{
                        flex:1;
                        min-width: 3.0rem;
                        margin-left:.7rem;
                    }
                    .score{
                        flex: 1;
                        text-align: right;
                        h3{
                            color: @color-num;
                            font-weight: @font-weight-bold;
                        }
                    }
                    .enter{
                        flex: 1;
                        text-align: right;
                        font-size: .65rem;
                        &.active {
                            color: @color-link;
                        }
                    }
                }
            }
        }
        
        .nowrap{
            white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        }
        div{
            -webkit-tap-highlight-color: rgba(255, 255, 255, 0); 
        }
    }
    
</style>
