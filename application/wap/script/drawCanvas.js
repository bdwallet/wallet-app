import Global from '~script/global';
let G = Global.userLevel;

// 根据 window.devicePixelRatio 获取像素比
const DPR = () => {
    if (window.devicePixelRatio && window.devicePixelRatio > 1) return window.devicePixelRatio;
    return 1;
};

// 将传入值转为整数
const parseValue = (value) => {
    return parseInt(value, 10);
};


/**
 *  @desc 拓展文本换行方法  注意: =>函数 与 匿名函数的 区别  https://blog.csdn.net/yangxiaodong88/article/details/80460332
 *      @param text 需要换行的文本
 *      @param x 初始绘制x轴位置
 *      @param y 初始绘制y轴位置
 *      @param maxWidth 单行文本最大绘制宽度
 *      @param lineHeight 单行文本高度
 *      @param color 文本颜色
 *      @param Size  文本大小
 *      @param lineWidth 文本线条宽度
 *      @param scaleBy 设备像素比
 *      @param fontWeight 文本加粗
 * */
CanvasRenderingContext2D.prototype.wrapText = function (text, x, y, maxWidth, lineHeight, color, Size, lineWidth, scaleBy, fontWeight) {
    if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') return;

    let context = this,
        canvas = context.canvas;
        
    fontWeight = fontWeight || 400;
    

    if (typeof maxWidth == 'undefined'){
        maxWidth = (canvas && canvas.width) || 300;
    } else {
        maxWidth = maxWidth/2*scaleBy;
    }

    if (typeof lineHeight == 'undefined')
        lineHeight = (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) || parseInt(window.getComputedStyle(document.body).lineHeight);

    context.font = `${fontWeight} ${Size*scaleBy/2}px Arial, Helvetica, sans-serif`;
    context.lineWidth = lineWidth;
    context.textAlign = "start";
    context.fillStyle = color;


    // 字符分隔为数组
    let arrText = text.split(''),
        line = '';

    for (let i = 0; i < arrText.length; i++) {
        let testLine = line + arrText[i],
            metrics = context.measureText(testLine),
            testWidth = metrics.width;
        if (testWidth > maxWidth && i > 0) {
            context.fillText(line, x/2*scaleBy, y/2*scaleBy);
            line = arrText[i];
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x/2*scaleBy, y/2*scaleBy);
};


/**
 *  @desc 绘制圆形和矩形
 *      @param ctx canvas上下文对象
 *      @param img 图片链接base64
 *      @param x 绘图起始x轴坐标
 *      @param y 绘图起始y轴坐标
 *      @param width 图形的宽
 *      @param height 图形的高
 *      @param scaleBy 设备像素比
 *      @param shape 是否绘制圆形
 *      @param radius 圆形半径
 *      @param color 背景颜色
 */
const drawShape = (ctx, img, x, y, width, height, scaleBy, shape, radius, color) =>{
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x/2*scaleBy, y/2*scaleBy);

    // 画出圆形   // shape参数值 只要传进来就存在, 不能通过判断它存在与否 来进行业务判断 此点需牢记！！！
    if(shape == 1) { // ctx.arc(x轴坐标, y轴坐标, r半径, sAngle起始角, eAngle结束角, counterclockwise绘图方向(false = 顺时针，true = 逆时针));
        ctx.arc( x/2*scaleBy, y/2*scaleBy, radius/2*scaleBy, 0, 2*Math.PI, true);
    } else {
        // 画出矩形
        if(color){ // 是否绘制填充矩形
            ctx.fillStyle = color;
            ctx.fillRect(x/2*scaleBy, y/2*scaleBy, width/2*scaleBy, height/2*scaleBy);
        } else {
            ctx.rect(x/2*scaleBy, y/2*scaleBy, width/2*scaleBy, height/2*scaleBy);
        }
    }
    // 在刚刚裁剪的形状上画图
    if(img !== '' && img !== undefined){ // img参数值 只要传进来就存在, 不能通过判断它存在与否 来进行业务判断 此点需牢记！！！
        // 裁剪上面的形状
        ctx.clip();

        if(shape == 1) ctx.drawImage(img, (x-radius)/2*scaleBy, (y-radius)/2*scaleBy, radius*scaleBy, radius*scaleBy);
        else ctx.drawImage(img, x/2*scaleBy, y/2*scaleBy, width/2*scaleBy, height/2*scaleBy);
    }
    ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,0)";
    ctx.stroke();
    ctx.closePath();
};

/**
 *  @desc 绘制文字
 *      @param ctx canvas上下文对象
 *      @param text 文字内容
 *      @param Size 字体大小
 *      @param color 字体颜色
 *      @param x 绘制文字起始x轴坐标
 *      @param y 绘制文字起始y轴坐标
 *      @param maxWidth 绘制文字最大宽度
 *      @param scaleBy 设备像素比
 *      @param number 是否为数字
 *      @param textAlign 文本对齐
 *      @param lineWidth 文本线宽
 *      @param fontWeight 文本加粗
 */
