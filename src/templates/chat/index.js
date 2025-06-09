import { FullHeight, FullHeightAuto, FullWidth } from "@/components/style";
import { Observer, useLocalObservable } from "mobx-react-lite";
import { useCallback, useEffect, useRef } from "react";
import apis from "@/apis";
import { useStore } from "@/contexts/index.js";
import SafeArea from "@/components/SafeArea";
import Acon from "@/components/Acon";
import { Input } from "antd-mobile";
import Nav from "@/components/Nav/index.js";
import { runInAction } from "mobx";
import styled from "styled-components";

const MsgItem = styled.div`
  display: flex;
  flex-direction: ${({ isSelf }) => isSelf ? 'row-reverse' : 'row'};
  margin: 10px 0;
  font-size: 14px;
`
const ContentWrap = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: ${({ isSelf }) => isSelf ? 'flex-end' : 'flex-start'};
`
const ConerRight = styled.div`
  position: absolute;
  right: 1px;
  top: 4px;
  border-radius: 2px;
  border-style: solid;
  border-width: 10px 0 10px 10px;
  border-color: transparent transparent transparent #8aef49;
`
const ConerLeft = styled.div`
  position: absolute;
  left: -12px;
  top: 4px;
  border-radius: 2px;
  border-style: solid;
  border-width: 10px 10px 10px 10px;
  border-color: transparent #fff transparent transparent;
`

function MessageContent({ isSelf, type, data }) {
  if (type === 1) {
    return <div style={{
      padding: '5px 10px',
      backgroundColor: isSelf ? '#8aef49' : '#fff',
      margin: '0 5px',
      borderRadius: 3,
      display: 'inline-flex'
    }}>{data.content}</div>
  }
  if (type === 2) {
    return <div><img src={data.url} alt="" /></div>
  }
  return null;
}

export default function ChatPage(props) {
  const store = useStore();
  const local = useLocalObservable(() => ({
    chat_id: props.id,
    chat: null,
    messages: [],
    loading: true,
    error: null,
    focused: false,
    isComposing: false,
    setValue: function (key, value) {
      local[key] = value;
    }
  }));
  const inputRef = useRef(null)
  const getDetail = useCallback(async () => {
    local.setValue('loading', true);
    try {
      const resp = await apis.getChatDetail(props.id);
      if (resp && resp.code === 0) {
        local.setValue('chat', resp.data || null)
      } else {
        local.setValue('error', { code: resp.code, message: resp.message })
      }
    } catch (e) {
      local.setValue('error', e)
    } finally {
      local.setValue('loading', false);
    }
  }, [local, local.chat_id])
  const getMessages = useCallback(async () => {
    local.setValue('loading', true);
    try {
      const resp = await apis.getMessages(local.chat_id);
      if (resp && resp.code === 0) {
        local.setValue('messages', resp.data.list || null)
      } else {
        local.setValue('error', { code: resp.code, message: resp.message })
      }
    } catch (e) {
      local.setValue('error', e)
    } finally {
      local.setValue('loading', false);
    }
  }, [])
  const sendMessage = useCallback(async (data) => {
    try {
      data.timestamp = Date.now();
      data.loading = true;
      local.messages.push(data)
      const resp = await apis.sendMessage(data);
      if (resp.code === 0) {
        const item = local.messages.find(it => it.timestamp === data.timestamp)
        if (item) {
          runInAction(() => {
            delete item.loading
          });
        }
      }
    } catch (e) {

    }
  }, [])
  useEffect(() => {
    getMessages();
    getDetail();
  }, [])
  return <Observer>{() => (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 'var(--dvh)', }}>
      <SafeArea bot={local.focused ? '0' : 'env(safe-area-inset-bottom)'} height={local.focused ? 'var(--dvh)' : ''}>
        <Nav title={local.chat ? local.chat.friend.nickname : ''} right={<Acon icon="more" />} />
        <FullHeightAuto style={{ display: 'flex', flexDirection: 'column', padding: '0 10px', overflow: 'auto', background: `url('${local.chat ? local.chat.setting.background : ''}') center center no-repeat cover` }}>
          {local.messages.map(msg => {
            const isSelf = msg.user_id === store.user.info._id;
            return (
              <MsgItem key={msg._id} isSelf={isSelf}>
                <img src={isSelf ? store.user.info.avatar : msg.friend.icon} alt="" style={{ width: 25, height: 25, borderRadius: "50%", marginTop: 2, ...(isSelf ? { marginLeft: 5 } : { marginRight: 5 }) }} />
                <ContentWrap isSelf={isSelf}>
                  {isSelf ? <ConerRight /> : <ConerLeft />}
                  {msg.loading && <Acon icon="sync" size={12} spin />}
                  <MessageContent type={msg.type} data={msg.data} isSelf={isSelf} />
                </ContentWrap>
                <div style={{ width: 25 }}></div>
              </MsgItem>
            )
          })}
        </FullHeightAuto>
        <FullWidth style={{ padding: 5, borderTop: '0.5px solid #e2e2d2' }}>
          <Acon icon="voice" />
          <Input style={{ backgroundColor: '#fff', borderRadius: 5, marginLeft: 5, padding: '0 6px' }}
            ref={inputRef}
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
                sendMessage({
                  chat_id: local.chat_id,
                  user_id: store.user.info._id,
                  recv_id: local.chat.friend_id,
                  type: 1,
                  friend: local.chat.friend,
                  data: {
                    content: text,
                    url: '',
                    format: '',
                    size: 0
                  }
                })
              }
            }} />
          <Acon icon="expression" style={{ margin: '0 5px' }} />
          <Acon icon="PlusCircleOutlined" size={26} />
        </FullWidth>
      </SafeArea>
    </div>
  )}</Observer>
}