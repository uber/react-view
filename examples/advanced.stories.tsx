/*
Copyright (c) 2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from 'react';
import Theming from './theming';
import CustomProp from './custom-prop';

export default {
  title: 'Advanced',
};

export const customProp = () => {
  return <CustomProp />;
};

export const theming = () => {
  return <Theming />;
};
