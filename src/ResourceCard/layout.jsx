/**
 * 通用资源卡布局层。
 *
 * 这一层是「哑组件」：只吃已经提取好的字段（title / cover / meta / badges ...），
 * 不关心资源类型、也不关心数据从哪来。字段由各项目的 adaptor 负责提取，
 * 组装在 ./index.jsx 完成。
 *
 * 注意：**任何列表项都不展示 tag 标签，tag 只在详情页展示**，所以这里只有
 * 角标（Badges：独家 / 原创 / 直播中 / 广告 / 失效），没有 Tags。
 *
 * 所有布局的 props 约定见下方 CardProps。
 */

/**
 * 布局统一入参。
 *
 * @typedef {Object} CardProps
 * @property {any}    [item]      原始资源对象，透传给 onClick 等场景使用
 * @property {string} [display]   容器意图（'card' / 'lprt' / 'half' / 'banner' 等）
 * @property {string} title       标题
 * @property {string} [brief]     简介
 * @property {string} [cover]     封面图
 * @property {string[]} [covers]  多图（三图布局用）
 * @property {Array<{type: string, src: string}>} [media] 图片/视频混排（媒体滚动布局用）
 * @property {string} [avatar]    头像（圆形）
 * @property {string} [meta]      次要信息（来源 / 时间 / 时长等）
 * @property {string[]} [badges]  角标文案（独家 / 原创 / 直播中 ...）
 * @property {React.ReactNode} [action] 右侧操作区（关注卡片里的关注按钮等）
 * @property {number|string} [progress] 进度，0~1 数字或百分比字符串
 * @property {Function} [onClick]
 * @property {Object} [style]
 */

const NO_COVER = '/images/poster/nocover.jpg';

/** 布局名（各项目 adaptor 用它指定渲染形态） */
export const LAYOUT = {
  /** 左文右图 —— 列表小图 */
  LEFT_TEXT_RIGHT_IMAGE: 'leftTextRightImage',
  /** 上文下图 —— 列表大图 / 横向卡片 */
  COVER_TOP_TEXT_BOTTOM: 'coverTopTextBottom',
  /** 纯文字 —— 无图 */
  TEXT_ONLY: 'textOnly',
  /** 三图 */
  THREE_IMAGES: 'threeImages',
  /** 圆形头像在上、文字在下 —— 订阅号 */
  AVATAR_TOP_TEXT_BOTTOM: 'avatarTopTextBottom',
  /** banner 卡片：大图 + 覆盖文案 */
  BANNER: 'banner',
  /** 正文 + 图片/视频横向滚动 —— 动态 post */
  MEDIA_SCROLL: 'mediaScroll',
  /** 左圆形头像 + 中标题/描述 + 右操作区 —— 关注列表 */
  AVATAR_LEFT_TEXT_RIGHT_ACTION: 'avatarLeftTextRightAction',
};

const root = {
  display: 'flex',
  flex: 1,
  minWidth: 0,
  backgroundColor: '#fff',
  borderRadius: 6,
  overflow: 'hidden',
  boxSizing: 'border-box',
  cursor: 'pointer',
};

const titleStyle = {
  fontSize: 14,
  lineHeight: 1.35,
  color: '#222',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  wordBreak: 'break-word',
};

const briefStyle = {
  fontSize: 12,
  lineHeight: 1.4,
  color: '#666',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
};

const metaStyle = {
  fontSize: 12,
  color: '#999',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const rowStyle = { display: 'flex', alignItems: 'center', minWidth: 0 };

/** 媒体横向滚动条 */
const scrollRowStyle = {
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'flex-start',
  gap: 8,
  overflowX: 'auto',
  boxSizing: 'border-box',
  width: '100%',
};

const textColStyle = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: 6,
  padding: 8,
};

/** 角标样式（tag 样式已移除：列表不展示 tag，tag 只在详情页展示） */
const badgeStyle = {
  fontSize: 10,
  lineHeight: '16px',
  padding: '0 4px',
  borderRadius: 2,
  backgroundColor: '#ffecea',
  color: '#e8543f',
  flexShrink: 0,
};

