/**
 * YangFei
 * http://yangfei.name
 */
import offset from './offset'
import drag from './drag'
export default {
	name:'uploadCrop',
	props: {
		options:Object,
		src:String
	},
	data(){
		return {
			ui:{
				// 镜头边框
				side:[
						{k:'sl',p:'-1,0'},{k:'sr',p:'1,0'},{k:'st',p:'0,-1'},{k:'sb',p:'0,1'}
					],
				// 镜头交点
				dot:[
						{k:'dl',p:'-1,0'},{k:'dr',p:'1,0'},{k:'dt',p:'0,-1'},{k:'db',p:'0,1'},
						{k:'dlt',p:'-1,-1'},{k:'drt',p:'1,-1'},{k:'dlb',p:'-1,1'},{k:'drb',p:'1,1'}
					]
			},
			defaults:{
				width: 50, // 裁剪框初始宽度
				height: 50,  // 裁剪框初始高度
				lock: false, // 是否锁定裁剪框初比例
				center: true, // 裁剪框是否居中
				top: 0, // 裁剪框顶部距离
				left:0,// 裁剪框左部距离
				minHeight: 50, // 裁剪框的最小高度
				minWidth: 50, // 裁剪框最小宽度
				minImgWidth: 200, // 预览区最小宽度
				minImgHeight: 200, // 预览区最小高度
				cutting: function() {} // 裁剪实时回调
			},
			
			// 缩放率
			scale : {w: 1, h: 1},
			containerHeight:0,
			containerWidth:0,
			// 图片宽度
			originWidth:0,
			// 图片高度
			originHeight:0,
			areaRange:{},
			drag:null,
			info:null
		}
	},
	methods: {
		save: function() {
			this.$emit('save');
		},
		close(){
			this.$emit('close');
		},
		initImage(e){
			this.el.image.onload = () => {
				this.originWidth = this.el.image.width;
				this.originHeight = this.el.image.height;
				this.init()
			}

			// 禁止图像拖拽
			this.el.image.ondragstart = () => false;
		},
		init() {
			this.checkImg();
			this.areaRange = {
				minTop  : 0,
				minLeft : 0,
				maxTop  : this.containerHeight - this.options.height,
				maxLeft : this.containerWidth - this.options.width
			};
			
			let offs = offset(this.el.image), dS = {pageX: 0, pageY: 0};

			if (this.areaRange.maxTop < 0) this.areaRange.maxTop = 0;
			if (this.areaRange.maxLeft < 0) this.areaRange.maxLeft = 0;
			this.bindEvts();
			if (this.areaRange.maxTop < 0 || this.areaRange.maxLeft < 0) {
				dS.pageX = (offs.left + this.containerWidth) * 2;
				dS.pageY = (offs.top + this.containerHeight) * 2;
			}
			this.drag.initPos.left = this.options.left;
			this.drag.initPos.top = this.options.top;
			this.drag.handlerResize(dS);
			this.resizeContainer();
			
			// 镜头显示在中心
			if (this.options.center) {
				this.drag.moveTo(this.containerHeight / 2 - this.drag.pH / 2, this.containerWidth / 2 - this.drag.pW / 2);
			}
			this.drag.mouseup();
		},
		resizeContainer(){
			let width = this.el.container.offsetWidth;
			let Height = this.el.container.offsetHeight;
			this.el.container.style.cssText = `margin-left:${-width/2}px;margin-top:${-Height/2}px;`
		},
		checkImg () {
			var imageWidth = this.el.image.offsetWidth;
			var imageHeight = this.el.image.offsetHeight;
			var containerWidth = 300;
			var containerHeight = containerWidth / imageWidth * imageHeight
			this.el.image.style.width = containerWidth  + 'px';
			this.el.image.style.height = containerHeight + 'px';
			this.el.main.style.width = containerWidth + 'px';
			this.el.main.style.height = containerHeight + 'px';
			this.containerWidth = containerWidth;
			this.containerHeight = containerHeight;
		},
		bindEvts() {
			// 销毁拖拽对象
			if (this.drag) this.drag.destroy();
			this.drag = new drag({
				area:this.el.area,
				areaRange:this.areaRange,
				size:{
					width: this.containerWidth,
					height: this.containerHeight
				},
				mask:this.el.mask,
				custom:{
					minWidth    : this.options.minWidth,
					minHeight   : this.options.minHeight,
					onMove      : this.cutting.bind(this),
					onResize    : this.onResize.bind(this),
					lockWHScale : this.options.lock
				}
			});
		},
		// 拖拽回调
		cutting(top, left) {
			if (!this.drag) return {};
			let info = {
				area:this.getAreaInfo(),
				origin:this.getOriginInfo()
			}
			this.info = info;
			this.$emit('onCrop',info)
		},
		// 调整尺寸
		onResize(w, h) {
			this.areaRange.maxTop  = this.containerHeight - this.drag.pH;
			this.areaRange.maxLeft = this.containerWidth - this.drag.pW;
			this.computeScale(w, h);
		},
		// 计算比例
		computeScale(w, h) {
			if (this.preImgContainer) {
				this.scale.w = w / this.preImgContainer.offsetWidth;
				this.scale.h = h / this.preImgContainer.offsetHeight;
			}
		},
		// 获取裁剪尺寸
		getAreaInfo(){
			return {
				"top"    : this.drag.pTop,
				"left"   : this.drag.pLeft,
				"width"  : this.drag.pW,
				"height" : this.drag.pH
			}
		},
		// 获取原图裁剪尺寸
		getOriginInfo() {
			var scaleX = this.originWidth / this.containerWidth, scaleY = this.originHeight / this.containerHeight;
			return {
				"top"    : Math.round(this.drag.pTop * scaleY),
				"left"   : Math.round(this.drag.pLeft * scaleX),
				"width"  : Math.round(this.drag.pW * scaleX),
				"height" : Math.round(this.drag.pH * scaleY)
			}
		}
	},
	computed: {
		// 裁剪框初始宽度
		areaWidth(){
			return this.options.width+'px'
		},
		// 裁剪框初始高度
		areaHeight(){
			return this.options.height+'px'
		},
		el(){
			// 容器
			let container = this.$refs.container,
			main = this.$refs.main,
			// 裁剪框区域
			area = this.$refs.area,
			// 裁剪图片
			image = this.$refs.img,
			// 裁剪框遮罩
			mask = {
				l:this.$refs['euc-mask-sl'][0],
				r:this.$refs['euc-mask-sr'][0],
				t:this.$refs['euc-mask-st'][0],
				b:this.$refs['euc-mask-sb'][0]
			}
			return {container, main, area, image, mask}
		}
	},
	mounted() {
		// 合并参数初始化
		this.options = Object.assign(this.defaults,this.options);
		this.initImage();			
	}
}