/*
Copyright (c) 2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from 'react';

export const SIZE = {
  default: 'default',
  compact: 'compact',
  large: 'large',
};

type TInputProps = {
  value: string;
  onChange: (e: any) => void;
  size: keyof typeof SIZE;
  disabled: boolean;
  editable: boolean;
};

export const Input: React.FC<TInputProps> = ({
  value,
  onChange,
  size,
  disabled,
  editable,
}) => {
  const getSizeStyle = (size: keyof typeof SIZE) => {
    switch (size) {
      case SIZE.compact:
        return {
          padding: '8px',
          fontSize: '14px',
        };
      case SIZE.large:
        return {
          padding: '18px',
          fontSize: '20px',
        };
      default:
        return {
          padding: '12px',
          fontSize: '16px',
        };
    }
  };
  const inputStyle = {
    ...getSizeStyle(size),
    background: disabled ? '#BBB' : '#FFF',
    color: '#000',
    borderRadius: '5px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#000',
  };
  return (
    <input
      id="example-input"
      value={value}
      onChange={onChange}
      style={inputStyle}
      disabled={typeof editable === 'undefined' || editable ? false : true}
    />
  );
};
