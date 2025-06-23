import styled from 'styled-components'

export { default as Acon } from './Acon'
export { default as PageList } from './List'
export { default as Nav } from './Nav'
export { default as Player } from './Player'
export { default as SafeArea } from './SafeArea'
export { default as Visible } from './Visible'

export const Right = styled.div`
  text-align: right;
  flex: 1;
`;
export const CenterXY = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Center = styled.div`
  text-align: center;
`
/* 2.两端分散对齐 */
export const AlignSide = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;
export const AlignAside = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const AlignAround = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const AlignCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const AlignVertical = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
`;

export const FullHeight = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const FullHeightFix = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

export const FullHeightAuto = styled.div`
  /* flex-grown flex-shink flex-basis */
  flex: 1;
  overflow-y: auto;
`;

export const FullWidth = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
`;

export const FullWidthFix = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FullWidthAuto = styled.div`
  flex: 1;
`;

export const Padding = styled.div`
  padding: 15px;
`

export const PaddingSide = styled.div`
  padding: 0 15px;
`
export const padding = {
  padding: 15
}

export const paddingSide = {
  padding: '0 15px'
}

export const IconSVG = styled.img`
  height: 20px;
  width: 20px;
  src: ${({ src }) => src}
`;