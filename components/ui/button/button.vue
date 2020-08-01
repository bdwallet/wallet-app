<template>
  <button
    class="btn"
	  type="button"
    @click="handleClick"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="submit?'submit':nativeType"
    :class="[
      type ? 'btn-' + type : '',
      buttonSize ? 'btn-' + buttonSize : '',
      {
        'btn-disabled': buttonDisabled,
        'btn-loading': loading,
        'btn-plain': plain,
        'btn-round': round,
		    'btn-circle': circle,
		    'btn-block': block
      }
    ]"
  >
    <i v-if="loading" class="icon icon-loading"></i>
    <i v-if="icon && !loading" class="icon" :class="icon" ></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
  import ripplet from './ripplet.js';
  export default {
    name: 'Button',
    inject: {
      uForm: {
        default: ''
      },
      uFormItem: {
        default: ''
      }
    },
    props: {
      type: {
        type: String,
        default: 'default'
      },
	  value: {
        type: String,
        default: 'default'
      },
	  ripplet:{
		type:Boolean,
		default:true
	  },
      size: String, // lg sm 
      icon: {
        type: String,
        default: ''
      },
      nativeType: {
        type: String,
        default: 'button'
      },
	  submit:Boolean,
      loading: Boolean,
      disabled: Boolean,
      plain: Boolean,
	  block:Boolean,
      autofocus: Boolean,
      round: Boolean,
	  plain: Boolean,
	  circle:Boolean,
	  icon:String
    },
    computed: {
      _uFormItemSize() {
        return (this.uFormItem || {}).uFormItemSize;
      },
      buttonSize() {
        return this.size || this._uFormItemSize || (this.$ELEMENT || {}).size;
      },
      buttonDisabled() {
        return this.disabled || (this.uForm || {}).disabled;
      }
    },
    methods: {
		handleClick(evt) {
			this.$emit('click', evt);
			var isIE = new RegExp("MSIE (\\d+\\.\\d+);").test(navigator.userAgent);
			if(isIE){
				if(parseFloat(RegExp["$1"])==9)return;
			}
			this.ripplet && ripplet(evt,{},this.$el);
      }
    }
  };
</script>