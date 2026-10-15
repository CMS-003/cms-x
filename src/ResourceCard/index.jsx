import layouts, { LAYOUT } from './layout';

/**
 * 资源卡组装层：Layout（布局） + 字段（adapter）。
 *
 * 布局只管怎么摆，字段只管取什么值，两边解耦；
 * 各项目在自己的 adaptor 里提供字段适配器与布局选择，这里只做拼装。
 *
 * 字段适配器需要实现的接口见 FengshowsAdapter。
 *
 * @typedef {Object} FieldAdapter
 * @property {(item: any) => string}   [getTitle]
 * @property {(item: any) => string}   [getBrief]
 * @property {(item: any) => string}   [getCover]
 * @property {(item: any) => string[]} [getCovers]
 * @property {(item: any) => Array<{ type: string, src: string }>} [getMedia]
 * @property {(item: any) => string}   [getAvatar]
 * @property {(item: any) => string}   [getMeta]
 * @property {(item: any) => string[]} [getBadges]
 * @property {(item: any) => React.ReactNode} [getAction] 右侧操作区（关注按钮等）
 * @property {(item: any) => number|string|null} [getProgress]
 * @property {(item: any) => { view: string, query: Object }|null} [getRoute]
 */

/**
 * @param {Object} props
 * @param {any} props.item 原始资源对象
 * @param {FieldAdapter} props.adapter 字段适配器
 * @param {string} [props.layout] 布局名，见 LAYOUT；非法时回退到左文右图
 * @param {string} [props.display] 容器意图，透传给布局
 * @param {Function} [props.onClick]
 * @param {Object} [props.style]
 */
export default function ResourceCard({ item, adapter, layout = LAYOUT.LEFT_TEXT_RIGHT_IMAGE, display, onClick, style }) {
  if (!item || !adapter) return null;

  const Layout = layouts[layout] || layouts[LAYOUT.LEFT_TEXT_RIGHT_IMAGE];
  const call = (name, fallback) => (typeof adapter[name] === 'function' ? adapter[name](item) : fallback);

  return (
    <Layout
      item={item}
      display={display}
      title={call('getTitle', '')}
      brief={call('getBrief', '')}
      cover={call('getCover', '')}
      covers={call('getCovers', [])}
      media={call('getMedia', [])}
      avatar={call('getAvatar', '')}
      meta={call('getMeta', '')}
      badges={call('getBadges', [])}
      action={call('getAction', null)}
      progress={call('getProgress', null)}
      onClick={onClick}
      style={style}
    />
  );
}
