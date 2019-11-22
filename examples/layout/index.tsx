import * as React from 'react';
import Highlight, {defaultProps} from 'prism-react-renderer';
import lightTheme from '../../src/light-theme';

export const Layout: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{maxWidth: '600px', margin: '0px auto', padding: '64px 16px 160px 16px'}}>
    {children}
  </div>
);

export const H1: React.FC<{children: React.ReactNode}> = ({children}) => (
  <h1 style={{fontFamily: "'Helvetica Neue', Arial"}}>{children}</h1>
);

export const H2: React.FC<{children: React.ReactNode}> = ({children}) => (
  <h2 style={{fontFamily: "'Helvetica Neue', Arial"}}>{children}</h2>
);

export const H3: React.FC<{children: React.ReactNode}> = ({children}) => (
  <h3 style={{fontFamily: "'Helvetica Neue', Arial"}}>{children}</h3>
);

export const CompilerBox: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{marginBottom: '16px', minHeight: '52px'}}>{children}</div>
);

export const P: React.FC<{children: React.ReactNode}> = ({children}) => (
  <p style={{fontFamily: "'Helvetica Neue', Arial", marginTop: '32px', lineHeight: 1.5}}>
    {children}
  </p>
);

export const Code: React.FC<{children: string}> = ({children}) => (
  <div style={{borderLeft: '5px solid #F7BFA5', paddingLeft: '10px', overflowX: 'scroll'}}>
    <Highlight
      {...defaultProps}
      code={children.replace(/[\r\n]+$/, '')}
      language="jsx"
      theme={lightTheme}
    >
      {({style, tokens, getLineProps, getTokenProps}) => (
        <pre dir="ltr" style={{...style, padding: '10px 10px'}}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({line, key: i})}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({token, key})} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  </div>
);

export const Inline: React.FC<{children: string}> = ({children}) => (
  <code
    style={{
      padding: '.2em .4em',
      margin: '0',
      fontSize: '85%',
      backgroundColor: 'rgba(27,31,35,.05)',
      borderRadius: '3px',
      fontFamily: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace',
    }}
  >
    {children}
  </code>
);
