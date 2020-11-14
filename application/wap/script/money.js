
//保留两位小数并且整数部分三位一个逗号分隔符的数字金钱标准表示法：
 //这里假设我们即不知道输入数字的整数位数，也不知道小数位数
/*将100000转为100,000.00形式*/
const dealNumber = function(money){
  if(money && money!=null){
      money = String(money);
      let left=money.split('.')[0],right=money.split('.')[1];
      right = right ? (right.length>=2 ? '.'+right.substr(0,2) : '.'+right+'0') : '.00';
      let temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
      return (Number(money)<0?"-":"") + temp.join(',').split('').reverse().join('');
  }else if(money===0){   //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
      return '0';
  }else{
      return "";
  }
};
/*将100,000.00转为100000形式*/
const undoNubmer = function(money){
  if(money && money!=null){
      money = String(money);
      let group = money.split('.');
      let left = group[0].split(',').join('');
      return Number(left+"."+group[1]);
  }else{
      return "";
  }
}

export {dealNumber,undoNubmer};