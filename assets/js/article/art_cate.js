; (function () {

  initArtCateList()
  //导入layui的弹出层
  let layer = layui.layer


  //获取文章分类列表
  function initArtCateList() {
    //发起ajax请求获取表格数据
    $.ajax({
      method: "GET",
      url: '/my/article/cates',
      success: function (res) {
        //判断是否获取成功
        if (res.status !== 0) return layui.layer.msg('获取数据失败')
        //与定义的模板关联
        let htmlStr = template('tpl-table', res)
        //将渲染好的模板字符串添加到 tbody
        $('tbody').html(htmlStr)
      }
    })
  }
  //弹出层索引，用于关闭弹出层
  let indesAdd = null
  //添加类别按钮 操作
  $('#btnAddCate').click(function () {
    //弹出 表单
    indesAdd = layer.open({
      //将 层类型 修改为 页面层 对应数字 为 1
      type: 1,
      //定义弹出层的宽高
      area: ['500px', '300px'],

      title: '添加文章分类',
      //可以些纯文本 / 网页结构/ DOM
      content: $('#dialog-add').html()
    })
  })

  //通过代理 为 弹出层 确认添加 操作 （因为当不惦记 添加类别 按钮 页面不存在form）
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: {
        name: 'nihao',
        alias: 'nihaoff'
      },
      success: function (res) {
        console.log(res)

        if (res.status !== 0) {
          return layer.msg('新增分类失败！')
        }
        initArtCateList()
        layer.msg('新增分类成功！')

        // 根据索引，关闭对应的弹出层
        layer.close(indexAdd)
      }
    })
  })

  //通过代理 为 编辑按钮 添加弹出层
  $('tbody').on('click', '#btn-edit', function () {
    //点击触发后 ， 弹出一个弹出层
    //弹出 表单
    indesAdd = layer.open({
      //将 层类型 修改为 页面层 对应数字 为 1
      type: 1,
      //定义弹出层的宽高
      area: ['500px', '300px'],

      title: '修改文章分类',
      //可以些纯文本 / 网页结构/ DOM
      content: $('#dialog-edit').html()
    })

    //获取当前数据的ID
    let id = $(this).attr('data-id')
    //将已有的信息填充到 表单 中
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        if (res.status !== 0) return layer.msg('获取数据失败！')
        layer.msg('获取数据成功！')
        //填充数据
        layui.form.val('form-edit', res.data)
      }
    })
  })

  //通过代理 为 确认修改 添加效果
  $('body').on('submit', '#form-edit', function (e) {
    //阻止默认的提交行为
    e.preventDefault()
    //发起ajax请求
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $('#form-edit').serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message)
        layer.msg('修改数据成功！')
        //关闭弹出层
        layer.close(indesAdd)
        //更新当前行数据
        initArtCateList()
      }
    })
  })

  //通过代理 为 删除按钮 添加效果
  $('tbody').on('click', '#btn-del', function () {

    //弹出询问层,提示用户是否删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + $('#btn-del').attr('data-id'),
        success:function(res){
          if(res.status !== 0) return layer.msg(res.message)
          layer.msg('删除数据成功')
          //关闭询问层
          layer.close(indesAdd)
          //初始化表格
          initArtCateList()
        }
      })
      layer.close(index);
    });
  })
})()