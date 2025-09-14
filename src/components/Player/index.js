import { useCallback, useRef } from "react";
import ReactPlayer from 'react-player'
import { Observer, useLocalObservable } from "mobx-react-lite";
import { useDrag } from '@use-gesture/react'
import { store, storage, useRouter, apis } from '@/global.js'
import { Acon, AlignAside, Visible } from '@/components'
import styled from "styled-components";
import { formatDuration, isPWAorMobile } from "@/utils";

import svgSuspended from '@/theme/icon/suspended-fill.svg'
import svgPlay from '@/theme/icon/play-fill.svg'
import svgQuit from '@/theme/icon/quit-fullscreen.svg'
import svgFull from '@/theme/icon/fullscreen.svg'
import svgLoading from '@/theme/icon/loading.svg'
import { Modal } from "antd-mobile";

const VIDEO_STATUS = {
  CANPLAY: 'CANPLAY',
  PLAYING: 'PLAYING',
  BUFFERING: 'BUFFERING',
}


export const Icon = styled.img`
  width: 32px;
  height: 32px;
  margin: 0 5px;
`;
const VWrapper = styled.div`
 position: absolute;
 left: 0;
 top: 0;
 z-index: 2;
 & > video {
  height: 100%;
 }
`
const VPeek = styled.div`
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translate(-50%,-50%);
  padding: 10px;
  border-radius: 10;
  background-color: rgba(0,0,0,0.6);
  color: white;
`
const VBack = styled.div`
  position: absolute; 
  left: 0; 
  top: 0; 
  display: flex;
  width: 100%; 
  height: 40px;
  line-height: 40px; 
  z-index: 12;
  background: linear-gradient(180deg,#00000080,#fdfdfd00);
`
const BG = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  filter: blur(10px);
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`
const VGestrue = styled.div`
  z-index: 3;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
`
const VControl = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  z-index: 4;
  align-items: center;
  color: white;
  background: linear-gradient(0deg,#00000080,#fdfdfd00);
  padding: 5px;
  box-sizing: border-box;
`
export const ProgressWrap = styled.div`
display: flex;
flex-direction: column;
padding: 4px;
border-radius: 5px;
flex: 1;
position: relative;
margin: 0 10px 2px 10px;
`
export const Handler = styled.div`
width: 16px;
height: 10px;
border-radius: 20px;
position: absolute;
transform: translate(-8px,-4px);
background-color: #2bb7ff;
z-index: 11;
`
export const Tip = styled.span`
position: absolute;
left: 50%;
transform: translate(-50%, -30px);
background-color: #00000080;
border-radius: 5px;
padding: 3px 5px;
&::after {
  position: absolute;
  left: 50%;
  bottom: -6px;
  transform: translateX(-50%);
  content: '';
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 6px solid  #00000080;
}
`

