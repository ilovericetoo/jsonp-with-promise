# jsonp with Promise

## API

1. __jsonp(url, params, cbName, timeout)__
  - url: url
  - params: querystrings, it can also be attached to the url
  - cbName: set server side callback name, 'callback' for default
  - timeout: timeout

2. __jsonp.setRemoteCb(cbName)__

set default server side callbak name

## Example

```js
var future = jsonp('//api', {q: 'bar'}, 'cb', 15000)
future.then(function(data){
  consume(data)
}).catch(function(err){
  console.log(err)
})
```
