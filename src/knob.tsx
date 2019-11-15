import * as React from 'react';
import {useValueDebounce} from './utils';
import {PropTypes} from './const';
import Error from './error';
import Editor from './editor';
import {TPropValue} from './types';

const getTooltip = (description: string, type: string, name: string) => `${name}: ${type}

${description}`;

const Spacing: React.FC<{children: React.ReactNode; title?: string}> = ({children, title}) => {
  return (
    <div
      style={{margin: '10px 0px', fontFamily: "'Helvetica Neue', Arial", fontSize: '14px'}}
      title={title}
    >
      {children}
    </div>
  );
};

const Label: React.FC<{
  children: React.ReactNode;
  tooltip: string;
}> = ({children, tooltip}) => {
  return (
    <label
      title={tooltip}
      style={{
        fontWeight: 500,
        lineHeight: '20px',
      }}
    >
      {children}
    </label>
  );
};

const Knob: React.SFC<{
  name: string;
  error: string | null;
  description: string;
  val: TPropValue;
  set: (val: TPropValue) => void;
  type: PropTypes;
  options?: {[key: string]: string};
  placeholder?: string;
  enumName?: string;
}> = ({
  name,
  error,
  type,
  val: globalVal,
  set: globalSet,
  options = {},
  description,
  placeholder,
  enumName,
}) => {
  const [val] = useValueDebounce<TPropValue>(globalVal, globalSet);
  switch (type) {
    case PropTypes.Ref:
      return (
        <Spacing>
          <Label tooltip={getTooltip(description, type, name)}>{name}</Label>
          <a
            href="https://reactjs.org/docs/refs-and-the-dom.html"
            target="_blank"
            style={{
              fontSize: '14px',
              display: 'block',
            }}
          >
            React Ref documentation
          </a>
          <Error msg={error} isPopup />
        </Spacing>
      );
    case PropTypes.Boolean:
      return (
        <Spacing title={getTooltip(description, type, name)}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <input
              id={name}
              type="checkbox"
              style={{marginRight: '8px', marginLeft: '0px'}}
              checked={Boolean(val)}
              onChange={() => {
                globalSet(!val);
              }}
            />
            <label htmlFor={name}>{name}</label>
          </div>
          <Error msg={error} isPopup />
        </Spacing>
      );
    case PropTypes.Enum:
      const optionsKeys = Object.keys(options);
      const numberOfOptions = optionsKeys.length;
      return (
        <Spacing>
          <Label tooltip={getTooltip(description, type, name)}>{name}</Label>
          {numberOfOptions < 7 ? (
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
              {Object.keys(options).map(opt => (
                <div
                  style={{
                    marginRight: '16px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  key={opt}
                >
                  <input
                    style={{marginRight: '8px', marginLeft: '0px'}}
                    type="radio"
                    checked={`${enumName || name.toUpperCase()}.${opt}` === val}
                    key={opt}
                    id={`${name}_${opt}`}
                    value={`${enumName || name.toUpperCase()}.${opt}`}
                    name={`radio_${name}`}
                    onChange={e => globalSet(e.target.value)}
                  />
                  <label htmlFor={`${name}_${opt}`}>{opt}</label>
                </div>
              ))}
            </div>
          ) : (
            <select
              onChange={e => globalSet(e.target.value)}
              value={String(val)}
              name={name}
              style={{
                display: 'block',
                padding: '8.5px 10px',
                MozAppearance: 'none',
                WebkitAppearance: 'none',
                appearance: 'none',
                width: '100%',
                border: '1px solid #CCC',
                background: `url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHBvbHlnb24gY2xhc3M9ImNscy0yIiBwb2ludHM9IjEuNDEgNC42NyAyLjQ4IDMuMTggMy41NCA0LjY3IDEuNDEgNC42NyIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIzLjU0IDUuMzMgMi40OCA2LjgyIDEuNDEgNS4zMyAzLjU0IDUuMzMiLz48L3N2Zz4=) no-repeat 95% 50%`,
                fontSize: '14px',
                borderRadius: '5px',
              }}
            >
              {Object.keys(options).map(opt => (
                <option key={`${name}_${opt}`} value={`${enumName || name.toUpperCase()}.${opt}`}>
                  {opt}
                </option>
              ))}
            </select>
          )}

          <Error msg={error} isPopup />
        </Spacing>
      );
    case PropTypes.ReactNode:
    case PropTypes.Function:
    case PropTypes.Array:
    case PropTypes.Object:
    case PropTypes.String:
    case PropTypes.Date:
    case PropTypes.Number:
      return (
        <Spacing>
          <Label tooltip={getTooltip(description, type, name)}>{name}</Label>
          <Editor
            onChange={code => {
              globalSet(code);
            }}
            code={val ? String(val) : ''}
            placeholder={placeholder}
            small
          />
          <Error msg={error} isPopup />
        </Spacing>
      );
    default:
      return null;
  }
};

export default Knob;
