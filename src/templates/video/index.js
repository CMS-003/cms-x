import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { default as dayjs } from "dayjs";
import _ from 'lodash'
import { runInAction } from "mobx";
import { Observer, useLocalObservable } from "mobx-react-lite";
import styled from "styled-components";
import { Ellipsis, Space, Tag, Tabs, Swiper, Empty, Input, Popup } from "antd-mobile";
import { apis, store, ResourceItem, readableTime, shttp } from '@/global.js';
import { Acon, PageList, Player, SafeArea, Visible, FullHeight, FullHeightAuto, FullHeightFix, FullWidth, FullWidthAuto, FullWidthFix } from "@/components";
import { isLandscape } from "@/utils";

const Title = styled.h1`
  font-size: 1.4em;
  font-weight: 550;
  margin: 0;
  padding: 10px;
`
export const Epsode = styled.span`
  color: ${({ selected }) => (selected ? 'rgb(0 165 253)' : '#888')};
  margin: 2px 3px;
  padding: 3px 4px;
  position: relative;
  font-size: 11px;
  white-space: nowrap;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 200%;
    height: 200%;
    border: 1px solid
      ${({ selected }) => (selected ? 'rgb(0 165 253)' : '#888')};
    border-radius: 6px;
    transform-origin: 0 0;
    transform: scale(0.5);
    box-sizing: border-box;
    pointer-events: none;
  }
`;
const ReplyWrap = styled.div`
  font-size: 12px;
  background-color: lightgray;
  color: #2b68db;
  padding: 5px 5px;
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`

function CommentReply({ comment }) {
  const local = useLocalObservable(() => ({
    loading: false,
    comments: [],
    setComments(comments) {
      local.comments = comments;
    }
  }))
  const getComments = useCallback(async () => {
    try {
      local.loading = true;
      const resp = await shttp.get(`/gw/express/comment/resource/${comment.rid}/comment/${comment._id}`)
      console.log(resp.data)
      if (resp.code === 0) {
        local.setComments(resp.data.list)
      }
    } catch (e) {

    } finally {
      local.loading = false
    }
  })
  useEffect(() => {
    if (!local.loading) {
      getComments()
    }
  }, [getComments])
  return <Observer>{() => (
    <PageList
      infinite={true}
      items={local.comments}
      onRefresh={() => {
        getComments()
      }}
      renderItems={items => items.map(v => (
        <FullWidth key={v._id} style={{ alignItems: 'flex-start', paddingTop: 5, borderBottom: '1px solid #ddd' }}>
          <FullWidthFix>
            <img src={v.user.avatar} alt="" style={{ width: 30, height: 30, borderRadius: "50%", margin: 5, }} />
          </FullWidthFix>
          <FullWidthAuto style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 14, paddingTop: 2 }}>{v.user.nickname}</span>
            <span style={{ fontSize: 12, color: 'grey', margin: '5px 0 10px 0' }}>{readableTime(new Date(v.createdAt))}</span>
            {v.content}
            <Space style={{ margin: '5px 0 10px', gap: 10 }}>
              <Acon icon='Thumb' size={18} color={'grey'} />
              <Acon icon='Thumb' size={18} color={'grey'} style={{ transform: 'rotate(180deg)' }} />
              <Acon icon='Comment' size={18} color={'grey'} onClick={() => {
                runInAction(() => {
                  local.reply_pid = v._id;
                  local.reply_user = v.user;
                })
              }} />
            </Space>
            {v.counter && v.counter.comments ? <ReplyWrap>
              共{v.counter.comments}条回复 <Acon icon={'right'} size={10} style={{ marginTop: 2, marginLeft: 5 }} color={'grey'} />
            </ReplyWrap> : null}
          </FullWidthAuto>
        </FullWidth>
      ))}
    />
  )}</Observer>
}

function Recommend({ recommends, style = {} }) {
  return <Observer>{() => (<FullHeight style={style}>
    <div style={{ fontSize: 16, fontWeight: 600, margin: '10px 10px 0' }}>推荐</div>
    <div style={{ flex: 1, overflow: 'auto' }}>
      <PageList
        disabled={true}
        display="lprt"
        items={recommends}
        infinite={false}
        renderItems={(items) => items.map(v => (
          <div key={v._id} style={{ margin: '10px 5px' }}>
            <ResourceItem item={v} type="lprt" />
          </div>
        ))}
      />
    </div>
    <div style={{ height: 'var(--safe-padding-bottom)' }}></div>
  </FullHeight>)}</Observer>
}

