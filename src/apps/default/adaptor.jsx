/**
 * 统一资源适配器 —— 所有项目共用（apps/default）。
 *
 * 设计：
 * - 原来的 `src/adaptor/` 目录（article / video / gallery / post / user / compilation +
 *   style）与 `src/apps/fengshows/`（types / adapters / resolve / index）全部合并到本文件，
 *   一个文件就是「一套适配器」。
 * - 分层不变：**字段适配器（本文件）只管取什么**，**布局（ResourceCard/layout.jsx）只管怎么摆**，
 *   由 `ResourceCard` 组装。新增项目若字段形态不同，另建 `src/apps/<APP_NAME>/adaptor.jsx` 覆盖即可。
 *
 * 展示形态由两层决定：
 * - `display`：容器意图（`'lprt' | 'card' | 'half' | 'history' | 'banner'`），告诉列表项当前处在什么容器里；
 * - `display_type`：数据自带的展示类型（1 小图 / 4 无图 / 5 大图 / 6 三图）。
 *
 * 资源类型识别优先级：`resource_type`（新表） > 旧数字 `type` > 订阅号特征 > 形状推断 > article。
 *
 * @module apps/default/adaptor
 */

import { Observer } from 'mobx-react-lite';
import { useRouter } from '@/contexts';
import store from '@/store';
import { readableTime, formatDuration } from '@/utils';
import ResourceCard from '@/ResourceCard';
import { LAYOUT } from '@/ResourceCard/layout';

export { LAYOUT } from '@/ResourceCard/layout';

/* ================================================================== *
 * 枚举
 * ================================================================== */

/** 资源类型（资源基础表 resource_type） */
export const RESOURCE_TYPE = {
  ARTICLE: 'article',
  TICKER: 'ticker',
  LIVE: 'live',
  PROGRAM: 'program',
  EPISODE: 'episode',
  AWHILE: 'awhile',
  SPECIAL: 'special',
  CHOICE: 'choice',
  AD: 'ad',
  VIDEO: 'video',
  SUBSCRIPTION: 'subscription',
};

/** 展示类型（资源基础表 display_type）：1 小图 / 4 无图 / 5 大图 / 6 三图 */
export const DISPLAY_TYPE = {
  SMALL_IMAGE: 1,
  NO_IMAGE: 4,
  BIG_IMAGE: 5,
  THREE_IMAGES: 6,
};

/** 资源标记 marks：1 獨家 / 2 原創 */
export const MARK = { EXCLUSIVE: 1, ORIGINAL: 2 };

/** 订阅号类别：1 媒体 / 2 自媒体 / 3 组织机构 / 4 企业 */
export const SUBSCRIPTION_CATEGORY = {
  MEDIA: 1,
  SELF_MEDIA: 2,
  ORGANIZATION: 3,
  ENTERPRISE: 4,
};

/**
 * 旧数字类型（历史接口 `item.type`）到资源类型的映射。
 * 取自旧 `adaptor/index.jsx` 的分发：1 图文 / 2 视频 / 3 图集 / 9 视频 / 11 动态 / 13 用户 / 14 合集。
 * @type {Record<number, string>}
 */
export const LEGACY_TYPE = {
  1: RESOURCE_TYPE.ARTICLE,
  2: RESOURCE_TYPE.VIDEO,
  3: 'gallery',
  9: RESOURCE_TYPE.VIDEO,
  11: 'post',
  13: 'user',
  14: 'compilation',
};

export const RESOURCE_TYPE_LABEL = {
  article: '图文',
  ticker: '快讯',
  live: '直播',
  program: '栏目',
  episode: '剧集',
  awhile: '短视频',
  video: '视频',
  special: '专题',
  choice: '精选',
  ad: '广告',
  subscription: '订阅号',
  gallery: '图集',
  post: '动态',
  user: '用户',
  compilation: '合集',
};

