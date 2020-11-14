<template>
  <div class="dropdown">
    <slot name="trigger" class="dropdown-trigger"></slot>
    <transition name="fade">
      <div class="dropdown-container" :style="customStyle||containerStyle" ref="popper" v-show="isShow">
        <div class="dropdown-content">
          <slot name="content"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name:'Dropdown',
  props: {
    trigger: {
      type: String,
      default: 'click',
    },
	customStyle: Object
  },
  data(){
	return {
		button: null,
		popper: null,
		isShow: false,
		btnHeight:0
	}
  },
  methods: {
	init(){
		var trigger = this.$slots.trigger;
		var button = this.$el.children[0];
		
		if(trigger && trigger.length){
			var slot = trigger[0].elm;
			if(slot) button = slot;
		}
		
		this.button = button;
		this.popper = this.$refs.popper;
		this.bindEvent();
		this.btnHeight = button.offsetHeight
	},
	show() {
		this.isShow = true;
    },
	hide() {
		this.isShow = false;
    },
	handleClick(e) {
		e.stopPropagation();
		let isButton = this.button==e.target || this.button.contains(e.target)
		
		if (isButton) {
			if (this.isShow) {
				this.hide();
			} else {
				this.show();
			}
		} else if (this.popper.contains(e.target)) {
			this.show();
		} else {
			if (this.isShow) this.hide();
		}
    },
	bindEvent() {
		const button = this.button;
		const popper = this.popper;
		if (!button || !popper) return;
		if (this.trigger === 'hover') {
			button.addEventListener('mouseenter', this.show);
			button.addEventListener('mouseleave', this.hide);
			popper.addEventListener('mouseenter', this.show);
			popper.addEventListener('mouseleave', this.hide);
		} else {
			button.addEventListener('click', this.handleClick);
			document.documentElement.addEventListener('click', this.handleClick);
		}
    }
  },
  computed: {
	containerStyle(){
		
		return { top: this.btnHeight+10 + 'px' }
	}

},
  mounted() {
		this.init();
  }
};
</script>
<style lang="less">
.dropdown{
	position:relative;
}
.dropdown-container{
	position:absolute;
	left:0;
	top:0;
}
</style>