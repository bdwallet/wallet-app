export default function openUrl(url, type,route) {
	if(route && route!=''){
		url+='#/'+ route.replace('/','');
	}
	if(type=='blank'){
		window.open(url); 
		
	}else{
		window.location.href = url
	}
}