export const DISPLAY_TYPE_LABEL = { 1: '小图', 4: '无图', 5: '大图', 6: '三图' };
export const MARK_LABEL = { 1: '独家', 2: '原创' };
export const SUBSCRIPTION_CATEGORY_LABEL = { 1: '媒体', 2: '自媒体', 3: '组织机构', 4: '企业' };
export const CERTIFICATION_LABEL = { 0: '', 1: '企业认证', 2: '个人认证' };

/* ================================================================== *
 * 数据结构（JSDoc typedef，与原始数据库实现无关，只描述前端消费到的字段）
 * ================================================================== */

/**
 * { _id, name } 形式的键值对，区域 / 语言 / 分类等复用。
 * @typedef {Object} NameId
 * @property {string} _id
 * @property {string} name
 */

/**
 * 资源译文。
 * @typedef {Object} Translation
 * @property {string} [title]     译文标题
 * @property {string} [brief]     译文简介
 * @property {string} [content]   译文正文
 * @property {string} [language]  语言编码
 */

/**
 * 资源权限项。
 * @typedef {Object} ResourcePermission
 * @property {boolean} [free]   是否免费
 * @property {number}  [price]  价格
 * @property {string}  [level]  会员等级
 */

/**
 * 第三方资源（内容），对应资源基础表。
 * 适配器实际依赖的最小集合：`title / brief / cover / cover_list / display_type /
 * resource_type / source / duration / marks / tags / subscription_id`。
 *
 * @typedef {Object} Resource
 * @property {string} _id                            系统序号 guid
 * @property {string} [title]                        文章标题
 * @property {string} [brief]                        资源简介
 * @property {number} [available]                    0 不可用 / 1 可用
 * @property {Date|string} [created_time]            创建时间
 * @property {Date|string} [modified_time]           修改时间
 * @property {string} [resource_type]                资源类型
 * @property {string} [resource_id]                  资源序号
 * @property {number} [display_type]                 展示类型 1 小图 / 4 无图 / 5 大图 / 6 三图
 * @property {string} [cover]                        封面图
 * @property {string} [source]                       来源
 * @property {Array<string|NameId>} [labels]         标签
 * @property {number} [duration]                     时长（秒）
 * @property {number} [allow_comment]                1 可以评论 / 2 禁止
 * @property {Date|string} [__last_actived_time]     最后活跃时间（创建或修改时更新）
 * @property {Array<number>} [marks]                 标记 1 獨家 / 2 原創
 * @property {string} [subscription_id]              订阅号 id
 * @property {string[]} [cover_list]                 封面列表（三图）
 * @property {ResourcePermission} [permission]       权限项
 * @property {string[]} [authorized_countries]       授权区域
 * @property {Date|string} [expiration_time]         资源过期时间
 * @property {number} [free_duration]                免费时长（秒）
 * @property {number} [config_score]                 人工干预热度
 * @property {string[]} [flags]                      标记
 * @property {number} [duanmu_enabled]               是否开启弹幕 1 是 / 0 否
 * @property {number} [comment_enabled]              是否开启评论 1 是 / 0 否
 * @property {number} [send_subscription]            订阅号资源是否发布到订阅号 1 是 / 0 否
 * @property {Translation[]} [translations]          资源译文数据
 * @property {string} [current_language]             资源内容当前语言
 * @property {string[]} [translation_languages]      译文支持的语言编码（冗余）
 * @property {string[]} [target_platforms]           支持的平台
 * @property {NameId[]} [target_countries_and_regions] 目标国家与地区
 * @property {Array<string|NameId>} [tags]           标签（历史上有 string 与 {_id,name} 两种形态）
 * @property {NameId[]} [default_countries_and_regions] 默认国家与地区
 * @property {NameId} [default_language]             默认语言
 *
 * 说明：`region_allowed` 表示「用户当前区域是否被授权」，仅数据返回客户端时设置，不落库，不视为持久字段。
 */

