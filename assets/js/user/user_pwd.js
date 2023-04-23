;(function(){
  let form = layui.form
  form.verify({
    password:[
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ],
    samePwd:function(value) {
      if(value === $('.layui-input-block [name=oldPwd]').val()){
        return '和原密码重复'
      }
    },
    pwdEquit:function(value){
      if(value !== $('.layui-input-block [name=newPwd]').val()){
        return '密码不一致，请核对后输入'
      }
    }
  })

  //重设密码功能
  $('.layui-form').submit(function(e){
    //阻止默认提交事件
    e.preventDefault()
    //发起请求重设密码
    $.ajax({
      method: "POST",
      url:'/my/updatepwd',
      data: {
        oldPwd:$('.layui-input-block [name=oldPwd]').val(),
        newPwd:$('.layui-input-block [name=newPwd]').val()
      },
      success:function(res){
        if(res.status !== 0) return layui.layer.msg('更新密码失败')
        layui.layer.msg('更新密码成功')
        //清空表单
        $('.layui-form')[0].reset()
      }
    })
  })
})()