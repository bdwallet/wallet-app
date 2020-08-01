<template>
	<div class="help-main helps">
		<!-- <a href="#li7"> --> 
			<!-- app端点击会显示代码 -->
			<div class="header" :style="{backgroundImage: 'url('+$assets.helpHeaderBg+')'}"></div>
		<!-- </a> -->
		<div class="com-tab">
			<div class="tab-item">
				<span :class="{'active':current==11}" @click="Cuter(11)">常见问题</span>
			</div>
			<div class="tab-item">
				<span :class="{'active':current==12}" @click="Cuter(12)">功能宝典</span>
			</div>
		</div>
		<div class="help-wrap">
			<div class="item" v-if="+current==11">
				<ul ref="ullist">
					<li id="li0">
						<div class="head" @click="toggle(0)">
							<div class="title">1、什么是黑钻？</div>
							<span class="dropdown" :class="[{iconAnimation:loading&&height[0]!=='0px'}]">
	                <i class="icon icon-shouhui"></i>
	              </span>
						</div>
						<div class="intro" ref="intro0" :style="{'height':height[0]}">
							<p>黑钻是黑钻评级的区块链代币，代表黑钻评级平台及其周边生态的使用权</p>
							<p>黑钻发行总量10亿（基于区块链，不增发），6亿用于社区用户激励，1亿用于市场推广及商务合作，1亿用于团队奖励，2亿保留做后续计划</p>
						</div>
					</li>
					<li id="li1">
						<div class="head" @click="toggle(1)">
							<div class="title">2、黑钻的价值？</div>
							<span class="dropdown" :class="[{iconAnimation:loading&&height[1]!=='0px'}]">
	                <i class="icon icon-shouhui"></i>
	              </span>
						</div>
						<div class="intro" ref="intro1" :style="{'height':height[1]}">
							<p>Token价值取决于平台的价值。我们坚信，在鱼龙混杂的区块链世界，能致力于帮助投资者去糙取精，发掘高价值项目的平台，是能够堆积起强大势能的</p>
							<p>赞赏已上线，后续会上线付费阅读、付费问答、持钻分红等功能，以实现token流通，价值扩散</p>
						</div>
					</li>
					<li id="li2">
						<div class="head" @click="toggle(2)">
							<div class="title">3、等级有什么用？</div>
							<span class="dropdown" :class="[{iconAnimation:loading&&height[2]!=='0px'}]">
	                <i class="icon icon-shouhui"></i>
	              </span>
						</div>
						<div class="intro" ref="intro2" :style="{'height':height[2]}">
							<p>黑钻等级是黑钻社区用户的身份象征。等级高的用户将能提现更多数额的黑钻，并专享更多有价值、有趣的功能。去“个人中心-任务中心”里完成任务，将能增加经验，提升等级</p>
						</div>
					</li>
					<li id="li3">
						<div class="head" @click="toggle(3)">
							<div class="title">4、如何获取黑钻？</div>
							<span class="dropdown" :class="[{iconAnimation:loading&&height[3]!=='0px'}]">
	                <i class="icon icon-shouhui"></i>
	              </span>
						</div>
						<div class="intro" ref="intro3" :style="{'height':height[3]}">
							<p>目前，发布新评级/追加评级、邀请、实名认证及参与官方活动均有机会获得黑钻。更多挖黑钻任务，可于“个人中心-任务中心”里查看</p>
						</div>
					</li>
					<li id="li4">
						<div class="head" @click="toggle(4)">
							<div class="title">5、实名认证后每日登录，为啥没有奖励？</div>
							<span class="dropdown" :class="[{iconAnimation:loading&&height[4]!=='0px'}]">
	                <i class="icon icon-shouhui"></i>
	              </span>
						</div>
						<div class="intro" ref="intro4" :style="{'height':height[4]}">
							<div>①实名认证通过审核才有奖励</div>
							<div>②访问任务中心才视作登录，才有奖励</div>
							<div>③从次日起的前100天内登录【若100天内某日未登录，则视为放弃当日奖励】才有奖励，超过100天则没有奖励</div>
						</div>
					</li>
					<li id="li5">
						<div class="head" @click="toggle(5)">
							<div class="title">6、发布评级有什么限制？</div>
							<span class="dropdown" :class="[{iconAnimation:loading&&height[5]!=='0px'}]">
	                <i class="icon icon-shouhui"></i>
	              </span>
						</div>
						<div class="intro" ref="intro5" :style="{'height':height[5]}">
							<p>
								一、评级：超级评审团成员才可发布评级。
								<router-link to="/user/application">申请加入</router-link>
							</p>
							<p>二、追评</p>
							<div>1、追评是追加评级的简称，能在保持评级内容不可篡改的前提下，让评审员随着项目的发展，补充自己新的见解、观点</div>
							<div>2、LV5等级以上的超级评审员才可追评</div>
							<div>3、1个项目每隔100天（从上条内容发布日期算起）可追评1次</div>
							<div>4、追评内容要求：①不可与历史评级内容重复 ②可以提出与历史评级不同的见解和观点；也可以就某方面进行更深入的分析和补充 ③100-10000字</div>
						</div>
					</li>
					<li id="li6">
						<div class="head" @click="toggle(6)">
							<div class="title">7、发爆料最多能有多少奖励？</div>
							<span class="dropdown" :class="[{iconAnimation:loading&&height[6]!=='0px'}]">
	                <i class="icon icon-shouhui"></i>
	              </span>
						</div>
						<div class="intro" ref="intro6" :style="{'height':height[6]}">
							<div>
								<div>①每日仅前2条爆料能获得发布奖励1黑钻（审核不通过、删除会撤回）</div>
								<div>②上首页推荐的爆料，能获得额外的100黑钻</div>
								<div>③全网首发劲爆内容投稿给我们（微信号：wangbiao-yihan），有机会获得数千黑钻奖励</div>
							</div>
						</div>
					</li>
					<li id="li7">
						<div class="head" @click="toggle(7)">
							<div class="title">8、待释放黑钻、可用黑钻的区别？</div>
							<span class="dropdown" :class="[{iconAnimation:loading&&height[7]!=='0px'}]">
	                <i class="icon icon-shouhui"></i>
	              </span>
						</div>
						<div class="intro" ref="intro7" :style="{'height':height[7]}">
							<div>
								<div>黑钻目前分为两种状态：待释放和可用</div>
								<p>一、待释放：</p>
								<div>①实名认证通过后每日登录【访问任务中心即视为登录】的奖励：30天内为待释放状态。若未检测出异常行为，30天后会自动释放，变为可用状态</div>
								<div>②您邀请的用户实名后每日登录【访问任务中心即视为登录】，您将获得的奖励：30天内为待释放状态。若未检测出被邀请方有异常行为，30天后会自动释放，变为可用状态</div>
								<div>③发布内容（新评级、追评）的奖励：7天内为待释放状态。若内容通过审核，7天后会自动释放，变为可用状态</div>
								<div>④您邀请的用户发布前10条评级，您将获得的奖励：7天内为待释放状态。若对方内容通过审核，7天后会自动释放，变为可用状态</div>
								<div>⑤发布内容（爆料、评论）的奖励：30天内为待释放状态。若内容通过审核，30天后会自动释放，变为可用状态</div>
								<p>二、可用</p>
								<div>其余任务均可直接获得可用状态的黑钻。可用黑钻才可提现；充值后的金额也计做可用黑钻</div>
							</div>
						</div>
					</li>
					<li id="li8">
						<div class="head" @click="toggle(8)">
							<div class="title">9、发布评级、追加评级能获得多少奖励？</div>
							<span class="dropdown" :class="[{iconAnimation:loading&&height[8]!=='0px'}]">
	                <i class="icon icon-shouhui"></i>
	              </span>
						</div>
						<div class="intro" ref="intro8" :style="{'height':height[8]}">
							<p>一、新评级</p>
							<div>①评级越早，奖励越高。同一项目，会根据评级发布的先后实行阶梯式奖励：</div>
							<div>第1-100位：50黑钻</div>
							<div>第101-300位：30黑钻</div>
							<div>第301位后：10黑钻</div>
							<div>②针对首发当周的项目，能获得额外的20黑钻</div>
							<p>二、追加评级</p>
							<div>A用户在某项目下的首条评级能获得如上所述100%奖励。首次追评、第2次追评、第3次追评将只能获得发布当时1/2、1/3、1/4的奖励，以此类推。</div>
							<p>三、上首页推荐的评级/追评，能获得额外的100黑钻；优质的评级/追评获得官方精选，还能收获额外的500黑钻</p>
						</div>
					</li>
					<li id="li9">
						<div class="head" @click="toggle(9)">
							<div class="title">10、发布的内容可以删除、修改吗？</div>
							<span class="dropdown" :class="[{iconAnimation:loading&&height[9]!=='0px'}]">
	                <i class="icon icon-shouhui"></i>
	              </span>
						</div>
						<div class="intro" ref="intro9" :style="{'height':height[9]}">
							<div>
								<div>①为了避免内容篡改，对投资人造成负面影响，故限制删除、修改功能的使用</div>
								<div>②内容（新评级、追评、爆料、评论）发布5分钟后将不支持删除</div>
								<div>③仅内容审核不通过的情况，才支持修改后重新提交</div>
							</div>
						</div>
					</li>
					<li id="li10">
						<div class="head" @click="toggle(10)">
							<div class="title">11、钱包什么时候开启提现和充值功能？</div>
							<span class="dropdown" :class="[{iconAnimation:loading&&height[10]!=='0px'}]">
	                <i class="icon icon-shouhui"></i>
	              </span>
						</div>
						<div class="intro" ref="intro10" :style="{'height':height[10]}">
							<div>
								<div>7.8-7.12日已开放首次提现。后续我们将会定期开放提现、充值功能，请您耐心等待并持续关注黑钻评级</div>
							</div>
						</div>
					</li>
					<li id="li11">
						<div class="head" @click="toggle(11)">
							<div class="title">12、为什么需要支付密码？</div>
							<span class="dropdown" :class="[{iconAnimation:loading&&height[11]!=='0px'}]">
	                <i class="icon icon-shouhui"></i>
	              </span>
						</div>
						<div class="intro" ref="intro11" :style="{'height':height[11]}">
							<p>考虑到手机遗失、短时借用他人等情况，特设计支付密码来保障您的资金安全。支付密码可通过短信验证码重置，重置后48小时内将禁用资金操作，请谨慎操作</p>
							<p>为了您的资金安全，请尽快设置一个无规则的支付密码</p>
						</div>
					</li>
				</ul>
				<div class="contact">
					<h2>联系我们</h2>
					<div class="contact-txt">
						<p>意见反馈：请关注公众号“黑钻评级”</p>
						<p>商务合作：请添加微信号“jiukou0920”</p>
					</div>
				</div>
			</div>
			<div class="item" v-else>
				<keep-alive>
					<comp-datalist scene="6" type="12" key="12" />
				</keep-alive>
			</div>
		</div>
		<div class="btn">
			<comp-input type="button" value="意见反馈" :status="1" @arrow="GoFeedBack" />
		</div>
	</div>
