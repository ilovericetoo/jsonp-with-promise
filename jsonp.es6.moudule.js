function isObject(thing){
  return Object.prototype.toString.call(thing) === '[object Object]'
}
function serialize(obj){
  if(!obj || !isObject(obj)) return ''
  return Object.keys(obj).map( key => key + '=' + obj[key] ).join('&')
}

let cbId = 0
  
export function jsonp(url, params, remoteCb, timeout){
  const thisId = '_jsonp' + cbId++
  remoteCb = remoteCb || jsonp.cbQueryString
  params = serialize(params)
  
  if(url.indexOf('?') === -1) url += '?'
  if(params.length > 0) url += '&' + params
  url += '&' + remoteCb + '=' + thisId
  
  let script = document.createElement('script'),
      head = document.getElementsByTagName('head')[0] || document.head
  script.src = url
  head.appendChild(script)

  const clean = () => {
      window[thisId] = null
      head.removeChild(script)
  }
  return new Promise((resolve, reject) => {
    let timer = setTimeout(() =>{
      clean()
      reject('jsonp Timeout.')
    }, timeout || 30000)
    
    window[thisId] = function(data){
      if(timer) clearTimeout(timer)
      clean()
      resolve(data)
    }

    script.onerror = function(err){
      if(timer) clearTimeout(timer)
      clean()
      reject(err)
    }
  })
}
jsonp.cbQueryString = 'callback'
jsonp.setRemoteCb = cbQueryString => {
  jsonp.cbQueryString = cbQueryString
}