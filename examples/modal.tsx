/*
Copyright (c) 2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/

import * as React from 'react';
import {View, PropTypes} from '../src/index';
import {Layout, H1, P} from './layout/';
import Modal from './showcase-components/modal';

const ModalExample = () => (
  <Layout>
    <H1>Modal example</H1>
    <P>
      This is story was created for an e2e test. Reproduces this{' '}
      <a href="https://github.com/uber/react-view/issues/19">bug report.</a>
    </P>
    <View
      componentName="Modal"
      props={{
        children: {
          value: 'This is a simple Modal',
          type: PropTypes.ReactNode,
          description: 'Content of the modal',
        },
        handleClose: {
          value: '() => setShow(false)',
          type: PropTypes.Function,
          description: 'Function called when button is clicked.',
          propHook: {
            what: 'false',
            into: 'show',
          },
        },
        show: {
          value: false,
          type: PropTypes.Boolean,
          description: 'Indicates that the modal is visible',
          stateful: true,
        },
      }}
      scope={{
        Modal,
      }}
      imports={{
        'your-modal-component': {
          default: 'Modal',
        },
      }}
    />
  </Layout>
);
export default ModalExample;
