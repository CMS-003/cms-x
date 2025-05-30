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
- 组件分页加载设置
- ipad 支持touch和click两种事件导致播放按钮失效
- attrs属性：align，layout，flex，path，selected_id，selected，left，right，holder，template_id，gap，content_type，confirm，style,columns,pagination
  - 子组件属性

## 消息系统
- 全局参数
  - 消息提醒: 是否显示数字
  - 互动通知: 所有人/关注的人/NONE,赞: 接收/不接收
  - 推送: 消息免打扰, 点赞/评论/@/聊天,更新提醒,推荐,追番,订阅合集,预约提醒

# 消息系统

## 分类
- 提醒消息: thumb/comment-replay/follow/system/subscribe/reserve
- 私信: message
- 群消息: group
- 

## 表
### 会话chat
| 字段      | 类型   | 说明                     |
| --------- | ------ | ------------------------ |
| _id       | string | 唯一id                   |
| chat_id   | string | 会话id(两用户id计算得到) |
| user_id   | string |                          |
| friend_id | string |                          |
| createdAt | date   |                          |
| updatedAt | date   |                          |
| setting   | object | forbidden/top/muted      |

### 消息message
| 字段      | 类型   | 说明                         |
| --------- | ------ | ---------------------------- |
| _id       | string | 唯一id                       |
| pid       | string | 上级id                       |
| chat_id   | string | 会话id                       |
| sender_id | string | 发送人                       |
| accept_id | string | 接收人                       |
| type      | number | 1 文本,2 图标, 3 音频,4 视频 |
| data      | object | content,url,format,size      |
| createdAt | date   |                              |
| updatedAt | date   |                              |

### 提醒notification
| 字段        | 类型     | 说明                                  |
| ----------- | -------- | ------------------------------------- |
| _id         | string   | 唯一id                                |
| uid         | string   | 用户                                  |
| res_id      | string   | 资源id                                |
| res_type    | string   | 资源类型                              |
| target_id   | string   | 比如点赞的评论,但评论是某个视频或文章 |
| target_type | string   |                                       |
| read        | number   | 1: 已读 0: 未读                       |
| cover       | string   |                                       |
| url         | string   |                                       |
| title       | string   |                                       |
| content     | string   |                                       |
| platforms   | number[] |                                       |
| createdAt   | date     |                                       |
| updatedAt   | date     |                                       |
| deletedAt   | date     |                                       |

## 接口
- `get /chats`
- `get /chats/:id/messages`
- `put /chats/:id`
- `del /chats/:id`
- `del /chats/:uid/:id`
- 
- `get /counter/notifications`
- `get /notifications/:type`
- 
- `post /notifications/:type`
- `post /notification/:type/read`
- `post /notification/:type/readall`
- `post /notification/:type/clear`
- `post /notification/:type/clearall`
- 
- `post /im/callback`
- `post /message`
- `post /revoke`