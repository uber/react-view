import * as React from 'react';
import {Portal} from 'react-portal';
import {Reference, Popper, Manager} from 'react-popper';
import {formatBabelError, frameError} from './utils';

const PopupError: React.FC<{enabled: boolean; children: React.ReactNode}> = ({
  enabled,
  children,
}) => {
  if (!enabled) return <React.Fragment>{children}</React.Fragment>;
  return (
    <Manager>
      <Reference>{({ref}) => <div ref={ref} />}</Reference>
      <Portal>
        <Popper placement="bottom">
          {({ref, style, placement}) => (
            <div ref={ref} style={style} data-placement={placement}>
              {children}
            </div>
          )}
        </Popper>
      </Portal>
    </Manager>
  );
};

const Error: React.FC<{msg: string | null; code?: string; isPopup?: boolean}> = ({
  msg,
  code,
  isPopup,
}) => {
  if (msg === null) return null;
  return (
    <PopupError enabled={Boolean(isPopup)}>
      <div
        style={{
          borderRadius: '5px',
          backgroundColor: '#892C21',
          whiteSpace: 'pre',
          fontSize: '11px',
          fontFamily: `Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace`,
          color: '#FFF',
          padding: '16px',
          margin: `${isPopup ? 4 : 8}px 0px`,
          overflowX: 'scroll',
        }}
      >
        {code ? frameError(msg, code) : formatBabelError(msg)}
      </div>
    </PopupError>
  );
};

export default Error;
