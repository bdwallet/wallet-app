// 时间戳
function getMap(date){
	if('string' == typeof date) date = parseInt(date);
	var checkLen = date.toString().length == 10;
	if(checkLen) date = date* 1000;
	return date;
}


// 详情
function getInfo(date){
	return {
		year:date.getFullYear(),//年
		quarter:Math.floor(date.getMonth()/3 + 1), //季度
		month:date.getMonth()+1,//月
		day:date.getDate(),//日
		week:date.getDay(),//周
		hours:date.getHours(),//时
		minutes:date.getMinutes(),//分
		seconds:date.getSeconds(), //秒
		msec:date.getMilliseconds()//毫秒
	}
}

// 解析时间
function parseDate(date){
	var stamp = date;
	if(date instanceof Date){
		stamp = date.valueOf()
	}else if('string' == typeof date){
		var isDateStr = date.indexOf(' ')>=0 || date.indexOf('-')>=0 || date.indexOf('/')>=0;
		stamp = isDateStr ? Date.parse(date.replace(/-/g, '/')) : parseInt(getMap(date));
	}else if('number' == typeof date){
		stamp = getMap(date)
	}else{
		stamp = (new Date()).valueOf();
	}
	var date = new Date(stamp) ;
	var info = getInfo(date);
	var string = date.toString()
	return { date, stamp, info ,string};
}


const Dater = function(date){
	if(!date){
        date = (new Date()).valueOf();
	}
	this.date = parseDate(date);
	return this;
}


Dater.prototype = {
	// 格式化时间  
	format(rule) {
		var date = this.date;
		var ret=date.date;
		var maps = {
			'M+': date.info.month, //月
			'q+': date.info.quarter,// 季度小写
			'Q+': date.info.quarter, // 季度大写		
			'D+': date.info.day, //日期
			'w+': date.info.week,// 星期小写
			'W+': date.info.week,// 星期大写
			'h+': date.info.hours, //时
			'm+': date.info.minutes, //分
			's+': date.info.seconds, // 秒
			'ms': date.info.msec // 毫秒
		};
		
		
		if (!rule || rule=='') rule = 'YYYY-MM-DD hh:mm:ss:ms';
		if (/(Y+)/.test(rule)){
			var regstr = RegExp.$1;
			var value = (date.date.getFullYear() + '').substr(4 - regstr.length);
			rule = rule.replace(regstr, value);
		}
		
		for (var key in maps) {
			if (new RegExp('(' + key + ')').test(rule)) {
				var time = maps[key];
				var regstr = RegExp.$1;
				var value = regstr.length == 1 ? time: (('00' + time).substr(('' + time).length));
				if(regstr=='w'){
					value = parseInt(value)
				}else if(regstr=='W'){
					value = ['一','二','三','四','五','六','日'][parseInt(value)-1]
				}else if(regstr=='q'){
					value = parseInt(value)
				}else if(regstr=='Q'){
					value = ['一','二','三','四'][parseInt(value)-1]
				}
				rule = rule.replace(regstr, value);
			}
		}
		return rule;
	}
}

export default function dater(date){
	return new Dater(date);
}