/**
 * 用户。
 *
 * @typedef {Object} User
 * @property {string} id                             主键唯一 UUID
 * @property {string} [phone]                        电话号码
 * @property {string} [nickname]                     用户昵称
 * @property {number} [serial_number]                用户编号
 * @property {number} [status]                       状态 1 正常 / 2 禁用 / 3 禁言 / 4 注销
 * @property {Date|string} [expiry_date]             有效期（禁言）
 * @property {string} [name]                         姓名
 * @property {number} [gender]                       性别
 * @property {string} [code]                         国际区号（如 86）
 * @property {string} [nation]                       国家
 * @property {string} [region]                       区域
 * @property {string} [address]                      地址
 * @property {string} [postcode]                     邮编
 * @property {Date|string} [birthday]                生日
 * @property {string} [job]                          职业
 * @property {string} [education]                    教育程度
 * @property {string} [hobby]                        兴趣
 * @property {string} [icon]                         头像
 * @property {string} [memo]                         介绍
 * @property {string} [eamil]                        邮箱（字段名沿用接口拼写）
 * @property {Date|string} [modify_time]             更新时间
 * @property {Date|string} [reg_time]                注册时间
 * @property {string} [reg_ip]                       注册 IP
 * @property {string} [reg_plat]                     注册设备
 * @property {string} [reg_nation]                   注册国家
 * @property {string} [reg_region]                   注册区域
 * @property {number} [is_developper]                是否开发者 1 是 / 0 否
 * @property {string} [head_picture]                 头图
 * @property {string} [medals]                       勋章
 * @property {number} [certificate]                  认证 0 无 / 1 企业 / 2 个人
 */

/**
 * 订阅号（该表没有 resource_type，靠 category / media_name / head 等独有字段识别）。
 *
 * @typedef {Object} Subscription
 * @property {string} _id                            主键唯一 UUID
 * @property {number} category                       订阅号类别 1 媒体 / 2 自媒体 / 3 组织机构 / 4 企业
 * @property {number} [subject_type]                 主体类型（与 category 相关）
 * @property {string} title                          账号名称
 * @property {string} brief                          账号简介
 * @property {string} icon                           账号图标（列表里按圆形头像展示）
 * @property {string} [works]                        已有内容渠道及链接
 * @property {string} [code]                         国际区号
 * @property {string} [phone]                        电话号码
 * @property {string} [email]                        邮箱
 * @property {string} [qq]
 * @property {string} [we_chat]
 * @property {string} [verification_mark]            海外验证标识
 * @property {string} [media_name]                   媒体 / 媒体公司 / 企业名称
 * @property {string} [nation]                       国家
 * @property {string} [region]                       区域
 * @property {string} [address]                      地址
 * @property {string} [business_license]             营业执照扫描件
 * @property {string} [organization_code]            组织机构 / 社会信用代码
 * @property {string} [id_card_picture]              运营者身份证照片
 * @property {NameId} [user]                         凤凰秀账号
 * @property {string} [company_category]             公司类别
 * @property {Date|string} [created_time]            创建时间
 * @property {Date|string} [modified_time]           更新时间
 * @property {number} [status]                       状态 1 启用 / 2 禁用 / 3 注销
 * @property {NameId} [account_category]             账号分类
 * @property {string} [notice]                       公告（栏目专有）
 * @property {string} [head]                         头图（栏目专有）
 * @property {string} [head_wide]                    头图（栏目专有，宽版）
 * @property {number} [program_status]               在播状态 1 在播 / 0 停播（栏目专有）
 * @property {Date|string} [start_time]              首播日期（栏目专有）
 * @property {Date|string} [end_time]                停播日期（栏目专有）
 * @property {string} [announcement]                 更新提示语（栏目专有）
 * @property {number} [allow_comment]                允许评论（栏目专有）
 * @property {number} [available]                    0 下线 / 1 上线
 * @property {Date|string} [__last_actived_time]
 * @property {string} [video_frame]                  视频框
 * @property {string} [title_pinyin]                 标题拼音（首字母搜索）
 * @property {string} [cover]                        分享卡片二维码，上线时生成
 * @property {number} [config_score]                 人工干预热度
 * @property {Array} [medals]                        订阅号勋章
 * @property {number} [certification_type]           订阅号认证 0 无 / 1 企业 / 2 个人
 */

