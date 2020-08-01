import Vue from 'vue';
import Rpdialog from './popup/dialog';
import localStore from '~script/localStore';

let rpshare = {
	sharelogo:'https://heizuan.oss-cn-shenzhen.aliyuncs.com/h5images/sharelogo.jpg',
	getdesc(){
		let id = localStore.get(Global.localStores.business);
		id = id || 0;
		let shareDesc = '黑钻评级集福唤财神,祝你猪年行大运!';
		switch(Number(id)){
			case 1:
						shareDesc = '欧链 X 黑钻评级集福唤财神,祝你猪年行大运!';
						break;
			case 2:
						shareDesc = 'ExNow X 黑钻评级集福唤财神,祝你猪年行大运!';
						break;
			case 3:
						shareDesc = '净土计划 X 黑钻评级集福唤财神,祝你猪年行大运!';
						break;
			case 4:
						shareDesc = 'Bit.cc X 黑钻评级集福唤财神,祝你猪年行大运!';
						break;
			default:
						shareDesc = '黑钻评级集福唤财神,祝你猪年行大运!';
						break;
		}
		return shareDesc;
	}
}
Vue.prototype.$rpshare = window.rpshare = rpshare;
Vue.prototype.$rpdialog = window.Rpdialog = Rpdialog;