const drawText = (ctx, text, Size, color, x, y, maxWidth, scaleBy, number, textAlign, lineWidth, fontWeight) =>{
    ctx.beginPath();
    fontWeight = fontWeight || 400;
    if(number == 1){  // number参数值 只要传进来就存在, 不能通过判断它存在与否 来进行业务判断 此点需牢记！！！
        ctx.font = `${Size*scaleBy/2}px icon`;
        ctx.lineWidth = 10.0;
    } else{
        ctx.font = `${Size*scaleBy/2}px Arial, Helvetica, sans-serif`;
        ctx.lineWidth = lineWidth || 2.0;
    }
    if(textAlign == '' && textAlign == undefined) {
        ctx.textAlign = 'start'
    } else {
        ctx.textAlign = textAlign;
    }
    ctx.fillStyle = color;
    ctx.fillText(text, x*scaleBy/2,y*scaleBy/2, maxWidth*scaleBy);
    ctx.closePath();
};

/**
 *  @desc 绘制圆角矩形和半圆矩形
 *      @param ctx canvas上下文对象
 *      @param x 绘图起始x轴坐标
 *      @param y 绘图起始y轴坐标
 *      @param img 图片链接base64
 *      @param width 图形的宽
 *      @param height 图形的高
 *      @param radius 圆形半径
 *      @param scaleBy 设备像素比
 *      @param shape 是否绘制半圆矩形
 *      @param color 背景颜色
 *      @param shadow 是否有阴影
 *      @param sColor 阴影颜色
 *      @param sBlur 模糊级数
 */
const drawRoundRect = (ctx, x, y, img, width, height, radius, scaleBy, shape, color, shadow, sColor, sBlur) =>{
    ctx.save();

    ctx.beginPath();
    // 绘制圆角矩形
    if(shape ==! 1) {
        ctx.arc((x + radius)/2*scaleBy, (y + radius)/2*scaleBy, radius/2*scaleBy, Math.PI, Math.PI*3/2); //绘制1/4圆

        ctx.lineTo((width + x - radius)/2*scaleBy, y/2*scaleBy);

        ctx.arc((width + x - radius)/2*scaleBy, (y + radius)/2*scaleBy, radius/2*scaleBy, Math.PI*3/2, Math.PI*2); //绘制第二个1/4圆

        ctx.lineTo((width + x)/2*scaleBy, (height + y - radius)/2*scaleBy);

        ctx.arc((width + x - radius)/2*scaleBy, (height + y - radius)/2*scaleBy, radius/2*scaleBy, 0, Math.PI/2); //绘制第三个1/4圆

        ctx.lineTo((x + radius)/2*scaleBy, (height + y)/2*scaleBy);

        ctx.arc((x + radius)/2*scaleBy, (height + y - radius)/2*scaleBy, radius/2*scaleBy, Math.PI/2, Math.PI); //绘制第四个1/4圆

        ctx.lineTo(x/2*scaleBy, (height + y)/2*scaleBy); // ? => 不需要？

    } else {
        ctx.arc((x + radius)/2*scaleBy, (y + radius)/2*scaleBy, radius/2*scaleBy, Math.PI/2, Math.PI*3/2); //绘制1/2圆

        ctx.lineTo((width + x - radius)/2*scaleBy, y/2*scaleBy);

        ctx.arc((width + x - radius)/2*scaleBy, (y + radius)/2*scaleBy, radius/2*scaleBy, Math.PI/2, Math.PI*3/2); //绘制第二1/2圆

        ctx.lineTo((width + x - radius)/2*scaleBy, y/2*scaleBy); // ？=> 不需要？
    }


    // 在刚刚裁剪的形状上画图
    if(shape !== 1 && img !== ''&& img !== undefined) {

        // 裁剪上面的形状
        ctx.clip();

        ctx.drawImage(img, (x-radius)/2*scaleBy, (y-radius)/2*scaleBy, radius*scaleBy, radius*scaleBy);
    }
    ctx.closePath();

    // 设置阴影
    if(shadow == 1) {
        ctx.shadowBlur = sBlur;
        ctx.shadowColor = sColor;
    }
    
    if(color != ''){
        ctx.fillStyle = color;
        ctx.fill();
    } else {
        ctx.strokeStyle="rgba(255, 255, 255, 0)";
        ctx.stroke();
    }
    ctx.restore();
};

/**
 *  @desc 绘制五边形
 *      @param ctx canvas上下文对象
 *      @param x 绘图起始x轴坐标
 *      @param y 绘图起始y轴坐标
 *      @param width 图形的宽
 *      @param height 图形的高
 *      @param scaleBy 设备像素比
 *      @param color 背景颜色
 */
const drawPentagon = (ctx, x, y, width, height, scaleBy, color) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x/2*scaleBy, y/2*scaleBy);

    ctx.lineTo((width + x)/2*scaleBy, y/2*scaleBy);

    ctx.lineTo((width + x)/2*scaleBy, (height + y)/2*scaleBy);

    ctx.lineTo((width/2 + x)/2*scaleBy, (width/2 + height + y)/2*scaleBy);

    ctx.lineTo(x/2*scaleBy, (height + y)/2*scaleBy);

    ctx.strokeStyle = "rgba(255,255,255,0)";
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = color; // 此处需调整
    ctx.fill();
    ctx.closePath();
};

