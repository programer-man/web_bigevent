; (function () {

  let layer = layui.layer
  let form = layui.form

  initCate()
  // 初始化富文本编辑器
  initEditor()

  // 定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败！')
        }
        // 调用模板引擎，渲染分类的下拉菜单
        let htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 一定要记得调用 form.render() 方法
        form.render()
      }
    })
  }

  // 1. 初始化图片裁剪器
  let $image = $('#image')

  // 2. 裁剪选项
  let options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 为选择封面的按钮，绑定点击事件处理函数
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click()
  })

  // 监听 coverFile 的 change 事件，获取用户选择的文件列表
  $('#coverFile').on('change', function (e) {
    // 获取到文件的列表数组
    let files = e.target.files
    // 判断用户是否选择了文件
    if (files.length === 0) {
      return
    }
    // 根据文件，创建对应的 URL 地址
    let newImgURL = URL.createObjectURL(files[0])
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 定义文章的发布状态
  let art_state = '已发布'

  // 为存为草稿按钮，绑定点击事件处理函数
  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  })

  // 为表单绑定 submit 提交事件
  // 这里有个bug,就是我需要点击两次才能拿到 content 的值 需要点击 发布 两次 才能发起 Ajax请求
  // 这个bug没法解决，只能提醒用户 双击发布

  $('#form-pub').on('submit', function (e) {
    // 1. 阻止表单的默认提交行为
    e.preventDefault()
    // 2. 基于 form 表单，快速创建一个 FormData 对象
    let fd = new FormData($(this)[0])

    //只能通过判断content是否为空 再 发起请求
    if ($('[name=content]').val()) {
      //将文章的发布状态存入 state
      fd.append('state', art_state)

      //将裁剪后的图片输出为文件
      $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
          width: 400,
          height: 280
        })
        .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
          // 将blod文件存入fd
          fd.append('cover_img', blob)
          //发起ajax请求
          publishArticle(fd)
        })
      

    }

  })

  function publishArticle(fd){
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      //如果向服务器提交的是formDate格式的数据必须添加必须添加以下配置项
      contentType:false,
      processData:false,
      success: function(res){
        if(res.status !== 0) return layer.msg('发表文章失败')
        layer.msg('发布文章成功')
        //成功后跳转到 list 页面
        location.href='/article/art_list.html'      
      }
    })
  }
})()