const createElement = (marker, tag) => {
  let el = document.createElement(tag || 'div')
  if(/^\./.test(marker)){
    el.classList.add(marker.replace('.',''));
  }else if(/^\#/.test(marker)){
    el.setAttribute('id', marker.replace('#',''));
  }else{
    el.setAttribute(marker, '');
  }
  document.body.appendChild(el)
}

const removeElement = (marker) => {
  let el = document.querySelector(marker) || document.querySelector(`[${marker}]`)
  if (el)
    document.body.removeChild(el)
}

const timeout = (duration = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration);
  })
}

module.exports = {
  createElement: createElement,
  removeElement: removeElement,
  timeout: timeout
}
