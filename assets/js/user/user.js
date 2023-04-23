; (function () {
  //初始化表单
  initUserInfo()
  let form = layui.form
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称的长度必须在 1 ~ 6 字符之间'
      }
    }
  })

  

  //初始化用户的基本信息
  function initUserInfo() {
    //获取用户基本信息
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) return layui.layer.msg('获取用户信息失败')

        //jQuery赋值
        // $('.layui-input-block [name=username]').val(res.data.username)
        // $('.layui-input-block [name=nickname]').val(res.data.nickname)
        // $('.layui-input-block [name=email]').val(res.data.email)

        //快速为表单赋值
        form.val("userInfoForm", res.data)
      }
    })
  }

  //重置表单数据
  $('#btnReset').click(function(e){
    //阻止表单默认重置事件
    e.preventDefault()
    initUserInfo()
  })

  //提交表单数据 更新用户数据
  $('.layui-form').submit(function(e){
    e.preventDefault()
    //发起POST请求更新数据
    $.ajax({
      method: 'POST',
      url:'/my/userinfo',
      data: $('.layui-form').serialize(),
      success: function(res){
        if(res.status !== 0) return layui.layer.msg('更新数据失败！')
        layui.layer.msg(res.message)
        //更新index.html的 欢迎 文本
        window.parent.getUserInfo()
      }
    })
  })
})()