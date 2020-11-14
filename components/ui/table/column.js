export default {
	name: 'TableColumn',
	props: {
		field: String,
		label: String,
		width: String,
		align: String,
		filter:Function
	},

	data() {
		return {
			column: {},
		};
	},

	created() {
		this.column = {
			label: this.label,
			width: this.width,
			field: this.field,
			align:this.align,
			filter:this.filter
		};
		this.column.renderCell = (h, { row, column }) => {
			if (this.$scopedSlots.default) {
				return h('div', { class: 'child' }, [this.$scopedSlots.default(row)]);
			}
			var ret = row[column.field];
			if(column.filter && 'function' == typeof column.filter){
				ret = column.filter.call(null,ret)
			}
			return ret;
		};
	},

	mounted() {
		this.$parent.columns.push(this.column);
	},

	render(h) {
		return null;
	}
};