/* ================================================================== *
 * 取值辅助
 * ================================================================== */

const isAbsoluteUrl = url => /^(https?:)?\/\//.test(url || '');

/**
 * 补全媒体地址：绝对地址原样返回，相对地址拼上媒体服务器。
 * @param {string} [url]
 * @returns {string}
 */
export function imageUrl(url) {
  if (!url) return '';
  if (isAbsoluteUrl(url)) return url;
  return (store.app.imageLine || '') + url;
}

/** 视频地址（旧 post 用） */
export function videoUrl(url) {
  if (!url) return '';
  if (isAbsoluteUrl(url)) return url;
  return (store.app.videoLine || '') + url;
}

const toDate = value => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** 依次尝试的活跃时间字段：新表优先，兼容旧的 publishedAt / createdAt */
const ACTIVE_FIELDS = ['__last_actived_time', 'created_time', 'modified_time', 'publishedAt', 'createdAt'];

const pickDate = (item, fields) => {
  for (const field of fields) {
    const date = toDate(item[field]);
    if (date) return date;
  }
  return null;
};

/** 相对时间文案（优先活跃时间，回退到创建 / 修改 / 发布时间） */
const timeText = item => {
  const date = pickDate(item, ACTIVE_FIELDS);
  return date ? readableTime(date) : '';
};

/** 作者 / 来源文案：新表用 source，兼容旧的 uname / author */
const authorText = item => item.source || item.uname || item.author || '';

/** tags 兼容 string 与 { _id, name } 两种历史形态 */
const tagText = tag => (typeof tag === 'string' ? tag : (tag && tag.name) || '');

/** marks -> 角标文案 */
const markTexts = item => (item.marks || []).map(mark => MARK_LABEL[mark]).filter(Boolean);

/** 时长文案 */
const durationText = item => (item.duration ? formatDuration(item.duration) : '');

/** 视频失效角标：旧视频卡片在 status ∈ {1,2} 时叠加 videoBroken 图标，这里用文案表达 */
const brokenTexts = item => ([1, 2].includes(item.status) ? ['失效'] : []);

/** 拼接非空片段 */
const join = (list, sep = ' · ') => list.filter(Boolean).join(sep);

/* ================================================================== *
 * 类型识别与路由
 * ================================================================== */

/**
 * 资源类型 -> 详情页。
 * @type {Record<string, string>}
 */
export const VIEW_OF = {
  [RESOURCE_TYPE.ARTICLE]: 'article',
  [RESOURCE_TYPE.TICKER]: 'article',
  [RESOURCE_TYPE.PROGRAM]: 'video',
  [RESOURCE_TYPE.EPISODE]: 'video',
  [RESOURCE_TYPE.AWHILE]: 'video',
  [RESOURCE_TYPE.VIDEO]: 'video',
  [RESOURCE_TYPE.LIVE]: 'video',
  [RESOURCE_TYPE.SPECIAL]: 'compilation',
  [RESOURCE_TYPE.CHOICE]: 'compilation',
  [RESOURCE_TYPE.AD]: 'dynamic',
  [RESOURCE_TYPE.SUBSCRIPTION]: 'channel',
  gallery: 'gallery',
  post: 'post',
  user: 'user',
  compilation: 'compilation',
};

/**
 * 判断是否订阅号：订阅号表没有 resource_type，用若干独有字段识别；
 * 也支持后端直接给 resource_type: 'subscription'。
 *
 * @param {any} item
 * @returns {boolean}
 */
export function isSubscription(item) {
  if (!item) return false;
  if (item.resource_type === RESOURCE_TYPE.SUBSCRIPTION) return true;
  if (item.resource_type != null) return false;
  return item.category != null
    || item.subject_type != null
    || item.media_name != null
    || item.head != null;
}

/**
 * 解析资源类型：resource_type > 旧数字 type > 订阅号特征 > 形状推断 > article。
 *
 * @param {any} item
 * @returns {string|null}
 */
