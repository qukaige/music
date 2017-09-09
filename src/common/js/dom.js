export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

// 检查class是否存在
export function hasClass(el, className) {
  // \\s 空白字符
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
// 获取 设置 元素的属性
export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}
// 游览器能力检查, 查看是那个游览器内核,支持那种类型 前缀
let elementStyle = document.createElement('div').style
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    moz: 'mozTransform',
    o: 'oTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()
//
export function prefixStyle(style) {
  if (!vendor) {
    return false
  }
  if (vendor === 'standard') {
    return style
  } // webkitTransform   第一个字符大小 后面小写
  return vendor + style.charAt(0).toUpperCase() + style.substring(1)
}
