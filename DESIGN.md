# 设计方案

- 页面设计: views,一个 view 可能由一个或多个 template 组成
  - 应用的view 一定有不会被删除,view 有对应 route 和参数: template_id/name,query 的 id/page 等
  - location.href 与 views 不是完全对应,与 currentView 有关,分享和多层 views 就不会受影响
- 通用View组件: 包含 Navi 和视图切换动画
- view 的数据,template下分tree有利于分页和缓存
- groups 自动组装
- pages 页面模板。template+其他定义模板
- 页面缓存： 切换view，数据不存在则创建并缓存


## TODO
- Tabbar切换并缓存
- Filter数据加载
- Random请求数据
- ✅ 组件分页加载设置
- ✅ ipad 支持touch和click两种事件导致播放按钮失效
- 模板attrs属性：
  - embed 是否是内嵌页面,控制显示安全区和返回导航
  - pagination 分页
- 组件attrs属性:
  - align 对齐方式
  - layout 布局方向
  - flex 是否自适应
  - path 后端菜单路径
  - selected_id/selected 选择子元素
  - left/right 表单左右比例
  - holder 占位符
  - template_id 模板id
  - gap 间距
  - confirm 事件触发确认
  - style 样式
  - columns 分栏数量
  - display 展示类型
  - auth 要求先登陆
  - ❌ content_type 页面类型
  - 子组件属性
> 优化方式. style,attrs(layout,selected,left/right,holder,confirm,columns,display,auth,template_id)
1. align,flex,gap,style 统一使用 style
2. path 改到 url 和 widget 中
3. selected_id/改为 selected


- Follow: _id,follower_id,followee_id,createdAt,
- ✅ QueryContext/useQuery

推送: 发不发通知  免打扰: 来了通知要不要打扰用户
- global: push,mute,show_hidden,block_stranger,
- chat: mute免打扰(sound,banner,vibrate),push(推送),pinned,banned,hidden,background,