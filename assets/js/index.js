; (function () {
  //调用getUserInfo获取用户基本信息
  getUserInfo()

  //退出 按钮效果
  let layer = layui.layer
  $('#btnLogOut').click(function () {
    //弹出提示框，提示用户是否退出
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
      //do something
      //1.清空本地存储中的 token
      localStorage.removeItem('token')
      //2.重新跳转到登录页
      location.href = '/login.html'

      //关闭当前弹出层
      layer.close(index);
    });
  })
})()
function getUserInfo() {
  //获取用户基本信息
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function (res) {
      if (res.status !== 0) return layui.layer.msg('获取用户信息失败')
      console.log(res.data)
      //调用renderAvatar渲染用户头像
      renderAvatar(res.data)
    },
    //不论成功失败，都会调用complete函数, 此函数在Prefilter中全局挂载
    // complete: function (res) {
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //     //1. 强制清空token
    //     localStorage.removeItem('token')
    //     //2.强制跳转到login.index
    //     location.href = '/login.html'
    //   }
    // }
  })
}

function renderAvatar(data) {
  //获取和设置用户名称
  let name = data.nickname || data.username
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  console.log(name)

  //设置头像
  //判断 user_pic是否为空：
  if (data.user_pic === null) {
    //说明为空，隐藏实体头像，初始化文字头像
    $('.layui-nav-img').hide()
    //截取用户名前1个字符,并且大写
    let str = (name.substring(0, 1)).toUpperCase()
    $('.text-avatar').text(str)
  }
  else {
    $('.text-avatar').hide()
    $('.layui-nav-img').attr('src', data.user_pic)
  }
}

