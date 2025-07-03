import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { default as dayjs } from "dayjs";
import { runInAction } from "mobx";
import { Observer, useLocalObservable } from "mobx-react-lite";
import styled from "styled-components";
import { Ellipsis, Space, Tag, Tabs, Swiper, Empty, Input, Popup } from "antd-mobile";
import { apis, store, ResourceItem, readableTime, shttp } from '@/global.js';
import { Acon, PageList, Player, SafeArea, Visible, FullHeight, FullHeightAuto, FullHeightFix, FullWidth, FullWidthAuto, FullWidthFix } from "@/components";

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

export default function Comment(props) {
  const local = useLocalObservable(() => ({
    comments: [],
    reply_pid: '',
    reply_user: null,
    pop_comment: null,
    isComposing: false,
    focused: false,
    setValue: function (key, value) {
      local[key] = value;
    }
  }))
  const [booted, setBooted] = useState(false)
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
  useEffect(() => {
    if (!booted) {
      setBooted(true)
      getComments()
    }
  })
  return <Observer>{() => (
    <Fragment>
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
    </Fragment>
  )}</Observer>
}