export function resolveType(item) {
  if (!item) return null;
  if (item.resource_type) return item.resource_type;
  if (isSubscription(item)) return RESOURCE_TYPE.SUBSCRIPTION;
  if (item.type != null && LEGACY_TYPE[item.type]) return LEGACY_TYPE[item.type];
  if (Array.isArray(item.images) || Array.isArray(item.videos)) return 'post';
  return RESOURCE_TYPE.ARTICLE;
}

/**
 * 默认点击路由。
 * @param {any} item
 * @returns {{ view: string, query: Object }|null}
 */
export function routeOf(item) {
  if (!item) return null;
  const type = resolveType(item);
  if (type === RESOURCE_TYPE.SUBSCRIPTION) return { view: 'channel', query: { id: item._id } };
  const view = VIEW_OF[type] || 'dynamic';
  const id = item.resource_id || item._id;
  return id ? { view, query: { id } } : null;
}

/* ================================================================== *
 * 字段适配器
 * ================================================================== */

/**
 * @typedef {Object} FieldAdapter
 * @property {(item: any) => string} title
 * @property {(item: any) => string} brief
 * @property {(item: any) => string} cover
 * @property {(item: any) => string[]} covers
 * @property {(item: any) => string} avatar
 * @property {(item: any) => string} meta
 * @property {(item: any) => string[]} tags
 * @property {(item: any) => string[]} badges
 * @property {(item: any) => number|string|null} progress
 * @property {(item: any) => Array<{ type: string, src: string }>} media
 * @property {(item: any) => { view: string, query: Object }|null} route
 */

/** 通用字段，各类型按需覆盖 */
const base = {
  getTitle: item => item.title || '',
  getBrief: item => item.brief || item.desc || '',
  getCover: item => imageUrl(item.cover || item.poster || item.thumbnail),
  getCovers: item => (item.cover_list || item.covers || []).map(imageUrl).filter(Boolean),
  getAvatar: item => imageUrl(item.icon || item.avatar),
  getMeta: item => join([authorText(item), timeText(item)]),
  getTags: item => (item.tags || []).map(tagText).filter(Boolean),
  getBadges: item => markTexts(item),
  getProgress: () => null,
  getMedia: () => [],
  getRoute: routeOf,
};

const create = (overrides = {}) => ({ ...base, ...overrides });

/** 视频类次要信息：时长 + 来源 */
const videoMeta = item => join([durationText(item), authorText(item)]);

/** 「发布于 xx」文案 */
const publishedText = item => {
  const date = pickDate(item, ['publishedAt', 'created_time', 'createdAt']);
  return date ? `发布于 ${readableTime(date)}` : '';
};

/** 「注册于 xx」文案 */
const registeredText = item => {
  const date = pickDate(item, ['reg_time', 'createdAt', 'created_time']);
  return date ? `注册于 ${readableTime(date)}` : '';
};

/** 「更新于 xx」文案 */
const updatedText = item => {
  const date = pickDate(item, ACTIVE_FIELDS);
  return date ? `更新于 ${readableTime(date)}` : '';
};

/** 从 item 里抽出图片 / 视频，供 post 动态的横向滚动布局使用 */
const postMedia = item => [
  ...(item.images || []).map(img => ({ type: 'image', src: imageUrl(img && (img.path || img.url)) })),
  ...(item.videos || []).map(v => ({ type: 'video', src: videoUrl(v && (v.path || v.url)) })),
].filter(media => media.src);

/**
 * 全部适配器。键为资源类型或容器意图（banner）。
 * @type {Record<string, FieldAdapter>}
 */