const coverBase = url => ({
  backgroundColor: '#f2f2f2',
  backgroundImage: `url(${url || NO_COVER})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  position: 'relative',
});

/** 固定尺寸封面（列表小图、卡片） */
const fixedCover = (url, width, height) => ({
  ...coverBase(url),
  width,
  height,
  flexShrink: 0,
});

/** 通栏封面（大图 / banner），按 16:9 撑开 */
const wideCover = url => ({
  ...coverBase(url),
  width: '100%',
  aspectRatio: '16 / 9',
});

const overlayStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  padding: '24px 8px 8px',
  background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.68) 100%)',
};

function Badges({ badges }) {
  const list = (badges || []).filter(Boolean);
  if (!list.length) return null;
  return (
    <div style={{ ...rowStyle, flexWrap: 'wrap', gap: 4 }}>
      {list.map((text, i) => <span key={i} style={badgeStyle}>{text}</span>)}
    </div>
  );
}

function Progress({ value }) {
  if (value === null || value === undefined || value === '') return null;
  const width = typeof value === 'number'
    ? `${Math.min(Math.max(value, 0), 1) * 100}%`
    : value;
  return (
    <div style={{ height: 2, borderRadius: 1, backgroundColor: '#eee', overflow: 'hidden' }}>
      <div style={{ width, height: '100%', backgroundColor: '#3498db' }} />
    </div>
  );
}

/**
 * 左文右图 —— 列表小图形态。
 * @param {CardProps} props
 */
export function LeftTextRightImage({ title, cover, meta, badges, progress, onClick, style = {} }) {
  return (
    <div style={{ ...root, flexDirection: 'row', ...style }} onClick={onClick}>
      <div style={textColStyle}>
        <div style={titleStyle}>{title}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Badges badges={badges} />
          <Progress value={progress} />
          <div style={metaStyle}>{meta}</div>
        </div>
      </div>
      <div style={fixedCover(cover, 100, 70)} />
    </div>
  );
}

/**
 * 上文下图 —— 列表大图 / 横向卡片形态。
 * @param {CardProps} props
 */
export function CoverTopTextBottom({ title, cover, meta, badges, progress, onClick, style = {} }) {
  return (
    <div style={{ ...root, flexDirection: 'column', ...style }} onClick={onClick}>
      <div style={wideCover(cover)} />
      <div style={{ ...textColStyle, gap: 4 }}>
        <div style={titleStyle}>{title}</div>
        <Badges badges={badges} />
        <Progress value={progress} />
        <div style={metaStyle}>{meta}</div>
      </div>
    </div>
  );
}

/**
 * 纯文字 —— 无图形态（含无封面的 ticker）。
 * @param {CardProps} props
 */
export function TextOnly({ title, brief, meta, badges, progress, onClick, style = {} }) {
  return (
    <div style={{ ...root, flexDirection: 'column', gap: 6, padding: 10, ...style }} onClick={onClick}>
      <div style={titleStyle}>{title}</div>
      {brief ? <div style={briefStyle}>{brief}</div> : null}
      <Badges badges={badges} />
      <Progress value={progress} />
      <div style={metaStyle}>{meta}</div>
    </div>
  );
}

/**
 * 三图形态。
 * @param {CardProps} props
 */
export function ThreeImages({ title, covers = [], meta, badges, onClick, style = {} }) {
  const list = (covers.length ? covers : [null, null, null]).slice(0, 3);
  return (
    <div style={{ ...root, flexDirection: 'column', gap: 8, padding: 10, ...style }} onClick={onClick}>
      <div style={titleStyle}>{title}</div>
      <div style={{ display: 'flex', gap: 4 }}>
        {list.map((url, i) => (
          <div key={i} style={{ ...coverBase(url), flex: 1, height: 72, borderRadius: 3 }} />
        ))}
      </div>
      <Badges badges={badges} />
      <div style={metaStyle}>{meta}</div>
    </div>
  );
}

/**
 * 圆形头像在上、文字在下 —— 订阅号形态。
 * @param {CardProps} props
 */
export function AvatarTopTextBottom({ avatar, title, brief, meta, badges, onClick, style = {} }) {
  return (
    <div
      style={{ ...root, flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 10px', ...style }}
      onClick={onClick}
    >
      <div style={{ ...coverBase(avatar), width: 56, height: 56, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ ...titleStyle, WebkitLineClamp: 1, textAlign: 'center', width: '100%' }}>{title}</div>
      {brief ? <div style={{ ...metaStyle, textAlign: 'center', width: '100%' }}>{brief}</div> : null}
      <Badges badges={badges} />
      <div style={{ ...metaStyle, textAlign: 'center', width: '100%' }}>{meta}</div>
    </div>
  );
}

/**
 * banner 卡片：大图铺底 + 文案覆盖。
 * @param {CardProps} props
 */
export function Banner({ title, cover, meta, badges, onClick, style = {} }) {
  return (
    <div style={{ ...root, flexDirection: 'column', ...style }} onClick={onClick}>
      <div style={wideCover(cover)}>
        <div style={overlayStyle}>
          <Badges badges={badges} />
          <div style={{ ...titleStyle, color: '#fff', marginTop: 4 }}>{title}</div>
          <div style={{ ...metaStyle, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{meta}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * 正文 + 图片/视频横向滚动 —— 动态（post）形态。
 * @param {CardProps} props
 */
export function MediaScroll({ title, brief, media = [], meta, badges, onClick, style = {} }) {
  return (
    <div style={{ ...root, flexDirection: 'column', gap: 8, padding: 10, ...style }} onClick={onClick}>
      {title ? <div style={titleStyle}>{title}</div> : null}
      {brief ? <div style={briefStyle}>{brief}</div> : null}
      {media.length ? (
        <div style={scrollRowStyle}>
          {media.map((m, i) => (m.type === 'video'
            ? <video
                key={i}
                src={m.src}
                preload="metadata"
                style={{ width: 120, height: 90, flexShrink: 0, borderRadius: 3, backgroundColor: '#000' }}
              />
            : <div key={i} style={{ ...coverBase(m.src), width: 120, height: 90, flexShrink: 0, borderRadius: 3 }} />
          ))}
        </div>
      ) : null}
      <Badges badges={badges} />
      {meta ? <div style={metaStyle}>{meta}</div> : null}
    </div>
  );
}

/**
 * 左圆形头像 + 中间（上标题 / 下描述）+ 右侧操作区 —— 关注列表形态。
 *
 * `action` 由适配器提供（如关注按钮），这一层只负责摆位置；
 * 操作区自己拦截点击，避免触发整行的跳转。
 *
 * @param {CardProps} props
 */
export function AvatarLeftTextRightAction({ avatar, title, brief, meta, action, onClick, style = {} }) {
  return (
    <div
      style={{ ...root, flexDirection: 'row', alignItems: 'center', gap: 10, padding: '10px 12px', ...style }}
      onClick={onClick}
    >
      <div style={{ ...coverBase(avatar), width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ ...titleStyle, WebkitLineClamp: 1 }}>{title}</div>
        {brief ? <div style={{ ...briefStyle, WebkitLineClamp: 1 }}>{brief}</div> : null}
        {meta ? <div style={metaStyle}>{meta}</div> : null}
      </div>
      {action ? <div style={{ flexShrink: 0 }}>{action}</div> : null}
    </div>
  );
}

const layouts = {
  [LAYOUT.LEFT_TEXT_RIGHT_IMAGE]: LeftTextRightImage,
  [LAYOUT.COVER_TOP_TEXT_BOTTOM]: CoverTopTextBottom,
  [LAYOUT.TEXT_ONLY]: TextOnly,
  [LAYOUT.THREE_IMAGES]: ThreeImages,
  [LAYOUT.AVATAR_TOP_TEXT_BOTTOM]: AvatarTopTextBottom,
  [LAYOUT.BANNER]: Banner,
  [LAYOUT.MEDIA_SCROLL]: MediaScroll,
  [LAYOUT.AVATAR_LEFT_TEXT_RIGHT_ACTION]: AvatarLeftTextRightAction,
};

export default layouts;
