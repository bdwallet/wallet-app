<template>
    <div class="comp-buttons">
        <div v-show="$route.meta.submit" class="float-post-btn">
            <div v-show="isShowBtns" class="btns-pannel" @click="showBtns"></div>
            <div class="btns-box">
                <img class="img" @click.stop="showBtns" :src="$assets.proFloatBtn" />
                <div class="btns">
                    <div class="btn" v-for="item in btns" :key="item" @click.stop="clickEvent(item.clickEvent)" :style="{'transform':`scale(${btns_btn_scale})`,'top':`${item.icon_top}rem`}">
                        <div class="txt" :style="{'transform':`scale(${btns_txt_scale})`}">{{item.text}}</div>
                        <div :class="item.icon"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="float-download-btn" v-if="$global.isApp==0&&$route.meta.down" @click="Download">下载APP</div>
    </div>
</template>

<script>
    let timeout;
    export default {
        name: 'compFloatButton',
        data() {
            return {
                btns_btn_scale: 0,
                btns_txt_scale: 0,
                btns: [{
                    text: '项目评级',
                    icon: 'icon icon-CombinedShape',
                    icon_top: 0.75,
                    clickEvent: 0,
                },{
                    text: '交易所评级',
                    icon: 'icon icon-CombinedShape',
                    icon_top: 0.75,
                    clickEvent: 2,
                },{
                    text: '爆料',
                    icon: 'icon icon-Path1',
                    icon_top: 0.75,
                    clickEvent: 1,
                },{
                    text: '公告',
                    icon: 'icon icon-tongzhi',
                    icon_top: 0.75,
                    clickEvent: 3,
                }],
                isShowBtns: false,
            }
        },
        watch:{
            userInfo(){
                this.IsReCurit()
            }
        },
        computed: {
            havePro() {
                return this.$route.params.itemid;
            },
            userInfo() {
                return this.$store.getters.userInfo
            },
            isReCruit() {
                return this.userInfo && this.userInfo.user_located_item_id
            },
            bannedType() { //账号异常状态 1正常  -1冻结账号  -2禁言  -3不能获取奖励   -4答题
                return this.$store.getters.bannedType;
            }
        },
        methods: {
            //显示按钮点击事件
            showBtns() {
                if(this.bannedType && this.bannedType.indexOf(-2) != -1){ //禁言
                    this.$dialog.alert('很抱歉，您目前行为受限，无法进行相应操作。');
                    return;
                }
                clearTimeout(timeout);
                let time = 0,
                    top = 0.75;
                if (!this.isShowBtns) {
                    this.btns_btn_scale = 1;
                    this.btns.forEach((son, i) => {
                        clearTimeout(son.timeout);
                        son.timeout = setTimeout(() => {
                            son.icon_top = top - 3.4 * (i + 1);
                        }, time);
                        time += 100;
                    });
                    timeout = setTimeout(() => {
                        this.btns_txt_scale = 1;
                    }, time + 200);
                } else {
                    this.btns_txt_scale = 0;
                    time = 100;
                    this.btns.forEach((son, i) => {
                        clearTimeout(son.timeout);
                        son.timeout = setTimeout(() => {
                            son.icon_top = top;
                        }, time);
                        time += 100;
                    });
                    timeout = setTimeout(() => {
                        this.btns_btn_scale = 0;
                    }, time);
                }
                this.isShowBtns = !this.isShowBtns;
                let container = this.$parent.$el.querySelector(".main-box");
                let style = this.isShowBtns ? 'blur(5px)' : 'none';
                container.style.filter =
                container.style.webkitFilter = style;//兼容处理
            },

            //发布按钮点击事件
            clickEvent(type) { //type 0:项目评级 1:爆料 2：交易所评级 3：公告
                this.showBtns(); // 关闭浮动按钮
                Service.CheckLogin().then(() => {
                    Service.CheckBind().then(() => {
                        if (type == 0) { //点击发项目评级
                            Service.CheckLevel(3).then(() => {
                                if (this.havePro && this.$route.name == 'article') { // 判断是否已选择了发布的项目  //如果在交易所详情页点击发布项目评级，则跳转项目选择页
                                    this.checkGrade(2);
                                } else {
                                    this.$router.push("/select/2/0");
                                }
                            }).catch(() => { //不是超级评审员
                                this.$router.push("/user/application");
                            });
                        } else if (type == 1) { //点击发爆料
                            if (this.havePro && this.$route.name == 'article'){
                                this.$router.push({
                                    path: `/write/1/${this.$route.params.itemid}`,
                                    query: {
                                        pro: this.$route.query.pro,
                                    }
                                });
                            } else {
                                this.$router.push("/select/2/1");
                            }
                        } else if(type == 2){ //发布交易所评级
                            if(this.havePro  && this.$route.name == 'exchange'){
                                this.checkGrade(1);
                            } else {
                                this.$router.push("/select/1/0");
                            }
                        } else { // 点击发布公告
                            this.$router.push({
                                path: '/write/2/0',
                                query: {
                                    pro: this.$route.query.pro,
                                }
                            });
                        }
                    });
                }).catch(() => {
                    Service.Login();
                });
            },

            //检测该项目用户是否发布过评级
            checkGrade(type) {
                if(this.bannedType && this.bannedType.indexOf(-2) != -1){ //禁言
                    this.$dialog.alert('很抱歉，您目前行为受限，无法进行相应操作。');
                    return;
                }
                Service.CheckGrade(type,this.havePro).then(res => {
                    if(res.data.grade_id > 0){ //有grade_id为追评，先跳转至详情页
						if(type == 1) this.$router.push(`/detail/5/${res.data.grade_id}`);
						else this.$router.push(`/detail/0/${res.data.grade_id}`);
					} else { //无grade_id为发评级，跳转至发布页
                        if(type == 1) {
                            this.$router.push({
                                path: `/writexch/0/${this.havePro}`,
                                query: {
                                    pro: this.$route.query.pro,
                                }
                            });
                        } else {
                            this.$router.push({
                                path: `/write/0/${this.havePro}`,
                                query: {
                                    pro: this.$route.query.pro,
                                }
                            });
                        }
					}
                }).catch(res => {
                    let grade_id = res.data.grade_id;
                    if (res.data.status == 2) { //原因为未到追请时间
                        this.$dialog.alert({
							title: '暂不可追评',
							content: '距上次发布内容未满100天，请耐心等待',
							btns: ['知道了']
						});
					} else if(res.data.status == 4) { //原因为前一条评级未通过审核
						this.$router.push(`/detail/${type==1?5:0}/${res.data.grade_id}`);
					}  else { //原因为等级未到5级
						this.$dialog.confirm({
							title: '您已评过该项目',
							content: 'LV5等级以上的超级评审员才可追评',
							btns: ['做任务升级', '好的']
						}).then((res) => {
							this.$router.replace('/user/task');
						})
					}
                });
            },

            //是否是项目方
            IsReCurit() {
                if(this.isReCruit && this.btns.length == 3) {
                    this.btns.push({
                        text: '公告',
                        icon: 'icon icon-tongzhi',
                        icon_top: 0.75,
                        clickEvent: 3,
                    })
                }
                if(!this.isReCruit && this.btns.length == 4){
                    this.btns.splice(3,1);
                }
            },

            //下载APP跳转
            Download(){
                location.href = '/down.html';
            }
        },
        mounted() {
            //防止返回事件后，Dialog弹窗还在的问题、发布按钮还在问题
            window.addEventListener("popstate", e => {
                //关闭发布按钮
                this.isShowBtns && this.showBtns();
            }, false);
            this.IsReCurit()
        }
    }
