/*
Copyright (c) 2019 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from 'react';
import SimpleEditor from 'react-simple-code-editor';
import Highlight, {Prism} from 'prism-react-renderer';
import {
  useValueDebounce,
  lightTheme,
  TEditorProps,
  TEditorLanguage,
  TTransformToken,
} from '../index';

const highlightCode = ({
  code,
  theme,
  transformToken,
  language,
}: {
  code: string;
  theme: typeof lightTheme;
  transformToken?: TTransformToken;
  language?: TEditorLanguage;
}) => (
  <Highlight
    Prism={Prism}
    code={code}
    theme={theme}
    language={language || 'jsx'}
  >
    {({tokens, getLineProps, getTokenProps}) => (
      <React.Fragment>
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({line, key: i})}>
            {line.map((token, key) => {
              const tokenProps = getTokenProps({token, key});

              if (transformToken) {
                return transformToken(tokenProps);
              }
              return <span key={key} {...tokenProps} />;
            })}
          </div>
        ))}
      </React.Fragment>
    )}
  </Highlight>
);

const Editor: React.FC<TEditorProps> = ({
  code: globalCode,
  transformToken,
  onChange,
  placeholder,
  language,
  theme,
  ['data-testid']: testid,
}) => {
  const [focused, setFocused] = React.useState(false);
  const editorTheme = {
    ...(theme || lightTheme),
    plain: {
      whiteSpace: 'break-spaces',
      ...(theme || lightTheme).plain,
    },
  };

  const [code, setCode] = useValueDebounce<string>(globalCode, onChange);

  return (
    <div
      data-testid={testid}
      style={{
        boxSizing: 'border-box',
        paddingLeft: '4px',
        paddingRight: '4px',
        maxWidth: 'auto',
        overflow: 'hidden',
        border: focused ? '1px solid #276EF1' : '1px solid #CCC',
        borderRadius: '5px',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `.npm__react-simple-code-editor__textarea { outline: none !important }`,
        }}
      />
      <SimpleEditor
        value={code || ''}
        placeholder={placeholder}
        highlight={code =>
          highlightCode({code, theme: editorTheme, transformToken, language})
        }
        onValueChange={code => setCode(code)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        padding={8}
        style={editorTheme.plain as any}
      />
    </div>
  );
};
export default Editor;
