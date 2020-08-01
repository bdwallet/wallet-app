export default {
	name: 'TableBody',
	props: {
		data: Array
	},
	data() {
		return {};
	},
	computed: {
		cols() {
			return this.$parent.columns;
		},
	},
	watch: {},
	methods: {},
	created() {},
	render(h) {
		return (
		<tbody>
			{
				this._l(this.data, (row, $index) => {
					return (
						<tr>
						{this._l(this.cols, (column, cellIndex) => {
							var domPropsInnerHTML = column.renderCell.call(this._renderProxy, h, { row, column, $index,store: this.store, _self: this.context || this.$parent.$vnode.context });
							if('string'==typeof domPropsInnerHTML){	
								return (<td key={`${$index}${cellIndex}`} domPropsInnerHTML={domPropsInnerHTML}></td>);
							}else{
								return (<td key={`${$index}${cellIndex}`} >{domPropsInnerHTML}</td>);
							}
						})}
					  </tr>
					);
				})
			}
		</tbody>
		);
	}
};
