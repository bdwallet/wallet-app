(function (doc, win) {
  
  //orientationchange : 判断手机是水平方向还是垂直方向，感应方向
  //doc.documentElement ==> 得到文档的根元素-->  <html>
  //之所以要得到文档的根元素，是为了计算网页所打开时屏幕的真实宽度
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      // if(clientWidth>800){
      //   clientWidth = 800
      // }
      //750 是我们默认的手机屏幕
      //clientWidth 是我们页面打开时所得到的屏幕（可看见页面的真实宽度）宽度真实的宽度值
      //这两者相除得到一个放大或缩小的比例值
      if(win.innerWidth >= 1200) {
        docEl.style.fontSize = 12 + 'px';
      }else
        docEl.style.fontSize = 40 * (clientWidth / 750) + 'px';//设置根元素font-size
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
  //当dom加载完成时，或者 屏幕垂直、水平方向有改变进行html的根元素计算
})(document, window);
