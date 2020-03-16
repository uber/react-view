/*
Copyright (c) 2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/

import {clone} from '../utils';
import {
  TProp,
  TPropValue,
  TImportsConfig,
  PropTypes,
  formatCode as rvFormatCode,
} from '../';
import {addToImportList} from '../code-generator';

const formatCode = (code: TPropValue) => {
  if (code && typeof code === 'string') {
    const isJsx = code.startsWith('<');
    try {
      if (isJsx) {
        code = rvFormatCode(`<>${code}</>`);
      } else {
        code = rvFormatCode(`<>{${code}}</>`);
      }
      const addSpaces = !code.startsWith('<>\n');
      if (isJsx) {
        code = code.replace(/^<>\s*/, '').replace(/\s*<\/>$/, '');
      } else {
        code = code.replace(/^<>\s*\{/, '').replace(/\}\s*<\/>$/, '');
      }
      if (addSpaces) {
        code = code.replace(/\n/g, '\n  ');
      }
    } catch (e) {}
    code = code.replace(/\}/g, '\\}').replace(/\$/g, '\\$');
  }

  return code;
};

const joinNamed = (items: string[] | undefined, ctr: number) => {
  if (!items) return '';
  let output = `\${${ctr++}:{`;
  for (let i = 0; i < items.length; i++) {
    if (i !== items.length - 1) {
      output += `\${${ctr++}:${items[i]}, }`;
    } else {
      output += `\${${ctr++}:${items[i]}}`;
    }
  }
  return `${output}\\}}`;
};

type TVscodeSnippetOutput = {
  [key: string]: {
    body: string[];
    description: string;
    prefix: string[];
    scope: string;
  };
};

type TVscodeSnippet = (props: {
  componentName: string;
  prefix?: string;
  imports?: TImportsConfig;
  props?: {[key: string]: TProp<any>};
  description?: string;
}) => TVscodeSnippetOutput;

const getImportBody = (
  imports?: TImportsConfig,
  props?: {[key: string]: TProp<any>}
) => {
  const importList: TImportsConfig = imports ? clone(imports) : {};
  // prop level imports (typically enums related) that are displayed
  // only when the prop is being used
  props &&
    Object.values(props).forEach(prop => {
      if (prop.imports) {
        addToImportList(importList, prop.imports);
      }
    });
  const importBody: string[] = [];
  let ctr = 1;
  for (const from in importList) {
    const def = importList[from].default;
    const named =
      Array.isArray(importList[from].named) &&
      (importList[from].named as string[]).length > 0
        ? importList[from].named
        : undefined;
    const defaultImport = def ? `\${${ctr++}:${def}${named ? ', }' : '}'}` : '';
    importBody.push(
      `import ${defaultImport}${joinNamed(named, ctr)} from '${from}';`
    );
    if (named) {
      ctr += named.length + 1;
    }
  }
  return importBody;
};

const getComponentBody = (
  componentName: string,
  props?: {[key: string]: TProp<any>}
) => {
  let ctr = 1;
  const componentBody = [`<${componentName}`];
  if (props) {
    for (const propName in props) {
      if (props[propName].hidden) continue;
      if (propName === 'children') continue;
      if (props[propName].type === PropTypes.Boolean) {
        const row = `  \${${ctr++}:${propName}}`;
        componentBody.push(row);
      } else if (props[propName].type === PropTypes.Enum) {
        const enumName = props[propName].imports
          ? props[propName].enumName || propName.toUpperCase()
          : null;
        const opts = Object.values(props[propName].options)
          .map((opt: any) =>
            enumName
              ? opt.includes('-')
                ? `${enumName}['${opt}']`
                : `${enumName}.${opt}`
              : opt
          )
          .filter(opt => opt !== props[propName].defaultValue);
        if (props[propName].defaultValue) {
          opts.unshift(props[propName].defaultValue as string);
        }
        if (!props[propName].imports) {
          const row = `  \${${ctr++}:${propName}="\${${ctr++}|${opts.join(
            ','
          )}|}\"}`;
          componentBody.push(row);
        } else {
          const row = `  \${${ctr++}:${propName}={\${${ctr++}|${opts.join(
            ','
          )}|}\\}}`;
          componentBody.push(row);
        }
      } else if (
        props[propName].type === PropTypes.String &&
        typeof props[propName].value === PropTypes.String
      ) {
        const row = `  \${${ctr++}:${propName}="\${${ctr++}:${formatCode(
          props[propName].defaultValue || props[propName].value
        )}}\"}`;
        componentBody.push(row);
      } else {
        const row = `  \${${ctr++}:${propName}={\${${ctr++}:${formatCode(
          props[propName].defaultValue || props[propName].value
        )}}\\}}`;
        componentBody.push(row);
      }
    }
    if (props['children'] && !props['children'].hidden) {
      componentBody.push('>');
      componentBody.push(
        `  \${${ctr++}:${formatCode(props['children'].value)}}`
      );
      componentBody.push(`</${componentName}>`);
    } else {
      componentBody.push(`/>`);
    }
  } else {
    componentBody.push(`/>`);
  }
  return componentBody;
};

const vscodeSnippet: TVscodeSnippet = ({
  componentName,
  prefix,
  imports,
  props,
  description,
}) => {
  const output: TVscodeSnippetOutput = {};

  const importBody = getImportBody(imports, props);
  if (importBody.length > 0) {
    output[`${componentName} import`] = {
      scope: 'javascript,javascriptreact,typescript,typescriptreact',
      prefix: [`${prefix || componentName} import`],
      description: description || `Base ${componentName} import.`,
      body: importBody,
    };
  }

  output[`${componentName}`] = {
    scope: 'javascript,javascriptreact,typescript,typescriptreact',
    prefix: [`${prefix || componentName} component`],
    description: description || `Base ${componentName} component.`,
    body: getComponentBody(componentName, props),
  };

  return output;
};

export default vscodeSnippet;
