
import Base64 from '~script/base64';
import md5 from 'js-md5';

const base64 = new Base64();

function lock(txt,key){
    txt = txt + key;
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-=+";
    let nh = parseInt(Math.random() * 64);
    let ch = chars[nh];
    let mdKey = md5(key + ch);
    mdKey = mdKey.substr(nh%8,nh%8+7);
    txt = base64.encode(txt);
    let tmp = '';
    let i=0,j=0,k=0;
    for (i=0; i<txt.length; i++) {
        k = k == mdKey.length ? 0 : k;
        j = (nh + chars.indexOf(txt[i]) + mdKey[k++].charCodeAt()) % 64;
        tmp += chars[j];
    }
    return base64.encode(ch + tmp);
}

//解密
function unlock(txt,key){
    txt = base64.decode(txt);
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-=+";
    let ch = txt[0];
    let nh = chars.indexOf(ch);
    let mdKey = md5(key + ch);
    mdKey = mdKey.substr(nh%8,nh%8+7);
    txt = txt.substr(1);
    let tmp = '';
    let i=0,j=0,k = 0;
    for (i=0; i<txt.length;i++) {
        k = k == mdKey.length ? 0 : k;
        j = chars.indexOf(txt[i]) - nh - mdKey[k++].charCodeAt();
        while (j<0) j+=64;
        tmp += chars[j];
    }
    tmp = base64.decode(tmp);
    return tmp.replace(new RegExp(key+'$'),'');
}

export default {lock,unlock}