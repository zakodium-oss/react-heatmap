import React from 'react';

import { useContextDimensions } from './Chart';
import { MapNumToNum } from './types';

interface IXAxisProps {
  labels: string[];
  xAccessor: MapNumToNum;
}

export default function XAxis(props: IXAxisProps) {
  const { labels, xAccessor } = props;
  const dimensions = useContextDimensions();
  return (
    <g transform={`translate(0, ${dimensions.boundedHeight})`}>
      {labels.map((label, i) => (
        <text
          key={label}
          transform={`translate(${xAccessor(i)}, 20)rotate(-45)`}
          textAnchor="end"
          fontSize="0.8em"
        >
          {label}
        </text>
      ))}
    </g>
  );
}
