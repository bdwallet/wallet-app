export default elem => {
	let docElem, win,
		box = {top: 0, left: 0},
		doc = elem && elem.ownerDocument;
	if (!doc) return;
	docElem = doc.documentElement;
	if (typeof elem.getBoundingClientRect !== 'undefined') {
		box = elem.getBoundingClientRect();
	}
	win = doc.nodeType === 9 ? doc.defaultView || doc.parentWindow : false;
	return {
		top: box.top  + (win.pageYOffset || docElem.scrollTop)  - (docElem.clientTop  || 0),
		left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
	};
};