const VRecover = styled.div`
  position: absolute;
  background-color: #0004;
  color: white;
  padding: 4px 5px;
  border-radius: 5;
  z-index: 12;
  left: 15;
`
const VError = styled.div`
  position: absolute;
  background-color: #0004;
  color: red;
  padding: 4px 5px;
  border-radius: 5;
  zIndex: 12;
  bottom: 20%;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
`
let tap_timer = null;
let auto_hidden_timer = null;
export default function Player({
  resource = {},
  video = {},
  type,
  looktime,
  onTimeUpdate,
}) {
  const router = useRouter()
  const containerRef = useRef(null)
  const controlRef = useRef(null)
  const playerRef = useRef(null);
  const local = useLocalObservable(() => ({
    fullscreen: false,
    isMobile: isPWAorMobile(),
    volume: window.volume || parseInt(storage.getValue('volume')) || 30,
    muted: storage.getValue('muted') ? true : false,
    controls: false,
    playsinline: true,
    autoplay: false,
    playbackRate: 1,
    playing: false,
    seeking: false,
    status: VIDEO_STATUS.CANPLAY,
    duration: resource ? resource.size : 0,
    realtime: 0,
    buffertime: 0,
    dragtime: 0,
    displayPercent: 0,
    showControl: true,
    isDrag: false,
    error: '',
    // 恢复进度显示
    showRecover: false,
    bottomHeight: 0,
    // 手势显示：进度和声音改变
    showPeek: false,
    peekValue: '',
    takePeek(value) {
      this.peekValue = value;
      this.showPeek = true;
      clearTimeout(this.peekTimer);
      this.peekTimer = setTimeout(() => {
        local.setValue('showPeek', false)
      }, 1000);
    },
    setValue(key, value) {
      this[key] = value;
    },
    autoHiddenControl() {
      if (auto_hidden_timer) {
        clearTimeout(auto_hidden_timer);
        auto_hidden_timer = null;
      }
      if (local.showControl) {
        auto_hidden_timer = setTimeout(() => {
          local.playing && local.setValue('showControl', false)
        }, 4000);
      }
    },
    onTap() {
      local.showControl = !local.showControl;
    },
    onDTap() {
      local.playing = !local.playing
    },
  }));
  const seekTo = useCallback((time) => {
    if (playerRef.current) {
      const internalPlayer = playerRef.current.getInternalPlayer();
      if (internalPlayer && typeof internalPlayer.currentTime !== 'undefined') {
        internalPlayer.currentTime = time;
      } else {
        playerRef.current.seekTo(time);
      }
    }
  }, [])
  const bind = useDrag(({
    direction: [dx, dy],
    velocity: [vx, vy], // 修正：velocity 是数组 [vx, vy]
    movement: [mx, my],
    last,
    event
  }) => {
    event.preventDefault()
    if (last && (Math.abs(mx) > 3) || (Math.abs(my) > 3)) {
      const angle = Math.atan2(mx, my) * 180 / Math.PI
      if (angle >= -22.5 && angle < 22.5) console.log('下')
      else if (angle >= 67.5 && angle < 112.5) {
        console.log('右')
        seekTo(local.realtime + 10)
      }
      else if (angle >= 157.5 || angle < -157.5) console.log('上')
      else if (angle >= -112.5 && angle < -67.5) {
        console.log('左')
        seekTo(local.realtime - 10)
      }
      local.autoHiddenControl();
    }
    if (last && mx === 0 && my === 0) {
      if (!tap_timer) {
        tap_timer = setTimeout(() => {
          local.onTap()
          local.autoHiddenControl();
          clearTimeout(tap_timer);
          tap_timer = null;
        }, 200)
      } else {
        clearTimeout(tap_timer);
        tap_timer = null;
        local.onDTap()
        local.autoHiddenControl();
      }
    }
  });
  return <Observer>{() => (
    <div
      ref={containerRef}
      style={local.fullscreen ? {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        zIndex: 9,
        display: 'flex',
        justifyContent: 'center',
        boxSizing: 'border-box',
        overflow: 'hidden',
      } : {
        position: 'relative',
        width: '100%',
        backgroundColor: 'black',
        zIndex: 9,
      }}>
      <div style={{
        position: 'relative',
        width: '100vw',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        aspectRatio: '16 / 9',
      }}>
        {resource && <BG style={{ backgroundImage: `url('${store.app.imageLine + (resource.poster || resource.thumbnail || '')}')` }} />}
        {resource && video && <ReactPlayer
          url={store.app.videoLine + video.path}
          ref={playerRef}
          loop={false}
          playing={local.playing}
          width={'100%'}
          height={'100%'}
          style={{ display: 'flex', justifyContent: 'center' }}
          pip={true}
          controls={local.controls}
          playsinline={local.playsinline}
          playbackRate={local.playbackRate}
          muted={local.muted}
          wrapper={VWrapper}
          // light={
          //   <img
          //     src={store.app.imageLine + (resource.poster || resource.thumbnail || '')}
          //     alt="Video thumbnail"
          //     style={{
          //       width: '100%',
          //       height: '100%',
          //       objectFit: 'cover'
          //     }}
          //   />
          // }
          config={{
            file: {
              forceHLS: type === 'hls',
              attributes: {
                // poster: store.app.imageLine + (resource.poster || resource.thumbnail || ''),
                style: {
                  // width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }
              }
              // tracks: subtitles.map((s, i) => ({ kind: 'subtitles', src: store.app.baseURL + s.path, srcLang: s.lang, default: i === 0 })),
            }
          }}
          onDuration={(duration) => {
            local.setValue('duration', duration)
          }}
          onReady={(e) => {
            // console.log(e, 'onready')
            if (local.seeking) {
              local.setValue('seeking', false)
            }
          }}
          onStart={(e) => {
            console.log(e, 'onstart', looktime)
            if (looktime) {
              local.setValue('showRecover', true)
              setTimeout(() => {
                local.setValue('showRecover', false)
              }, 4000)
            }
          }}
          onEnded={(e) => {
            // console.log(e, 'onended')
            local.setValue('status', VIDEO_STATUS.CANPLAY)
          }}
          onError={(e) => {
            console.log(e.message, typeof e.message, 'onerror')
            local.setValue('error', e.message)
          }}
          onPlay={(e) => {
            console.log(e, 'onplay')
            local.setValue('playing', true)
            local.setValue('status', VIDEO_STATUS.PLAYING)
            local.setValue('error', '')
          }}
          onPause={(e) => {
            console.log(e, 'onpause')
            local.setValue('playing', false)
            local.setValue('status', VIDEO_STATUS.CANPLAY)
          }}
          onBuffer={(e) => {
            local.setValue('status', VIDEO_STATUS.BUFFERING)
          }}
          onBufferEnd={(e) => {
            // console.log(e, 'onbufferend')
            if (local.playing) {
              local.setValue('status', VIDEO_STATUS.PLAYING)
            } else {
              local.setValue('status', VIDEO_STATUS.CANPLAY)
            }
          }}
          onProgress={(e) => {
            local.setValue('buffertime', e.loadedSeconds)
            local.setValue('realtime', e.playedSeconds)
            onTimeUpdate && onTimeUpdate(local.realtime)
          }}
          onSeek={(time) => {
            console.log(time, 'onseeek', local.duration)
          }}
        />}
        {local.showControl && (
          <VBack>
            <AlignAside style={{ fontSize: 18, width: '100%' }}>
              <Acon icon="LeftOutlined" color='#fff' style={{ padding: '0 10px' }} onClick={() => {
                if (local.fullscreen) {
                  local.setValue('fullscreen', false)
                } else {
                  router.backView()
                }
              }} />
              <div style={{ paddingRight: 15 }}>
                <Acon icon='InfoCircleOutlined' color={'#fff'} onClick={() => {
                  apis.fetchAPI('post', 'http://192.168.0.124:7777/ffmpeg/video-info-full', { filepath: video.path }).then(resp => {
                    if (resp.code === 0) {
                      Modal.show({ content: <pre style={{ margin: 0 }}>{JSON.stringify(resp.data, null, 2)}</pre>, closeOnMaskClick: true })
                    }
                  })
                }} />
              </div>
            </AlignAside>
          </VBack>
        )}
        <Visible visible={!local.controls}>
          <VGestrue
            {...bind()}
          >
            {/* {local.status === VIDEO_STATUS.CANPLAY && !local.playing && <Icon src={svgPlay} onClick={() => {
              local.playing = true
            }} />} */}
            {local.status === VIDEO_STATUS.BUFFERING && <Icon className='spin-slow' src={svgLoading} />}
          </VGestrue>
        </Visible>
        <Visible visible={local.showPeek}>
          <VPeek>
            {local.peekValue}
          </VPeek>
        </Visible>
        <Visible visible={local.showRecover}>
          <VRecover onClick={() => {
            seekTo(looktime);
            local.setValue('showRecover', false)
            local.setValue('showControl', false)
          }}>
            恢复到 {formatDuration(looktime)}
          </VRecover>
        </Visible>
        <Visible visible={local.error}>
          <VError>{local.error}</VError>
        </Visible>
        <Visible visible={local.showControl}>
          <VControl style={{ paddingBottom: local.fullscreen ? 'var(--safe-padding-bottom)' : '5px' }} ref={controlRef}>
            {/* 播放中,已暂停,缓冲中 */}
            {local.playing
              ? <Icon
                style={{ width: 24, height: 24, margin: 0 }}
                onTouchEndCapture={(e) => {
                  e.stopPropagation();
                  if (local.status === VIDEO_STATUS.BUFFERING) {
                    return;
                  }
                  local.setValue('playing', false)
                  local.setValue('status', VIDEO_STATUS.CANPLAY)
                }}
                // onClick={e => {
                //   e.stopPropagation();
                //   if (local.status === VIDEO_STATUS.BUFFERING) {
                //     return;
                //   }
                //   local.setValue('playing', false)
                //   local.setValue('status', VIDEO_STATUS.CANPLAY)
                // }}
                src={svgSuspended}
              />
              : <Icon
                style={{ width: 24, height: 24, margin: 0 }}
                src={svgPlay}
                onTouchEndCapture={(e) => {
                  e.stopPropagation();
                  if (local.status === VIDEO_STATUS.BUFFERING) {
                    return;
                  }
                  local.setValue('playing', true)
                }}
              // onClick={e => {
              //   e.stopPropagation();
              //   if (local.status === VIDEO_STATUS.BUFFERING) {
              //     return;
              //   }
              //   local.setValue('playing', true)
              // }}
              />}
            <ProgressWrap className='progress' onClickCapture={e => {
              e.stopPropagation();
              const parentRect = e.currentTarget.getBoundingClientRect();
              const offsetX = e.clientX - parentRect.left;
              const time = local.duration * (offsetX / e.currentTarget.offsetWidth)
              local.setValue('realtime', time)
              seekTo(time)
              local.setValue('seeking', true)
            }}>
              <div style={{ position: 'absolute', left: 0, top: 3, width: '100%', height: 4, backgroundColor: '#fff4' }}></div>
              <div style={{ position: 'absolute', left: 0, top: 3, width: (local.duration ? 100 * local.buffertime / local.duration : 0) + '%', zIndex: 9, height: 4, backgroundColor: '#eee' }}></div>
              <div style={{ position: 'absolute', left: 0, top: 3, width: local.isDrag ? local.displayPercent : (local.duration ? 100 * local.realtime / local.duration : 0) + '%', zIndex: 10, height: 4, backgroundColor: '#1196db' }}></div>

              <Handler
                style={{ left: local.isDrag ? local.displayPercent : (local.duration ? 100 * local.realtime / local.duration : 0) + '%' }}
                onTouchStartCapture={e => {
                  e.stopPropagation();
                  local.setValue('dragtime', local.realtime)
                  local.setValue('displayPercent', 100 * local.realtime / local.duration + '%')
                  local.setValue('isDrag', true)
                }}
                onTouchMove={e => {
                  const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
                  let offsetX = e.touches[0].clientX - parentRect.left;
                  if (offsetX < 0) {
                    offsetX = 0;
                  }
                  if (offsetX > parentRect.width) {
                    offsetX = parentRect.width;
                  }
                  local.setValue('dragtime', Math.round(offsetX / parentRect.width * local.duration))
                  local.setValue('displayPercent', 100 * offsetX / parentRect.width + '%')
                }}
                onTouchEnd={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  const time = local.dragtime
                  console.log(local.realtime, time)
                  seekTo(time);
                  local.setValue('seeking', true)
                  local.setValue('realtime', time)
                  local.setValue('isDrag', false)
                  local.setValue('displayPercent', 0)
                }}
              >
                {local.isDrag && <Tip>{formatDuration(local.dragtime)}</Tip>}
              </Handler>
            </ProgressWrap>
            <span>{formatDuration(local.realtime)}/{formatDuration(local.duration)}</span>
            <img src={local.fullscreen ? svgQuit : svgFull} alt="" style={{ width: 20, height: 20, margin: '0 5px' }} onClick={() => {
              local.setValue('fullscreen', !local.fullscreen)
            }} />
          </VControl>
        </Visible>
      </div>
    </div>
  )}</Observer>
}