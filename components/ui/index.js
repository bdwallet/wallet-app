import '@assets/style/ui'

import {Row, Column} from './grid';
import Panel from './panel';
import {Button, ButtonGroup} from './button';
import {FormGroup} from './form';
import Tab from './tab';
import {Table, TableColumn} from './table';
import {Modal, Message} from './modal';
import Dropdown from './dropdown';
import Page from './page';
import {Menu,MenuItem} from './menu';
import Textarea from './textarea';
import Input from './input';
const prefix = 'ui';
const components = {
	Row, Column,
	Panel,
	Button, ButtonGroup,
	FormGroup,
	Tab,
	Table,
	TableColumn,
	Modal,
	Dropdown,
	Page,
	Menu,MenuItem,
	Textarea,
	Input,
}
const install = function(Vue, opts = {}) {
	if (install.installed) return;
	for(var i in components){
		let component = components[i];
		
		Vue.component(prefix + component.name, component);
	}
	Vue.prototype.$message = Message;
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
module.exports = Object.assign({install},components);
module.exports.default = module.exports;