/**
 *  @desc 绘制icon
 *      @param ctx canvas上下文对象
 *      @param iconArr  icon数组
 *              x 绘图起始x轴坐标
 *              y 绘图起始y轴坐标
 *              icon  icon Unicode
 *              color icon颜色
 *              size  icon 尺寸
 *      @param scaleBy 设备像素比
 */
const drawIcon = (ctx, iconArr, scaleBy) =>{
    ctx.save();
    ctx.beginPath();
    for(let i = 0; i < iconArr.length; i++){//第二步 循环iconArr数组绘制图标
        iconArr[i].size = (iconArr[i].size || 40)*scaleBy/2;
        ctx.font = `${iconArr[i].size}px  icon`;//图标大小
        ctx.fillStyle = iconArr[i].color;
        ctx.fillText(eval(('("'+iconArr[i].icon).replace('&#x','\\u').replace(';','')+'")'), iconArr[i].x*scaleBy/2, iconArr[i].y*scaleBy/2);
    }
    ctx.closePath();
};

// 创建canvas画布
const CANVAS = (options) => {
    let W = options && options.width || 375,
        H = options && options.height || 667;
        
    // DOM 节点计算后宽高
    let width = parseValue(W);
    let height = parseValue(H);

    // 获取像素比
    let scaleBy = DPR();

    // 创建自定义 canvas 元素
    let canvas = document.createElement('canvas');

    // 设定 canvas 元素属性宽高为 DOM 节点宽高 * 像素比
    canvas.width = width * scaleBy;
    canvas.height = height * scaleBy;

    // 设定 canvas css宽高为 DOM 节点宽高
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // 获取画笔
    const context = canvas.getContext('2d');

    return {
        canvas,
        context,
        width,
        height,
        scaleBy
    }
};


// 转化oss背景图片为base64地址--> 解决跨域问题
const toBase64Url = (Url,width,height,callBack) => {
    let Canvas = document.createElement('canvas');
    Canvas.width = width;
    Canvas.height = height;
    if(!Canvas.getContext) return false;
    let ctx = Canvas.getContext("2d");
    let img = new Image();
    img.src = Url;
    img.crossOrigin = "anonymous";
    img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        let database64 = Canvas.toDataURL("image/png", 1);
        callBack ? callBack(database64) : null;
    }
};


// 保存图片到本地
const saveImage = (type,data) => {
    return new Promise(resolve => {
        let bitmap = new plus.nativeObj.Bitmap("share");
        let filename = "Hz_share" + "." + type;
        bitmap.loadBase64Data(data,() => {
            // 保存Bitmap图片
            bitmap.save("_doc/" + filename, { overwrite: true, quality: 100 }, (i) => {
                // //保存到系统相册
                // plus.gallery.save(i.target, (d) => {
                //     //销毁Bitmap图片
                //     bitmap.clear();
                //     console.log("保存图片到相册成功: " + JSON.stringify(d));
                // }, (err) => {
                //     //销毁Bitmap图片
                //     console.log("保存保存失败: " + JSON.stringify(err));
                // });
                bitmap.clear();
                resolve(i.target);
            }, () => {
                bitmap.clear();
            })
        },(error) => {
            bitmap.clear();
        })
    });
};



// 生成图片 ==> 邀请分享图片
const creatCanvas = (options) =>{
    return new Promise((resolve) => {

        let Object = CANVAS(),
            canvas = Object.canvas,
            // DOM 节点计算后宽高
            width = Object.width,
            height = Object.height,

            // 获取像素比
            scaleBy = Object.scaleBy,
            // 获取画笔
            context = Object.context;

        // 绘制整个背景
        let image = new Image();
        image.src = options.image.canvas_inviteBg;
        image.onload = () => {

            drawShape(context, image, 0, 0, width*2, height*2, scaleBy);

            // 绘制分享获得黑钻图片
            let image1 = new Image();
            image1.src = options.image.canvas_shareBg;
            image1.onload = () => {
                
                drawShape(context, image1, (width*2-638)/2, 125, 638, 1039, scaleBy);

                // 绘制name
                drawText(context, '@'+options.name, 34, '#333', 100, 350, width/2, scaleBy);

                // 绘制tip
                drawText(context, options.tipName, 28, '#888', 100, 400, width/2, scaleBy);

                // 绘制头像
                let image2 = new Image();
                image2.src = options.image.canvas_photo;
                image2.onload = () => {

                    drawShape(context, image2, 585, 365, 0, 0, scaleBy, 1, 63);

                    drawText(context, options.code, 118, '#FF7270', 157, 615, width/2, scaleBy, 1); // 117
                    
                    drawText(context, options.code, 118, '#FF7270', 247, 615, width/2, scaleBy, 1); // 177
                    // drawText(context, options.code1, 118, '#FF7270', 247, 615, width/2, scaleBy, 1);
                    drawText(context, options.code1, 118, '#FF7270', 337, 615, width/2, scaleBy, 1);

                    // 绘制二维码
                    let image3 = new Image();
                    image3.src = options.image.canvas_QRCode;
                    image3.onload = () => {
                        drawShape(context, image3, (width*2-180)/2, 711, 180, 180, scaleBy);

                        options.imageData = canvas.toDataURL(`image/${options.type}`);

                        resolve(options.imageData)
                    }
                }
            }
        }
    });
};



