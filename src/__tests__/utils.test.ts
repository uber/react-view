/*
Copyright (c) 2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import {formatBabelError} from '../utils';

describe('formatBabelError', () => {
  test('preserve', () => {
    const source = `SyntaxError: Unexpected token, expected "jsxTagEnd" (10:5)`;
    expect(formatBabelError(source)).toBe(
      `SyntaxError: Unexpected token, expected "jsxTagEnd" (10:5)`
    );
  });

  test('make all adjustments', () => {
    const source = `SyntaxError: Unexpected token, expected "jsxTagEnd" (3:17)
  1 | /* @babel/template */;
  2 | <><Tab title="Tab Link 1">
> 3 |   Content 1</Tab /></>
    |                 ^`;
    expect(formatBabelError(source))
      .toBe(`SyntaxError: Unexpected token, expected "jsxTagEnd" (2:17)
  
  1 | <Tab title="Tab Link 1">
> 2 |   Content 1</Tab />
    |                 ^`);
  });
});
