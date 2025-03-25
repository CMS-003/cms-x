# 设计方案

- 页面设计: views,一个 view 可能由一个或多个 template 组成
  - 应用的view 一定有不会被删除,view 有对应 route 和参数: template_id/name,query 的 id/page 等
  - location.href 与 views 不是完全对应,与 currentView 有关,分享和多层 views 就不会受影响
- 通用View组件: 包含 Navi 和视图切换动画
- view 的数据,template下分tree有利于分页和缓存
- groups 自动组装
- pages 页面模板。template+其他定义模板
- 页面缓存： 切换view，数据不存在则创建并缓存