/*
Copyright (c) 2019 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/

import * as React from 'react';
import {View, PropTypes} from '../src/index';
import {Layout, H1} from './layout/';
import Modal from './showcase-components/modal';

const ModalExample = () => (
  <Layout>
    <H1>Modal example</H1>
    <View
      componentName="Modal"
      props={{
        show: {
          value: false,
          type: PropTypes.Boolean,
          description: 'Indicates that the modal is visible',
          stateful: true,
        },
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
