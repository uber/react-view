/*
Copyright (c) 2019 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/

import * as React from 'react';
//import {View, PropTypes} from '../src/index';
import {Layout, H1, P} from './layout/';
import Modal from './showcase-components/modal';

export default () => (
  <View
    componentName="asdasd"
    props={{
      children: {
        value: 'Hello',
        type: PropTypes.ReactNode,
        description: 'Content of the modal',
      },
      handleClose: {
        value: '() => alert("click")',
        type: PropTypes.Function,
        description: 'Function called when button is clicked.',
      },
      disabled: {
        value: false,
        type: PropTypes.Boolean,
        description: 'Indicates that the button is disabled',
      },
    }}
    scope={{
      Button,
      SIZE,
    }}
    imports={{
      'your-button-component': {
        named: ['Button'],
      },
    }}
  />
);
