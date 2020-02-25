/*
Copyright (c) 2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import {vscodeSnippet, PropTypes} from '../../index';

describe('vscodeSnippet imports', () => {
  test('no imports', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
      })['Button import']
    ).toBeUndefined();
  });
  test('single default import', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
        imports: {
          'your-button-component': {
            default: 'Button',
          },
        },
      })['Button import']
    ).toEqual({
      body: ["import ${1:Button} from 'your-button-component';"],
      description: 'Base Button import.',
      prefix: ['Button import'],
      scope: 'javascript,javascriptreact,typescript,typescriptreact',
    });
  });
  test('single named import', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
        imports: {
          'your-button-component': {
            named: ['SIZE'],
          },
        },
      })['Button import']
    ).toEqual({
      body: ["import ${1:{${2:SIZE}\\}} from 'your-button-component';"],
      description: 'Base Button import.',
      prefix: ['Button import'],
      scope: 'javascript,javascriptreact,typescript,typescriptreact',
    });
  });
  test('multiple named imports', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
        imports: {
          'your-button-component': {
            named: ['SIZE', 'KIND'],
          },
        },
      })['Button import']
    ).toEqual({
      body: [
        "import ${1:{${2:SIZE, }${3:KIND}\\}} from 'your-button-component';",
      ],
      description: 'Base Button import.',
      prefix: ['Button import'],
      scope: 'javascript,javascriptreact,typescript,typescriptreact',
    });
  });
  test('default import and named imports', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
        imports: {
          'your-button-component': {
            named: ['SIZE', 'KIND'],
            default: 'Button',
          },
        },
      })['Button import']
    ).toEqual({
      body: [
        "import ${1:Button, }${2:{${3:SIZE, }${4:KIND}\\}} from 'your-button-component';",
      ],
      description: 'Base Button import.',
      prefix: ['Button import'],
      scope: 'javascript,javascriptreact,typescript,typescriptreact',
    });
  });
  test('multiple from sources', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
        imports: {
          'your-button-component': {
            named: ['SIZE', 'KIND'],
            default: 'Button',
          },
          'your-toast-component': {
            default: 'Toast',
          },
        },
      })['Button import']
    ).toEqual({
      body: [
        "import ${1:Button, }${2:{${3:SIZE, }${4:KIND}\\}} from 'your-button-component';",
        "import ${5:Toast} from 'your-toast-component';",
      ],
      description: 'Base Button import.',
      prefix: ['Button import'],
      scope: 'javascript,javascriptreact,typescript,typescriptreact',
    });
  });
  test('prop imports', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
        props: {
          size: {
            value: false,
            type: PropTypes.Boolean,
            description: '',
            imports: {
              'your-button-component': {
                named: ['SIZE'],
              },
            },
          },
          kind: {
            value: false,
            type: PropTypes.Boolean,
            description: '',
            imports: {
              'your-button-component': {
                named: ['KIND'],
              },
            },
          },
        },
      })['Button import']
    ).toEqual({
      body: [
        "import ${1:{${2:SIZE, }${3:KIND}\\}} from 'your-button-component';",
      ],
      description: 'Base Button import.',
      prefix: ['Button import'],
      scope: 'javascript,javascriptreact,typescript,typescriptreact',
    });
  });
});
describe('vscodeSnippet component', () => {
  test('no props', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
      })
    ).toEqual({
      Button: {
        body: ['<Button', '/>'],
        description: 'Base Button component.',
        prefix: ['Button component'],
        scope: 'javascript,javascriptreact,typescript,typescriptreact',
      },
    });
  });
  test('generic prop', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
        props: {
          onClick: {
            value: '() => alert("click")',
            type: PropTypes.Function,
            description: `Function called when button is clicked.`,
          },
        },
      })
    ).toEqual({
      Button: {
        body: ['<Button', '  ${1:onClick={${2:() => alert("click")}\\}}', '/>'],
        description: 'Base Button component.',
        prefix: ['Button component'],
        scope: 'javascript,javascriptreact,typescript,typescriptreact',
      },
    });
  });
  test('boolean prop', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
        props: {
          disabled: {
            value: false,
            type: PropTypes.Boolean,
            description: 'Indicates that the button is disabled',
          },
        },
      })
    ).toEqual({
      Button: {
        body: ['<Button', '  ${1:disabled}', '/>'],
        description: 'Base Button component.',
        prefix: ['Button component'],
        scope: 'javascript,javascriptreact,typescript,typescriptreact',
      },
    });
  });
  test('enum prop', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
        props: {
          size: {
            value: 'SIZE.default',
            defaultValue: 'SIZE.default',
            options: {default: 'default', big: 'big'},
            type: PropTypes.Enum,
            description: 'Defines the size of the button.',
            imports: {},
          },
        },
      })
    ).toEqual({
      Button: {
        body: ['<Button', '  ${1:size={${2|SIZE.default,SIZE.big|}\\}}', '/>'],
        description: 'Base Button component.',
        prefix: ['Button component'],
        scope: 'javascript,javascriptreact,typescript,typescriptreact',
      },
    });
  });
  test('enum prop with enumName', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
        props: {
          size: {
            value: 'CUSTOM.default',
            defaultValue: 'CUSTOM.default',
            enumName: 'CUSTOM',
            options: {big: 'big', default: 'default'},
            type: PropTypes.Enum,
            description: 'Defines the size of the button.',
            imports: {},
          },
        },
      })
    ).toEqual({
      Button: {
        body: [
          '<Button',
          '  ${1:size={${2|CUSTOM.default,CUSTOM.big|}\\}}',
          '/>',
        ],
        description: 'Base Button component.',
        prefix: ['Button component'],
        scope: 'javascript,javascriptreact,typescript,typescriptreact',
      },
    });
  });
  test('enum prop without imports', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
        props: {
          size: {
            value: 'default',
            defaultValue: 'default',
            options: {big: 'big', default: 'default'},
            type: PropTypes.Enum,
            description: 'Defines the size of the button.',
          },
        },
      })
    ).toEqual({
      Button: {
        body: ['<Button', '  ${1:size={${2|default,big|}\\}}', '/>'],
        description: 'Base Button component.',
        prefix: ['Button component'],
        scope: 'javascript,javascriptreact,typescript,typescriptreact',
      },
    });
  });
  test('enum prop with values containing a dash', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
        props: {
          size: {
            value: "SIZE['default-val']",
            defaultValue: "SIZE['default-val']",
            options: {['default-val']: 'default-val', ['big-val']: 'big-val'},
            type: PropTypes.Enum,
            description: 'Defines the size of the button.',
            imports: {},
          },
        },
      })
    ).toEqual({
      Button: {
        body: [
          '<Button',
          "  ${1:size={${2|SIZE['default-val'],SIZE['big-val']|}\\}}",
          '/>',
        ],
        description: 'Base Button component.',
        prefix: ['Button component'],
        scope: 'javascript,javascriptreact,typescript,typescriptreact',
      },
    });
  });
  test('children prop', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
        props: {
          children: {
            value: 'Hey',
            type: PropTypes.String,
            description: 'Foo',
          },
        },
      })
    ).toEqual({
      Button: {
        body: ['<Button', '>', '  ${1:Hey}', '</Button>'],
        description: 'Base Button component.',
        prefix: ['Button component'],
        scope: 'javascript,javascriptreact,typescript,typescriptreact',
      },
    });
  });
  test('prop formatting (prettier)', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
        props: {
          enhancer: {
            value: '() => { return   <div>Blah</div>}',
            type: PropTypes.Function,
            description: 'Foo',
          },
        },
      })
    ).toEqual({
      Button: {
        body: [
          '<Button',
          '  ${1:enhancer={${2:() => {\n    return <div>Blah</div>;\n  \\}}\\}}',
          '/>',
        ],
        description: 'Base Button component.',
        prefix: ['Button component'],
        scope: 'javascript,javascriptreact,typescript,typescriptreact',
      },
    });
  });
  test('prop formatting child function (prettier)', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
        props: {
          children: {
            value: `() => { return   <div>Blah</div>}`,
            type: PropTypes.Function,
            description: 'Foo',
          },
        },
      })
    ).toEqual({
      Button: {
        body: [
          '<Button',
          '>',
          '  ${1:() => {\n    return <div>Blah</div>;\n  \\}}',
          '</Button>',
        ],
        description: 'Base Button component.',
        prefix: ['Button component'],
        scope: 'javascript,javascriptreact,typescript,typescriptreact',
      },
    });
  });
  test('prop formatting child components (prettier)', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
        props: {
          children: {
            value: `<span>Foo</span><span>Baz</span><span>Ok</span>`,
            type: PropTypes.Function,
            description: 'Foo',
          },
        },
      })
    ).toEqual({
      Button: {
        body: [
          '<Button',
          '>',
          '  ${1:<span>Foo</span>\n  <span>Baz</span>\n  <span>Ok</span>}',
          '</Button>',
        ],
        description: 'Base Button component.',
        prefix: ['Button component'],
        scope: 'javascript,javascriptreact,typescript,typescriptreact',
      },
    });
  });
  test('prop escape variables', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
        props: {
          children: {
            value: '<span $align="center">${hey}</span>',
            type: PropTypes.Function,
            description: 'Foo',
          },
        },
      })
    ).toEqual({
      Button: {
        body: [
          '<Button',
          '>',
          '  ${1:<span \\$align="center">\\${hey\\}</span>}',
          '</Button>',
        ],
        description: 'Base Button component.',
        prefix: ['Button component'],
        scope: 'javascript,javascriptreact,typescript,typescriptreact',
      },
    });
  });
  test('custom description', () => {
    expect(
      vscodeSnippet({
        componentName: 'Button',
        imports: {
          'your-button-component': {
            default: 'Button',
          },
        },
        description: 'Button component',
      })['Button import']
    ).toEqual({
      body: ["import ${1:Button} from 'your-button-component';"],
      description: 'Button component',
      prefix: ['Button import'],
      scope: 'javascript,javascriptreact,typescript,typescriptreact',
    });
  });
  test('(PropTypes.String prop) append as string literal', () => {
    expect(
      vscodeSnippet({
        props: {
          placeholder: {
            value: 'Placeholder',
            type: PropTypes.String,
            description: 'Placeholder',
          },
        },
        componentName: 'Input',
      })['Input']
    ).toEqual({
      body: ['<Input', '  ${1:placeholder="${2:Placeholder}"}', '/>'],
      description: 'Base Input component.',
      prefix: ['Input component'],
      scope: 'javascript,javascriptreact,typescript,typescriptreact',
    });
  });
  test('(PropTypes.String prop) ignore undefined values', () => {
    expect(
      vscodeSnippet({
        props: {
          value: {
            value: undefined,
            type: PropTypes.String,
            description: 'Value',
          },
        },
        componentName: 'Input',
      })['Input']
    ).toEqual({
      body: ['<Input', '  ${1:value={${2:undefined}\\}}', '/>'],
      description: 'Base Input component.',
      prefix: ['Input component'],
      scope: 'javascript,javascriptreact,typescript,typescriptreact',
    });
  });
});
