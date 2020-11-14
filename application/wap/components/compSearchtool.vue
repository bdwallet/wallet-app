<template>
	<div class="comp-searchtool">
		<div class="search-box" style="border-color: #eee">
			<span class="sousuo">
				<i class="icon icon-sousuo"></i>
			</span>
			<form action="" @submit.prevent="">
				<input type="search" maxlength="16" :placeholder="placeholder" v-model="value" :disabled="$route.name != 'search'" ref="input" @keyup="keyup">
			</form>
			<span class="delete" @click="del" v-show="showdel">
				<i class="icon icon-quxiao"></i>
			</span>
		</div>
		<button v-if="$route.name == 'search'" @click="search">搜索</button>
	</div>
</template>

<script>
	export default {
		name: 'compSearchtool',
		data() {
			return {
				oldword: '', //上一次的数据
			}
		},
		props: {
			value: {
				default: ""
			},
			placeholder: {
				default: '搜索项目'
			}
		},
		computed: {
			showdel() {
				return this.value.length
			}
		},
		methods: {
			keyup(evt) {
				if (evt.keyCode == 13) {
					this.search()
				}
			},
			del() {
				this.value = "";
				this.$emit('input', this.value);
			},
			search() {
				if (this.value == this.oldword) return;
				this.oldword = this.value;
				if (!this.value) return; //没有值 不让搜索
				this.$ajax.post(this.$api.apply.update_search, {
					search_word: this.value,
					search_type: 0
				});
				this.$emit('input', this.value);
				this.$emit('search', this.value);
			}
		}
	}
</script>
<style lang="less" scoped>
	@import "../assets/css/config";
	.comp-searchtool {
		position: fixed;
		top: 0;
		z-index: 5;
		display: flex;
		width: 100%;
		max-width: 768px;
		height: 2.5rem;
		padding: 0.4rem 0.75rem;
		background-color: @bgcolor-body;
		.search-box {
			position: relative;
			flex: 1;
			font-size: 0.65rem;
			text-align: center;
			background-color: @color-basics;
			border: 1px solid @color-border-item;
			border-radius: 0.2rem;
			span {
				position: absolute;
				top: 0;
				height: 100%;
				color: @color-placeholder;
				z-index: 2;
				height: 1.6rem;
				color: #8E8E93;
				i {
					font-size: 0.7rem;
					line-height: 1.6rem;
				}
				&.sousuo {
					left: 0.5rem;
				}
				&.delete {
					right: 0;
					padding: 0 0.5rem;
					color: #D6D6DB;
				}
			}
		}
	}
	input {
		display: block;
		flex: 1;
		width: 100%;
		height: 1.6rem;
		line-height: 0.85rem;
		padding: 0.425rem 1.55rem;
		font-size: 0.75rem;
		-webkit-appearance: none;
		outline: none;
		box-sizing: border-box;
		vertical-align: middle;
		background-color: @color-basics;
		border: 0;
		border-radius: 0.2rem;
	}
	input,
	span,
	i,
	button {
		-webkit-tap-highlight-color: rgba(255, 255, 255, 0);
	}
	button {
		width: 2.25rem;
		padding: 0;
		color: @color-link;
		font-size: 0.75rem;
		text-align: right;
		outline: none;
		border: 0;
		background-color: transparent;
	}
	input::-webkit-input-placeholder {
		color: @color-placeholder !important;
	}
	input::input-placeholder {
		color: @color-placeholder !important;
	}
	input:disabled {
		color: @color-placeholder !important;
	}
	input[type="search"]::-webkit-search-cancel-button {
		display: none;
	}
	input[disabled],
	input:disabled,
	input.disabled {
		-webkit-text-fill-color: @color-placeholder !important;
		-webkit-opacity: 1;
		opacity: 1;
	}
</style>