</script>

<style lang="less">
	@import "../../assets/css/config";
    .comp-buttons{
        .float-download-btn{
            position:fixed;
            bottom:2.8rem;
            left:50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 4.85rem;
            height: 1.6rem;
            background: @color-link;
            border-radius: 1.6rem;
            color: #FFF;
            font-size: .7rem;
        }
	    .float-post-btn {
	    	position: fixed;
	    	bottom: 3.5rem;
	    	right: .3rem;
	    	display: flex;
	    	width: 3.5rem;
	    	height: 3.5rem;
	    	font-size: 0;
	    	line-height: 0;
	    	z-index: 7;
	    	.btns-box {
	    		position: relative;
	    		width: 100%;
	    		height: 100%;
	    		z-index: 3;
	    		.img {
	    			position: absolute;
	    			left: 0;
	    			top: 0;
	    			z-index: 1;
	    			width: 3.5rem;
	    			height: 3.6rem;
	    		}
	    		.btns {
	    			position: absolute;
	    			top: 0;
	    			left: 0;
	    			width: 100%;
	    			height: 100%;
	    			.btn {
	    				transition: top .1s ease-in;
	    				position: absolute;
	    				right: .75rem; //top: .75rem;
	    				display: flex;
	    				align-items: center;
	    				justify-content: flex-end;
	    				&.btn-1 {
	    					//top: -2.85rem;
	    				}
	    				&.btn-2 {
	    					//top: -6.2rem;
	    				}
	    				.icon {
	    					display: flex;
	    					width: 2rem;
	    					height: 2rem;
	    					margin-left: .9rem;
	    					align-items: center;
	    					justify-content: center;
	    					flex-shrink: 0;
	    					background: @color-link;
	    					border-radius: 50%;
	    					box-shadow: 0px .1rem .2rem 0px rgba(0, 0, 0, 0.2);
	    					font-size: 1rem;
	    					color: #fff;
	    				}
	    				.txt {
	    					transition: all .2s ease;
	    					transform-origin: 100% 50% 0;
	    					display: flex;
	    					padding: .4rem .5rem;
	    					background: #fff;
	    					box-shadow: 0px .05rem .1rem 0px rgba(0, 0, 0, 0.2);
	    					border-radius: .7rem;
	    					align-items: center;
	    					justify-content: center;
	    					flex-shrink: 0;
	    					line-height: 1;
	    					font-size: .6rem;
	    					color: @color-sub;
	    				}
	    			}
	    		}
	    	}
	    	.btns-pannel {
	    		position: fixed;
	    		left: 0;
	    		top: 0;
	    		width: 100%;
	    		height: 100%;
	    		z-index: 2;
	    	}
	    }
	    @media screen and (min-width: 768px) {
	    	.float-post-btn {
	    		bottom: 5.5rem !important;
	    		right: e('calc(50vw - 19.2rem)') !important;
	    	}
	    }
    }
</style>