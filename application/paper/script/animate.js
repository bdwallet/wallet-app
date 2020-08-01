
 //动画效果值取反或归零 type:1 取反，type:0 归零
const resetStyleValue = function(value, type) {
  let resault = "";
  if(value.indexOf("translate") != -1){
    if (type){
      if(/-/.test(value)){
        resault = value.replace(/\(-/, "(");
      }else{
        resault = value.replace(/\(/, "(-");
      }
    }
    else resault = value.replace(/\([+-]?[^\s]+\)/, "(0)");
  }else if(value.indexOf("scale") != -1){
    if (type) resault = value;
    else {
      resault = value.replace(/\([+-]?[^\s]+\)/, "(1)");
    };
  }else{

  }
  return resault;
};

const getDisplay = function(obj) {
  // 浏览器兼容
  if (obj.currentStyle) {
    return obj.currentStyle.display;
  } else {
    return getComputedStyle(obj, false).display;
  }
};

export default {
  animateGo(className) {
    this.animateStart(className,true);
  },
  animateStart(className,isgo) {
    className = className || "animate";
    let dom = document.getElementsByClassName(className);
    for (let i = 0; i < dom.length; i++) {
      let el = dom[i],_style = "",_transition="all .2s ease-in",_time = 0;
      if (getDisplay(el) == 'inline') el.style.display = "inline-block";
      try{
        _transition = el.attributes["animate-transition"] ? el.attributes["animate-transition"].nodeValue : "all .2s ease-in";
        _style = el.attributes["animate-style"] && JSON.parse(el.attributes["animate-style"].nodeValue);
      }catch(e){}
      _time = parseInt(el.attributes["animate-time"] && el.attributes["animate-time"].nodeValue);
      el.style.transition = _transition;
      if (_style && _style.length) { //多个动画效果
        _style.forEach(element => {
          console.log(element);
        });
      } else { //单个动画效果
        setTimeout(() => {
          el.style.opacity = 1;
          if(!_style) return;
          el.style[_style.attr] = isgo ? _style.val : resetStyleValue(_style.val, 0);
        }, _time);
      }
    }
  },
  //动画初始化
  animateBeFore(className) {
    className = className || "animate";
    let dom = document.getElementsByClassName(className);
    for (let i = 0; i < dom.length; i++) {
      let el = dom[i],_style = "";
      try{
        _style = el.attributes["animate-style"] && JSON.parse(el.attributes["animate-style"].nodeValue);
      }catch(e){}
      el.style.opacity = 0;
      if(!_style) return;
      if (_style.length) { //多个动画效果
        _style.forEach(element => {
          console.log(element);
        });
      } else { //单个动画效果
        el.style[_style.attr] = resetStyleValue(_style.val, 1);
      }
    }
  },
}
