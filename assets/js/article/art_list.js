
; (function () {
  //用于渲染分页
  let laypage = layui.laypage;
  //定义一个查询参数对象，用于向服务器拿数据时，需要将查询参数一起提交给服务器
  let q = {
    pagenum: 1, //页码值，默认请求第一页的数据
    pagesize: 2, //每页显示几条数据
    cate_id: '', //文章分类的id
    state: '' //文章发布状态
  }
  // 定义美化时间过滤器
  template.defaults.imports.dataFormat = function (date) {
    let d = new Date(date)
    return d.toLocaleString()
  }
  initTable()
  initCate()




  //获取文章数据方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) return layui.layer.msg('获取数据失败！')
        layui.layer.msg('获取数据成功！')
        //使用模板引擎渲染数据
        let htmlStr = template('list', res)
        $('tbody').html(htmlStr)
        //调用渲染分页方法
        renderPage(res.total)
      }
    })
  }

  //动态拿到文章分类选项
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) return layui.layer.msg('获取下拉列表失败')
        //初始化模板引擎
        let htmlStr = template('downMenu', res)
        $('#cate_id').html(htmlStr)
        //使用layui重新渲染
        layui.form.render()
      }
    })
  }

  //筛选 功能 
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    q.cate_id = $('[name=cate_id]').attr('value')
    q.state = $('[name=state]').attr('value')
    //通过新q渲染表格
    initTable()
  })


  //定义渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: 'pageBox', //分页容器ID
      count: total, //总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, //默认选择第几页
      limits: [2, 3, 4, 5],
      layout: ['count', 'limit', 'page', 'next', 'prev', 'skip'],
      //触发方式1：分页被点击触发时，才会执行回调函数
      jump: function (obj, first) {
        //发起ajax更新表格

        q.pagenum = obj.curr
        //把最新的条目数赋值给q
        q.pagesize = obj.limit
        //触发方式2：只要调用了laypage.render()就会执行jump,所以会形成死循环
        // initTable()
        //判断jump是否第一次触发
        if (!first) {
          initTable()
        }
      }
    });
  }

  // 通过代理的形式，为删除按钮绑定点击事件处理函数
  $('tbody').on('click', '.btn-delete', function () {
    // 获取删除按钮的个数
    var len = $('.btn-delete').length
    console.log(len)
    // 获取到文章的 id
    var id = $(this).attr('data-id')
    // 询问用户是否要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
          // 如果没有剩余的数据了,则让页码值 -1 之后,
          // 再重新调用 initTable 方法
          // 4
          if (len === 1) {
            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
            // 页码值最小必须是 1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })

      layer.close(index)
    })
  })
  // 通过代理的形式，为编辑按钮绑定点击事件处理函数
  $('tbody').on('click', '.btn-edit', function () {
    //获得当前文章行的ID
    let id = $(this).attr('data-id')
    //发起ajax请求
    $.ajax({
      method: 'GET',
      url: '/my/article/' + id,
      success:function(res){
        if(res.status !== 0) return layui.layer.msg('获取数据失败')
        layui.layer.msg('获取数据成功')
        //将页面换成 编辑 页面
      }
    })  
  })


})()