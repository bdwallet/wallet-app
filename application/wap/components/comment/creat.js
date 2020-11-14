
import Vue from 'Vue';
import editor from './editor';

function Creat(propsData){
  let el = document.createElement('div');
  const component = Vue.extend(editor);
  let vm = new component({
	  el,
	  propsData,
  });
  return vm;
}

export default Creat;