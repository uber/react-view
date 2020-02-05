/*
Copyright (c) 2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from 'react';
import {
  useView,
  Compiler,
  Knobs,
  Editor,
  Error,
  ActionButtons,
  Placeholder,
} from '../index';
import {getStyles} from '../utils';

import {TUseViewParams} from '../types';

const View: React.FC<TUseViewParams> = args => {
  const params = useView(args);
  return (
    <div {...getStyles({maxWidth: '600px'}, args.className)}>
      <Compiler
        {...params.compilerProps}
        minHeight={62}
        placeholder={Placeholder}
      />
      <Error msg={params.errorProps.msg} isPopup />
      <Knobs {...params.knobProps} />
      <Editor {...params.editorProps} data-testid="rv-editor" />
      <Error {...params.errorProps} />
      <ActionButtons {...params.actions} />
    </div>
  );
};

export default View;
