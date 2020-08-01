<template>
  <div class="ext-slider" :style="mainStyle" ref="main"  @mouseover="_showCtrl(true)" @mouseout="_showCtrl(false)">
    <ul class="ext-slider-ctrl" v-show="ctrlStat">
      <li class="ext-slider-prev" @click="prev"><icon type="prev" width="40" height="40" /></li>
      <li class="ext-slider-next" @click="next"><icon type="next" width="40" height="40" /></li>
    </ul>
    <ul class="ext-slider-list" :style="listStyle" ref="list"><slot/></ul>
	<div class="ext-slider-pos" :class="posStyle()" v-if="showPos" >
	  <ul class="ext-slider-title" v-if="showTitle">
	    <li v-for="(v,i) in items" :key="i" :class="{current:index==i}" @click="run(i)" v-text="getTitle(v)" />
	  </ul>
	  <ul class="ext-slider-counter" v-if="showNum">
	    <li v-for="(v,i) in items" :key="i" 
			:class="{current:index==i,num:posType=='num'}"
			v-text="posType=='num'?(i+1):''" 
			@click="run(i)" />
	  </ul>
	</div>
    
  </div>
</template>

<script>
import Icon from './icon';
import Tween from './tween';
export default {
	name:'extSlider',
	components: {
		Icon
	},
	props: {
		width:{ // 宽
			type: String,
			default: '100%'
		},
		height:{ // 高
			type: String,
			default: '200'
		},
		autoplay: { // 自动播放
			type: Boolean,
			default: true
		},
		speed: { // 播放速度
			type: Number,
			default: 3000
		},
		time: { // 滚动延时
			type: Number,
			default: 10
		},
		duration: { //滚动持续时间
			type: Number,
			default: 50
		},
		tween:{ // 缓动效果
			type: String,
			default: 'Quart.easeOut'
		},
		direction:{ // 滚动方向 left|top
			type: String,
			default: 'left'
		},
		posType:{ // 滚动方向 left|top
			type: String,
			default: 'dot'
		},
		showCtrl: { // 默认是否显示左右控制按钮
			type: Boolean,
			default: false
		},
		showPos: { // 默认是否显示左右控制按钮
			type: Boolean,
			default: true
		},
		showTitle: { // 默认是否显示左右控制按钮
			type: Boolean,
			default: true
		},
		showNum: { // 默认是否显示左右控制按钮
			type: Boolean,
			default: true
		}
		
	},
	
	data() {
		let [count,target,index,change,t,b,c] = new Array(7).fill(0)
		return {
			mainStyle:{}, // 容器尺寸
			listStyle:{}, // 列表盒子尺寸
			Tween:Tween.Quart.easeOut, // 缓动
			items:[], // 列表对象
			timer:null, // 定时器
			ctrlStat:false,
			count, // 总数
			target, // 目标值
			index, // 当前索引
			change, // 改变量
			t,
			b,
			c
		};
	},

	
	mounted(){

		
		// 容器
		this._main = this.$refs.main;
		
		// 列表
		this._list = this.$refs.list;
		
		if(!this.$slots.default || !this.$slots.default.length){
			this.$el.style.display = 'none' 
			return 
		}
	
		// 过滤无效列表slot
		this.items = this.$slots.default.filter(el=>el.tag)
		
		// 总数
		this.count = this.items.length;	
		
		this.mainStyle = this.getMainStyle();
		this.listStyle = this.getListStyle();

		// 设置缓动效果
		let tweens = this.tween.split('.')
		this.Tween = Tween[tweens[0]][tweens[1]]
		
		// 播放
		this.autoplay && this.run();
	},
	
	computed: {
	

	},
	methods: {
		posStyle(){
			if(this.showTitle && !this.showNum ){
				return 'only-title'
			}else if(this.showNum && !this.showTitle ){
				return 'only-num'
			}
		},
		getTitle(v){
			let img = v.elm.getElementsByTagName('img')[0];
			let alt = img.getAttribute('alt')
			return alt
		},
		// 显示左右控制
		_showCtrl(stat){
			if(this.showCtrl){
				this.ctrlStat = false
				return 
			}
			if(stat){
				this.stop()
				this.ctrlStat = true
			}else{
				this.autoplay && this.move()
				this.ctrlStat = false
			}
			
			
		},
		// 隐藏左右控制
		_hideCtrl(){
			this.autoplay && this.move()
			this.showCtrl = false
		},
		// 容器尺寸
		getMainStyle(){
			var width = this.width.indexOf('%')>0?this.width:this.width+'px';
			var height = this.height.indexOf('%')>0?this.height:this.height+'px';
			return {width, height}
		},
		// 列表盒子尺寸
		getListStyle(){
			let [width,height,itemWidth,itemHeight] = new Array(4).fill('100%')
			
			// 左右滚动计算宽度
			if(this.direction=='left'){
				itemWidth = this.width && this.width.indexOf('%')>0 ? this._main.clientWidth : parseInt(this.width)
				this.change = itemWidth
				width = (this.count * itemWidth) +'px';
				itemWidth = itemWidth + 'px';
			
			// 上下滚动计算高度
			}else{
				itemHeight = this.height && this.height.indexOf('%')>0 ? this._main.clientHeight : parseInt(this.height)
				this.change = itemHeight
				height = this.count * itemHeight +'px';
				itemHeight = itemHeight + 'px';
			}
			this.setItemStyle({ width:itemWidth, height:itemHeight})
			return {width, height}
		},
		// 设置图片尺寸
		setItemStyle(itemStyle = {width:0,height:0}){
			this.items.forEach(el=>{
				el.elm.style.width = itemStyle.width;
				el.elm.style.height = itemStyle.height;
			})
		},
		// 播放
		run(index = this.index) {
			let currentStyle = (element=document) => {
				return element.currentStyle || document.defaultView.getComputedStyle(element, null);
			}
			
			//修正index
			index < 0 && (index = this.count - 1) || index >= this.count && (index = 0);
			
			//设置参数
			this.target = -Math.abs(this.change) * (this.index = index);
			this.t = 0;
			this.b = parseInt(currentStyle(this._list)[this.direction]);
			this.c = this.target - this.b;
			this.move();
		},
		//移动
		move() {
			// 清除定时器
			clearTimeout(this.timer);

			//未到达目标继续移动否则进行下一次滑动
			if (this.c && this.t < this.duration) {
				this.moveTo(Math.round(this.Tween(this.t++, this.b, this.c, this.duration)));
				this.timer = setTimeout(this.move, this.time);
			}else{
				this.moveTo(this.target);
				this.autoplay && (this.timer = setTimeout(this.next, this.speed));
			}
		},
		//移动到
		moveTo(val = 0) {
			this._list.style[this.direction] = val + "px";
		},
		//下一个
		next() {
			this.run(++this.index);
		},
		//上一个
		prev() {
			this.run(--this.index);
		},
		//停止
		stop() {
			clearTimeout(this.timer);
			this.moveTo(this.target);
		}
	}
}
</script>
	
<style lang="less" src="./style.less" />