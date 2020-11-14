<template>
  <div class="page"  v-show="show">
	<div class="btn-group">
	  <span class="btn btn-outline" :class="{disabled:pstart}" @click="currentPage--">上一页</span>
	  <span v-show="currentPage>5" class="btn" @click="jump(1)">1</span>
	  <span class="btn"  v-show="efont">...</span>
	  <span class="btn" v-for="num in indexs" :class="{current:currentPage==num}" @click="jump(num)">{{num}}</span>
	  <span class="btn"  v-show="ebehind">...</span>

	  <span :class="{disabled:pend}" class="btn" @click="currentPage++">下一页</span>
	  <span v-show="currentPage<pages-4" class="btn" @click="jump(pages)">{{pages}}</span>

	  <span class="btn">跳转到：</span>
	  <span class="btn"><input class="input-sm" type="text" v-model="to"></span>
	  <span class="btn" @click="jump(to)">GO</span>
	</div>
  </div>
</template>
<script>
  export default {
    name: 'Page',
	data(){
		return {
			currentPage:0,
			to:'',//跳转页
		}
	},
    props: {
		current:{
			type: Number,
			default: 0
		},
		pages:{
			type: Number,
			default: 0
		},
		lengs:{
			type: Number,
			default: 5
		}
    },
    computed: {
		show:function(){
			return this.pages && this.pages !=1
		},
		pstart: function() {
			return this.currentPage == 1;
		},
		pend: function() {
			return this.currentPage == this.pages;
		},
		efont: function() {
			if (this.pages <= 7) return false;
			return this.currentPage > 5
		},
		ebehind: function() {
			if (this.pages <= 7) return false;
			var nowAy = this.indexs;
			return nowAy[nowAy.length - 1] != this.pages;
		},
		indexs: function() {
			var left = 1,
			right = this.pages,
			ret = [];
			if (this.pages >= 7) {
				if (this.currentPage > 5 && this.currentPage < this.pages - this.lengs - 4) {
					left = Number(this.currentPage) - 3;
					right = Number(this.currentPage) + 3;
				} else {
					if (this.currentPage <= 5) {
						left = 1;
						right = 7;
					} else {
					
						right = this.pages;
						left = this.pages - 6;
					}
				}
			}
			while (left <= right) {
				ret.push(left);
				left++;
			}
			return ret;
		}
    },
    methods: {
		jump: function(id) {
			this.currentPage = id;
		}
    },
	mounted() {
		this.currentPage = this.current;
	}
  };
</script>