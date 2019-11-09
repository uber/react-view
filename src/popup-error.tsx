import * as React from 'react';
import {Portal} from 'react-portal';
import {Reference, Popper} from 'react-popper';
import {formatBabelError} from './utils';

const PopupError: React.FC<{error: string | null}> = ({error}) => {
  if (error === null) {
    return null;
  }
  return (
    <React.Fragment>
      <Reference>{({ref}) => <span ref={ref} />}</Reference>
      <Portal>
        <Popper placement="bottom">
          {({ref, style, placement}) => (
            <div ref={ref} style={style} data-placement={placement}>
              <div
                style={{
                  marginLeft: '28px',
                  marginTop: '4px',
                  backgroundColor: '#892C21',
                  whiteSpace: 'pre',
                  fontSize: '11px',
                  fontFamily: `Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace`,
                  color: '#FFF',
                  padding: '16px',
                  overflowX: 'scroll',
                  zIndex: 1000,
                }}
              >
                {formatBabelError(error)}
              </div>
            </div>
          )}
        </Popper>
      </Portal>
    </React.Fragment>
  );
};

export default PopupError;
