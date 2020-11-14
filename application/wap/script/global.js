const isPro = process.env.NODE_ENV === 'production';
const appScenc = 1; //1：正试环境，2：测试环境，3：开发环境
let _appid,_host;
//开发公众号 wx720d66b50f2fea62   测试公众号//wx546bd6625792bbcd  appid:"wx9a9fdfbd57373dd5",//正式公众号
if(isPro && appScenc == 1){
	_appid = "wx9a9fdfbd57373dd5";
	_host = "https://wx.heizuan.com";
}else{
	if(isPro && appScenc == 2){
		_appid = "wx546bd6625792bbcd";
		_host = "http://test.wx.33dxs.com";
	}else{
		_appid = "wx720d66b50f2fea62";
		_host = "http://hz.wx.33dxs.com";
	}
}

module.exports = {
	appScenc,
	isPro: isPro,
	isApp: 0,//是否为APP端   IOS or Android
	noavatar:'https://heizuan.oss-cn-shenzhen.aliyuncs.com/h5images/avatar.jpg',
	host: _host,
	appid: _appid,
	home: `${_host}/home`,
	application: `${_host}/user/application`,
	shareTitle:"黑钻评级--上黑钻评级，知项目好坏",
	shareDesc:"全面了解币种信息，买币亏损比例减少75%",
	dateFormat:"YYYY-MM-DD hh:mm:ss",
	homeTab:[
		{
			flag: 'concern',
			title: '关注',
			to:'/home/concern'
		},
		{
			flag: 'recommend',
			title: '推荐',
			to:'/home/recommend'
		},
		{
			flag: 'ratings',
			title: '评级',
			to:'/home/ratings'
		},
		{
			flag: 'disclosures',
			title: '爆料',
			to:'/home/disclosures'
		}
	],
	nav:[
		{
			flag: 'home',
			icon: 'icon-shequ',
			title: '社区',
			to:'/home'
		},
		{
			flag: 'announce',
			icon: 'icon-zixun1',
			title: '资讯',
			to:'/announce/main?tab=0'
		},
		{
			flag: 'store',
			icon: 'icon-pingji',
			title: '评级库',
			to:'/list'
		},
		{
			flag: 'notify',
			icon: 'icon-dibuxiaoxi',
			title: '消息',
			to:'/notify'
		},
		{
			flag: 'user',
			icon: 'icon-wode',
			title: '我的',
			to:'/user/main'
		},
		// {
		// 	flag: 'test',
		// 	icon: 'icon-wode',
		// 	title: '测试',
		// 	to:'/test'
		// }
	],
	localStores:{
		searchWord:'searchWord',
		level:'level',
		business:'business',// acts
		awardgot:'awardgot',// acts
		ratings:'HZRATINGS',
		exch:'EXCHANGE',
		bind:'bindphone',
		selectChecked:'selectChecked' //项目选择页用户是否需要筛选已发过项目
	},
	userLevel:{ //1:草根,2:领袖3.评审员 20普通机器人 21评审机器人 30官方机器人
		user:1,
		leader:2,
		assessor:3,
		userRobot:20,
		assessorRobot:21,
		official:30,
	},
	userLV:[
	
	]
}