export default function VideoPage(props) {
  const local = useLocalObservable(() => ({
    resource: null,
    loading: true,
    error: null,
    video: null,
    recommends: [],
    comments: [],
    reply_pid: '',
    reply_user: null,
    pop_comment: null,
    isComposing: false,
    focused: false,
    looktime: 0,
    latest_time: 0,
    setValue: function (key, value) {
      local[key] = value;
    },
  }));
  const swiperRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const getDetail = useCallback(async () => {
    local.setValue('loading', true);
    try {
      const resp = await apis.getResourceDetail(props.id);
      if (resp && resp.code === 0) {
        local.setValue('video', resp.data.videos[0] || null)
        local.setValue('resource', resp.data)
        if (resp.data.detail) {
          local.setValue('looktime', resp.data.detail.watched || 0)
        }
        getRecommends();
        getComments();
      } else {
        local.setValue('error', { code: resp.code, message: resp.message })
      }
    } catch (e) {
      local.setValue('error', e)
    } finally {
      local.setValue('loading', false);
    }

  }, [local, props.id])
  const toggleStar = useCallback(async () => {
    const collected = local.resource.counter.collected
    try {
      runInAction(() => {
        local.resource.counter.collected = !collected
      })
      const resp = collected
        ? await apis.fetchAPI('post', '/gw/api/gatling/pJFc2GC9W', { resource_id: local.resource._id })
        : await apis.fetchAPI('post', '/gw/api/gatling/jw-KAgBzI', {
          resource_id: local.resource._id,
          resource_type: local.resource.type,
          title: local.resource.title,
          cover: local.resource.poster,
        });
      if (resp.code === 0) {

      } else {
        runInAction(() => {
          local.resource.counter.collected = collected
        })
      }
    } catch (e) {
      runInAction(() => {
        local.resource.counter.collected = collected
      })
    }
  }, [])
  const getRecommends = useCallback(async () => {
    try {
      const resp = await apis.fetchAPI('get', '/gw/api/gatling/XKjvJJ6rV')
      if (resp.code === 0) {
        local.setValue('recommends', resp.data.items);
      }
    } catch (e) {

    }
  });
  const inputRef = useRef(null)
  const getComments = useCallback(async () => {
    try {
      const resp = await shttp.get(`/gw/express/comment/resource/${props.id}`)
      if (resp.code === 0) {
        local.setValue('comments', resp.data.list)
      }
    } catch (e) {

    }
  })
  const sendComment = useCallback(async (data) => {
    try {
      const resp = await shttp.post(`/gw/express/comment`, data)
      if (resp.code === 0) {
        await getComments();
      }
    } catch (e) {

    }
  }, [])
  const tabItems = [
    { key: 'info', title: '简介' },
    { key: 'comment', title: '评论' },
  ];
  useEffect(() => {
    getDetail();
    return () => {
      apis.createHistory({
        resource_id: props.id,
        resource_type: local.resource.type,
        total: local.resource.size,
        watched: local.latest_time,
      })
    }
  }, [getDetail])
  return <Observer>{() => (
    <SafeArea topBGC="black" bot="0">
      <div data-id='test' style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
        <FullHeight style={{ flex: 1 }}>
          <FullHeightFix style={{ flexDirection: 'column', backgroundColor: 'black' }}>
            <Player
              resource={local.resource}
              video={local.video}
              looktime={local.looktime}
              onTimeUpdate={t => {
                local.latest_time = t
              }}
              type="mp4"
            />
          </FullHeightFix>
          <FullHeightAuto style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Tabs
              style={{ '--adm-border-color': '#ddd' }}
              activeKey={tabItems[activeIndex].key}
              onChange={key => {
                const index = tabItems.findIndex(item => item.key === key)
                setActiveIndex(index)
                swiperRef.current?.swipeTo(index)
              }}
            >
              {tabItems.map(item => (
                <Tabs.Tab title={item.title} key={item.key} style={{ flex: '0' }} />
              ))}
            </Tabs>
            <Swiper
              style={{ overflow: 'hidden' }}
              direction='horizontal'
              indicator={() => null}
              ref={swiperRef}
              defaultIndex={activeIndex}
              onIndexChange={index => {
                setActiveIndex(index)
              }}
            >
              <Swiper.Item style={{ overflow: 'auto' }}>
                {
                  local.resource ? (<Fragment>
                    <Title>{local.resource.title}</Title>
                    <FullWidth style={{ padding: '0 10px 10px', gap: 8, justifyContent: 'flex-start' }}>
                      <span>{dayjs(local.resource.publishedAt).format('YYYY年MM月日DD HH:mm')}</span>
                      <Acon icon={local.resource.counter.collected ? 'stared' : 'unstar'} color='pink' size={24} onClick={toggleStar} onTouchEnd={toggleStar} />
                    </FullWidth>
                    <Ellipsis content={local.resource.content} rows={2}
                      expandText='展开'
                      collapseText='收起' />
                    <FullWidth style={{ alignItems: 'baseline', overflow: 'auto', touchAction: 'pan-x' }} onTouchStart={e => {
                      e.stopPropagation();
                    }}>
                      <Space style={{ padding: '0 10px' }}>
                        {local.resource.tags.map(tag => (
                          <Tag key={tag} round color='#2db7f5' style={{ padding: '4px 6px' }}>
                            {tag}
                          </Tag>
                        ))}
                      </Space>
                    </FullWidth>
                    <Visible visible={local.resource.videos.length > 1}>
                      <p
                        style={{
                          fontWeight: 'bolder',
                          margin: 0,
                          padding: '10px 10px 5px',
                        }}
                      >
                        播放列表
                      </p>
                      <FullWidth style={{ alignItems: 'baseline', overflow: 'auto', padding: '0 8px' }} onTouchStart={e => {
                        e.stopPropagation();
                      }}>
                        {local.resource.videos.map((child) => (
                          <Epsode
                            key={child.path}
                            onClick={() => {
                              if (local.vid !== child._id) {
                                local.video = child;
                                local.looktime = 0;
                              }
                            }}
                            selected={local.video && local.video._id === child._id}
                          >
                            {child.title || `第${child.nth}集`}
                          </Epsode>
                        ))}
                      </FullWidth>
                    </Visible>
                  </Fragment>) : null
                }
                {!isLandscape() && <Recommend recommends={local.recommends} />}
              </Swiper.Item>
              <Swiper.Item style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflow: 'auto' }}>
                  <PageList
                    infinite={true}
                    items={local.comments}
                    onRefresh={() => {
                      getComments()
                    }}
                    renderItems={items => items.map(v => (
                      <FullWidth key={v._id} style={{ alignItems: 'flex-start', paddingTop: 5, borderBottom: '1px solid #ddd' }}>
                        <FullWidthFix>
                          <img src={v.user.avatar} alt="" style={{ width: 30, height: 30, borderRadius: "50%", margin: 5, }} />
                        </FullWidthFix>
                        <FullWidthAuto style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: 14, paddingTop: 2 }}>{v.user.nickname}</span>
                          <span style={{ fontSize: 12, color: 'grey', margin: '5px 0 10px 0' }}>{readableTime(new Date(v.createdAt))}</span>
                          {v.content}
                          <Space style={{ margin: '5px 0 10px', gap: 10 }}>
                            <Acon icon='Thumb' size={18} color={'grey'} />
                            <Acon icon='Thumb' size={18} color={'grey'} style={{ transform: 'rotate(180deg)' }} />
                            <Acon icon='Comment' size={18} color={'grey'} onClick={() => {
                              runInAction(() => {
                                local.reply_pid = v._id;
                                local.reply_user = v.user;
                              })
                            }} />
                          </Space>
                          {v.counter && v.counter.comments ? <ReplyWrap onClick={() => local.setValue('pop_comment', v)}>
                            共{v.counter.comments}条回复 <Acon icon={'right'} size={10} style={{ marginTop: 2, marginLeft: 5 }} color={'grey'} />
                          </ReplyWrap> : null}
                        </FullWidthAuto>
                      </FullWidth>
                    ))}
                  />
                  {local.pop_comment && <Popup
                    visible={true}
                    onMaskClick={() => {
                      local.setValue('pop_comment', null)
                    }}
                    bodyStyle={{ height: '70vh' }}
                  >
                    <CommentReply comment={local.pop_comment} />
                  </Popup>}
                </div>
                <FullWidth style={{ padding: 5, borderTop: '0.5px solid #e2e2d2' }}>
                  <Input style={{ backgroundColor: '#fff', borderRadius: 5, marginLeft: 5, padding: '0 6px' }}
                    ref={inputRef}
                    placeholder={local.reply_pid ? `回复 ${local.reply_user.nickname}` : '评论'}
                    onCompositionStart={() => {
                      local.setValue('isComposing', true)
                    }}
                    onCompositionEnd={() => {
                      local.setValue('isComposing', false)
                    }}
                    onFocus={() => {
                      local.setValue('focused', true)
                    }}
                    onBlur={() => {
                      local.setValue('focused', false)
                    }}
                    onEnterPress={(e) => {
                      if (!local.isComposing) {
                        const text = e.currentTarget.value;
                        e.currentTarget.value = '';
                        if (inputRef.current) {
                          inputRef.current.clear()
                        }
                        sendComment({
                          rid: props.id,
                          pid: local.reply_pid,
                          content: text,
                        })
                        local.setValue('reply_pid', '')
                        local.setValue('reply_user', null)
                      }
                    }} />
                  <Acon icon="expression" style={{ margin: '0 5px' }} />
                </FullWidth>
                <div style={{ height: 'var(--safe-padding-bottom)' }}></div>
              </Swiper.Item>
            </Swiper>
          </FullHeightAuto>
        </FullHeight>
        {isLandscape() && <Recommend recommends={local.recommends} style={{ width: 450 }} />}
      </div>
    </SafeArea>
  )}</Observer>
}