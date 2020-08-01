import drag from './drag'
export default {
	name:'uploadCrop',
	props: {
		// options:Object,
		src:String
	},
	data(){
		return {
			ui:{
				// 镜头边框
				side:[
						{k:'sl',p:'-1,0'},{k:'sr',p:'1,0'},{k:'st',p:'0,-1'},{k:'sb',p:'0,1'}
					],
			},
			defaults:{
				width: 300, // 裁剪框宽度
				height: 300,  // 裁剪框高度
				cutting: function() {} // 裁剪实时回调
			},

			// 预览容器高宽
			previewWidth:0,
			previewHeight:0,

			// 原图尺寸 坐标
			originImg:{
				width: 0,
				height: 0,
				top: 0,
				left: 0
			},

			// 裁剪框尺寸 坐标
			areaInfo:{
				width: 0,
				height: 0,
				top: 0,
				left: 0
			},

			// 图片初始缩放比例
			scaleMag: 1,
			finalScale: 1,

			// 图片 与 裁剪框 的偏移量
			cropOffset:{
				x: 0,
				y: 0
			},

			// 默认偏移量，让图片与裁剪框的偏移量为0
			defaultOffset:{
				x: 0,
				y: 0
			},

			options: {},
			drag: null

		}
	},
	methods: {
		save: function() {
			this.$emit('cropSave');
		},
		close(){
			this.$emit('close');
		},
		initImage(e){
			// 获取图片预览容器的高宽
			let container = this.el.container;
			let previewBody = this.$refs.previewBody;
			previewBody.style.height = container.offsetHeight - 180 + 'px';
			previewBody.style.width = container.offsetWidth +'px';
			this.previewWidth = previewBody.offsetWidth;
			this.previewHeight = previewBody.offsetHeight;

			this.areaInfo = {
				width: this.options.width,
				height: this.options.height,
				top: (this.previewHeight - this.options.height) / 2,
				left: (this.previewWidth - this.options.width) / 2
			},

			this.el.image.onload = () => {
				let img = this.el.image;
				this.originImg = {
					width: img.width,
					height: img.height,
					top: this.areaInfo.top,
					left: this.areaInfo.left
				}
				this.init();

			}
			// 裁剪框居中
			this.moveTo(this.el.area.style, this.areaInfo.top, this.areaInfo.left);

		},
		moveTo(el, top, left){
			el.top = top + 'px';
			el.left = left + 'px';
		},
		init() {
			this.initImg();
			this.resizeMask();
			this.bindEvts();

		},
		initImg(){	// 图片初始化  图片与裁剪框对齐

			// 根据裁剪框设置图片的大小，让图片不小于裁剪框
			let img = this.el.image;
			let scaleX = this.areaInfo.width / this.originImg.width,
				scaleY = this.areaInfo.height / this.originImg.height;

			if(scaleX * this.originImg.width >= this.areaInfo.width && scaleX * this.originImg.height >= this.areaInfo.height){
				this.scaleMag = scaleX;
			}else{
				this.scaleMag = scaleY;
			}
			// 图片缩小  向右偏移量
			let scaleOffsetX = -((this.originImg.width - this.originImg.width * this.scaleMag) / 2),
				scaleOffsetY = -((this.originImg.height - this.originImg.height * this.scaleMag) / 2);
			this.defaultOffset.x = scaleOffsetX + this.areaInfo.left;
			this.defaultOffset.y = scaleOffsetY + this.areaInfo.top;

			img.style.transform =
			img.style.webkitTransform = `translate(${this.defaultOffset.x}px, ${this.defaultOffset.y}px) scale(${this.scaleMag})`;

			this.cutting();
		},

		resizeMask(){	// 设置裁剪遮罩的宽高
			let mask_l_w = (this.previewWidth - this.areaInfo.width)/2,
			mask_t_h = (this.previewHeight - this.areaInfo.height)/2;

			// 左
			this.el.mask.l.style.width  = mask_l_w+'px'

			// 右
			this.el.mask.r.style.width  = mask_l_w+'px'

			// 上
			this.el.mask.t.style.width  = this.areaInfo.width +'px'
			this.el.mask.t.style.left   = mask_l_w+'px'
			this.el.mask.t.style.height = mask_t_h+'px'

			// 下
			this.el.mask.b.style.left   = mask_l_w+'px'
			this.el.mask.b.style.width  = this.areaInfo.width +'px'
			this.el.mask.b.style.height = mask_t_h+'px'
		},
		bindEvts() {
			// 销毁拖拽对象
			if (this.drag) this.drag.destroy();
			this.drag = new drag({
				main: this.el.main,
				image: this.el.image,
				area: this.el.area,
				scale: this.scaleMag,
				originImg: this.originImg,
				areaInfo: this.areaInfo,
				cropOffset: this.cropOffset,
				defaultOffset: this.defaultOffset,

				custom:{
					onMove      : this.cutting.bind(this),
				// 	onResize    : this.onResize.bind(this),
				// 	onChange 	: this.onChange.bind(this)
				}
			});
		},
		// 拖拽回调
		cutting(offset, scale) {
			// 图片移动到的坐标
			// if (!this.drag) return {};
			this.cropOffset = offset || this.cropOffset;
			this.finalScale = scale || this.scaleMag;
			let info = {
				origin:this.getOriginInfo(scale)
			}
			this.$emit('onCrop',info);
		},

		// 获取原图裁剪尺寸
		getOriginInfo() {
			return {
				'top': this.cropOffset.y,
				'left': this.cropOffset.x,
				'width': this.originImg.width * this.finalScale,
				'height': this.originImg.height * this.finalScale
			};
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
			let container = this.$refs.container,
			// 拖动区域来控制图片的拖动
			main = this.$refs.main,
			// 图片
			image = this.$refs.img,
			// 裁剪框区域
			area = this.$refs.area,
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
		// this.options = Object.assign(this.defaults,this.options);
		this.options = this.defaults;
		this.initImage();
	}
}
