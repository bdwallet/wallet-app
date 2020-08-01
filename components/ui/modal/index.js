import Vue from 'vue';
import Modal from './modal';
import ModalMessage from './message';
import MessageTip from './tip';

function open(props) {
	let propsData = Object.assign({content: '', showCancel:true,type: 'primary', onOk:()=>{},onClose:()=>{}}, props) 
	let ModalComponent = Vue.extend(ModalMessage);
  return new ModalComponent({
    el: document.createElement('div'),
    propsData,
  });
}


function tip(text,type) {
  const TipComponent = Vue.extend(MessageTip);
  let propsData = {text,type};
  return new TipComponent({
    el: document.createElement('div'),
    propsData
  });
}

const Message = {
	tip(text,type='primary'){
		if(!text || text==''){
			type = 'error';
			text = '未知错误！'
		}
		return tip(text,type);
	},
	open(params) {
		return open(Object.assign({ type: 'success'},params));
	},

	confirm(params) {
		return open(Object.assign({ type: 'primary'},params));
	},

	alert(params) {
		return open(Object.assign({ type: 'danger',showCancel: true},params));
	}
}

export {
	Modal,
	Message
};