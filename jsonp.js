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
  function setUpUrl(url, params){
    var cbQS = jsonp.cbQueryString + '=' + jsonDataCatcher
    params = serialize(params)
    
    if(url.indexOf('?') === -1) url += '?'
    if(params.length > 0) url += '&' + params
    return [url, cbQS].join('&')
  }
  
  var jsonpBus = {}
  var jsonp = function(url, params){
    var script = document.createElement('script')
    script.src = setUpUrl(url, params)
    console.log(script.src)
    document.head.appendChild(script)
    return new Promise(function(resolve, reject){
      jsonpBus.onData = function(data){
        resolve(data)
        document.head.removeChild(script)
      }
      script.onerror = function(err){
        reject(err)
        document.head.removeChild(script)
      }
    })
  }
  var jsonDataCatcher = 'jsonp' + Date.now()
  window[jsonDataCatcher] = function(data){
      jsonpBus.onData(data)
  }
  jsonp.cbQueryString = 'callback'
  jsonp.setRemoteCb = function(cbQueryString){
    jsonp.cbQueryString = cbQueryString
  }
  window.jsonp = jsonp
})(window)