// 生成图片 ==> 评级|爆料|热议|快讯|项目|交易所
const creatDetailCanvas = (options) => {
    return new Promise(resolve => {
        // 获取Canvas画布
        let Object = CANVAS(),
            Canvas = Object.canvas,
            // DOM 节点计算后宽高
            width = Object.width,

            // 获取像素比
            scaleBy = Object.scaleBy,
            // 获取画笔
            context = Object.context;

        // 绘制头部背景
        let image = new Image();
        image.src = options.imageData.header;
        image.onload = () => {
            drawShape(context, image, 0, 0, width * 2, 379, scaleBy);
            
            // 绘制空的内容区域底层
            drawShape(context, '', 0, 379, width * 2, 955, scaleBy, 0, 0, "#fff");
    
            // 绘制内容区域
            drawRoundRect(context, 30, 312, '',690, 990, 20, scaleBy, 0, "#fff", 1, `rgba(169,169,169,0.5)`, 30);
    
            // 绘制整个背景水印
            let image1 = new Image();
            image1.src = options.imageData.wrapBg;
            image1.onload = () => {
                drawShape(context, image1, 60, 450, 630, 850, scaleBy);
    
                // 绘制内容
                // 评级用户标签--> 超级评审员
                if(options.imageData.user_super && options.imageData.user_project) {
                    let image2 = new Image();
                    image2.src = options.imageData.user_super;
                    image2.onload = () => {
                        // 评级用户标签--> 官方|项目
                        let image3 = new Image();
                        image3.src = options.imageData.user_project;
                        image3.onload = () => {
    
                            // 爆料|讨论|（项目|交易所）评级 {0 项目评级|1 爆料|5 交易所评级|6 讨论}
                            if (options.Type == 0 || options.Type == 1 || options.Type == 5 || options.Type == 6){
                                // 头像
                                let image4 = new Image();
                                image4.src = options.imageData.user_photo;
                                image4.onload = () => {
                                    drawShape(context, image4, 100, 392, 0, 0, scaleBy, 1, 42);

                                    // 身份标签
                                    if (options.imageData.text.locatedid || options.imageData.text.level == G.official) { // 官方|项目
                                        drawShape(context, image3, 128, 420, 0, 0, scaleBy, 1, 16)
                                    } else if (options.imageData.text.level == G.assessor || options.imageData.text.level == G.assessorRobot){ // 超级评审员
                                        drawShape(context, image2, 128, 420, 0, 0, scaleBy, 1, 16)
                                    }
                                };

                                // 用户昵称
                                drawText(context, options.imageData.text.user_name, 32, "#333", 164, 405, 400, scaleBy, 0, 'start', 1, 700);
                                
                                // 该项目评级分数
                                if(options.Type == 0) drawText(context, `${options.imageData.text.score}分`, 32, "#FFA678", 690, 405, 100, scaleBy, 0, "end");

                                // 该交易所评级评价
                                if(options.Type == 5) drawText(context, options.imageData.text.score, 32, "#FFA678", 690, 405, 100, scaleBy, 0, "end");
                                
                                // 内容
                                context.wrapText(options.imageData.text.text,60, 488, 630, 45, "#5F5F5F", 30, 1, scaleBy);
    
                                // 项目评级|交易所评级
                                if(options.Type == 0 || options.Type == 5) {

                                    // 画填充圆角矩形
                                    drawRoundRect(context, 60, 960, undefined, 630, 112, 8, scaleBy, 0, "rgba(237,238,243,.6)");

                                    // 绘制项目logo
                                    // 此处需加载图片
                                    let image5 = new Image();
                                    image5.src = options.imageData.logo;
                                    image5.onload = () => {
                                        drawShape(context, image5, 80, 976, 83, 83, scaleBy)
                                    };
                                    // 项目名称
                                    drawText(context, options.imageData.text.nickname, 30, "#333", 177, 1010, 100, scaleBy);
                                    // 项目总分
                                    drawText(context, options.imageData.text.gradeScore, 24, "#EFAB87", 177, 1044, 100, scaleBy);

                                    // 内容
                                    let text = `已有${options.imageData.text.personal}名超级评审员也评过`;
                                    context.wrapText(text,470, 1008, 200, 33, "#888", 24, 1, scaleBy);
                                }
                            }
                            
                            // 话题
                            if(options.Type == 2){
                                // 绘制热议 title
                                context.wrapText(options.imageData.text.title,60, 406, 630, 60, "#333", 42, 4, scaleBy, 700);

                                // 头像
                                let image4 = new Image();
                                image4.src = options.imageData.user_photo;
                                image4.onload = () => {
                                    drawShape(context, image4, 100, 532, 0, 0, scaleBy, 1, 40);

                                    // 身份标签
                                    if (options.imageData.text.locatedid || options.imageData.text.level == G.official) { // 官方|项目
                                        drawShape(context, image3, 128, 556, 0, 0, scaleBy, 1, 16)
                                    } else if (options.imageData.text.level == G.assessor || options.imageData.text.level == G.assessorRobot){ // 超级评审员
                                        drawShape(context, image2, 128, 556, 0, 0, scaleBy, 1, 16)
                                    }
                                };

                                // 用户昵称
                                drawText(context,options.imageData.text.user_name, 32, "#333", 164, 545, 400, scaleBy, 0, 'start', 1, 700);
                                // 内容
                                context.wrapText(options.imageData.text.text,60, 637, 630, 45, "#333", 30, 1, scaleBy);

                            }
    
                            // 项目|交易所
                            if (options.Type == 7 || options.Type == 8) {
                                // 项目loge
                                let image4 = new Image();
                                image4.src = options.imageData.logo;
                                image4.onload = () => {
                                    drawShape(context, image4, 60, 352, 80, 80, scaleBy);
                                };
    
                                // 项目名称
                                drawText(context, options.imageData.text.nickname, 40, "#333", 156, 408, 400, scaleBy);
                                // 项目点赞数
                                drawText(context, `已有${options.imageData.text.personal}名超级评审员评过`, 24, "#333", 60, 472, 300, scaleBy);
    
    
                                // 项目总评分背景
                                let image5 = new Image();
                                image5.src = options.imageData.goldBg;
                                image5.onload = () => {
                                    drawShape(context, image5, 570, 352, 120, 120, scaleBy);
                                    // 项目总评分
                                    drawText(context, options.imageData.text.gradeScore, 48, "#333", 650, 432, 100, scaleBy, 0, "end");
                                    drawText(context, '分', 28, "#333", 651, 432, 100, scaleBy, 0, "start");
                                };
    
                                // 第一条
                                // 评级用户头像
                                if (Array.isArray(options.imageData.text.text)) {
                                    options.imageData.text.text.forEach((item, index) => {
                                        if (index == 0) {
                                            // 绘制头像
                                            let image5 = new Image();
                                            image5.src = options.imageData.user_photo[0];
                                            image5.onload = () => {
                                                drawShape(context, image5, 100, 575, 0, 0, scaleBy, 1, 42);
                    
                                                // 身份标签
                                                if (item.user_located_item_id || item.level == G.official) { // 官方|项目
                                                    drawShape(context, image3, 128, 605, 0, 0, scaleBy, 1, 16)
                                                } else if (item.level == G.assessor || item.level == G.assessorRobot) { // 超级评审员
                                                    drawShape(context, image2, 128, 605, 0, 0, scaleBy, 1, 16)
                                                }
                                            };
                
                                            // 用户昵称
                                            drawText(context, item.user_name, 32, "#333", 160, 583, 400, scaleBy, 0, 'start', 1, 700);
                                            // 用户给项目评分
                                            drawText(context, item.grade_score, 32, "#FFA678", 690, 583, 50, scaleBy, 0, 'end');
                                            // 内容
                                            context.wrapText(item.grade_intro, 160, 645, 530, 45, "#333", 32, 1, scaleBy);
                                        } else {
                                            // 第二条
                                            // 评级用户头像
                                            let image6 = new Image();
                                            image6.src = options.imageData.user_photo[1];
                                            image6.onload = () => {
                                                drawShape(context, image6, 100, 820, 0, 0, scaleBy, 1, 42);
                    
                                                // 身份标签
                                                if (item.user_located_item_id || item.level == G.official) { // 官方|项目
                                                    drawShape(context, image3, 128, 850, 0, 0, scaleBy, 1, 16)
                                                } else if (item.level == G.assessor || item.level == G.assessorRobot) { // 超级评审员
                                                    drawShape(context, image2, 128, 850, 0, 0, scaleBy, 1, 16)
                                                }
                                            };
                
                                            // 用户昵称
                                            drawText(context, item.user_name, 32, "#333", 160, 828, 400, scaleBy, 0, 'start', 1, 700);
                                            // 用户给项目评分
                                            drawText(context, item.grade_score, 32, "#FFA678", 690, 828, 50, scaleBy, 0, 'end');
                                            // 内容
                                            context.wrapText(item.grade_intro, 160, 890, 530, 45, "#333", 32, 1, scaleBy);
                                        }
                                    })
                                } else {
                                    // 内容
                                    context.wrapText(`项目简介：${options.imageData.text.text}`, 60, 575, 630, 45, "#333", 32, 1, scaleBy);
                                }
                            }
                        }
                    }
                }else {
                    // 快讯
                    if(options.Type == 9){
                        let iconarr = [
                            {x:60, y:380, icon:"&#xe766;", color:'#6B6B6B', size: 28}
                        ];
                        drawIcon(context, iconarr, scaleBy);
                        drawText(context, options.imageData.text.date, 28, "#333", 100, 380, 328, scaleBy);
                        context.wrapText(options.imageData.text.title, 60, 467, 630, 60, "#333", 42, 4, scaleBy, 700);
                        context.wrapText(options.imageData.text.content, 60, 600, 630, 52, "#333", 32, 1, scaleBy);
                    }
                }
    
                // 底部二维码
                let image3 = new Image();
                image3.src = options.imageData.QRCode;
                image3.onload = () => {
                    if(options.Type == 9) drawShape(context, image3, 60, 1076, 150, 150, scaleBy);
                    else drawShape(context, image3, 60, 1120, 150, 150, scaleBy);
                };
                if(options.Type == 9){
                    drawText(context, '长按识别二维码', 24, "#9A9FA7", 225, 1180, 300, scaleBy);
                    drawText(context, options.footip, 24, "#333", 225, 1220, 300, scaleBy);
                    drawText(context, '投资有风险，入市需谨慎。本资讯不作为投资理财建议', 20, "#9A9FA7", 60, 1272, 630, scaleBy);
                }else{
                    drawText(context, '长按识别二维码', 24, "#9A9FA7", 225, 1220, 300, scaleBy);
                    drawText(context, options.footip, 24, "#333", 225, 1260, 300, scaleBy);
                }
            };
            // document.body.appendChild(Canvas);
            setTimeout(() => {
                let data = Canvas.toDataURL(`image/png`);
                resolve(data)
            },200)
        };
    })
};



