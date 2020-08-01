var engine = require('store/src/store-engine')
var storages = [
    require('store/storages/localStorage'),
    require('store/storages/cookieStorage')
]
var plugins = [
    require('store/plugins/defaults'),
    require('store/plugins/expire')
]
var store = engine.createStore(storages, plugins)
var storage = {
	get: function(key){
		return store.get(key);
	},
	set: function(key,value,exp){
			var expires = typeof exp == 'number'&&exp>=0 ? exp:86400;// exp ==  || 86400  
			return store.set(key,value,expires*1000+new Date().getTime());
	},
	remove: function(key){
		return store.remove(key);
	}
}
//store.set('foo', 'bar', new Date().getTime() + 3000)

export default storage;