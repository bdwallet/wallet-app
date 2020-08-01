import h2e from './h2e';
import ele from './ele';

// 匹配简单选择器
const regSimple = /^[\w\-_#]+$/
		
// 匹配html选择器 <div>test<div>
const regHtml = /<[^>]+>/g

const  fliter = (selector, context) => {

	selector = selector.trim();

	// 判断html
	var isHtml = regHtml.test(selector);
	if (isHtml) return h2e(selector, context);
	
	// 判断简单选择器 #demo .test div 
	var simple = regSimple.test(selector);
	
	if (simple)return ele(selector, context);

	// 遍历
	return context.querySelectorAll(selector);
}

export default fliter
