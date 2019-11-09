import * as React from 'react';
import {Manager} from 'react-popper';
import {TPropValue, TProp, TError} from './types';
import Knob from './knob';

type TKnobsProps = {
  knobProps: {[key: string]: TProp};
  set: (propValue: TPropValue, propName: string) => void;
  error: TError;
};

const KnobColumn: React.FC<TKnobsProps & {knobNames: string[]}> = ({
  knobProps,
  knobNames,
  error,
  set,
}) => {
  return (
    <div
      style={{
        flexBasis: '50%',
        padding: `0 16px`,
      }}
    >
      {knobNames.map((name: string) => (
        <Knob
          key={name}
          name={name}
          error={error.where === name ? error.msg : null}
          description={knobProps[name].description}
          type={knobProps[name].type}
          val={knobProps[name].value}
          options={knobProps[name].options}
          placeholder={knobProps[name].placeholder}
          set={(value: TPropValue) => set(value, name)}
          enumName={knobProps[name].enumName}
        />
      ))}
    </div>
  );
};

const Knobs: React.FC<TKnobsProps> = ({knobProps, set, error}) => {
  const [showAllKnobs, setShowAllKnobs] = React.useState(false);
  const allKnobNames = Object.keys(knobProps);
  const filteredKnobNames = allKnobNames.filter((name: string) => knobProps[name].hidden !== true);
  const knobNames = showAllKnobs ? allKnobNames : filteredKnobNames;
  const firstGroup = knobNames.slice(0, knobNames.length / 2);
  const secondGroup = knobNames.slice(knobNames.length / 2);
  return (
    <Manager>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media screen and (max-width: 600px) {
          .react-view-columns {
            flex-wrap: wrap;
          }
        }
        .react-view-columns {
          display: flex;
          margin: 0 -16px;
        }
      `,
        }}
      />
      <div className="react-view-columns">
        <KnobColumn knobProps={knobProps} knobNames={firstGroup} set={set} error={error} />
        <KnobColumn knobProps={knobProps} knobNames={secondGroup} set={set} error={error} />
      </div>
      {filteredKnobNames.length !== allKnobNames.length && (
        <button onClick={() => setShowAllKnobs(!showAllKnobs)}>
          {showAllKnobs ? 'Show only basic props' : 'Show all props'}
        </button>
      )}
    </Manager>
  );
};

export default Knobs;
