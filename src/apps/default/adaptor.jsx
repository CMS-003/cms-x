/**
 * 默认项目适配器（apps/default）。
 *
 * ⚠️ 本文件与 `src/apps/fs/adaptor.jsx` **完全独立**：
 * 类型怎么认、字段怎么取、点哪里跳，各自写一份，互不 import。
 * 唯一共享的是**布局层** `src/ResourceCard/layout.jsx`（哑组件，只管怎么摆）
 * 和组装层 `src/ResourceCard/index.jsx`。改 fs 的数据形态不会碰到这里。
 *
 * 分层不变：**适配器只管取什么**，**布局只管怎么摆**，由 `ResourceCard` 组装。
 *
 * 展示形态由两层决定：
 * - `display`：容器意图（`'lprt' | 'card' | 'half' | 'history' | 'banner' | 'follow'`）；
 * - `display_type`：数据自带的展示类型（1 小图 / 4 无图 / 5 大图 / 6 三图）。
 *
 * 资源类型识别优先级：`resource_type` > 旧数字 `type` > 形状推断 > article。
 *
 * 「带记录时间」的列表（收藏 / 历史 / 关注）：item 与普通资源**同构**（扁平结构），
 * 只是各自多了一个时间字段 + 少量统计字段，适配器据此调整展示：
 * - 收藏：`collectedAt`（收藏时间）
 * - 历史：`watchedAt`（观看时间）+ `total` / `watched`（进度）+ `device`（设备）
 * - 关注：`subscribedAt`（关注时间）+ `counted.followed`（关注状态 → 右侧关注按钮）
 * 这些字段存在时**优先作为展示时间**（无这些字段的普通列表行为完全不变）。
 *
 * tag 只在详情页展示，任何列表项都不展示（适配器不提供 getTags）。
 *
 * 构建时由 vite 的 `@app` alias 选择：`src/apps/${APP_NAME}`，不存在则回退本目录。
 *
 * @module apps/default/adaptor
 */

import { Observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { Button } from 'antd-mobile';
import { useRouter } from '@/contexts';
import store from '@/store';
import apis from '@/apis';
import { readableTime, formatDuration } from '@/utils';
import ResourceCard from '@/ResourceCard';
import { LAYOUT } from '@/ResourceCard/layout';

export { LAYOUT } from '@/ResourceCard/layout';

/* ================================================================== *
 * 枚举
 * ================================================================== */

/** 资源类型（资源基础表 res_type） */
export const RESOURCE_TYPE = {
  ARTICLE: 'article',
  TICKER: 'ticker',
  VIDEO: 'video',
  AD: 'ad',
  GALLERY: 'gallery',
  POST: 'posts',
  USER: 'user',
  COMPILATION: 'compilation',
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

/**
 * 旧数字类型（历史接口 `item.type`）到资源类型的映射。
 * 取自旧 `adaptor/index.jsx` 的分发：1 图文 / 2 视频 / 3 图集 / 9 视频 / 11 动态 / 13 用户 / 14 合集。
 * @type {Record<number, string>}
 */
export const LEGACY_TYPE = {
  1: RESOURCE_TYPE.ARTICLE,
  2: RESOURCE_TYPE.VIDEO,
  3: RESOURCE_TYPE.GALLERY,
  9: RESOURCE_TYPE.VIDEO,
  11: RESOURCE_TYPE.POST,
  13: RESOURCE_TYPE.USER,
  14: RESOURCE_TYPE.COMPILATION,
};

export const RESOURCE_TYPE_LABEL = {
  article: '图文',
  ticker: '快讯',
  video: '视频',
  ad: '广告',
  gallery: '图集',
  post: '动态',
  user: '用户',
  compilation: '合集',
  subscription: '订阅号',
};

export const DISPLAY_TYPE_LABEL = { 1: '小图', 4: '无图', 5: '大图', 6: '三图' };
export const MARK_LABEL = { 1: '独家', 2: '原创' };

/* ================================================================== *
 * 数据结构（JSDoc typedef，只描述前端消费到的字段）
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
 * 资源（内容），对应资源基础表。
 * 适配器实际依赖的最小集合：`title / brief / cover / cover_list / display_type /
 * resource_type / source / duration / marks / subscription_id`。
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
 * @property {string} [name]                         姓名
 * @property {string} [icon]                         头像
 * @property {string} [memo]                         介绍
 * @property {string} [nation]                       国家
 * @property {string} [region]                       区域
 * @property {Date|string} [reg_time]                注册时间
 * @property {string} [reg_plat]                     注册设备
 * @property {number} [certificate]                  认证 0 无 / 1 企业 / 2 个人
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

/** marks -> 角标文案 */
const markTexts = item => (item.marks || []).map(mark => MARK_LABEL[mark]).filter(Boolean);

/** 时长文案 */
const durationText = item => (item.duration ? formatDuration(item.duration) : '');

/** 视频失效角标：旧视频卡片在 status ∈ {1,2} 时叠加 videoBroken 图标，这里用文案表达 */
const brokenTexts = item => ([1, 2].includes(item.status) ? ['失效'] : []);

/** 拼接非空片段 */
const join = (list, sep = ' · ') => list.filter(Boolean).join(sep);

/* ================================================================== *
 * 收藏 / 历史 / 关注：与普通资源同构，只多了若干字段
 * ================================================================== */

/** 列表记录时间字段：收藏 / 历史 / 关注各自只多一个 */
const RECORD_TIME_FIELDS = ['collectedAt', 'watchedAt', 'subscribedAt'];

/** 收藏 / 观看 / 关注时间文案；普通资源返回空串 */
const recordTimeText = item => {
  const date = pickDate(item, RECORD_TIME_FIELDS);
  return date ? readableTime(date) : '';
};

/** 展示用的「主时间」：记录时间优先，否则回退资源自身时间 */
const primaryTime = item => recordTimeText(item) || timeText(item);

/** 设备文案（历史列表独有） */
const deviceText = item => item.device || '';

/**
 * 观看进度：历史列表的 `watched / total`，两者都是正数才有值。
 * 与单位无关（秒 / 集数都能算出比例），普通资源返回 null。
 */
const progressOf = item => {
  const total = Number(item.total);
  const watched = Number(item.watched);
  if (!Number.isFinite(total) || !Number.isFinite(watched) || total <= 0) return null;
  return Math.min(Math.max(watched / total, 0), 1);
};

/**
 * 是否历史列表的记录：只看 `watchedAt`。
 * 历史新增的 `total` / `watched` 与合集的 `total`（共 N 部）同名，用它来区分。
 */
const isHistory = item => item.watchedAt != null;

/* ================================================================== *
 * 字段适配器
 * ================================================================== */

/**
 * @typedef {Object} FieldAdapter
 * @property {(item: any) => string} getTitle
 * @property {(item: any) => string} getBrief
 * @property {(item: any) => string} getCover
 * @property {(item: any) => string[]} getCovers
 * @property {(item: any) => string} getAvatar
 * @property {(item: any) => string} getMeta
 * @property {(item: any) => string[]} getBadges
 * @property {(item: any) => React.ReactNode} [getAction] 右侧操作区（关注按钮）
 * @property {(item: any) => number|null} getProgress
 * @property {(item: any) => Array<{ type: string, src: string }>} getMedia
 * @property {(item: any) => { view: string, query: Object }|null} getRoute
 */

/** 通用字段，各类型按需覆盖 */
const base = {
  getTitle: item => item.title || '',
  getBrief: item => item.brief || item.desc || '',
  getCover: item => imageUrl(item.cover || item.poster || item.thumbnail),
  getCovers: item => (item.cover_list || item.covers || []).map(imageUrl).filter(Boolean),
  getAvatar: item => imageUrl(item.icon || item.avatar),
  // 时间：收藏 / 观看 / 关注时间优先，其次资源自身时间；设备仅历史列表有
  getMeta: item => join([authorText(item), deviceText(item), primaryTime(item)]),
  getBadges: item => markTexts(item),
  // 观看进度：历史列表的 watched / total
  getProgress: progressOf,
  getMedia: () => [],
  getAction: () => null,
  getRoute: routeOf,
};

const create = (overrides = {}) => ({ ...base, ...overrides });

/** 视频类次要信息：时长 + 来源 + （历史列表的）设备 + （收藏 / 观看）时间 */
const videoMeta = item => join([durationText(item), authorText(item), deviceText(item), recordTimeText(item)]);

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
 * 关注按钮：状态取资源上的 `counted.followed`，点击调关注 / 取消关注接口。
 * 独立成组件是为了让按钮自己订阅状态、点击后原地刷新。
 *
 * @param {{ item: any }} props
 */
export function FollowButton({ item }) {
  return <Observer>{() => {
    const followed = !!(item && item.counted && item.counted.followed);
    return (
      <Button
        size="mini"
        color={followed ? 'warning' : 'primary'}
        onClick={async e => {
          e.preventDefault();
          e.stopPropagation();
          await apis.toggleFollow(followed, item._id);
          runInAction(() => {
            item.counted.followed = followed ? 0 : 1;
          });
        }}
      >{followed ? '取消关注' : '关注'}</Button>
    );
  }}</Observer>;
}

/* ================================================================== *
 * 类型识别与路由
 * ================================================================== */

/**
 * 资源类型 -> 详情页模板名。
 * 模板由服务端下发（见 `src/templates/index.jsx`），这里只给默认落点。
 * @type {Record<string, string>}
 */
export const VIEW_OF = {
  [RESOURCE_TYPE.ARTICLE]: 'article',
  [RESOURCE_TYPE.TICKER]: 'article',
  [RESOURCE_TYPE.VIDEO]: 'video',
  [RESOURCE_TYPE.AD]: 'dynamic',
  [RESOURCE_TYPE.GALLERY]: 'gallery',
  [RESOURCE_TYPE.POST]: 'post',
  [RESOURCE_TYPE.USER]: 'user',
  [RESOURCE_TYPE.COMPILATION]: 'compilation',
  [RESOURCE_TYPE.SUBSCRIPTION]: 'channel',
};

/**
 * 解析资源类型：`resource_type` > 旧数字 `type` > 形状推断 > article。
 *
 * @param {any} item
 * @returns {string|null}
 */
export function resolveType(item) {
  if (!item) return null;
  if (item.res_type) return item.res_type;
  const type = item.res_type || item.type;
  // if (item.type != null && LEGACY_TYPE[item.type]) return LEGACY_TYPE[item.type];
  // if (Array.isArray(item.images) || Array.isArray(item.videos)) return RESOURCE_TYPE.POST;
  if (['movie', 'anime', 'video'].includes(type)) return 'video';
  return item.type;
}

/**
 * 默认点击路由。
 * @param {any} item
 * @returns {{ view: string, query: Object }|null}
 */
export function routeOf(item) {
  if (!item) return null;
  const type = resolveType(item);
  const view = VIEW_OF[type] || 'dynamic';
  const id = item.resource_id || item._id;
  return id ? { view, query: { id } } : null;
}

/* ================================================================== *
 * 适配器表
 * ================================================================== */

/**
 * 全部适配器。键为资源类型或容器意图（banner / follow）。
 * @type {Record<string, FieldAdapter>}
 */
export const adapters = {
  /** 图文：封面可有可无，小图 / 大图 / 三图由 display_type 决定 */
  [RESOURCE_TYPE.ARTICLE]: create(),

  /** 快讯：通常没有封面，无封面时布局自动降级为纯文字 */
  [RESOURCE_TYPE.TICKER]: create({
    getMeta: item => join([primaryTime(item), deviceText(item), authorText(item)]),
  }),

  /** 视频 */
  [RESOURCE_TYPE.VIDEO]: create({
    getCover: item => imageUrl(item.cover || item.thumbnail || item.poster),
    getMeta: videoMeta,
    getBadges: item => [...brokenTexts(item), ...markTexts(item)],
  }),

  /** 广告 */
  [RESOURCE_TYPE.AD]: create({ getBadges: () => ['广告'] }),

  /** 图集：封面 + 标题 + 作者 */
  [RESOURCE_TYPE.GALLERY]: create({
    getCover: item => imageUrl(item.cover || item.poster || item.thumbnail),
    getMeta: item => authorText(item),
  }),

  /** 动态：作者 + 发布时间 + 正文 + 图片/视频横向滚动 */
  [RESOURCE_TYPE.POST]: create({
    getTitle: item => item.title || item.content || '',
    getBrief: () => '',
    getCover: () => '',
    getCovers: () => [],
    getMeta: item => join([item.uname || item.author, deviceText(item), recordTimeText(item) || publishedText(item)]),
    getMedia: postMedia,
  }),

  /** 用户：头像/海报 + 昵称 + 注册时间 */
  [RESOURCE_TYPE.USER]: create({
    getCover: item => imageUrl(item.poster || item.icon),
    getTitle: item => item.name || item.nickname || '',
    getBrief: item => item.brief || item.memo || '',
    getMeta: item => recordTimeText(item) || registeredText(item),
    getAction: item => <FollowButton item={item} />,
  }),

  /** 合集：海报 + 标题 + 简介 + 集数 + 更新时间（历史列表里的 total 是进度，不算集数） */
  [RESOURCE_TYPE.COMPILATION]: create({
    getCover: item => imageUrl(item.poster || item.cover),
    getBrief: item => item.desc || item.brief || '',
    getMeta: item => join([
      !isHistory(item) && item.total != null ? `共${item.total}部` : '',
      recordTimeText(item) || updatedText(item),
    ]),
  }),

  /** banner 卡片：取宽版头图，文案覆盖在大图上 */
  banner: create({
    getCover: item => imageUrl(item.cover || item.head_wide || item.head),
    getCovers: () => [],
    getMeta: item => item.source || '',
    getBadges: () => [],
  }),

  /** 关注卡片：左圆形头像 + 中标题/描述 + 右关注按钮（状态取 counted.followed） */
  follow: create({
    getCover: () => '',
    getCovers: () => [],
    getAvatar: item => imageUrl(item.icon || item.avatar),
    getTitle: item => item.name || item.nickname || '',
    getBrief: item => item.brief || item.desc || item.memo || '',
    getMeta: item => join([item.nation || item.region, recordTimeText(item)]),
    getBadges: () => [],
    getAction: item => <FollowButton item={item} />,
  }),
};

/**
 * 取字段适配器。
 *
 * @param {any} item
 * @param {string} [display] 容器意图，'banner' 时走 banner 适配器
 * @param {string} [type] 已解析的资源类型，不传则内部解析
 * @returns {FieldAdapter}
 */
export function getAdapter(item, display, type = resolveType(item)) {
  return adapters[type] || adapters[RESOURCE_TYPE.ARTICLE];
}

/* ================================================================== *
 * 布局解析
 * ================================================================== */

/**
 * 根据「容器意图 display」+「数据展示类型 display_type」决定用哪个布局。
 *
 * 规则：
 * - 关注列表（带 `counted.followed`）-> 左圆形头像 + 中标题/描述 + 右关注按钮
 * - `display === 'banner'`         -> banner 卡片
 * - 动态 post                       -> 正文 + 图片/视频横向滚动
 * - `display === 'card' | 'half' | 'history'` -> 上图下文（横向卡片列表）
 * - `display === 'lprt'`           -> 左文右图（显式列表形态）
 * - 其余按 display_type：4 无图 -> 纯文字；5 大图 -> 上文下图；6 三图 -> 三图；
 *   1 小图 / 未标注 -> 左文右图
 * - 数据里没有可用封面时一律降级为纯文字（无封面的 ticker 即走这条）
 *
 * @param {any} item
 * @param {string} [display] 容器意图
 * @param {string} [type] 已解析的资源类型，不传则内部解析
 * @returns {string} 布局名，见 LAYOUT
 */
export function resolveLayout(item, display, type = resolveType(item)) {
  if (!item) return LAYOUT.TEXT_ONLY;

  // 关注卡片：左圆形头像 + 中标题/描述 + 右关注按钮
  if (display === 'follow') return LAYOUT.AVATAR_LEFT_TEXT_RIGHT_ACTION;

  if (display === 'banner') return LAYOUT.BANNER;

  if (type === RESOURCE_TYPE.POST) return LAYOUT.MEDIA_SCROLL;
  // card / half / history 均为「上图下文」
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
 * 用法：`<ResourceItem item={item} display="lprt" />`，
 * 内部按「资源类型选字段适配器 + display/display_type 选布局」组装出列表项。
 *
 * @param {Object} props
 * @param {any} props.item 资源对象
 * @param {string} [props.display] 容器意图：'lprt' | 'card' | 'half' | 'history' | 'banner' | 'follow'
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
