export default () => {
	let width = 0;
	let height = 0;
	//获取窗口宽度
	if (window.innerWidth){
		width = window.innerWidth;
	}else if ((document.body) && (document.body.clientWidth)){
		width = document.body.clientWidth;
	}
	
	//获取窗口高度
	if (window.innerHeight){
		height = window.innerHeight;
	}else if ((document.body) && (document.body.clientHeight)){
		height = document.body.clientHeight;
	}
		
	//通过深入Document内部对body进行检测，获取窗口大小
	if (document.documentElement  && document.documentElement.clientHeight && document.documentElement.clientWidth){
		height = document.documentElement.clientHeight;
		width = document.documentElement.clientWidth;
	}
	return {width,height}
};