</template>

<script>
	import compInput from "~components/compInput/input";
	import compDatalist from "~components/compDatalist";
	export default {
		name: "help-main",
		components: {
			compInput,
			compDatalist
		},
		data() {
			return {
				show: [],
				naturalHeight: [],
				height: [],
				loading: false
			};
		},
		computed: {
			currentIndex() {
				return this.$route.query.index;
			},
			current() {
				// 11:常见问题  12：功能宝典
				return this.$route.query.tab;
			}
		},
		methods: {
			//TAB切换处理
            Cuter(tab) {
                let query = {
                    path: '/user/help/main',
                    query: {
                        tab: tab
                    }
                }
				this.$router.replace(query);
				this.Share();
            },
			toggle(index) {
				if (!parseInt(this.height[index])) {
					this.$set(this.height, index, this.naturalHeight[index]);
					this.height[index] = this.naturalHeight[index];
				} else {
					this.$set(this.height, index, "0px");
					this.height[index] = "0px";
				}
				for (let i = 0; i < this.$refs.ullist.children.length; i++) {
					if (i == index) continue;
					this.$set(this.height, i, "0px");
				}
			},
			getNaturalH() {
				for (let i = 0; i < this.$refs.ullist.children.length; i++) {
					this.naturalHeight[i] = this.$refs["intro" + i].offsetHeight + "px";
					this.$set(this.height, i, "0px");
				}
				this.loading = true;
			},
			GoFeedBack() {
				Service.CheckLogin().then(() => {
					Service.CheckBind().then(() => {
						this.$router.push("/user/help/feedback");
					});
				});
			},
			Share() {
				//分享配置
				Share.Ready({
					title: "黑钻评级帮助中心",
					desc: "希望可以帮助解决你一些疑惑",
					link: location.href
				});
			}
		},
		mounted() {
			this.Share();
			this.getNaturalH();
			let currentIndex = this.$route.query.index;
			if (!isNaN(this.currentIndex)) {
				this.toggle(this.currentIndex);
				let to = this.currentIndex - 1;
				to = to < 0 ? 0 : to;
				setTimeout(() => {
					this.$el.querySelector('#li' + to).scrollIntoView();
				}, 200);
			}
		}
	};
</script>

<style lang="less" scoped>
	.helps {
		padding-bottom: 2.86rem;
	}
	.btn {
		position: fixed;
		bottom: 0;
		width: 100%;
		background: #fff;
		padding: 0.75rem 0.75rem;
	}
</style>