export const adapters = {
  /** 图文：封面可有可无，小图 / 大图 / 三图由 display_type 决定 */
  [RESOURCE_TYPE.ARTICLE]: create(),

  /** 快讯：通常没有封面，无封面时布局自动降级为纯文字 */
  [RESOURCE_TYPE.TICKER]: create({
    getMeta: item => join([timeText(item), authorText(item)]),
  }),

  /** 短视频 */
  [RESOURCE_TYPE.AWHILE]: create({
    getMeta: videoMeta,
    getBadges: item => [...markTexts(item), '短视频'],
  }),

  /** 视频 */
  [RESOURCE_TYPE.VIDEO]: create({
    getCover: item => imageUrl(item.cover || item.thumbnail || item.poster),
    getMeta: videoMeta,
    getBadges: item => [...brokenTexts(item), ...markTexts(item)],
  }),

  /** 栏目 */
  [RESOURCE_TYPE.PROGRAM]: create({ getMeta: videoMeta }),

  /** 剧集 */
  [RESOURCE_TYPE.EPISODE]: create({ getMeta: videoMeta }),

  /** 直播 */
  [RESOURCE_TYPE.LIVE]: create({
    getMeta: videoMeta,
    getBadges: item => ['直播中', ...markTexts(item)],
  }),

  /** 专题 */
  [RESOURCE_TYPE.SPECIAL]: create(),

  /** 精选 */
  [RESOURCE_TYPE.CHOICE]: create(),

  /** 广告 */
  [RESOURCE_TYPE.AD]: create({ getBadges: () => ['广告'] }),

  /** 订阅号：圆形头像 + 名称 + 简介，封面字段不参与 */
  [RESOURCE_TYPE.SUBSCRIPTION]: create({
    getCover: () => '',
    getCovers: () => [],
    getAvatar: item => imageUrl(item.icon),
    getBrief: item => item.brief || item.media_name || '',
    getMeta: item => join([SUBSCRIPTION_CATEGORY_LABEL[item.category], item.nation]),
    getBadges: item => [CERTIFICATION_LABEL[item.certification_type]].filter(Boolean),
    getRoute: item => ({ view: 'channel', query: { id: item._id } }),
  }),

  /** banner 卡片：取宽版头图，文案覆盖在大图上 */
  banner: create({
    getCover: item => imageUrl(item.cover || item.head_wide || item.head),
    getCovers: () => [],
    getMeta: item => item.source || '',
    getBadges: () => [],
  }),

  /* ---------------- 旧项目类型（保持原展示语义） ---------------- */

  /** 图集：封面 + 标题 + 作者 */
  gallery: create({
    getCover: item => imageUrl(item.cover || item.poster || item.thumbnail),
    getMeta: item => authorText(item),
  }),

  /** 动态：作者 + 发布时间 + 正文 + 图片/视频横向滚动 */
  post: create({
    getTitle: item => item.title || item.content || '',
    getBrief: () => '',
    getCover: () => '',
    getCovers: () => [],
    getMeta: item => join([item.uname || item.author, publishedText(item)]),
    getMedia: postMedia,
  }),

  /** 用户：头像/海报 + 昵称 + 注册时间 + 标签 */
  user: create({
    getCover: item => imageUrl(item.poster || item.icon),
    getBrief: item => item.brief || item.memo || '',
    getMeta: registeredText,
  }),

  /** 合集：海报 + 标题 + 简介 + 集数 + 更新时间 */
  compilation: create({
    getCover: item => imageUrl(item.poster || item.cover),
    getBrief: item => item.desc || item.brief || '',
    getMeta: item => join([item.total != null ? `共${item.total}部` : '', updatedText(item)]),
  }),
};

/**
 * 取字段适配器。
 * @param {any} item
 * @param {string} [display] 容器意图，'banner' 时走 banner 适配器
 * @param {string} [type] 已解析的资源类型，不传则内部解析
 * @returns {FieldAdapter}
 */
export function getAdapter(item, display, type = resolveType(item)) {
  if (display === 'banner') return adapters.banner;
  if (type === RESOURCE_TYPE.SUBSCRIPTION) return adapters[RESOURCE_TYPE.SUBSCRIPTION];
  return adapters[type] || adapters[RESOURCE_TYPE.ARTICLE];
}

/* ================================================================== *
 * 布局解析
 * ================================================================== */

