<template>
	<ul class="comp-anonymous-selector" :class="{show:show}">
		<li @click.stop="select(0)">
			<div class="wrap-left">
				<img :src="src" />
				<div class="info">
					<div class="name" v-if="isLogin">实名：{{userInfo.user_name}}</div>
					<div class="name" v-else>未登录用户</div>
					<div class="mark">老子要红，币圈爆料一哥就是我</div>
				</div>
			</div>
			<div class="queren" v-show="checked==0">
				<i class="icon icon-shixin-queren"></i>
			</div>
		</li>
		<li @click.stop="select(1)">
			<div class="wrap-left">
				<div class="com-anonym">
					<i class="icon icon-spy"></i>
				</div>
				<div class="info">
					<div class="name">匿名：系统将隐去您的大名</div>
					<div class="mark">做一名在黑暗中拔剑的隐士</div>
				</div>
			</div>
			<div class="queren" v-show="checked==1">
				<i class="icon icon-shixin-queren"></i>
			</div>
		</li>
	</ul>
</template>
<script>
    import './style';
	import Global from '~script/global';
    import store from '~script/store';
	export default {
		name: 'compAnonymousSelector',
		props:{
			checked:0, //0.实名  1.匿名
		},
		data() {
			return {
				show:0,
			}
		},
		computed: {
			userInfo() {
				return store.getters.userInfo;
			},
			isLogin() {
				return (this.userInfo && this.userInfo.user_id) ? 1 : 0;
			},
			src(){
				return this.isLogin ? this.userInfo.user_photo : Global.noavatar;
			}
		},
		methods: {
			select(v) {
				this.$emit('checked', v);
				this.hide();
				Backdrop.hide();
			},
			hide(){
				this.show = 0;
				setTimeout(() => {
            		//移除DOM
            		let parent = this.$el.parentNode
            		parent && parent.removeChild(this.$el);
				}, 300);
			}
		},
		mounted(){
			Backdrop.show(this.hide);
			this.show = 1;
		}
	}
</script>