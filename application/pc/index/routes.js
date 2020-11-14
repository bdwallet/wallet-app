const routers = [
	/*********
	 *首页*
	 *********/
	{
		path: '/',
		name: 'index',
		component: require('./pages/home'),
		meta: {
			title: '黑钻评级-区块链评级平台-BTC LTC评级查询',
			keywords: '黑钻,黑钻评级,BTC,LTC,EOS,ETH,区块链,区块链评级,项目评级,数字货币评级,比特币价格,比特币资讯,虚拟货币,虚拟货币资讯',
			description: '黑钻评级是全球首家“评审团”式区块链评级社区,覆盖区块链评级、区块链行情预测、区块链爆料、区块链问卷调查等领域，汇集各类币圈大佬、区块链名人，为广大用户提供项目评级、区块链投资交流、区块链问答等服务',
			header:true,
			footer:true,
		}
		// redirect: '/home',
	},
	{
    path: '*',
    redirect: '/',
  },
	/*********
	 *首页*
	 *********/
	{
		path: '/home',
		name: 'home',
		component: require('./pages/home'),
		meta: {
			title: '黑钻评级-区块链评级平台-BTC LTC评级查询',
			keywords: '黑钻,黑钻评级,BTC,LTC,EOS,ETH,区块链,区块链评级,项目评级,数字货币评级,比特币价格,比特币资讯,虚拟货币,虚拟货币资讯',
			description: '黑钻评级是全球首家“评审团”式区块链评级社区,覆盖区块链评级、区块链行情预测、区块链爆料、区块链问卷调查等领域，汇集各类币圈大佬、区块链名人，为广大用户提供项目评级、区块链投资交流、区块链问答等服务',
			header:true,
			footer:true,
		}
	},
	/*********
	 *评级*
	 *********/
	{
		path: '/ratings',
		name: 'ratings',
		component: require('./pages/ratings'),
		meta: {
			title: '项目库-黑钻评级',
			keywords: '黑钻,黑钻评级,BTC,LTC,EOS,ETH,区块链,区块链评级,项目评级,数字货币评级,比特币价格,比特币资讯,虚拟货币,虚拟货币资讯',
			description: '黑钻评级是全球首家“评审团”式区块链评级社区,覆盖区块链评级、区块链行情预测、区块链爆料、区块链问卷调查等领域，汇集各类币圈大佬、区块链名人，为广大用户提供项目评级、区块链投资交流、区块链问答等服务',
			header:true,
			footer:true,
		}
	},
	/*********
	 *项目详情*
	 *********/
	{
		path: '/detail/:id',
		name: 'detail',
		component: require('./pages/detail'),
		meta: {
			title: '项目详情-黑钻评级',
			keywords: '黑钻,黑钻评级,BTC,LTC,EOS,ETH,区块链,区块链评级,项目评级,数字货币评级,比特币价格,比特币资讯,虚拟货币,虚拟货币资讯',
			description: '黑钻评级是全球首家“评审团”式区块链评级社区,覆盖区块链评级、区块链行情预测、区块链爆料、区块链问卷调查等领域，汇集各类币圈大佬、区块链名人，为广大用户提供项目评级、区块链投资交流、区块链问答等服务',
			header:true,
			footer:true,
		}
	}
];

export default routers;