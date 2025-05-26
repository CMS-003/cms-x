import { FullHeight, FullHeightAuto, FullHeightFix } from "@/components/style";
import { Observer, useLocalObservable } from "mobx-react-lite";
import Nav from "@/components/Nav";
import styled from "styled-components";
import _ from 'lodash'

const ChannelWrap = styled.div`
  display: flex;
`
const ChannelItem = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  line-height: 60px;
  justify-content: center;
  align-items: center;
`

export default function ChannelPage() {
  const local = useLocalObservable(() => ({
    channels: [
      { _id: '', name: '', title: '番剧', icon: '' },
      { _id: '', name: '', title: '电影', icon: '' },
      { _id: '', name: '', title: '动画', icon: '' },
      { _id: '', name: '', title: '图片', icon: '' },
      { _id: '', name: '', title: '小说', icon: '' },
      { _id: '', name: '', title: '视频', icon: '' },
      { _id: '', name: '', title: '帖子', icon: '' },
      { _id: '', name: '', title: '音乐', icon: '' },
      { _id: '', name: '', title: '资讯', icon: '' },
      { _id: '', name: '', title: '美食', icon: '' },
      { _id: '', name: '', title: '专栏', icon: '' },
      { _id: '', name: '', title: '漫画', icon: '' },
      { _id: '', name: '', title: '生活', icon: '' },
      { _id: '', name: '', title: '随笔', icon: '' },
      { _id: '', name: '', title: 'pixiv', icon: '' },
      { _id: '', name: '', title: '电视剧', icon: '' },
    ]
  }))
  return <Observer>{() => (
    <FullHeight>
      <FullHeightAuto>
        {_.chunk(local.channels, 4).map((channels, i) => (
          <ChannelWrap key={i}>
            {channels.map((channel, j) => (
              <ChannelItem key={j}>{channel.title}</ChannelItem>
            ))}
          </ChannelWrap>
        ))}
      </FullHeightAuto>
    </FullHeight>
  )}</Observer>
}