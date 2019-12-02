/*
Copyright (c) 2019 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from 'react';
import Basic from './basic';
import StateHook from './state-hook';
import LiveCodeOnly from './live-code-only';
import Typescript from './typescript';

export default {
  title: 'useView',
};

export const basic = () => {
  return <Basic />;
};

export const stateHook = () => {
  return <StateHook />;
};

export const liveCodeOnly = () => {
  return <LiveCodeOnly />;
};

export const typescript = () => {
  return <Typescript />;
};
