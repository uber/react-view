import{j as e}from"./index-OfupEra9.js";import{L as i,H as s,a as o,P as t,h as a,i as l,I as d}from"./action-buttons-1xy8bqUX.js";import{S as n,B as r}from"./button-Fm_AxZIp.js";import{V as u}from"./view-AIP637Iv.js";const p=()=>e.jsxs(i,{children:[e.jsx(s,{children:"View Component"}),e.jsxs(o,{children:[e.jsx("b",{children:"A single component that does it all"}),". It is a tiny wrapper around the ",e.jsx("a",{href:"/?path=/story/useview--basic",children:"useView"})," hook and composes all UI components into one thing. This might be an ideal solution if you do not want to visually tweak anything and just get started as quickly as possible."]}),e.jsx(u,{componentName:"Button",props:{children:{value:"Hello",type:t.ReactNode,description:"Visible label."},size:{value:"SIZE.default",defaultValue:"SIZE.default",options:n,type:t.Enum,description:"Defines the size of the button.",imports:{"your-button-component":{named:["SIZE"]}}},onClick:{value:'() => alert("click")',type:t.Function,description:"Function called when button is clicked."},disabled:{value:!1,type:t.Boolean,description:"Indicates that the button is disabled"}},scope:{Button:r,SIZE:n},imports:{"your-button-component":{named:["Button"]}}}),e.jsx(a,{children:"Usage"}),e.jsx(l,{children:`import {View, PropTypes} from 'react-view';
import {Button, SIZE} from 'your-button-component';

export default () => <View
  componentName="Button"
  props={{
    children: {
      value: 'Hello',
      type: PropTypes.ReactNode,
      description: 'Visible label.',
    },
    size: {
      value: 'SIZE.default',
      defaultValue: 'SIZE.default',
      options: SIZE,
      type: PropTypes.Enum,
      description: 'Defines the size of the button.',
      imports: {
        'your-button-component': {
          named: ['SIZE'],
        },
      },
    },
    onClick: {
      value: '() => alert("click")',
      type: PropTypes.Function,
      description: 'Function called when button is clicked.',
    },
    disabled: {
      value: false,
      type: PropTypes.Boolean,
      description: 'Indicates that the button is disabled',
    },
  }}
  scope={{
    Button,
    SIZE,
  }}
  imports={{
    'your-button-component': {
      named: ['Button'],
    },
  }}
/>;
`}),e.jsxs(o,{children:["If you are building your own playground based on ",e.jsx(d,{children:"useView"}),", having component like this can be a good way how to share it with others."]})]}),c=p,b={title:"View"},f=()=>e.jsx(c,{});typeof window<"u"&&window.document&&window.document.createElement&&document.documentElement.setAttribute("data-storyloaded","");export{b as default,f as view};
