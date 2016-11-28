# jsonp with Promise**

## example:
```js
jsonp.setRemoteCb('_jsonp')
jsonp(url,{param: 'foo'}).then(function(data){
  consume(data)
})
```