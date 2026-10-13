import { useEffect } from 'react';
import { get } from 'lodash';
import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react-lite';
import { apis, imageUrl, store } from '@/global.js';
import { mapFields } from '@/utils';

/**
 * 列表类组件（Card / Banner ...）的取数。
 *
 * 数据来源由 `self.widget.from` 决定，三种来源统一归一成 CardItem，
 * 组件只负责摆位置 —— 不用各自去兜「这条数据叫 poster 还是 thumbnail」。
 *
 * | from     | 数据来自                                                            |
 * |----------|---------------------------------------------------------------------|
 * | `data`   | 组件自己的 `self.resources`（组件配置里维护的静态数据，默认值）      |
 * | `global` | `self.widget.source` 这条 lodash 路径在全局 store 上取到的数组       |
 * | `api`    | 请求 `self.widget.method` + `self.url`，响应按 `widget.mapping` 翻译 |
 *
 * 只有 `api` 要等网络：`loading` 就是骨架图的开关，`reload` 给「刷新」用。
 *
 * ⚠️ 与 cms-admin 的差异：那边组件本身就是 observer，这里组件是「函数体返回 <Observer>」，
 * 取值必须发生在观察者内部才算订阅 —— 所以 `items` 是**方法**而不是现成的数组，
 * 组件要在 <Observer> 里调 `local.items()`，才能订阅到 `self.resources` / 全局 store。
 */

/** 允许的三种来源 */
export const RESOURCE_SOURCES = ['data', 'global', 'api'];

/**
 * `attrs.more` —— 列表类组件（Card / Banner）共用的「更多」约定。
 * 新配置写**要跳去的页面视图名**（字符串）；兼容旧配置里写布尔 true 的（当年等价于跳合集）。
 */
export function moreViewOf(attrs) {
  const more = attrs && attrs.more;
  if (typeof more === 'string') return more;
  return more ? 'compilations' : '';
}

/**
 * 图片字段名各来源不一致，按优先级挑一个。
 * 相对路径补 CDN 前缀；`http(s)://` / `//` / `data:` 是外部地址，原样保留 ——
 * api 来源（第三方接口）基本都是绝对地址，加了前缀反而打不开。
 * 内部走 adaptor 的 imageUrl，规则与 ResourceItem 一致。
 */
function toImageUrl(path) {
  return path ? imageUrl(String(path)) : '';
}

/** 一条列表数据（三种来源归一之后的样子） */
function normalize(raw, index) {
  const it = raw || {};
  return {
    /** 稳定 key：优先业务 id，退到下标 */
    key: String(it._id || it.id || index),
    title: String(it.title || it.label || it.name || ''),
    /** 已拼好前缀的图片地址（绝对地址原样保留） */
    image: toImageUrl(it.cover || it.poster || it.thumbnail || it.image || it.url || ''),
    /** 次要信息（来源 / 作者），banner 文案用得上 */
    meta: String(it.source || it.uname || it.author || ''),
    /** 原始那一项 —— 组件要用别的字段（如交给 ResourceItem 渲染）时从这里取 */
    raw: it,
  };
}

/**
 * 从响应里取列表。
 *
 * 配了 mapping 就按 mapping 折出来的形状取；没配就把常见的几种包装都试一遍
 * （本项目是 `{code, data:{items}}`，第三方常见 `{data:{list}}` / 裸数组）。
 */
function pickList(body) {
  if (Array.isArray(body)) return body;
  if (!body || typeof body !== 'object') return [];
  const data = body.data;
  if (Array.isArray(data)) return data;
  for (const bucket of [data, body]) {
    if (!bucket || typeof bucket !== 'object') continue;
    for (const key of ['items', 'list', 'rows', 'records', 'resources']) {
      if (Array.isArray(bucket[key])) return bucket[key];
    }
  }
  return [];
}

/**
 * @param {object} self 组件节点（template 树上的一个 node）
 * @returns {{from:string, remote:boolean, loading:boolean, rows:any[], items:()=>Array, reload:()=>Promise<void>}}
 */
export function useResourceList(self) {
  const widget = self.widget || {};
  const url = self.url || '';
  const method = widget.method;
  // ⚠️ mapFields 对空对象映射会返回 {}（不是原样返回 raw），所以这里把「没配」归一成 null
  const mapping = widget.mapping && Object.keys(widget.mapping).length ? widget.mapping : null;
  const local = useLocalObservable(() => {
    const from = RESOURCE_SOURCES.includes(widget.from) ? widget.from : 'data';
    // 没配地址就当没有接口：不发请求，也不让骨架图一直转
    const remote = from === 'api' && !!url;
    return {
      from,
      remote,
      url,
      method,
      mapping,
      /** 数据还在路上（只有 api 来源会为真）；初值取 remote → 首帧就是骨架图，不会先闪一下空状态 */
      loading: remote,
      /** api 拿回来的原始列表 */
      rows: [],
      /** 请求序号：连点刷新时只认最后一次的结果 */
      seq: 0,
      async reload() {
        if (!local.remote) return;
        const seq = ++local.seq;
        // ⚠️ loading / rows 都被 <Observer> 订阅着，mobx 6 默认 enforceActions: 'observed'，
        // 不在 action 里改会打印告警，所以统一包在 runInAction 里写
        runInAction(() => { local.loading = true; });
        let rows = [];
        try {
          const raw = await apis.fetchAPI(local.method, apis.getApi(local.url, {}));
          if (seq === local.seq) {
            // 第三方接口字段映射：key 支持点路径，值以 $ 开头表示取原始响应的字段（见 utils/mapFields）
            const resp = local.mapping ? mapFields(raw, local.mapping) : raw;
            rows = resp && resp.code === 0 ? pickList(resp) : [];
          }
        } catch (e) {
          console.log(e);
        } finally {
          if (seq === local.seq) {
            runInAction(() => {
              local.rows = rows;
              local.loading = false;
            });
          }
        }
      },
      /**
       * 归一化后的列表。
       * ⚠️ 必须在 <Observer> 内调用：它会读 `self.resources` 或全局 store，
       * 放在观察者外面读不到变化（这是本文件顶部那条差异的由来）。
       */
      items() {
        let source;
        if (local.from === 'global') {
          // 项目没有独立的 global 段，按 widget.source 的 lodash 路径从全局 store 上取
          const value = widget.source ? get(store, widget.source) : null;
          source = Array.isArray(value) ? value.slice() : [];
        } else if (local.from === 'api') {
          source = local.rows;
        } else {
          source = self.resources || [];
        }
        return source.map(normalize);
      },
    };
  });

  // 运行时的 template 只拉一次，地址 / 方法不会变，挂载时拉一次即可；刷新走 local.reload()
  useEffect(() => {
    local.reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return local;
}
