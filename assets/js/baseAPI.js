//每次调用$.get/$.post/$.ajax, 会隐式的自动调用ajaxPrefilter（）函数，
//在这个函数我们可以拿到给ajax提供的配置对象(method/url/...)。
jQuery.ajaxPrefilter(function(options){

  //设置url服务器域名端口部分/请求根路径  和 文件地址的拼接 （这样有助于后期维护，如果你换了服务器，请求很多，就会一条一条修改）
  options.url = 'http://www.liulongbin.top:3007' + options.url 
  
  //统一为需要权限的接口， 设置headers请求头
  //判断url是否含有/my/,因为只有这个路径的请求需要headers
  if(options.url.indexOf('/my/') !== -1){
    options.headers = {Authorization: localStorage.getItem('token') || ''}
  }

  //全局统一挂载complete函数
  options.complete = function(res){
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      //1. 强制清空token
      localStorage.removeItem('token')
      //2.强制跳转到login.index
      location.href = '/login.html'
    }
  }
})