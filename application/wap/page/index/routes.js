const routers = [
	/*********
	 *首页*
	 *********/
	{
		path: '/',
		name: 'home',
		component: require('./pages/home'),
		redirect: '/home',
	},
	{
		path: '/home',
		name: 'home',
		component: require('./pages/home'),
		redirect: '/home/recommend',
		children: [
			{
				path: 'recommend',
				name: 'recommend',
				component: require('./pages/home/recommend'),
				meta: {
					auth: 0,
					nav: 1,
					submit: 1,
					down: 1,
					isShare: 0,
					title: '黑钻评级-上黑钻评级，知项目好坏',
				}
			},
			{
				path: 'ratings',
				name: 'ratings',
				component: require('./pages/home/ratings'),
				meta: {
					auth: 0,
					nav: 1,
					submit: 1,
					down: 1,
					isShare: 0,
					title: '黑钻评级-上黑钻评级，知项目好坏',
				}
			},
			{
				path: 'disclosures',
				name: 'disclosures',
				component: require('./pages/home/disclosures'),
				meta: {
					auth: 0,
					nav: 1,
					submit: 1,
					down: 1,
					isShare: 0,
					title: '黑钻评级-上黑钻评级，知项目好坏',
				}
			},
			{
				path: 'concern',
				name: 'concern',
				component: require('./pages/home/concern'),
				meta: {
					auth: 0,
					nav: 1,
					submit: 0,
					down: 1,
					isShare: 0,
					title: '黑钻评级-上黑钻评级，知项目好坏',
				}
			},
		],
	},
	/***********
	 *公告*
	 ***********/
	{
		path: '/coins',
		name: 'coins',
		component: require('./pages/coins'),
		redirect: '/coins/main',
		children: [
			{
				path: 'main',
				name: 'coins-main',
				component: require('./pages/coins/main'),
				meta: {
					auth: 0,
					nav: 1,
					submit: 0,
					down: 1,
					isShare: 0,
					title: '官方公告',
				}
			}
		]
	},
	/***********
	 *项目方公告*
	 ***********/
	{
		path: '/announce',
		name: 'announce',
		component: require('./pages/announce'),
		redirect: '/announce/main',
		children: [
			{
				path: 'main',
				name: 'announce-main',
				component: require('./pages/announce/main'),
				meta: {
					auth: 0,
					nav: 1,
					submit: 0,
					down: 1,
					isShare: 0,
					title: '快讯',
				}
			},
			{
				path: 'list',
				name: 'announce-list',
				component: require('./pages/announce/list'),
				meta: {
					auth: 0,
					nav: 1,
					submit: 0,
					down: 1,
					isShare: 0,
					title: '项目方入驻列表',
				}
			},
			//废弃 --- 原公告详情页
			// {
			// 	path: 'detail/:pid',
			// 	name: 'detail',
			// 	component: require('./pages/announce/detail'),
			// 	meta: {
			// 		auth: 0,
			// 		nav: 1,
			// 		submit: 0,
			// 		isShare: 1,
			// 		title: '公告详情',
			// 	}
			// },
		]
	},
	/***********
	 *热门活动*
	 ***********/
	{
		path: '/hot',
		name: 'hot',
		component: require('./pages/hot'),
		redirect: '/hot/main',
		children: [
			{
				path: 'main',
				name: 'hot-main',
				component: require('./pages/hot/main'),
				meta: {
					auth: 0,
					nav: 1,
					submit: 0,
					down: 1,
					isShare: 0,
					title: '热门活动',
				}
			},
		]
	},
	// {
	// 	path: '/activity-detail/:rid',
	// 	name: 'activity-detail',
	// 	component: require('./pages/activityDetail'),
	// 	meta: {
	// 		auth: 0,
	// 		nav: 1,
	// 		submit: 0,
	// 		isShare: 1,
	// 		title: '内容详情',
	// 	}
	// },
	/***********
  *新手课堂*
  ***********/
  {
		path: '/newbie',
		name: 'newbie',
		component: require('./pages/newbie'),
		redirect: '/newbie/main',
		children: [
			{
				path: 'main',
				name: 'newbie-main',
				component: require('./pages/newbie/main'),
				meta: {
					auth: 0,
					nav: 1,
					submit: 0,
					down: 1,
					isShare: 0,
					title: '新手课堂',
				}
			}
		]
	},


	/***********
	 *登录页*
	 ***********/
	{
		path: '/login',
		name: 'login',
		component: require('./pages/login'),
		meta: {
			auth: 0,
			nav: 0,
			submit: 0,
			down: 0,
			isShare: 0,
			title: '黑钻评级-登录',
		}
	},
	
	/***********
	 *发布页 itemid：项目编号 type：(0:发布评级,1:发布爆料,2:发布公告)*
	 ***********/
	{
		path: '/write/:type/:itemid',
		name: 'write',
		component: require('./pages/write'),
		meta: {
			auth: 1,
			nav: 0,
			submit: 0,
			down: 0,
			isShare: 0,
			title: '发布页',
		}
	},
	
	/***********
	 *交易所发布页 itemid：项目编号 type：(0:发布评级,1:发布爆料,2:发布公告)*
	 ***********/
	{
		path: '/writexch/:type/:itemid',
		name: 'write-exchange',
		component: require('./pages/write/exchange'),
		meta: {
			auth: 1,
			nav: 0,
			submit: 0,
			down: 0,
			isShare: 0,
			title: '交易所发布页',
		}
	},
	
	/***********
	 *项目列表页*
	 ***********/
	{
		path: '/list',
		name: 'prolist',
		component: require('./pages/list'),
		meta: {
			auth: 0,
			nav: 1,
			submit: 1,
			down: 1,
			isShare: 0,
			title: '黑钻评级-评级库',
		}
	},
	
	/*********
 	*项目搜索页*
 	*********/
	{
		path: '/search/:type',
		name: 'search',
		component: require('./pages/search'),
		meta: {
			auth: 0,
			nav: 1,
			submit: 0,
			down: 0,
			isShare: 0,
			title: '搜索项目',
		}
	},
	
	/*********
	 *项目选择页*
	 @type 发布对象 1：交易所 2：项目
	 @broke 发布类型 0：评级 1：爆料
 	*********/
	{
		path: '/select/:type/:broke',
		name: 'select',
		iconCls: 'icon-selct',
		component: require('./pages/select'),
		meta: {
			auth: 1,
			nav: 0,
			submit: 0,
			down: 0,
			isShare: 0,
			title: '选择项目',
		}
	},
	
	/*********
	 *项目介绍页*
	 *********/
	{
		path: '/article/:itemid',
		name: 'article',
		iconCls: 'icon-start',
		component: require('./pages/article'),
		meta: {
			auth: 0,
			nav: 1,
			submit: 1,
			down: 1,
			isShare: 1,
			title: '黑钻评级-项目评级',
		}
	},
	
	/*********
	 *交易所介绍页*
	 *********/
	{
		path: '/exchange/:itemid',
		name: 'exchange',
		iconCls: 'icon-start',
		component: require('./pages/exchange'),
		meta: {
			auth: 0,
			nav: 1,
			submit: 1,
			down: 1,
			isShare: 1,
			title: '黑钻评级-交易所评级',
		}
	},
	
	/*********
 	*项目所有评级*
    * type: 1 交易所 2 项目
 	*********/
	{
		path: '/project/:type/:itemid',
		name: 'project',
		iconCls: 'icon-start',
		component: require('./pages/project'),
		meta: {
			auth: 0,
			nav: 1,
			submit: 1,
			down: 1,
			isShare: 1,
			title: '黑钻评级-项目评级',
		}
	},
	
	/*********
	 *邀请相关*
	 *********/
	{
		path: '/invite',
		name: 'invite',
		iconCls: 'icon-start',
		component: require('./pages/invite'),
		redirect: '/invite/main',
		children:[
			{
				path: 'main',
				name: 'invite-main',
				component: require('./pages/invite/main'),
				meta: {
					auth: 1,
					nav: 0,
					submit: 0,
					down: 0,
					isShare: 1,
					title: '黑钻评级-邀请注册',
				}
			},
			{
				path: 'share',
				name: 'invite-share',
				iconCls: 'icon-start',
				component: require('./pages/invite/share'),
				meta: {
					auth: 0,
					nav: 0,
					submit: 0,
					down: 0,
					isShare: 1,
					title: '黑钻评级-分享邀请',
				}
			},
			{
				path: 'register/:invid',
				name: 'invite-register',
				component: require('./pages/invite/register'),
				meta: {
					auth: 0,
					nav: 0,
					submit: 0,
					down: 0,
					isShare: 0,
					title: '黑钻评级-邀请注册',
				}
			},
			{
				path: 'success',
				name: 'invite-success',
				component: require('./pages/invite/success'),
				meta: {
					auth: 0,
					nav: 0,
					submit: 0,
					down: 0,
					isShare: 0,
					title: '黑钻评级-邀请注册',
				}
			},
			{
				path: 'list',
				name: 'invite-list',
				component: require('./pages/invite/list'),
				meta: {
					auth: 0,
					nav: 0,
					submit: 0,
					down: 0,
					isShare: 0,
					title: '黑钻评级-邀请列表',
				}
			}
		]
	},
	
	/*********
 	*评级详情页*
 	*********/
	{
		path: '/detail/:type/:rid',
		name: 'detail',
		component: require('./pages/detail'),
		meta: {
			auth: 0,
			nav: 1,
			submit: 0,
			down: 0,
			isShare: 1,
			title: '内容详情',
		}
	},
	
	/*********
	 *外部测评详情页*
	 *********/
	{
		path: '/extlevaluation/:rid',
		name: 'evaluation',
		component: require('./pages/exchange/extlevaluation'),
		meta: {
			auth: 0,
			nav: 1,
			submit: 0,
			down: 0,
			isShare: 1,
			title: '黑钻评级',
		}
	},
	
	/*********
	 *赞赏列表*
	 *********/
	{
		path: '/reward/:gradetype/:rid',
		name: 'reward',
		component: require('./pages/detail/reward'),
		meta: {
			auth: 0,
			nav: 1,
			submit: 0,
			down: 0,
			isShare: 1,
			title: '赞赏的支持者',
		}
	},
	
	/*********
	 *评论页*
	 @rid : 评级ID
	 @pid : 低级评论ID
 	*********/
	{
		path: '/comment/:rid/:pid',
		name: 'comment',
		component: require('./pages/comment'),
		meta: {
			auth: 0,
			nav: 1,
			submit: 0,
			down: 0,
			isShare: 0,
			title: '评论详情',
		}
	},
	
	/*********
 	*消息中心*
 	*********/
	{
		path: '/notify',
		name: 'notify',
		component: require('./pages/notify'),
		meta: {
			auth: 1,
			nav: 1,
			submit: 0,
			down: 1,
			isShare: 0,
			title: '黑钻评级-消息中心',
		}
	},
	
	/*********
 	*用户协议*
 	*********/
	{
		path: '/protocol',
		name: 'protocol',
		component: require('./pages/protocol'),
		meta: {
			auth: 0,
			nav: 0,
			submit: 0,
			down: 0,
			isShare: 0,
			title: '黑钻用户协议',
		}
	},
	
	/*****
	*申请超级评审员*
	*******/
	{
		path: '/apply',
		name: 'apply',
		iconCls: 'icon-start',
		component: require('./pages/apply'),
		redirect: 'apply/form',
		children: [
			{
				path: 'form',
				name: 'apply-form',
				iconCls: 'icon-form',
				component: require('./pages/apply/form'),
				meta: {
					auth: 1,
					nav: 0,
					submit: 0,
					down: 0,
					isShare: 0,
					title: '黑钻评级-上传审核资料',
				}
			},
			{
				path: 'success',
				name: 'apply-success',
				iconCls: 'icon-applysuccess',
				component: require('./pages/apply/success'),
				meta: {
					auth: 1,
					nav: 0,
					submit: 0,
					down: 0,
					isShare: 1,
					title: '黑钻评级-申请成功',
				}
			},
			{
				path: 'verify',
				name: 'apply-verify',
				iconCls: 'icon-appling',
				component: require('./pages/apply/verify'),
				meta: {
					auth: 1,
					nav: 0,
					submit: 0,
					down: 0,
					title: '黑钻评级-资料审核中',
				}
			}
		]
	},
	
	/*****
	 * 理财相关
	 *****/
	// {
	// 	path: '/ficial-ment',
	// 	name: 'user-ficial-ment',
	// 	component: require('./pages/ficialMent'),
	// 	redirect: '/ficial-ment/list',
	// 	children: [
	// 		{
	// 			path: 'list',
	// 			name: 'list',
	// 			component: require('./pages/ficialMent/ficiaList'),
	// 			meta: {
	// 				auth: 0,
	// 				nav: 1,
	// 				submit: 0,
	// 				isShare: 0,
	// 				title: '理财产品',
	// 			}
	// 		},
	// 		{
	// 			path: 'main',
	// 			name: 'main',
	// 			component: require('./pages/ficialMent/main'),
	// 			meta: {
	// 				auth: 0,
	// 				nav: 1,
	// 				submit: 0,
	// 				isShare: 0,
	// 				title: '理财详情',
	// 			}
	// 		},
	// 		{
	// 			path: 'purchistory-list',
	// 			name: 'purchistory-list',
	// 			component: require('./pages/ficialMent/purchistoryList'),
	// 			meta: {
	// 				auth: 0,
	// 				nav: 1,
	// 				submit: 0,
	// 				isShare: 0,
	// 				title: '购买记录'
	// 			}
	// 		},
	// 		{
	// 			path: 'purchistory-detail',
	// 			name: 'purchistory-detail',
	// 			component: require('./pages/ficialMent/purchistoryDetail'),
	// 			meta: {
	// 				auth: 0,
	// 				nav: 1,
	// 				submit: 0,
	// 				isShare: 0,
	// 				title: '购买详情'
	// 			}
	// 		},
	// 	]
	// },
	
	/*********
	 *个人中心*
	 *********/
	{
		path: '/user',
		name: 'user',
		iconCls: 'icon-start',
		component: require('./pages/user'),
		redirect: '/user/main',
		children: [
			{
				path: 'main',
				name: 'user-main',
				component: require('./pages/user/main'),
				meta: {
					auth: 0,
					nav: 1,
					submit: 0,
					down: 0,
					isShare: 0,
					title: '个人中心',
				}
			},
			{
				path: 'help',
				name: 'user-help',
				component: require('./pages/user/help'),
				redirect: '/user/help/main',
				children:[
					{
						path: 'main',
						name: 'user-help-main',
						component: require('./pages/user/help/main'),
						meta: {
							auth: 0,
							nav: 0,
							submit: 0,
							down: 0,
							isShare: 1,
							title: '黑钻评级-帮助与反馈',
						}
					},
					{
						path: 'feedback',
						name: 'user-help-feedback',
						component: require('./pages/user/help/feedback'),
						meta: {
							auth: 1,
							nav: 0,
							submit: 0,
							down: 0,
							isShare: 0,
							title: '意见反馈-帮助与反馈',
						}
					}
				]
			},
			{
				path: 'application',
				name: 'user-application',
				component: require('./pages/user/application'),
				meta: {
					auth: 0,
					nav: 0,
					submit: 0,
					down: 0,
					isShare: 1,
					title: '申请成为超级评审员',
				}
			},
			{
				path: 'about',
				name: 'user-about',
				component: require('./pages/user/about'),
				meta: {
					auth: 0,
					nav: 1,
					submit: 0,
					down: 0,
					isShare: 1,
					title: '黑钻评级-关于我们',
				}
			},
			{
				path: 'ratings/:uid',
				name: 'user-ratings',
				component: require('./pages/user/ratings'),
				meta: {
					auth: 0,
					nav: 1,
					submit: 0,
					down: 1,
					isShare: 0,
					title: 'TA的精评',
				}
			},
			{
				path: 'collect',
				name: 'user-collect',
				component: require('./pages/user/collect'),
				meta: {
					auth: 1,
					nav: 0,
					submit: 0,
					down: 1,
					isShare: 0,
					title: '我的收藏',
				}
			},
			{
				path: 'homepage/:uid',
				name: 'user-homepage',
				component: require('./pages/user/homepage'),
				meta: {
					auth: 0,
					nav: 1,
					submit: 1,
					down: 1,
					isShare: 1,
					title: '个人主页',
				}
			},
			{
				path: 'contact',
				name: 'user-contact',
				component: require('./pages/user/contact'),
				redirect: 'contact/bans-list/:uid',
				children: [
					{
						path: 'bans-list/:uid',
						name: 'bans-list',
						component: require('./pages/user/contact/bansList'),
						meta: {
							auth: 0,
							nav: 0,
							submit: 0,
							down: 1,
							isShare: 0,
							title: 'TA的粉丝',
						}
					},
					{
						path: 'concern-list/:uid',
						name: 'concern-list',
						component: require('./pages/user/contact/concernList'),
						meta: {
							auth: 0,
							nav: 0,
							submit: 0,
							down: 1,
							isShare: 0,
							title: 'TA的关注',
						}
					}
				]
			},
			{
				path: 'task',
				name: 'user-task',
				component: require('./pages/user/task'),
				meta: {
					auth: 1,
					nav: 1,
					submit: 0,
					down: 0,
					isShare: 1,
					title: '任务中心',
				}
			},
			{
				path: 'level',
				name: 'user-level',
				component: require('./pages/user/level'),
				meta: {
					auth: 1,
					nav: 1,
					submit: 0,
					down: 0,
					isShare: 1,
					title: '用户等级',
				},
			},
			{
				path: 'exp',
				name: 'user-exp',
				component: require('./pages/user/exp'),
				meta: {
					auth: 1,
					nav: 1,
					submit: 0,
					down: 1,
					isShare: 0,
					title: '经验明细',
				}
			},
			{
				path: 'wallet',
				name: 'user-wallet',
				component: require('./pages/user/wallet'),
				redirect: '/user/wallet/main',
				children:[
					{
						path: 'main',
						name: 'user-wallet-main',
						component: require('./pages/user/wallet/main'),
						meta: {
							auth: 1,
							nav: 1,
							submit: 0,
							down: 0,
							isShare: 0,
							title: '黑钻钱包',
						}
					},
					{
						path: 'list',
						name: 'user-wallet-list',
						component: require('./pages/user/wallet/list'),
						meta: {
							auth: 1,
							nav: 1,
							submit: 0,
							down: 0,
							isShare: 0,
							title: '待释放明细',
						}
					},
					{
						path: 'recharge',
						name: 'user-wallet-recharge',
						component: require('./pages/user/wallet/recharge'),
						meta: {
							auth: 1,
							nav: 1,
							submit: 0,
							down: 0,
							isShare: 0,
							title: '黑钻充值',
						}
					},
					{
						path: 'cashout',
						name: 'user-wallet-cashout',
						component: require('./pages/user/wallet/cashout'),
						meta: {
							auth: 1,
							nav: 0,
							submit: 0,
							down: 0,
							isShare: 0,
							title: '黑钻提现',
						}
					},
					{
						path: 'record',
						name: 'user-wallet-record',
						component: require('./pages/user/wallet/record'),
						meta: {
							auth: 1,
							nav: 1,
							submit: 0,
							down: 0,
							isShare: 0,
							title: '钱包记录',
						}
					},
					{
						path: 'node',
						name: 'user-wallet-node',
						component: require('./pages/user/wallet/node'),
						redirect: '/user/wallet/node/main',
						children:[
							{
								path: 'main',
								name: 'user-wallet-record',
								component: require('./pages/user/wallet/node/main'),
								meta: {
									auth: 1,
									nav: 0,
									submit: 0,
									down: 0,
									isShare: 0,
									title: '提币地址',
								}
							},
							{
								path: 'edit/:id',
								name: 'user-wallet-edit',
								component: require('./pages/user/wallet/node/edit'),
								meta: {
									auth: 1,
									nav: 0,
									submit: 0,
									down: 0,
									isShare: 0,
									title: '钱包地址管理',
								}
							}
						],
					},
				]
			},
			{
				path: 'setup',
				name: 'user-setup',
				component: require('./pages/user/setup'),
				redirect: '/user/setup/main',
				children:[
					{
						path: 'main',
						name: 'user-setup-main',
						component: require('./pages/user/setup/main'),
						meta: {
							auth: 0,
							nav: 0,
							submit: 0,
							down: 1,
							isShare: 0,
							title: '黑钻评级-设置中心',
						}
					},
					{
						path: 'bind',
						name: 'user-setup-bind',
						component: require('./pages/user/setup/bind'),
						meta: {
							auth: 1,
							nav: 0,
							submit: 0,
							down: 0,
							isShare: 0,
							title: '手机绑定-设置中心',
						}
					},
					{
						path: 'profile',
						name: 'user-setup-profile',
						component: require('./pages/user/setup/profile'),
						meta: {
							auth: 1,
							nav: 0,
							submit: 0,
							down: 0,
							isShare: 0,
							title: '修改资料-设置中心',
						}
					},
					{
						path: 'pwd',
						name: 'user-setup-pwd',
						component: require('./pages/user/setup/pwd'),
						meta: {
							auth: 0,
							nav: 0,
							submit: 0,
							down: 0,
							isShare: 0,
							title: '修改密码-设置中心',
						}
					},
					{
						path: 'pay',
						name: 'user-setup-pay',
						component: require('./pages/user/setup/pay'),
						meta: {
							auth: 0,
							nav: 0,
							submit: 0,
							down: 0,
							isShare: 0,
							title: '设置支付密码-设置中心',
						}
					}
				]
			},
			{
				path: 'nodegift',
				name: 'user-nodegift',
				component: require('./pages/user/nodegift'),
				meta: {
					auth: 0,
					nav: 0,
					submit: 0,
					down: 0,
					isShare: 1,
					title: '每日锦鲤',
				}
			},
			{
				path: 'authentication',
				name: 'user-authentication',
				component: require('./pages/user/authentication'),
				meta: {
					auth: 1,
					nav: 0,
					submit: 0,
					down: 0,
					isShare: 0,
					title: '实名认证',
				}
			},
		]
	},

	/**********
	 *项目方招募*
	 **********/
	{
		path: '/recruit',
		name: 'recruit',
		component: require('./pages/recruit'),
		meta: {
			auth: 0,
			nav: 0,
			submit: 0,
			down: 0,
			isShare: 1,
			title: '黑钻评级-项目方招募',
		}
	},
	
	/*********
	 *举报*
	 *********/
	{
		path: '/report',
		name: 'report',
		component: require('./pages/report'),
		meta: {
			auth: 1,
			nav: 0,
			submit: 0,
			down: 0,
			isShare: 0,
			title: '黑钻评级-举报',
		}
	},
	
	/*********
	 *热榜*
	 *********/
	{
		path: '/hotlist',
		name: 'hotlist',
		component: require('./pages/hotlist'),
		meta: {
			auth: 0,
			nav: 0,
			submit: 0,
			down: 0,
			isShare: 1,
			title: '黑钻评级-评级热榜',
		}
	},
	
	/*********
	 *年终盘点*
	 *********/
	{
		path: '/summary/:uid',
		name: 'summary',
		component: require('./pages/summary'),
		meta: {
			auth: 0,
			nav: 0,
			submit: 0,
			down: 0,
			isShare: 0,
			title: '黑钻评级-年终盘点',
		}
	},
	
	/*********
	 *清理缓存*
	 *********/
	{
		path: '/clear',
		name: 'clear',
		component: require('./pages/clear'),
		meta: {
			auth: 0,
			title: '【黑钻评级】清理缓存',
		}
	},
	
	// /*********
 	// *checkapi*
 	// *********/
	{
		path: '/checkapi',
		name: 'checkapi',
		component: require('./pages/checkapi'),
		meta: {
			auth: 0,
			title: 'checkapi',
		}
	},
	{
		path: '*',
		redirect: '/home',
	}
];

export default routers;