// 生成图片 ==> 项目方主页|个人主页
const creatUserCanvas = (options) => {
    return new Promise(resolve => {
        // 获取Canvas画布
        let Object = CANVAS(),
            Canvas = Object.canvas,
            // DOM 节点计算后宽高
            width = Object.width,
        
            // 获取像素比
            scaleBy = Object.scaleBy,
            // 获取画笔
            context = Object.context;
        
        // 绘制头部背景
        let image = new Image();
        image.src = options.imageData.header;
        image.onload = () => {
            
            drawShape(context, image, 0, 0, width*2, 427, scaleBy);

            if (options.isSuper == 1 || options.isSuper == 2) {
                let color = "#3E4360";
                if (options.isSuper == 1) color = "#C97449";
                
                drawPentagon(context, 54, 50, 88, 110, scaleBy, color);
    
                // 身份标签
                if (options.isSuper == 1) {
                    // 评级用户标签 超级评审员
                    let image1 = new Image();
                    image1.src = options.imageData.user_super;
                    image1.onload = () => {
                        drawShape(context, image1, 98, 86, 0, 0, scaleBy, 1, 26);
                    };
                } else if (options.isSuper == 2) {
                    // 评级用户标签 项目|官方
                    let image1 = new Image();
                    image1.src = options.imageData.user_project;
                    image1.onload = () => {
                        drawShape(context, image1, 98, 86, 0, 0, scaleBy, 1, 26);
                    };
                }
                // 绘制内容
                if (options.isSuper == 1) {
                    drawText(context, '超级', 17, "#FFF", 98, 136, 88, scaleBy, 0, "center");
                    drawText(context, '评审员', 17, "#FFF", 98, 165, 88, scaleBy, 0, "center")
                } else { // 此处 项目需要动态传入 有黑钻|项目 两个值
                    drawText(context, options.HZ, 17, "#FFF", 98, 136, 88, scaleBy, 0, "center");
                    drawText(context, '官方', 17, "#FFF", 98, 165, 88, scaleBy, 0, "center")
                }
            }
            
            // 绘制头像
            let image2 = new Image();
            image2.src = options.imageData.user_photo;
            image2.onload = () => {
                drawShape(context, image2, 375, 88, 0, 0, scaleBy, 1, 71);
                // 评级用户标签
                if (options.isSuper == 1) {
                    // 评级用户标签 超级评审员
                    let image3 = new Image();
                    image3.src = options.imageData.user_super;
                    image3.onload = () => {
                        drawShape(context, image3, 416, 139, 0, 0, scaleBy, 1, 26);
                    };
                } else if (options.isSuper == 2) {
                    // 评级用户标签 项目|官方
                    let image3 = new Image();
                    image3.src = options.imageData.user_project;
                    image3.onload = () => {
                        drawShape(context, image3, 416, 139, 0, 0, scaleBy, 1, 26);
                    };
                }
            };
            
            // 绘制用户昵称
            drawText(context, options.imageData.user.user_name, 36, "#FFF", width, 230, 500, scaleBy, 0, 'center', 4, 700);
        
            // 绘制精选评级|粉丝|关注 数
            drawText(context, options.imageData.user.hot, 36, "#FFF", 168, 310, 200, scaleBy, 0, 'center', 4);
            drawText(context, options.imageData.user.attentioned, 36, "#FFF", 376, 315, 200, scaleBy, 0, 'center', 4);
            drawText(context, options.imageData.user.attention, 36, "#FFF", 581, 310, 200, scaleBy, 0, 'center', 4);
        
            // 绘制精选评级|粉丝|关注
            drawText(context, '精选评级', 22, "#FFF", 168, 350, 200, scaleBy, 0, 'center', 2);
            drawText(context, '粉丝', 22, "#FFF", 376, 350, 200, scaleBy, 0, 'center', 2);
            drawText(context, '关注', 22, "#FFF", 581, 350, 200, scaleBy, 0, 'center', 2);
        };
    
        // 绘制整个背景
        let image4 = new Image();
        image4.src = options.imageData.wrapBg;
        image4.onload = () => {
            drawShape(context, image4, 0, 427, width * 2, 907, scaleBy);
            
            // 绘制内容
            if(options.imageData.text.length > 0){
                // 绘制头像
                let image5 = new Image();
                image5.src = options.imageData.user_photo;
                image5.onload = () => {
                    // 评级用户标签图标
                    let image6 = new Image();
                    image6.src = options.imageData.user_super;
                    image6.onload = () => {
                        let image7 = new Image();
                        image7.src = options.imageData.user_project;
                        image7.onload = () => {
                            options.imageData.text.forEach((item, index) => {
                                if (index != 0) {
                                    // 第二条
                                    // 绘制头像
                                    drawShape(context, image5, 72, 820, 0, 0, scaleBy, 1, 42);
    
                                    // 评级用户标签
                                    if (options.isSuper == 1) {
                                        drawShape(context, image6, 105, 850, 0, 0, scaleBy, 1, 16);
                                    } else if (options.isSuper == 2) {
                                        // 评级用户标签 项目|官方
                                        drawShape(context, image7, 105, 850, 0, 0, scaleBy, 1, 16);
                                    }
        
                                    // 用户昵称
                                    drawText(context, options.imageData.user.user_name, 32, "#333", 142, 828, 400, scaleBy, 0, 'start', 4);
                                    // 内容
                                    context.wrapText(item.grade_intro, 142, 890, 570, 45, "#333", 32, 1, scaleBy);
                                } else {
                                    // 第一条
                                    // 绘制头像
                                    drawShape(context, image5, 72, 575, 0, 0, scaleBy, 1, 42);
    
                                    // 评级用户标签
                                    if (options.isSuper == 1) {
                                        // 评级用户标签 超级评审员
                                        drawShape(context, image6, 105, 605, 0, 0, scaleBy, 1, 16);
                                    } else if (options.isSuper == 2) {
                                        // 评级用户标签 项目|官方
                                        drawShape(context, image7, 105, 605, 0, 0, scaleBy, 1, 16);
                                    }
        
                                    // 用户昵称
                                    drawText(context, options.imageData.user.user_name, 32, "#333", 142, 583, 400, scaleBy, 0, 'start', 4);
                                    // 内容
                                    context.wrapText(item.grade_intro, 142, 645, 570, 45, "#333", 32, 1, scaleBy);
        
                                }
                            })
                        };
                    }
                };
            } else {
                // 数据为空时的样式
                let image8 = new Image();
                image8.src = options.imageData.Empty;
                image8.onload = () => {
                    drawShape(context, image8, (width*2-360)/2, 584, 360, 278, scaleBy);
                    // 数据为空时的文案
                    drawText(context, 'Ta还没有发布过内容哦~', 28, "#888", width, 945, 600, scaleBy, 0, 'center', 1);
                }
            }
            
            // 底部二维码
            let image9 = new Image();
            image9.src = options.imageData.QRCode;
            image9.onload = () => {
                drawShape(context, image9, 63, 1062, 200, 200, scaleBy);
            };
    
            drawText(context, '长按识别二维码', 36, "#888", 313, 1152, 400, scaleBy, 0, 'start', 1);
            drawText(context, options.footip, 36, "#333", 313, 1202, 400, scaleBy, 0, 'start', 1);
        };
        
        // document.body.appendChild(Canvas)
        
        setTimeout(() => {
            let data = Canvas.toDataURL(`image/png`);
            resolve(data)
        },200)
    })
};



