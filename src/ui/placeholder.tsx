/*
Copyright (c) 2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from "react";

const heightToSize = (height: number) => {
  if (height > 100) {
    return 5;
  }
  if (height > 60) {
    return 3;
  }
  return 2;
};

const heightToWidth = (height: number) => {
  if (height > 100) {
    return 0.7;
  }
  if (height > 60) {
    return 0.5;
  }
  return 0.4;
};

const Placeholder: React.FC<{ height: number }> = ({ height }) => (
  <React.Fragment>
    <style
      dangerouslySetInnerHTML={{
        __html: `
  .react-view-loader,
  .react-view-loader:after {
    border-radius: 50%;
    width: ${heightToSize(height)}em;
    height: ${heightToSize(height)}em;
  }
  .react-view-loader {
    margin: 60px auto;
    font-size: 10px;
    position: relative;
    text-indent: -9999em;
    border-top: ${heightToWidth(height)}em solid rgba(39,110,241, 0.2);
    border-right: ${heightToWidth(height)}em solid rgba(39,110,241, 0.2);
    border-bottom: ${heightToWidth(height)}em solid rgba(39,110,241, 0.2);
    border-left: ${heightToWidth(height)}em solid #276ef1;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: load8 1.1s infinite linear;
    animation: load8 1.1s infinite linear;
  }
  @-webkit-keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }  
  `,
      }}
    />
    <div
      style={{
        height: `${height < 32 ? 32 : height}px`,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="react-view-loader">Loading...</div>
    </div>
  </React.Fragment>
);

export default Placeholder;
