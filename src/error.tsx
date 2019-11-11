import * as React from 'react';
import {codeFrameColumns} from '@babel/code-frame';

const frameError = (error: string, code: string) => {
  if (error) {
    const found = error.match(/\((\d+)\:(\d+)\)$/);
    if (found) {
      const location = {
        start: {line: parseInt(found[1], 10), column: parseInt(found[2], 10)},
      };
      return `${error}\n\n${codeFrameColumns(code, location)}`;
    }
  }
  return error;
};

const Error: React.FC<{where: string; msg: string | null; code: string}> = ({where, msg, code}) => {
  if (where !== '__compiler' || !msg) return null;
  return (
    <div
      style={{
        borderRadius: '5px',
        backgroundColor: '#892C21',
        whiteSpace: 'pre',
        fontSize: '11px',
        fontFamily: `Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace`,
        color: '#FFF',
        padding: '16px',
        margin: '8px 0px',
        overflowX: 'scroll',
      }}
    >
      {frameError(msg, code)}
    </div>
  );
};

export default Error;
