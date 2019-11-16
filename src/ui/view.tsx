import * as React from 'react';
import {useView, Compiler, Knobs, Editor, Error, ActionButtons, Placeholder} from '../index';

import {TUseViewParams} from '../types';

const View: React.FC<TUseViewParams> = args => {
  const params = useView(args);
  return (
    <div style={{maxWidth: '600px'}}>
      <Compiler {...params.compilerProps} minHeight={62} placeholder={Placeholder} />
      <Error msg={params.errorProps.msg} isPopup />
      <Knobs {...params.knobProps} />
      <Editor {...params.editorProps} />
      <Error {...params.errorProps} />
      <ActionButtons {...params.actions} />
    </div>
  );
};

export default View;
