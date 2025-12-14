import styled from "styled-components";


export const VIDEO_STATUS = {
  CANPLAY: 'CANPLAY',
  PLAYING: 'PLAYING',
  BUFFERING: 'BUFFERING',
}


export const Icon = styled.img`
  width: 32px;
  height: 32px;
  margin: 0 5px;
`;
export const VWrapper = styled.div`
 position: absolute;
 left: 0;
 top: 0;
 z-index: 2;
 & > video {
  height: 100%;
 }
`
export const VPeek = styled.div`
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translate(-50%,-50%);
  padding: 10px;
  border-radius: 10;
  background-color: rgba(0,0,0,0.6);
  color: white;
  z-index: 2;
`
export const VBack = styled.div`
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
export const BG = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`
// touch-action 不为 none 造成swipe立即触发。。。
export const VGestrue = styled.div`
  z-index: 3;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
`
export const VControl = styled.div`
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

export const VRecover = styled.div`
  position: absolute;
  background-color: #0004;
  color: white;
  padding: 4px 5px;
  border-radius: 5;
  z-index: 12;
  left: 15;
`
export const VError = styled.div`
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