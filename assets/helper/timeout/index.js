let timer;
function timeout(options){
	let defaultOpt = {
		countdown:10,
		rate:1000
	}
	options = Object.assign({},defaultOpt,options)
	options.start && options.start();
	settime(options);
	this.stop = ()=> clearTimeout(timer)
	return this
}

function settime(options){
	if (options.countdown == 0) {
		options.end && options.end();
		return clearTimeout(options.timer) 
	}else{
		options.progress && options.progress(options.countdown);
		options.countdown--;
	}
	timer = setTimeout(()=>{ 
		settime(options) 
	},options.rate) ;
}


export default function (options){
	return new timeout(options)
}