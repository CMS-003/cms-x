import styled from 'styled-components'

export const ItemWrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
`

export const ItemImage = styled.div`
`

export const ItemTitle = styled.div`
  overflow: hidden; 
  text-overflow: ellipsis; 
  display: -webkit-box; 
  -webkit-box-orient: vertical; 
  -webkit-line-clamp: 2;
  line-height: 14px;
  height: 28px;
  margin: 5px;
  font-size: 12px;
`

export const Uname = styled.div`
  color: #999;
  font-size: 12px;
  padding: 0 5px 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
