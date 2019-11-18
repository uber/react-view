import * as React from 'react';

export const ActionButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = props => <button className="react-view-button" {...props} />;

export const ActionButtons: React.FC<{
  formatCode: () => void;
  copyCode: () => void;
  copyUrl: () => void;
  reset: () => void;
}> = ({formatCode, copyCode, copyUrl, reset}) => (
  <React.Fragment>
    <style
      dangerouslySetInnerHTML={{
        __html: `
    .react-view-button {
      font-size: 14px;
      font-family: 'Helvetica Neue', Arial;
      padding: 8px;
      margin: 0px;
      border-radius: 5px;
      border: 1px solid #CCC;
      background-color: #FFF;
      color: #000;
    }

    .react-view-button:hover {
      background-color: #EEE;
      color: #000;
    }

    .react-view-button:active {
      border-color: #276EF1;
      color: #000;
    }
  `,
      }}
    />
    <div style={{margin: '10px 0px'}}>
      <ActionButton style={{marginRight: '8px'}} onClick={formatCode}>
        Format code
      </ActionButton>
      <ActionButton style={{marginRight: '8px'}} onClick={copyCode}>
        Copy code
      </ActionButton>
      <ActionButton style={{marginRight: '8px'}} onClick={copyUrl}>
        Copy URL
      </ActionButton>
      <ActionButton style={{marginRight: '8px'}} onClick={reset}>
        Reset
      </ActionButton>
    </div>
  </React.Fragment>
);
