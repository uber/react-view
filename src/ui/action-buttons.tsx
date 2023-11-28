/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from "react";
import { getStyles } from "../utils";

export const ActionButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  ["data-testid"]?: string;
}> = (props) => <button className="react-view-button" {...props} />;

export const ActionButtons: React.FC<{
  formatCode: () => void;
  copyCode: () => void;
  copyUrl: () => void;
  reset: () => void;
  className?: string;
}> = ({ formatCode, copyCode, copyUrl, reset, className }) => (
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
    <div {...getStyles({ margin: "10px 0px" }, className)}>
      <ActionButton
        data-testid="rv-format"
        style={{ marginRight: "8px" }}
        onClick={formatCode}
      >
        Format code
      </ActionButton>
      <ActionButton
        data-testid="rv-copy-code"
        style={{ marginRight: "8px" }}
        onClick={copyCode}
      >
        Copy code
      </ActionButton>
      <ActionButton
        data-testid="rv-copy-url"
        style={{ marginRight: "8px" }}
        onClick={copyUrl}
      >
        Copy URL
      </ActionButton>
      <ActionButton
        data-testid="rv-reset"
        style={{ marginRight: "8px" }}
        onClick={reset}
      >
        Reset
      </ActionButton>
    </div>
  </React.Fragment>
);
