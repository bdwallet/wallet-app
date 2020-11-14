import App from './App';

const Plugin = {
    install(Vue, options = {}){
        let dialog = new Vue.component(App.name, App);
        let vm = dialog.$mount();
        Vue.prototype.$dialog = {
            open(content, params = {}){
              return dialog.addModal(content,params);
            },
            alert(content, params = {}){
              return dialog.addAlert(content,params);
            },
            toast(content, params = {}){
              return dialog.addToast(content,params);
            },
            side(content, params = {}){
            	return dialog.addSide(content,params);
            },
            close(data, key){
              dialog.close(data, key);
            }
        };
        document.body.appendChild(vm.$el);
    }
};

export default Plugin;