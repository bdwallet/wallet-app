<template>
    <a v-if="href" :href="href" :target="target" class="menu-item" :class="{disabled,current}" @click="handleClick">
		<i v-if="icon" class="icon" :class="icon" ></i>
		<span v-if="$slots.default"><slot></slot></span>
	</a>
	<a v-else class="menu-item" :class="{disabled,current}" @click="handleClick">
		<i v-if="icon" class="icon" :class="icon" ></i>
		<span v-if="$slots.default"><slot></slot></span>
	</a>
</template>
<script>
	export default {
		name: 'MenuItem',
		props: {
			href: {
				type: String,
				default: ''
			},
			target: {
				type: String,
				default: '_self'
			},
			
			icon: {
				type: String,
				default: 'icon-default'
			},
			width:{
				type: String,
				default: ''
			},
			current: Boolean,
			disabled: Boolean
		},
		methods: {
			stopDefault(e){
				if ( e && e.preventDefault ){
					e.preventDefault(); 
				}else{
					window.event.returnValue = false; 
				}
			},
			handleClick(evt) {
				if(!this.disabled){
					this.$emit('click', evt);
				}else{
					this.stopDefault(evt)
				}
			}
		}
	};
</script>