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

function MessageItem({ isSelf, type, data }) {
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
    <SafeArea topBGC="black">
      <FullHeight style={{ position: 'relative' }}>
        <Nav title={local.chat ? local.chat.friend.nickname : ''} right={<Acon icon="more" />} />
        <FullHeightAuto style={{ display: 'flex', flexDirection: 'column', padding: '0 10px' }}>
          {local.messages.map(msg => {
            const isSelf = msg.user_id === store.user.info._id;
            return (
              <div key={msg._id} style={{ display: 'flex', flexDirection: isSelf ? 'row-reverse' : 'row', margin: '10px 0' }}>
                <img src={msg.friend.icon} alt="" style={{ width: 25, height: 25, borderRadius: "50%", marginRight: 5 }} />
                <div style={{ display: 'flex', textAlign: isSelf ? 'right' : 'left' }}>
                  {msg.loading && <Acon icon="sync" size={12} spin />}
                  <MessageItem type={msg.type} data={msg.data} isSelf={isSelf} />
                </div>
              </div>
            )
          })}
        </FullHeightAuto>
        <FullWidth style={{ padding: 5, borderTop: '0.5px solid #e2e2d2' }}>
          <Acon icon="voice" />
          <Input style={{ backgroundColor: '#fff', borderRadius: 5, marginLeft: 5, padding: '0 5px' }}
            ref={inputRef}
            onCompositionStart={() => {
              local.setValue('isComposing', true)
            }}
            onCompositionEnd={() => {
              local.setValue('isComposing', false)
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
      </FullHeight>
    </SafeArea>
  )}</Observer>
}