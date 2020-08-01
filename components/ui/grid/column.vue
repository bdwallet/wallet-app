<template>
  <div class="column" :class="getClass()">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'Column',
    props: {
      col: {
        type: Number,
        default: 24
      },
	  offset: {
        type: Number,
        default: 0
      },
    },
	methods: {
		getClass(){
			let col = `column-${this.col||24}`;
			let offset = this.offset>0?` column-offset-${this.col}`:'';
			return col + offset
		}
    }
  };
</script>