// 生成图片 ==> 热榜
const creatHotlistCanvas = (options) => {
    return new Promise(resolve => {
        // 获取Canvas画布
        let Object = CANVAS({ width: 375, height: 1002 }),
            Canvas = Object.canvas,
            // DOM 节点计算后宽高
            width = Object.width,
            
            // 获取像素比
            scaleBy = Object.scaleBy,
            // 获取画笔
            context = Object.context;
        
        //整体 黑色背景
        drawShape(context, undefined, 0, 0, width * 2, 2004, scaleBy,0,0,'#232527');
    
        // 绘制整个背景
        let image2 = new Image();
        image2.src = options.imageData.wrapBg;
        image2.onload = () => {
        
            // 水印
            for(let i = 0; i < 6; i++){
                drawShape(context, image2, 0, (320 + i*250), width*2, 151, scaleBy);
            }
        
            // 绘制头部背景
            let image = new Image();
            image.src = options.imageData.shareHeader;
            if(options.type === 0){
                image.src = options.imageData.shareHeader1;
            }
            image.onload = () => {
                drawShape(context, image, 0, 0, width * 2, 414, scaleBy);
                // 绘制期号
                drawText(context, options.imageData.vol, 28, "#fff", 85, 100, 500, scaleBy);
                // 最新一期才出现这个
                if(options.imageData.isNew == 1){
                    // 绘制“至多瓜分”
                    drawText(context,'至多瓜分', 28, "#FFEDCC", 415, 245, 50, scaleBy, 0, "start");
                    // 绘制黑钻
                    drawText(context, `${options.imageData.max_hzt * 2}黑钻`, 36, "#fff", 695, 248, 500, scaleBy, 0, "end", 4);
                }
            };
            
            // 评级用户标签--> 超级评审员
            let image3 = new Image();
            image3.src = options.imageData.user_super;
            image3.onload = () => {
        
                // 评级用户标签--> 官方|项目
                let image4 = new Image();
                image4.src = options.imageData.user_project;
                image4.onload = () => {
                    if(Array.isArray(options.imageData.datalist)){
                        options.imageData.datalist.forEach((item, index) => {
                            // 绘制头像
                            let image5 = new Image();
                            image5.src = item.grade.user_photo;
                            image5.onload = () => {
                                // 名次
                                drawText(context, ` ${index+1}`, 36, "#D1B98D", 65, (486 + index * 235), 30, scaleBy,0, 'start', 4);
                                if (index == 0) {
                                    let image6 = new Image();
                                    image6.src = options.imageData.first;
                                    image6.onload = () => {
                                        drawShape(context, image6, 51, 441, 56, 56, scaleBy);
                                    }
                                } else if(index == 1) {
                                    let image6 = new Image();
                                    image6.src = options.imageData.second;
                                    image6.onload = () => {
                                        drawShape(context, image6, 51, 673, 56, 56, scaleBy);
                                    }
                                } else if(index == 2) {
                                    let image6 = new Image();
                                    image6.src = options.imageData.third;
                                    image6.onload = () => {
                                        drawShape(context, image6, 51, 905, 56, 56, scaleBy);
                                    }
                                }
                                
                                // 头像
                                drawShape(context, image5, 167, (469 + index * 235), 0, 0, scaleBy, 1, 42);
        
                                // 标签
                                if (item.grade.user_located_item_id || item.grade.level == G.official) {
                                    drawShape(context, image4, 183, (485 + index * 235), 30, 30, scaleBy);
                                } else if (item.grade.level == G.assessor || item.grade.level == G.assessorRobot){
                                    drawShape(context, image3, 183, (485 + index * 235), 30, 30, scaleBy);
                                }
                            };
    
                            // 用户昵称
                            drawText(context, item.grade.user_name, 28, "#FFF", 223, (465 + index * 235), 200, scaleBy, 0, 'start');
    
                            // 发布时间
                            drawText(context, item.grade.grade_create_time, 20, "#FFF", 223, (495 + index * 235), 200, scaleBy, 0, 'start');
    
                            // 分得的黑钻
                            if(options.type == 0){
                                drawText(context, '黑钻', 22, "#5682FF", 701, (483 + index * 235), 50, scaleBy, 0, 'end');
                                drawText(context, item.hzt, 28, "#5682FF", 650, (483 + index * 235), 300, scaleBy, 0, 'end');
                            } else{
                                drawText(context, '黑钻', 22, "#D1B98D", 701, (483 + index * 235), 50, scaleBy, 0, 'end');
                                drawText(context, item.hzt, 28, "#D1B98D", 650, (483 + index * 235), 300, scaleBy, 0, 'end');
                            }
                            // 内容
                            context.wrapText(item.grade.grade_intro, 71, (565 + index * 235), 630, 48, "#fff", 30, 1, scaleBy);
                        })
                    }
    
                    // 底部二维码
                    let image8 = new Image();
                    if(options.type == 0)
                        image8.src = options.imageData.QRCode;
                    else
                        image8.src = options.imageData.QRCode1;
                    image8.onload = () => {
                        drawShape(context, image8, 75, 1700, 200, 200, scaleBy);
                    };
                    drawText(context, '长按识别二维码', 36, "#FFF", 315, 1790, 300, scaleBy, 0, 'start');
                    drawText(context, options.footip, 36, "#FFF", 315, 1840, 300, scaleBy, 0, 'start');
    
    
                    // document.body.appendChild(Canvas);
    
                    setTimeout(() => {
                        let data = Canvas.toDataURL(`image/png`);
                        resolve(data)
                    },300)
                }
            };
        }
    })
};


export default {
    DPR,
    creatCanvas,
    creatDetailCanvas,
    creatUserCanvas,
    creatHotlistCanvas,
    toBase64Url,
    saveImage
}
