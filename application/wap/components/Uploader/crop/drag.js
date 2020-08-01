function EventStop(e){
	// e.stopPropagation();
	// e.preventDefault();
}
function drag(options) {
	this.main = options.main;
	this.image = options.image;
	this.area = options.area;
	this.changeScale = 0;
	this.startScale = this.finalScale = options.scale;
	this.originImg = options.originImg;
	this.areaInfo = options.areaInfo;
	this.cropOffset = options.cropOffset;
	this.defaultOffset = options.defaultOffset;
	this.onMove = options.custom.onMove;

	// // 手指是否按下
	this.touchStart = false;
	// // 单指触摸的位置
	this.startPosOne = {
		x: 0,
		y: 0
	};
	// //两指触摸的位置
	this.startPosTwo = [];
	this.initPos = {
		x: 0,
		y: 0
	};

	// 偏移
	this.changeOffset = {
		x: 0,
		y: 0
	};

	// 偏移范围
	this.offsetRange = {
		minX: 0,
		minY: 0,
		maxX: this.originImg.width * this.finalScale - this.areaInfo.width,
		maxY: this.originImg.height * this.finalScale - this.areaInfo.height
	};
	this.scaleOffsetX = this.scaleOffsetY = 0;
	this.bindEvts();
}
drag.prototype = {
	constructor: drag,
	bindEvts() {
		this._touchstart = this.main.addEventListener('touchstart', this.touchstart.bind(this), false)
	},

	touchstart(e) {
		EventStop(e);
		this.touchStart = true;
		if(e.touches.length == 1){
			this.startPosOne.x = e.touches[0].pageX;
			this.startPosOne.y= e.touches[0].pageY;
		}else if(e.touches.length == 2){
            this.startPosTwo[0] = {x:e.touches[0].pageX,y:e.touches[0].pageY};
            this.startPosTwo[1] = {x:e.touches[1].pageX,y:e.touches[1].pageY};
        }
		this._touchmove = document.addEventListener('touchmove', this.touchmove.bind(this), false);
		this._touchend = document.addEventListener('touchend', this.touchend.bind(this), false);
	},

	touchmove(e) {
		EventStop(e);
		if (this.touchStart) {
			if(e.touches.length == 1){
				this.handlerMove(e); // 移动位置
			}else if(e.touches.length == 2){
				this.handlerScale(e); //缩放图片
			}
		}
		return false;
	},

	handlerMove(e) {
		// 移动
		let x = e.touches[0].pageX,
			y= e.touches[0].pageY,
			offX = this.initPos.x,
			offY = this.initPos.y;

		offX += (x - this.startPosOne.x);
		offY += (y - this.startPosOne.y);

		this.changeOffset.x = offX;
		this.changeOffset.y = offY;

		this.moveTo(this.finalScale, offX, offY);
	},
	moveTo(scale, offX, offY) {
		let eleStyle = this.image.style;
		eleStyle.transform =
		eleStyle.webkitTransform = `translate(${this.defaultOffset.x + offX}px, ${this.defaultOffset.y + offY}px) scale(${scale})`;
	},
	handlerScale(e){
		// 缩放
		let nowPoint = [];
		nowPoint[0] = {x:e.touches[0].pageX,y:e.touches[0].pageY};
		nowPoint[1] = {x:e.touches[1].pageX,y:e.touches[1].pageY};
		let startDistance = this.getDis(this.startPosTwo[0],this.startPosTwo[1]);
		let nowDistance = this.getDis(nowPoint[0],nowPoint[1]);
		this.changeScale = nowDistance / startDistance * this.finalScale;
		this.moveTo(this.changeScale, this.initPos.x, this.initPos.y);
	},
	getDis(point1,point2){
		// 计算两点之间的距离
		let x = point2.x - point1.x;
		let y = point2.y - point1.y;
		return Math.sqrt(x*x + y*y);
	},

	touchend(e) {
		e && EventStop(e);
		this.touchStart = false;
		this.startPosOne.x = 0;
		this.startPosOne.y= 0;
		this.startPosTwo = [];

		this._touchmove && document.removeEventListener('touchmove', this._touchmove, false);
		this._touchend && document.removeEventListener('touchend', this._touchend, false);
		this._touchmove = null;
		this._touchend = null;
		if(this.changeScale < this.startScale){
			this.changeScale = this.startScale;
			this.moveTo(this.changeScale, 0, 0);
		}else if(this.changeScale / this.startScale > 1.5){
			this.changeScale = this.startScale * 1.5;
			this.moveTo(this.changeScale, 0, 0);
		}
		// 保存
		this.finalScale = this.changeScale;

		this.moveRange(this.changeOffset.x, this.changeOffset.y, this.finalScale);

		// 保存
		this.cropOffset = {
			x: this.changeOffset.x,
			y: this.changeOffset.y
		};
		if(this.changeScale){
			this.scaleOffsetX = -(this.originImg.width * this.finalScale - this.originImg.width * this.startScale) / 2;
			this.scaleOffsetY = -(this.originImg.height * this.finalScale - this.originImg.height * this.startScale) / 2;
			this.cropOffset = {
				x: this.scaleOffsetX  + this.changeOffset.x,
				y: this.scaleOffsetY + this.changeOffset.y
			};
		}
		this.initPos = {
			x: this.changeOffset.x,
			y: this.changeOffset.y
		}
		this.onMove(this.cropOffset, this.finalScale);
	},
	moveRange(x, y, s){
		if(this.changeScale){
			this.offsetRange = {
				maxX: this.originImg.width * s - this.areaInfo.width,
				maxY: this.originImg.height * s - this.areaInfo.height
			};
		}
		if(x > 0){
			if(this.changeScale != this.startScale){
				if(x > Math.abs(this.scaleOffsetX)){
					this.changeOffset.x = Math.abs(this.scaleOffsetX);
				}
			}else{
				this.changeOffset.x = 0;
			}
		}else if(x < 0){
			if(this.changeScale != this.startScale){
				if(Math.abs(x) > Math.abs(this.scaleOffsetX)){
					this.changeOffset.x = -Math.abs(this.scaleOffsetX);
				}
			}else{
				// this.changeOffset.x = 0;
				if(Math.abs(x) > Math.abs(this.offsetRange.maxX)){
					this.changeOffset.x = -Math.abs(this.offsetRange.maxX);
				}
			}
		}
		if(y > 0){
			if(this.changeScale != this.startScale){
				if(y > Math.abs(this.scaleOffsetY)){
					this.changeOffset.y = Math.abs(this.scaleOffsetY);
				}
			}else{
				this.changeOffset.y = 0;
			}
		}else if(y < 0){
			if(this.changeScale != this.startScale){
				if(Math.abs(y) > Math.abs(this.scaleOffsetY + this.offsetRange.maxY) ){
					this.changeOffset.y = -Math.abs(this.scaleOffsetY + this.offsetRange.maxY);
				}
			}else{
				if(Math.abs(y) > Math.abs(this.offsetRange.maxY)){
					this.changeOffset.y = -Math.abs(this.offsetRange.maxY);
				}
			}
		}

		this.moveTo( s, this.changeOffset.x, this.changeOffset.y);
	},

	destroy() {
		this.main.removeEventListener('touchstart', this._touchstart, false);
		this.area = null;
		return null;
	}
}
export default drag
