//jsonp with Promise
(function(window){
  function isObject(thing){
    return Object.prototype.toString.call(thing) === '[object Object]'
  }
  function serialize(obj){
    if(!obj || !isObject(obj)) return ''
    return Object.keys(obj).map(function(key){
      return key + '=' + obj[key]
    }).join('&')
  }
  
  var cbId = 0
  
  var jsonp = function(url, params, remoteCb, timeout){
    var thisId = '_jsonp' + cbId++
    remoteCb = remoteCb || jsonp.cbQueryString
    params = serialize(params)
    
    if(url.indexOf('?') === -1) url += '?'
    if(params.length > 0) url += '&' + params
    url += '&' + remoteCb + '=' + thisId
    
    var script = document.createElement('script'),
        head = document.getElementsByTagName('head')[0] || document.head
    script.src = url
    head.appendChild(script)
    return new Promise(function(resolve, reject){
      var timer = setTimeout(function(){
        reject('jsonp Timeout.')
        window[thisId] = null
        head.removeChild(script)
      }, timeout || 30000)
      
      window[thisId] = function(data){
        if(timer) clearTimeout(timer)
        resolve(data)
        window[thisId] = null
        head.removeChild(script)
      }
      script.onerror = function(err){
        if(timer) clearTimeout(timer)
        reject(err)
        window[thisId] = null
        head.removeChild(script)
      }
    })
  }
  jsonp.cbQueryString = 'callback'
  jsonp.setRemoteCb = function(cbQueryString){
    jsonp.cbQueryString = cbQueryString
  }
  window.jsonp = jsonp
})(window)
