import Vue from 'vue';
import App from './app';

function panel(config) {
  let Panel = Vue.component(App.name, App);
  let panel = new Panel({config});
  let vm = panel.$mount();
  this.show = panel.show
  this.close= panel.close
}
export default panel