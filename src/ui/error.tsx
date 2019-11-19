import * as React from 'react';
import Popover from '@miksu/react-tiny-popover';
import {formatBabelError, frameError} from '../utils';
import {TErrorProps} from '../index';

const PopupError: React.FC<{enabled: boolean; children: React.ReactNode}> = ({
  enabled,
  children,
}) => {
  if (!enabled) return <React.Fragment>{children}</React.Fragment>;
  return (
    <Popover isOpen={enabled} position={'bottom'} content={<div>{children}</div>}>
      <div />
    </Popover>
  );
};

const Error: React.FC<TErrorProps> = ({msg, code, isPopup}) => {
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
