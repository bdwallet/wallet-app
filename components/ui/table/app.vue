<template>
  <table class="table" :class="[{'table-striped': striped,'table-block': block,'table-border': border}]">
	<colgroup><col v-for="(col,index ) in cols" :key="index" :width="col"></colgroup>
    <slot></slot>
    <table-header :data="data" v-if="thead"></table-header>
	<table-body :data="data"></table-body>
  </table>
</template>
<script>
import TableHeader from './header'
import TableBody from './body'
export default {
	name: 'Table',
	components: {
		TableHeader,
		TableBody
	},
	data() {
		return {
			cols:[],
			columns:[]
		}
	},
	props: {
		striped: Boolean,
		border: Boolean,
		thead: {
			type:Boolean,
			default:true
		},
		block:Boolean,
		data:{
			type: Array,
			default: []
		}
	},
	mounted() {
		this.columns.forEach((column) => {
			this.cols.push(column.width);
		});
	},
	methods:{

	}
};
</script>