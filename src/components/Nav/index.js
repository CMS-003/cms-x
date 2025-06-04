import React, { useContext } from 'react';
import { AlignSide, CenterXY } from '../style';
import RouterContext from '@/contexts/router';
import StoreContext from '@/contexts/store';
import Acon from '../Acon';

export default function Nav({ style, title = '', align = 'center', left, right }) {
  const router = useContext(RouterContext)
  const store = useContext(StoreContext)
  return (
    <AlignSide
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: 40,
        width: '100%',
        color: '#333',
        backgroundColor: '#eee',
        borderBottom: '0.5px solid #e2e2e2',
        // backgroundColor: store.app.config.mainColor,
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        ...style,
      }}
    >
      <CenterXY style={{ paddingLeft: 30, position: 'relative', flex: 1 }}>
        <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', }}
          onClick={() => {
            router.backView();
          }}>
          <Acon icon="LeftOutlined" size={18} />
        </div>
        {left && <div style={{ boxSizing: 'border-box' }}>{left}</div>}
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
        <div style={{ boxSizing: 'border-box', marginRight: 5, minWidth: 25 }}>{right}</div>
      </CenterXY>
    </AlignSide>
  );
}
