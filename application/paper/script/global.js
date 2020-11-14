const isPro = process.env.NODE_ENV === 'production';
const appScenc = 2; //1：正试环境，2：测试环境，3：开发环境
let _appid,_host;
//开发公众号 wx720d66b50f2fea62   测试公众号//wx546bd6625792bbcd  appid:"wx9a9fdfbd57373dd5",//正式公众号
if(isPro && appScenc == 1){
	_appid = "wx9a9fdfbd57373dd5";
	_host = "https://figure.heizuan.com";
}else{
	if(isPro && appScenc == 2){
		_appid = "wx546bd6625792bbcd";
		_host = "http://testfigure.netup.vip";
	}else{
		_appid = "wx720d66b50f2fea62";
		_host = "http://figure.netup.vip";
	}
}
module.exports = {
  appid:_appid,
	home: `${_host}/home`,
	shareout: `${_host}/shareout`,
	application: `${_host}/user/application`,
	shareTitle:"上黑钻评级,知项目好坏",
	shareDesc:"善恶终有报，今天一个都别跑",
	shareImg:'https://heizuan.oss-cn-shenzhen.aliyuncs.com/paper/video_logo.png',
	getShareTxt(figure_user_name,score){
			let shareIndex = parseInt(Math.random()*3);
			let figure_grade = score==0?100:score;
			let arr1 = [`${figure_user_name},当年你割我,如今健在否?苍天绕过谁?`,`${figure_user_name},你凭实力割我韭菜,我凭事实怼你！`,`感觉自己这次真的会暴富,结果被${figure_user_name}割了...`];
			let arr2 = [`下海干活or会所嫩模,就看${figure_user_name}是否下手？`,`敌敌畏维权或财富自由, 就看${figure_user_name} 割还是拉？`,`技术向左,镰刀向右,${figure_user_name}左右为难`];
			let arr3 = [`${figure_user_name},敢为人先,万千投资者的领航先锋！`,`山川依旧,初心不改,${figure_user_name}良心币圈人!`,`不买点${figure_user_name}的币，都不知道自己多有投资头脑！`];

			let shareTitle = '';
			let sharedesc = '';

			if(figure_grade>0&&figure_grade<=4){
				shareTitle = arr1[shareIndex];
				sharedesc = '不管你愿或不愿，他就在这里，割你到底 ';
			}else if(figure_grade>4&&figure_grade<=7||figure_grade==100){
				shareTitle = arr2[shareIndex];
				sharedesc = '币圈都是黑庄？不，你只是被黑庄蒙蔽了双眼';
				if(figure_grade==100){
					sharedesc = '这人是实业家还是韭菜王，说出你知道的秘密'
				}
			}else if(figure_grade>7&&figure_grade<=10){
				shareTitle = arr3[shareIndex];
				sharedesc = '不喊暴富的口号，不诓无辜的韭菜眼';
			}
			return {shareTitle,sharedesc}
	}
}