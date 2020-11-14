function EventStop(e){
	e.stopPropagation();
	e.preventDefault();
}
function drag(options) {
	this.area = options.area;
	this.mousedDown = false;
	this.areaRange = options.areaRange;
	this.size = options.size;
	this.mask = options.mask;
	this.initPos = {
		left: options.left,
		top: options.top
	};
	this.initWH = {
		w: this.area.offsetWidth || parseInt(this.area.style.width),
		h: this.area.offsetHeight || parseInt(this.area.style.height)
	};
	this.startPos = {
		x: 0,
		y: 0
	};
	this.onMove = options.custom.onMove;
	this.onResize = options.custom.onResize;
	this.minWidth = options.custom.minWidth;
	this.minHeight = options.custom.minHeight;
	this.lockWHScale = options.custom.lockWHScale;
	this.pTop = this.pLeft = 0;
	this.bindEvts();
}
drag.prototype = {
	constructor: drag,
	bindEvts() {
		this._mousedown = this.area.addEventListener('mousedown', this.mousedown.bind(this), false)
	},

	mousedown(e) {
		this._mousemove = document.addEventListener('mousemove', this.mousemove.bind(this), false);
		this._mouseup = document.addEventListener('mouseup', this.mouseup.bind(this), false);
		EventStop(e);
		this.mousedDown = true;  
		this.target = e.target;
		this.startPos.x = e.pageX;
		this.startPos.y= e.pageY;
	},

	moveTo(pTop, pLeft) {
		var eleStyle = this.area.style;
		eleStyle.top = pTop + 'px';
		eleStyle.left = pLeft + 'px';
		this.pTop = pTop;
		this.pLeft = pLeft;
		//this.pW = this.initWH.w;
		//this.pH = this.initWH.h;
		this.resizeMask()
		this.onMove(pTop, pLeft);
	},

	mousemove(e) {
		EventStop(e);
		if (this.mousedDown) {
			let isResize = this.target.tagName.toLowerCase() === 'i';
			if (isResize) {
				this.handlerResize(e); // 调整尺寸
			} else {
				this.handlerMove(e); // 移动位置
			}
		}
		return false;
	},

	handlerMove(e) {
		var x = e.pageX;
		var y = e.pageY;
		var pLeft = this.initPos.left;
		var pTop = this.initPos.top;
		pLeft += (x - this.startPos.x);
		pTop += (y - this.startPos.y)
		if (pLeft > this.areaRange.maxLeft) {
			pLeft = this.areaRange.maxLeft;
		} else if (pLeft < this.areaRange.minLeft) {
			pLeft = this.areaRange.minLeft;
		}

		if (pTop > this.areaRange.maxTop) {
			pTop = this.areaRange.maxTop;
		} else if (pTop < this.areaRange.minTop) {
			pTop = this.areaRange.minTop;
		}
		this.moveTo(pTop, pLeft);
	},
	handlerResize(e) {

		var x = e.pageX, y = e.pageY, 
			xy = this.target && this.target.getAttribute('data-pos').split(',') || [1, 1],
			X = xy[0] - 0, Y = xy[1] - 0,
			diffX = (x - this.startPos.x) * X, diffY = (y - this.startPos.y) * Y,
			pW = this.initWH.w, pH = this.initWH.h,
			pLeft = this.initPos.left, pTop = this.initPos.top,
			disLeft = false, disTop = false, disW = false, disH = false,
			eleStyle = this.area.style, dx, dy;
		 if (this.lockWHScale) {
			dx = Math.abs(diffX), dy = Math.abs(diffY);
			if ((Y > 0 || Y < 0) && X === 0) {
				diffX = diffY = (diffY >= 0 ? dy : -dy);
			} else {
				// 目前优先 X
				diffX = diffY = (diffX >= 0 ? dx : -dx);
			}
		}
		pW += diffX;
		pH += diffY;
		if (X < 0) pLeft -= diffX;
		if (Y < 0) pTop -= diffY;

		if (pLeft > (this.size.width - this.minWidth)) {
			pW += (pLeft - this.areaRange.maxLeft);
			pLeft = this.areaRange.maxLeft;
			disLeft = true;
		} else if (pLeft < this.areaRange.minLeft) {
			pW += (pLeft - this.areaRange.minLeft);
			pLeft = this.areaRange.minLeft;
			disLeft = true;
		}
		if (pTop > (this.size.height - this.minHeight)) {
			pH += (pTop - this.areaRange.maxTop);
			pTop = this.areaRange.maxTop;
			disTop = true;
		} else if (pTop < this.areaRange.minTop) {
			pH += (pTop - this.areaRange.minTop);
			pTop = this.areaRange.minTop;
			disTop = true;
		}
		if (pW + pLeft > this.size.width) {
			pW = this.size.width - pLeft;
			disW = true;
		} else if (pW < this.minWidth) {
			if (X < 0) {
				pLeft += (pW - this.minWidth);
			} else {
				disW = true;
			} 
			pW = this.minWidth;
		}
		if (pH + pTop > this.size.height) {
			pH = this.size.height - pTop;
			disH = true;
		} else if (pH < this.minHeight) {
			if (Y < 0) {
				pTop += (pH - this.minHeight);
			} else {
				disH = true;
			} 
			pH = this.minHeight;
		}
		if (this.lockWHScale) {
			var pw = pW, ph = pH, wp = pW / pH, hp = this.initWH.w / this.initWH.h;
			if (wp >= hp) {
				pW = pH * hp;
				if (X < 0) {
					pLeft -= (pW - pw);
				}
			} else if (wp < hp) {
				pH = pW * this.initWH.h / this.initWH.w;
				if (Y < 0) {
					pTop -= (pH - ph);
				}
			}
		}


		if (!disW) {
			eleStyle.left = pLeft + 'px';
			this.pLeft = pLeft;
		}
		if (!disH) {
			eleStyle.top = pTop + 'px';
			this.pTop = pTop;
		}

		eleStyle.width = pW + 'px';
		this.pW = pW;
		eleStyle.height = pH + 'px';
		this.pH = pH;
		if (!disLeft || !disTop) {
			this.onResize(this.pW, this.pH);
		}
		this.resizeMask();
		this.onMove(this.pTop, this.pLeft);
	},
	
	resizeMask(){
		let mask_l_w = this.pLeft,
		mask_r_w = this.size.width - mask_l_w - this.pW, 
		mask_t_h = this.pTop,
		mask_t_w = this.size.width - mask_l_w - mask_r_w,
		mask_b_h = this.size.height-this.pH-mask_t_h;
		
		// 左
		this.mask.l.style.width  = mask_l_w+'px'
		
		// 右
		this.mask.r.style.width  = mask_r_w+'px'
		
		// 上
		this.mask.t.style.width  = mask_t_w +'px'
		this.mask.t.style.left   = mask_l_w+'px'
		this.mask.t.style.height = mask_t_h+'px'
		
		// 下
		this.mask.b.style.left   = mask_l_w+'px'
		this.mask.b.style.width  = mask_t_w +'px'
		this.mask.b.style.height = mask_b_h+'px'
	},

	mouseup(e) {
		e && EventStop(e);
		this.mousedDown = false;
		this.startPos.x = 0;
		this.startPos.y= 0;
		this.initWH.w = this.pW;
		this.initWH.h = this.pH;
		this.initPos.left = this.pLeft;
		this.initPos.top = this.pTop;
		this._mousemove && document.removeEventListener('mousemove', this._mousemove, false);
		this._mouseup && document.removeEventListener('mouseup', this._mouseup, false);
		this._mousemove = null;
		this._mouseup = null;
	},

	destroy() {
		this.area.removeEventListener('mousedown', this._mousedown, false);
		this.area = null;
		return null;
	}
}
export default drag