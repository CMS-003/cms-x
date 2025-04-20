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
  line-height: 17px;
  height: 34px;
  margin: 5px;
  font-size: 14px;
`

export const Uname = styled.div`
  color: #999;
  font-size: 11px;
  padding: 5px;
`
