export default {
  name: 'TableHeader',
  props: {
    columns: Array
  },

  computed: {
    cols() {
      return this.$parent.columns;
    },
  },
  
  props: {
	data:{
		type: Array,
		default: function() {
			return [];
		}
		}
	},

  methods: {
    handleToggleSelectAll(isCheck) {
      this.$parent.handleToggleSelectAll(isCheck);
    },
  },
  render(h) {
	  return (
		<thead><tr>
          {
            this._l(this.cols, (column, cellIndex) => {
              return (<th key={cellIndex}>{column.label}</th>);
            })
          }
        </tr>
      </thead>
	);
  }
};
