<template>
  <div class="panel" :style="{width}">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'Panel',
	props: {
		width:{
			type: String,
			default: ''
		}
	}
  };
</script>