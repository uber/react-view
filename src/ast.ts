import traverse, {NodePath} from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import {TProp} from './types';
import {parse as babelParse} from '@babel/parser';
import {getAstJsxElement, formatAstAndPrint} from './code-generator';

export const parse = (code: string) =>
  babelParse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'flow'],
  });

// creates a call expression that synchronizes view state
const getInstrumentOnChange = (what: string, into: string) =>
  t.callExpression(t.identifier('__react_view_onChange'), [
    t.identifier(what),
    t.stringLiteral(into),
  ]);

// appends a call expression to a function body
const fnBodyAppend = (
  path: NodePath<any>,
  callExpression: t.CallExpression
) => {
  if (path.node.type !== 'JSXExpressionContainer') {
    return;
  }
  const callbackBody = (path.get('expression') as any).get('body');
  if (callbackBody.type === 'BlockStatement') {
    // when the callback body is a block
    // e.g.: e => { setValue(e.target.value) }
    callbackBody.pushContainer('body', callExpression);
  } else {
    // when it is a single statement like e => setValue(e.target.value)
    // we have to create a BlockStatement first
    callbackBody.replaceWith(
      t.blockStatement([
        t.expressionStatement(callbackBody.node),
        t.expressionStatement(callExpression),
      ])
    );
  }
};

// clean-up for react-live, removing all imports, exports and top level
// variable declaration, add __react_view_onChange instrumentation when needed
export const transformBeforeCompilation = (
  ast: t.File,
  elementName: string,
  propsConfig: {[key: string]: TProp}
) => {
  try {
    traverse(ast, {
      VariableDeclaration(path) {
        if (path.parent.type === 'Program') {
          //@ts-ignore
          path.replaceWith(path.node.declarations[0].init);
        }
      },
      ImportDeclaration(path) {
        path.remove();
      },
      ExportDefaultDeclaration(path) {
        if (
          path.node.declaration.type === 'ArrowFunctionExpression' ||
          path.node.declaration.type === 'FunctionDeclaration'
        ) {
          path.replaceWith(path.node.declaration);
        } else {
          path.remove();
        }
      },
      // adds internal state instrumentation through __react_view_onChange callback
      JSXElement(path) {
        if (
          path.node.openingElement.type === 'JSXOpeningElement' &&
          //@ts-ignore
          path.node.openingElement.name.name === elementName
        ) {
          if (propsConfig['children'] && propsConfig['children'].propHook) {
            const propHook = propsConfig['children'].propHook;
            path.get('children').forEach(child => {
              typeof propHook === 'object'
                ? fnBodyAppend(
                    child,
                    getInstrumentOnChange(propHook.what, propHook.into)
                  )
                : child.traverse(
                    propHook({getInstrumentOnChange, fnBodyAppend})
                  );
            });
          }
          path
            .get('openingElement')
            .get('attributes')
            .forEach(attr => {
              const name = (attr.get('name') as any).node.name;
              const propHook = propsConfig[name].propHook;
              if (typeof propHook !== 'undefined') {
                typeof propHook === 'object'
                  ? fnBodyAppend(
                      attr.get('value') as any,
                      getInstrumentOnChange(propHook.what, propHook.into)
                    )
                  : attr.traverse(
                      propHook({getInstrumentOnChange, fnBodyAppend})
                    );
              }
            });
        }
      },
    });
  } catch (e) {}
  return ast;
};

export function parseCode(
  code: string,
  elementName: string,
  parseProvider?: (ast: any) => void
) {
  const propValues: {[key: string]: string} = {};
  const stateValues: {[key: string]: string} = {};
  let parsedProvider: any = undefined;
  try {
    const ast = parse(code) as any;
    traverse(ast, {
      JSXElement(path) {
        if (
          Object.keys(propValues).length === 0 && // process just the first element
          path.node.openingElement.type === 'JSXOpeningElement' &&
          //@ts-ignore
          path.node.openingElement.name.name === elementName
        ) {
          path.node.openingElement.attributes.forEach((attr: any) => {
            const name = attr.name.name;
            let value = null;
            if (attr.value === null) {
              //boolean prop without value
              value = true;
            } else {
              if (attr.value.type === 'StringLiteral') {
                value = attr.value.value;
              } else if (attr.value.type === 'JSXExpressionContainer') {
                if (attr.value.expression.type === 'BooleanLiteral') {
                  value = attr.value.expression.value;
                } else {
                  value = formatAstAndPrint(
                    //@ts-ignore
                    t.program([t.expressionStatement(attr.value.expression)]),
                    30
                  );
                }
              }
            }
            propValues[name] = value;
          });
          propValues['children'] = formatAstAndPrint(
            getAstJsxElement('ViewRoot', [], path.node.children as any) as any,
            30
          )
            .replace(/\n  /g, '\n')
            .replace(/^<ViewRoot>\n?/, '')
            .replace(/<\/ViewRoot>$/, '')
            .replace(/\s*<ViewRoot \/>\s*/, '');
        }
      },
      VariableDeclarator(path) {
        // looking for React.useState()
        const node = path.node as any;
        if (
          node.id.type === 'ArrayPattern' &&
          node.init.type === 'CallExpression' &&
          node.init.callee.property.name === 'useState'
        ) {
          const name = node.id.elements[0].name;
          const valueNode = node.init.arguments[0];
          if (
            valueNode.type === 'StringLiteral' ||
            valueNode.type === 'BooleanLiteral'
          ) {
            stateValues[name] = valueNode.value;
          } else {
            stateValues[name] = generate(valueNode).code;
          }
        }
      },
    });
    if (parseProvider) {
      parsedProvider = parseProvider(ast);
    }
  } catch (e) {
    throw new Error("Code is not valid and can't be parsed.");
  }

  // override props by local state (React hooks)
  Object.keys(stateValues).forEach(stateValueKey => {
    Object.keys(propValues).forEach(propValueKey => {
      if (propValues[propValueKey] === stateValueKey) {
        propValues[propValueKey] = stateValues[stateValueKey];
      }
    });
  });

  return {parsedProps: propValues, parsedProvider};
}
