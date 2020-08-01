export default function openWindow(url, option ={}) {
	const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
	const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top
	const _width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
	const _height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height
	
	const width  = option.width || 600;
	const height = option.height || 300;
	const left   = 'number' == typeof option.left ? option.left : ((_width / 2) - (width / 2)) + dualScreenLeft
	const top    = 'number' == typeof option.top ? option.top : ((_height / 2) - (height / 2)) + dualScreenTop

	
	const newWindow = window.open(url, '_blank','toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left)

	if (window.focus) newWindow.focus()
}