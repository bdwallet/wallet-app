<template>
    <div class="comp-radar" :style="{ height, width}">
        <canvas class="canvas" ref="canvas" :style="{ height, width}">
            您的浏览器暂不支持canvas
        </canvas>
    </div>
</template>

<script>
    import drawCanvas from '~script/drawCanvas'
    export default {
        name: "compRadar",
        data(){
            return {
                ctx:"", // canvas 2d 对象
                Canvas: {}, // Canvas 对象
                RadarCenter: '', // 雷达绘制中心点
                RAngle: '', // 对角线夹角度数
                mRadius: '', // 最小多边形的半径
                lineArr: [], // 存储坐标
                areaBackColor: [ // 背景颜色
                    'rgba(135, 147, 217, 0.1)', 'rgba(135, 147, 217, 0.2)',
                    'rgba(135, 147, 217, 0.4)', 'rgba(135, 147, 217, 0.5)',
                    'rgba(135, 147, 217, 0.6)', 'rgba(135, 147, 217, 1)'
                ].reverse(),
                sidesColor: [ // 边框颜色
                    'rgba(135, 147, 217, 0.1)', 'rgba(135, 147, 217, 0.2)',
                    'rgba(135, 147, 217, 0.4)', 'rgba(135, 147, 217, 0.5)',
                    'rgba(135, 147, 217, 0.6)', 'rgba(135, 147, 217, 1)'
                ].reverse(),
                fontSize: 18, // 字体大小
            }
        },
        props: {
            height: {
                type: String,
                default: "7.5rem"
            },
            width: {
                type: String,
                default: "7.5rem"
            },
            _Object: {
                type: Object,
                default: {
                    sidesNum: 6, // 多少个多边形
                    isGradient: 1, // 是否是背景渐变填充
                    isArea: 0, // 数据区域是否填充
                    isArc: 0, // 是否为圆形
                    dataArr: [ // 数据
                        { name: "技术安全", value: 0},
                        { name: "团队实力", value: 0},
                        { name: "产品使用", value: 0},
                        { name: "交易活跃度", value: 0},
                        { name: "运营情况", value: 0},
                        { name: "社区建设", value: 0},
                    ]
                }
            }
        },
        watch: {
            "_Object":  function (val) {
                if(val) {
                    // 每次开始时先清除画布
                    this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
                    // 开始绘制
                    this.Polygon();
                    (!val.isGradient || val.isArc) && this.LinesTop();
                    this.TextType();
                    this.DataArea();
                    this.Circles();
                    this.ToolTip()
                }
            },
        },
        methods: {
            // 绘制多边形边形
            Polygon () {
                // 确定绘制中心
                this.RadarCenter = this.Canvas.width/2;
                // 确定最大多边形的半径，80 为绘制文本预留空间
                this.mRadius = this.RadarCenter - 70 * drawCanvas.DPR();
                // 设置单位半径 即最小多边形半径
                let minR = this.mRadius/this._Object.sidesNum;
                // 获取对角线夹角的度数
                this.RAngle = (Math.PI * 2)/this._Object.dataArr.length;
                // 保存绘制路劲
                this.ctx.save();
                // 边框填充颜色
                if(!this._Object.isGradient) this.ctx.strokeStyle = Array.isArray(this.areaBackColor) ? this.areaBackColor[3] : this.areaBackColor;
                // 绘制多边形
                for (let n = 0; n < this._Object.sidesNum; n++) {
                    // 新的绘制路径开始
                    this.ctx.beginPath();
                    // 当前半径
                    let currR = minR * (n + 1);
                    // 绘制圆 或者 多边形
                    if(this._Object.isArc){ // 圆
                        this.ctx.arc(this.RadarCenter, this.RadarCenter, currR, 0, Math.PI * 2);
                    } else { // 绘制多边形的边
                        for (let m = 0; m < this._Object.dataArr.length; m++) {
                            // 获取多边形每个顶点坐标 现在以y轴为基准 x|y 互换 则以x轴为基准
                            let _y = parseInt(this.RadarCenter + currR * Math.cos(this.RAngle * m + Math.PI)) + 0.5,
                                _x = parseInt(this.RadarCenter + currR * Math.sin(this.RAngle * m + Math.PI)) + 0.5;
                            // 连线
                            this.ctx.lineTo(_x, _y)
                        }
                    }
                    // 创建当前闭环路径
                    this.ctx.closePath();
                    // 边框填充颜色
                    if(this._Object.isGradient) this.ctx.strokeStyle = this.sidesColor[n];
                    // 开始绘制
                    this.ctx.stroke();
                    // 填充
                    if(this._Object.isGradient) {
                        this.ctx.fillStyle = this.areaBackColor[n];
                        this.ctx.fill();
                    }
                }
                // 恢复当前路径绘制状态
                this.ctx.restore()
            },
            // 顶点连线
            LinesTop () {
                // 保存绘制路劲
                this.ctx.save();
                // 开始新的路径
                this.ctx.beginPath();
                // 绘制对角线
                for (let n = 0; n < this._Object.dataArr.length; n++) {
                    // 获取多边形每个顶点坐标 现在以y轴为基准 x|y 互换 则以x轴为基准
                    let _y = parseInt(this.RadarCenter + this.mRadius * Math.cos(this.RAngle * n + Math.PI)) + 0.5,
                        _x = parseInt(this.RadarCenter + this.mRadius * Math.sin(this.RAngle * n + Math.PI)) + 0.5;
                    // 移动到中心
                    this.ctx.moveTo(this.RadarCenter, this.RadarCenter);
                    // 连线
                    this.ctx.lineTo(_x, _y)
                }
                // 边框填充颜色
                this.ctx.strokeStyle =  Array.isArray(this.areaBackColor) ? this.areaBackColor[3] : this.areaBackColor;
                this.ctx.stroke();
                this.ctx.restore()
            },
            // 绘制顶点数据类型
            TextType () {
                // 保存绘制路劲
                this.ctx.save();
                // 开始新的路径
                this.ctx.beginPath();
                // 绘制文本
                // 设置 画布的整体字体大小 取整
                this.ctx.font = `${this.fontSize * drawCanvas.DPR()}px Microsoft Yahei`;
                this.ctx.textBaseline="middle"; //设置基线参考点
                this.ctx.fillStyle = 'rgba(178, 189, 255, 1)';
                this.ctx.textAlign="center";  // 文本居中
                // 绘制最大多边形的每个顶角代表的数据类型
                for(let n = 0; n < this._Object.dataArr.length; n++) {
                    // 获取最大多边形每个顶点坐标 现在以y轴为基准 x|y 互换 则以x轴为基准  x|y 存在偏差 0.5
                    let _y = parseInt(this.RadarCenter + this.mRadius * Math.cos(this.RAngle * n + Math.PI)) + 0.5,
                        _x = parseInt(this.RadarCenter + this.mRadius * Math.sin(this.RAngle * n + Math.PI)) + 0.5;
                    let _width = this.ctx.measureText(this._Object.dataArr[n].name).width, //获取当前绘画的字体宽度
                        maxWidth = this.ctx.measureText('产品使用').width; // 最大允许宽度
                    if(_x >= this.RadarCenter - 0.5 && _x <= this.RadarCenter + 0.5) {
                        let _Y = _y;
                        if ( _y < this.RadarCenter - 0.5) {
                            _Y = _y - maxWidth/2.5;
                        } else{
                            _Y = _y + maxWidth/2.5;
                        }
                        // 绘制文本
                        this.ctx.fillText(this._Object.dataArr[n].name, _x, _Y);
                    }else {
                        let _X = _x;
                        if ( _x > this.RadarCenter + 0.5) {
                            _X = _x + maxWidth/1.6;
                        } else if ( _x < this.RadarCenter - 0.5) {
                            _X = _x - maxWidth/1.6;
                        }
                        // 换行绘制
                        if(_width > maxWidth) {
                            let arrText = this._Object.dataArr[n].name.split(''),
                                line = '';
                            for (let i = 0; i < arrText.length; i++) {
                                let testLine = line + arrText[i],
                                    metrics = this.ctx.measureText(testLine),
                                    testWidth = metrics.width;
                                if (testWidth > maxWidth && i > 0) {
                                    this.ctx.fillText(line, _X, _y);
                                    line = arrText[i];
                                    _y += parseInt(window.getComputedStyle(document.body).lineHeight) + 10 * drawCanvas.DPR();
                                } else {
                                    line = testLine;
                                }
                            }
                            this.ctx.fillText(line, _X, _y);
                        } else {
                            this.ctx.fillText(this._Object.dataArr[n].name, _X, _y);
                        }
                    }
                }
            },
            // 绘制 数据区域
            DataArea() {
                // 保存绘制路劲
                this.ctx.save();
                // 开始新的路径
                this.ctx.beginPath();
                // 绘制数据覆盖区域
                for(let n = 0; n < this._Object.dataArr.length; n++){
                    // 获取每个数据的坐标
                    let _y = parseInt(this.RadarCenter + this.mRadius * (this._Object.dataArr[n].value/10) * Math.cos(this.RAngle * n + Math.PI)),
                        _x = parseInt(this.RadarCenter + this.mRadius * (this._Object.dataArr[n].value/10) * Math.sin(this.RAngle * n + Math.PI));
                    this.ctx.lineTo(_x, _y)
                }
                // 创建闭环路径
                this.ctx.closePath();
                if(!this._Object.isArea){
                    // 线框 宽厚
                    this.ctx.lineWidth = 1 * drawCanvas.DPR();
                    // 线框颜色
                    this.ctx.strokeStyle = 'rgba(240, 209, 189, 1)';
                    // 绘制
                    this.ctx.stroke();
                } else {
                    // 填充颜色
                    this.ctx.fillStyle = 'rgba(102,27,14,0.52)';
                    // 填充
                    this.ctx.fill()
                }
                this.ctx.restore()
            },
            // 绘制焦点圆
            Circles () {
                // 保存绘制路劲
                this.ctx.save();
                // 设置焦点圆半径
                let R = 2 * drawCanvas.DPR();
                // 绘制焦点圆
                for(let n = 0; n < this._Object.dataArr.length; n++){
                    // 获取每个数据的坐标 现在以y轴为基准 x|y 互换 则以x轴为基准
                    let _y = parseInt(this.RadarCenter + this.mRadius * (this._Object.dataArr[n].value/10) * Math.cos(this.RAngle * n + Math.PI)),
                        _x = parseInt(this.RadarCenter + this.mRadius * (this._Object.dataArr[n].value/10) * Math.sin(this.RAngle * n + Math.PI));
                    // 新的绘制路径开始
                    this.ctx.beginPath();
                    // 画圆 参数(x坐标，y坐标，R半径，0开始角度，Math.PI * 2结束角度)
                    this.ctx.arc(_x, _y, R, 0, Math.PI * 2);
                    // 填充颜色
                    this.ctx.fillStyle = 'rgb(240,209,189)';
                    // 填充
                    this.ctx.fill()
                }
                this.ctx.restore()
            },
            // 绘制tooltip
            ToolTip () {
                // @TODO
            }
        },
        mounted(){
            this.$nextTick(() => {
                this.Canvas = this.$refs.canvas;
                this.Canvas.height = 300 * drawCanvas.DPR();
                this.Canvas.width = 300 * drawCanvas.DPR();
                this.ctx = this.Canvas.getContext("2d");
                // 每次开始时先清除画布
                this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
                // 开始绘制
                this.Polygon();
                (!this._Object.isGradient || this._Object.isArc) && this.LinesTop();
                this.TextType();
                this.DataArea();
                this.Circles();
                this.ToolTip()
            });
        },
        activated() {
            this.$nextTick(() => {
                this.Canvas = this.$refs.canvas;
                this.Canvas.height = 300 * drawCanvas.DPR();
                this.Canvas.width = 300 * drawCanvas.DPR();
                this.ctx = this.Canvas.getContext("2d");
                // 每次开始时先清除画布
                this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
                // 开始绘制
                this.Polygon();
                (!this._Object.isGradient || this._Object.isArc) && this.LinesTop();
                this.TextType();
                this.DataArea();
                this.Circles();
                this.ToolTip()
            });
        }
    }
</script>

<style scoped></style>
