import { Observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { Skeleton } from 'antd-mobile';
import { ResourceItem, useRouter } from '@/global.js';
import { Acon } from '@/components';
import { useResourceList, moreViewOf } from '../_shared/useResourceList';

/**
 * 卡片列表（合并了 PickCard 与 RandomCard 的能力）。
 *
 * 数据来源看 `self.widget.from`（见 `_shared/useResourceList`）：
 * - `data`   → 组件自己的 resources（配置里维护的静态数据）
 * - `global` → `widget.source` 这条路径在全局 store 上取到的数组
 * - `api`    → `widget.method` + `self.url`，响应按 `widget.mapping` 翻译
 *
 * 两个开关都在 attrs 上：
 * - `attrs.more`：要跳去的页面视图（字符串）。非空就在标题右侧出现「更多」
 * - `attrs.refresh`：是否显示刷新（布尔）。只在真有接口（api + 地址）时出现
 *
 * 列表项交给 `ResourceItem`（项目统一的资源适配器）渲染，所以各资源类型
 * （图文 / 视频 / 订阅号 / 合集 ...）的展示差异不用在这里再写一遍。
 */

const Header = styled.div`
  font-weight: 600;
  font-size: 16px;
  padding: 10px;
  color: #555;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`
const HeaderTitle = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
const HeaderActions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 400;
`
const Tap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #999;
  cursor: pointer;
  &:active { opacity: .6; }
`
const Content = styled.div`
  border-radius: 4px;
  padding: 0 10px;
`
const ScrollWrap = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-x: auto;
  box-sizing: border-box;
  height: 100%;
  &::-webkit-scrollbar {
    display: none;
  }
  &>div:first-child {
    margin-left: 0;
  }
`;
const ItemWrap = styled.div`
  width: 120px;
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`

/** 骨架图的形状跟真卡片对齐（一张图 + 两行标题），别用通用骨架块 */
const SKELETON_COUNT = 3;
function CardSkeleton() {
  return (
    <ScrollWrap>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <ItemWrap key={i}>
          <Skeleton animated style={{ '--width': '120px', '--height': '90px', '--border-radius': '4px' }} />
          <Skeleton animated style={{ '--width': '100%', '--height': '12px', '--border-radius': '2px', marginTop: 8 }} />
          <Skeleton animated style={{ '--width': '60%', '--height': '12px', '--border-radius': '2px', marginTop: 6 }} />
        </ItemWrap>
      ))}
    </ScrollWrap>
  );
}

export default function CCard({ self, children }) {
  const router = useRouter();
  const local = useResourceList(self);
  return <Observer>{() => {
    const more = moreViewOf(self.attrs);
    // 没有接口就没得刷新，不给假按钮
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
        <Header>
          <HeaderTitle>{self.title}</HeaderTitle>
          <HeaderActions>
            {showRefresh && <Tap onClick={() => local.reload()}><Acon icon='RefreshCw' size={18} color='#999' title='刷新' /></Tap>}
            {more && <Tap onClick={() => router.pushView(more, {})}>更多<Acon icon='ChevronRight' size={18} color='#999' /></Tap>}
          </HeaderActions>
        </Header>
        <Content>
          {local.loading
            ? <CardSkeleton />
            : <ScrollWrap>
              {items.map(item => (
                <ItemWrap key={item.key}>
                  <ResourceItem item={item.raw} display={self.attrs.display} />
                </ItemWrap>
              ))}
            </ScrollWrap>}
        </Content>
      </div>
    )
  }}</Observer>
}
