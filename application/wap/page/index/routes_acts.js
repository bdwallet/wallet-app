	/*********
	 *活动中心*  2018年春节活动，已作废
	 *********/
	const routers = {
		path: '/acts/:id',
		name: 'acts',
		component: require('./pages/acts'),
		redirect: '/acts/:id/redpack/actend',
		children: [
			{
				path: 'redpack',
				name: 'redpack',
				component: require('./pages/acts/redpack'),
				redirect: '/acts/:id/redpack/activity',
				children: [
					{
						path: 'activity',
						name: 'redpack-activity',
						component: require('./pages/acts/redpack/activity'),
						meta: {
							auth: true,
							nav: false,
							submit: false,
							isShare: false,
							title: '黑钻集五福',
							keywords: '',
							description: ''
						}
					},
					{
						path: 'awardgot',
						name: 'redpack-awardgot',
						component: require('./pages/acts/redpack/awardgot'),
						meta: {
							auth: true,
							nav: false,
							submit: false,
							isShare: false,
							title: '黑钻集五福',
							keywords: '',
							description: ''
						}
					},
					{
						path: 'awardloss',
						name: 'redpack-awardloss',
						component: require('./pages/acts/redpack/awardloss'),
						meta: {
							auth: true,
							nav: false,
							submit: false,
							isShare: false,
							title: '黑钻集五福',
							keywords: '',
							description: ''
						}
					},
					{
						path: 'actend',
						name: 'redpack-actend',
						component: require('./pages/acts/redpack/actend'),
						meta: {
							auth: true,
							nav: false,
							submit: false,
							isShare: false,
							title: '黑钻集五福',
							keywords: '',
							description: ''
						}
					},
					{
						path: 'share/:awarduserId',
						name: 'redpack-share',
						component: require('./pages/acts/redpack/share'),
						meta: {
							auth: true,
							nav: false,
							submit: false,
							isShare: false,
							title: '黑钻集五福',
							keywords: '',
							description: ''
						}
					},
					{
						path: 'eostask',
						name: 'redpack-eostask',
						component: require('./pages/acts/redpack/eostask'),
						meta: {
							auth: true,
							nav: false,
							submit: false,
							isShare: false,
							title: 'EOS钱包任务',
							keywords: '',
							description: ''
						}
					},
					{
						path: 'puretask',
						name: 'redpack-puretask',
						component: require('./pages/acts/redpack/puretask'),
						meta: {
							auth: true,
							nav: false,
							submit: false,
							isShare: false,
							title: '黑钻集五福',
							keywords: '',
							description: ''
						}
					}
				]
			},
		]
	}

export default routers;