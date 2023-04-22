;(function(){
  //登录表单和注册表单的切换效果
  $('#link_reg').click(function(){
    $('.login-box').css('display', 'none')
    $('.reg-box').css('display', 'block')
    $('.loginAndRegBox').css('height', '310px')
  })
  $('#link_login').click(function(){
    $('.reg-box').hide()
    $('.login-box').show()
    $('.loginAndRegBox').css('height', '250px')
  })
  //从layui中获取 form对象
  let form = layui.form
  //从layui中获取 layer对象， 用于对注册或登录 成功/失败 后的弹出消息
  let layer = layui.layer
  
  //通过form.verify()函数自定义校验规则
  form.verify({
    //自定了一个pwd的验证规则
    pwd: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ],
    repwd: function(value){
      if($('#password').val() !== value){
        return "密码不一致，请重新输入"
      }
    },
    username: function(value){ //value：表单的值、item：表单的DOM对象
      if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
        return '用户名不能有特殊字符';
      }
      if(/(^\_)|(\__)|(\_+$)/.test(value)){
        return '用户名首尾不能出现下划线\'_\'';
      }
      if(/^\d+\d+\d$/.test(value)){
        return '用户名不能全为数字';
      }
      if(value === 'porn'){
        return '用户名不能为敏感词';
      }
    }
  })
  //监听注册表单的提交
  $('#form_reg').on('submit', function(e){
    e.preventDefault()
    //获得用户名和密码
    let userInfo = {
      username: $('.reg-box [name=username]').val(),
      password: $('.reg-box [name=password]').val()
    }
    //发起POST请求
    $.post('/api/reguser', userInfo, function(res){
      if(res.status !== 0) return layer.msg(res.message)
      layer.msg(res.message + '请登录！')  
      //注册成功后，自动跳转到注册页面
      $('#link_login').trigger('click')
    })
  })
  //监听登录表单的提交
  $('#form_login').on('submit', function(e){
    e.preventDefault()
    //获得用户名和密码
    let userInfo = $('#form_login').serialize()
    //发起POST请求
    $.post('/api/login', userInfo, function(res){
      if(res.status !== 0) return layer.msg(res.message) 
      //将登录成功的token字符串保存到 localStorage 中
      localStorage.setItem('token', res.token)
      // 跳转后台主页
      location.href = '/index.html'
    })
  })
})()