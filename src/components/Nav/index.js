import React, { useContext } from 'react';
import { AlignSide, CenterXY } from '../style';
import RouterContext from '@/contexts/router';
import StoreContext from '@/contexts/store';
import Acon from '../Acon';

export default function Nav({ style, title, align = 'center', left }) {
  const router = useContext(RouterContext)
  const store = useContext(StoreContext)
  return (
    <AlignSide
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: 45,
        width: '100%',
        color: 'white',
        backgroundColor: '#999',
        // backgroundColor: store.app.config.mainColor,
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        ...style,
      }}
    >
      <CenterXY
        onClick={() => {
          router.backView();
        }}
      >
        <div style={{ display: 'flex', margin: '0 4px' }}>
          <Acon icon="LeftOutlined" />
        </div>
        <div>{left}</div>
      </CenterXY>
      <div
        className="txt-omit"
        style={{
          flex: 1,
          textAlign: align,
          fontSize: 16,
          fontWeight: '600',
        }}
      >
        {title}
      </div>
    </AlignSide>
  );
}
