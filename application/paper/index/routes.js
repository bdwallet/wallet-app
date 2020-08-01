const routers = [
	/*********
	 *首页*
	 *********/
	{
		path: '/',
		name: 'index',
		redirect: '/home',
	},
	{
    path: '*',
    redirect: '/home',
  },
	/*********
	 *视频页*
	 *********/
	{
		path: '/home',
		name: 'home',
		component: require('./pages/home'),
		meta: {
			auth: false,
			title: '【黑钻评级】谁拿走了金镰刀',
			keywords: 'main-home',
			description: 'main-home'
		}
	},
	/*********
	 *档案库*
	 *********/
	{
		path: '/archives',
		name: 'archives',
		component: require('./pages/archives'),
		meta: {
			auth: false,
			title: '【黑钻评级】档案库',
			keywords: 'main-archives',
			description: 'main-archives'
		}
	},
	/*********
	 *查看档案*
	 *********/
	{
		path: '/user/:id',
		name: 'user',
		component: require('./pages/user'),
		redirect: '/user/:id/home',
		children: [
			{
				path: 'home',
				name: 'home',
				component: require('./pages/user/home'),
				meta:{
					auth:false,
					title:'【黑钻评级】个人档案',
					keywords:'user-home',
					description:'user-home'
				}
			},
			{
				path: 'ars/:type',
				name: 'appraise',
				component: require('./pages/user/appraise'),
				meta:{
					auth:false,
					title:'【黑钻评级】人物评价',
					keywords:'user-appraise',
					description:'user-appraise'
				}
			},
		],
	},
	/*********
	 *分享页*
	 *********/
	{
		path: '/share/:figuerId/:userId',
		name: 'share',
		component: require('./pages/share'),
		meta: {
			auth: false,
			title: '上黑钻评级，知项目好坏',
			keywords: 'main-share',
			description: 'main-share'
		}
	},
	/*********
	 *分享出去进入页*
	 *********/
	{
		path: '/shareout/:figuerId/:userId',
		name: 'shareout',
		component: require('./pages/shareout'),
		meta: {
			auth: false,
			title: '上黑钻评级，知项目好坏',
			keywords: 'main-shareout',
			description: 'main-shareout'
		}
	},
	/*********
	 *发布页*
	 *********/
	{
		path: '/write/:id',
		name: 'write',
		component: require('./pages/write'),
		meta: {
			auth: false,
			title: '【黑钻评级】提供情报',
			keywords: 'main-write',
			description: 'main-write'
		}
	},
	/*********
	 *排行页*
	 *********/
	{
		path: '/ranking/:type',
		name: 'ranking',
		component: require('./pages/ranking'),
		meta: {
			auth: false,
			title: '【黑钻评级】排行榜',
			keywords: 'main-ranking',
			description: 'main-ranking'
		}
	},
	/*********
	 *test*
	 *********/
	{
		path: '/test',
		name: 'test',
		component: require('./pages/test'),
		meta: {
			auth: false,
			title: 'test',
			keywords: 'main-test',
			description: 'main-test'
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
			auth: false,
			title: '【黑钻评级】清理缓存',
			keywords: 'main-clear',
			description: 'main-clear'
		}
	},
];

export default routers;