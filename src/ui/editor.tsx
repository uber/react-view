/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from "react";
import SimpleEditor from "react-simple-code-editor";
import { Highlight } from "prism-react-renderer";
import type { TEditorProps, TEditorLanguage } from "../index";
import lightTheme from "../light-theme";
import { getStyles, useValueDebounce } from "../utils";

const highlightCode = ({
  code,
  theme,
  language,
}: {
  code: string;
  theme: typeof lightTheme;
  language?: TEditorLanguage;
}) => (
  <Highlight code={code} theme={theme} language={language || "jsx"}>
    {({ tokens, getLineProps, getTokenProps }) => (
      <React.Fragment>
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line, key: i })}>
            {line.map((token, key) => {
              const tokenProps = getTokenProps({ token, key });
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
  onChange,
  placeholder,
  language,
  theme,
  ["data-testid"]: testid,
  className,
}) => {
  const [focused, setFocused] = React.useState(false);
  const editorTheme = {
    ...(theme || lightTheme),
    plain: {
      whiteSpace: "break-spaces",
      ...(theme || lightTheme).plain,
    },
  };

  const [code, setCode] = useValueDebounce<string>(globalCode, onChange);

  return (
    <div
      data-testid={testid}
      {...getStyles(
        {
          boxSizing: "border-box",
          paddingLeft: "4px",
          paddingRight: "4px",
          maxWidth: "auto",
          overflow: "hidden",
          border: focused ? "1px solid #276EF1" : "1px solid #CCC",
          borderRadius: "5px",
        },
        className,
      )}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `.npm__react-simple-code-editor__textarea { outline: none !important }`,
        }}
      />
      <SimpleEditor
        value={code || ""}
        placeholder={placeholder}
        highlight={(code) =>
          highlightCode({ code, theme: editorTheme, language })
        }
        onValueChange={(code) => setCode(code)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        padding={8}
        style={editorTheme.plain as any}
      />
    </div>
  );
};
export default Editor;
