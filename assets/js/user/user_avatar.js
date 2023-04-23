; (function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)


  //为上传按钮绑定点击事件
  $('#btnChooseImage').click(function () {
    $('#file').click()
  })

  //当文件选择框文件发生改变时，会触发change事件
  $('#file').on('change', function (e) {
    //获取用户选择的文件
    let fileList = e.target.files
    //判断用户是否选择了文件
    if (fileList.length === 0) return layui.layer.msg('未选择图片')



    //1.拿到用户选择的文件
    let file = e.target.files[0]
    //2.根据文件创建一个对应的URL地址
    let newImgURL = URL.createObjectURL(file)
    //3.先销毁旧的裁剪区域，再重新设置图片路劲，之后再创建新的裁剪区域
    $image
      .cropper('destroy') //摧毁
      .attr('src', newImgURL) //指定新的
      .cropper(options) //创建
  })

  //为确定按钮，绑定点击事件
  $('#btnUpload').click(function () {
    //1.拿到用户裁剪的图像，base64格式的图像
    let dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    //2.调用接口，把头像上传到服务器
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: function (res) {
        if(res.status !== 0) return layui.layer.msg('更换头像失败')
        layui.layer.msg('更换头像成功')
        //调用上层window的getUserInfo()方法，属性界面用户信息
        window.parent.getUserInfo()
      }
    })
  })
})()