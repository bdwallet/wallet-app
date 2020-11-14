import Table from './app';
import TableColumn from './column';

Table.install = function(Vue) {
	Vue.component(Table.name, Table);
};
export {
  Table,
  TableColumn
};
