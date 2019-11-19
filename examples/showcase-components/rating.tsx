import * as React from 'react';

type TRatingProps = {
  value: number;
  onChange: (e: any) => void;
};

type THeartProps = {
  active: boolean;
  setHovered: (num: number) => void;
  index: number;
  onClick: () => void;
};

const Heart: React.FC<THeartProps> = ({active, setHovered, index, onClick}) => {
  const ref = React.useRef(null);

  const handleMouseOver = () => setHovered(index);
  const handleMouseOut = () => setHovered(0);

  React.useEffect(() => {
    const node = ref.current as any;
    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);
      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    }
    return undefined;
  }, [ref.current]);

  return (
    <li
      role="radio"
      tabIndex={0}
      aria-setsize={5}
      aria-checked={active}
      aria-posinset={index}
      ref={ref}
      onClick={onClick}
      style={{
        listStyle: 'none',
        fontSize: '32px',
        margin: '5px',
        cursor: 'pointer',
      }}
    >
      {active ? '❤️' : '💙'}
    </li>
  );
};
export const Rating: React.FC<TRatingProps> = ({value, onChange}) => {
  const [hovered, setHovered] = React.useState(0);
  return (
    <ul role="radiogroup" tabIndex={0} style={{display: 'flex', flexWrap: 'nowrap', padding: 0}}>
      {[...Array(5).keys()].map(index => (
        <Heart
          key={index}
          active={hovered === 0 ? value > index : hovered > index}
          index={index + 1}
          setHovered={setHovered}
          onClick={() => onChange(index + 1)}
        />
      ))}
    </ul>
  );
};
