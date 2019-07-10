import React, { Fragment } from 'react';

import { useContextDimensions } from './Chart';
import { MapNumToNum } from './types';

interface IYAxisProps {
  labels: string[];
  yAccessor: MapNumToNum;
}

export default function YAxis(props: IYAxisProps) {
  const { labels, yAccessor } = props;
  const dimensions = useContextDimensions();
  return (
    <g transform={`translate(${dimensions.boundedWidth}, 0)`}>
      {labels.map((label, i) => {
        const y = yAccessor(i);
        return (
          <Fragment key={label}>
            <line y1={y} y2={y} x2="10" stroke="#bdc3c7" />
            <text
              key={label}
              transform={`translate(15, ${y})`}
              textAnchor="start"
              fontSize="0.8em"
              dominantBaseline="middle"
            >
              {label}
            </text>
          </Fragment>
        );
      })}
    </g>
  );
}
