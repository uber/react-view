/*
Copyright (c) 2019 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/

import * as React from 'react';

const Modal: React.FC<{
  handleClose: () => void;
  show: boolean;
  children: React.ReactNode;
}> = ({handleClose, show, children}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.6)',
        display: show ? 'block' : 'none',
      }}
    >
      <section
        style={{
          position: 'fixed',
          background: 'white',
          width: '80%',
          height: 'auto',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      >
        {children}
        <button onClick={handleClose}>close</button>
      </section>
    </div>
  );
};

export default Modal;
