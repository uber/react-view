/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/

import * as React from "react";

const Modal: React.FC<{
  handleClose: () => void;
  show: boolean;
  children: React.ReactNode;
}> = ({ handleClose, show, children }) => {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        zIndex: 2,
        background: "rgba(0, 0, 0, 0.6)",
      }}
    >
      <section
        style={{
          fontFamily: "'Helvetica Neue', Arial",
          position: "fixed",
          background: "white",
          width: "80%",
          height: "auto",
          minHeight: "200px",
          flexDirection: "column",
          top: "50%",
          left: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: "translate(-50%,-50%)",
        }}
      >
        <p>{children}</p>
        <button id="close-modal" onClick={handleClose}>
          close modal
        </button>
      </section>
    </div>
  );
};

export default Modal;
