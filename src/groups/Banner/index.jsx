import { Observer } from 'mobx-react-lite';
import styled, { keyframes } from 'styled-components';
import { Swiper } from 'antd-mobile';
import { routeOf, useRouter } from '@/global.js';
import { Acon } from '@/components';
import { useResourceList, moreViewOf } from '../_shared/useResourceList';

/**
 * 轮播 Banner。
 *
 * 用 antd-mobile 自带的 Swiper（自动播放 + 无限循环 + 指示点），不引第三方轮播库。
 *
 * 外观三件事都在下面的样式里：
 * - 指示点挪到**右下角**，并且一律是**小圆圈**（antd-mobile 默认是居中的细长胶囊）
 * - 标题**压在图片上**：底部一层由深到透的黑色渐变打底，白字才立得住
 * - 没数据时是**骨架图**（同样尺寸的占位块 + 流光动画），不是空白
 *
 * 数据来源看 `self.widget.from`（见 `_shared/useResourceList`）：
 * 一般是 `api`（接口拉），也支持 `data`（组件自己的 resources）。
 */

/** 轮播高度：图片与骨架图共用，换上去不会跳一下 */
const SLIDE_HEIGHT = 180;

const Wrap = styled.div`
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  background-color: #eee;

  /* ---------- 指示点：右下角的小圆圈 ---------- */
  /* 选择器刻意多带一层 .adm-swiper，压过 antd-mobile 自己的 .adm-swiper-horizontal .adm-swiper-indicator */
  .adm-swiper .adm-swiper-indicator {
    left: auto;
    right: 12px;
    bottom: 10px;
    transform: none;
  }
  .adm-swiper .adm-page-indicator {
    --dot-size: 6px;
    --active-dot-size: 6px;
    --dot-border-radius: 50%;
    --active-dot-border-radius: 50%;
    --dot-spacing: 6px;
    --dot-color: rgba(255, 255, 255, .5);
    --active-dot-color: #fff;
  }
`
const shimmer = keyframes`
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
`
/** 图与骨架共用同一套尺寸，换上去不会跳一下 */
const slideBox = `
  position: relative;
  width: 100%;
  height: ${SLIDE_HEIGHT}px;
  background-color: #dcdcdc;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
`
const Slide = styled.div`
  ${slideBox}
`
/** 加载中的占位：尺寸跟真图完全一致，只是换成流光 */
const SlideSkeleton = styled.div`
  ${slideBox}
  background-color: #e2e2e2;
  background-image: linear-gradient(90deg, #e2e2e2 25%, #f4f4f4 37%, #e2e2e2 63%);
  background-size: 400% 100%;
  animation: ${shimmer} 1.4s ease infinite;
`
const Caption = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 28px 16px 14px;
  color: #fff;
  /* 压在图上的那一层底：透明 → 深黑，字才看得清 */
  background: linear-gradient(to top, rgba(0, 0, 0, .65), rgba(0, 0, 0, 0));
`
const CaptionTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
const CaptionMeta = styled.div`
  margin-top: 2px;
  font-size: 12px;
  color: rgba(255, 255, 255, .85);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
const Actions = styled.div`
  position: absolute;
  top: 8px;
  right: 12px;
  z-index: 2;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 13px;
  background: rgba(0, 0, 0, .35);
`
const Tap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #fff;
  cursor: pointer;
  &:active { opacity: .65; }
`

export default function CBanner({ self, children }) {
  const router = useRouter();
  const local = useResourceList(self);
  return <Observer>{() => {
    const more = moreViewOf(self.attrs);
    const showRefresh = !!self.attrs?.refresh && local.remote;
    const items = local.items();
    return (
      <div
        style={{
          flex: 0,
          margin: '10px 10px 0',
          backgroundColor: '#fff',
          ...self.style,
        }}
      >
        {children}
        <Wrap>
          {local.loading ? (
            // 数据在路上：占位 + 流光
            <SlideSkeleton />
          ) : items.length > 0 ? (
            <Swiper
              autoplay
              autoplayInterval={4000}
              loop
              style={{ '--height': `${SLIDE_HEIGHT}px` }}
            >
              {items.map(item => (
                <Swiper.Item key={item.key} onClick={() => {
                  // 点击行为跟其它资源列表一致：按资源类型跳详情页
                  const route = routeOf(item.raw);
                  if (route && route.view) router.pushView(route.view, route.query || {});
                }}>
                  <Slide style={{ backgroundImage: item.image ? `url(${item.image})` : 'none' }}>
                    {(item.title || item.meta) && (
                      <Caption>
                        {item.title && <CaptionTitle>{item.title}</CaptionTitle>}
                        {item.meta && <CaptionMeta>{item.meta}</CaptionMeta>}
                      </Caption>
                    )}
                  </Slide>
                </Swiper.Item>
              ))}
            </Swiper>
          ) : (
            // 拉完了但一条都没有：给个静默的占位块，别再流光（那不是「在加载」）
            <Slide />
          )}
          {(showRefresh || more) && (
            <Actions>
              {showRefresh && <Tap onClick={() => local.reload()}><Acon icon='RefreshCw' size={16} color='#fff' title='刷新' /></Tap>}
              {more && <Tap onClick={() => router.pushView(more, {})}>更多<Acon icon='ChevronRight' size={16} color='#fff' /></Tap>}
            </Actions>
          )}
        </Wrap>
      </div>
    )
  }}</Observer>
}
