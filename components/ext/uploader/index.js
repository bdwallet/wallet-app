import Vue from 'vue';
import App from './App';

function upload(propsData) {
	const component = Vue.extend(App);
	return new component({
		el: document.createElement('div'),
		propsData,
	});
}

export default upload;