/**
 * 根据「容器意图 display」+「数据展示类型 display_type」决定用哪个布局。
 *
 * 规则：
 * - `display === 'banner'`         -> banner 卡片
 * - 订阅号                          -> 圆形头像在上、文字在下
 * - 动态 post                       -> 正文 + 图片/视频横向滚动
 * - `display === 'card' | 'half' | 'history'` -> 上图下文（横向卡片列表；旧 video 的
 *   history 未单独分支，等价于 card）
 * - `display === 'lprt'`           -> 左文右图（显式列表形态）
 * - 其余按 display_type：
 *     - 4 无图  -> 纯文字
 *     - 5 大图  -> 上文下图
 *     - 6 三图  -> 三图
 *     - 1 小图 / 未标注 -> 左文右图
 * - 数据里没有可用封面时，无论 display_type 都降级为纯文字（无封面 ticker 即走这条）。
 *
 * @param {any} item
 * @param {string} [display] 容器意图
 * @param {string} [type] 已解析的资源类型，不传则内部解析
 * @returns {string} 布局名，见 LAYOUT
 */
export function resolveLayout(item, display, type = resolveType(item)) {
  if (!item) return LAYOUT.TEXT_ONLY;

  if (display === 'banner') return LAYOUT.BANNER;
  if (type === RESOURCE_TYPE.SUBSCRIPTION) return LAYOUT.AVATAR_TOP_TEXT_BOTTOM;
  if (type === 'post') return LAYOUT.MEDIA_SCROLL;
  // card / half / history 均为「上图下文」（旧 video 里 history 未单独分支，等价于 card）
  if (display === 'card' || display === 'half' || display === 'history') {
    return LAYOUT.COVER_TOP_TEXT_BOTTOM;
  }

  const cover = imageUrl(item.cover || item.poster || item.thumbnail);
  const covers = (item.cover_list || item.covers || []).map(imageUrl).filter(Boolean);

  // 显式列表形态：一律左右排布（无封面则纯文字）
  if (display === 'lprt') {
    return cover ? LAYOUT.LEFT_TEXT_RIGHT_IMAGE : LAYOUT.TEXT_ONLY;
  }

  switch (item.display_type) {
    case DISPLAY_TYPE.NO_IMAGE:
      return LAYOUT.TEXT_ONLY;

    case DISPLAY_TYPE.BIG_IMAGE:
      return cover ? LAYOUT.COVER_TOP_TEXT_BOTTOM : LAYOUT.TEXT_ONLY;

    case DISPLAY_TYPE.THREE_IMAGES:
      if (covers.length) return LAYOUT.THREE_IMAGES;
      return cover ? LAYOUT.LEFT_TEXT_RIGHT_IMAGE : LAYOUT.TEXT_ONLY;

    case DISPLAY_TYPE.SMALL_IMAGE:
    default:
      return cover ? LAYOUT.LEFT_TEXT_RIGHT_IMAGE : LAYOUT.TEXT_ONLY;
  }
}

/* ================================================================== *
 * 入口
 * ================================================================== */

/**
 * 资源列表项入口。
 *
 * 用法与既有保持一致：`<ResourceItem item={item} display="lprt" />`，
 * 内部按「资源类型选字段适配器 + display/display_type 选布局」组装出列表项。
 *
 * @param {Object} props
 * @param {any} props.item 资源对象（Resource / Subscription / 旧结构均可）
 * @param {string} [props.display] 容器意图：'lprt' | 'card' | 'half' | 'history' | 'banner'
 * @param {Function} [props.onClick] 自定义点击行为，不传则按资源类型跳详情页
 * @param {Object} [props.style]
 */
export default function ResourceItem({ item, display = '', onClick, style }) {
  const router = useRouter();

  return <Observer>{() => {
    if (!item) return null;

    const type = resolveType(item);
    const adapter = getAdapter(item, display, type);
    const layout = resolveLayout(item, display, type);

    const handleClick = onClick || (() => {
      const route = adapter.getRoute(item);
      if (route && route.view) router.pushView(route.view, route.query || {});
    });

    return (
      <ResourceCard
        item={item}
        adapter={adapter}
        layout={layout}
        display={display}
        style={style}
        onClick={handleClick}
      />
    );
  }}</Observer>;
}
