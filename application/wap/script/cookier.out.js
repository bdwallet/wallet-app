
import Global from '~script/global';

function getCookie(key){
  let cookie = document.cookie;
  if(Global.isApp && Global.isPro){
    cookie = HZApp.GetCookie();
  }
  if(!key) return cookie; //如果没有键值，则返回cookie
  if (cookie && cookie.length>0) {
      let c_start=cookie.indexOf(key + "=");
      if (c_start!=-1) {
          c_start=c_start + key.length+1;
          let c_end=cookie.indexOf(";",c_start);
          if (c_end==-1) c_end=cookie.length;
          return cookie.substring(c_start,c_end);
          //return unescape(cookie.substring(c_start,c_end));
      }
  }
  return "";
}

function setCookie(key,value,expiredays){
  var exdate=new Date()
  exdate.setDate(exdate.getDate()+expiredays)
  document.cookie=key+ "=" +value+
  ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}

export default {
  getCookie,
  setCookie
}
