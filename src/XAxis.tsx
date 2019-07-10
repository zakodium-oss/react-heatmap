import React, { Fragment } from 'react';

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
      {labels.map((label, i) => {
        const x = xAccessor(i);
        return (
          <Fragment key={i}>
            <line x1={x} x2={x} y2="10" stroke="#bdc3c7" />
            <text
              transform={`translate(${x}, 15)rotate(-45)`}
              textAnchor="end"
              fontSize="0.8em"
              dominantBaseline="hanging"
            >
              {label}
            </text>
          </Fragment>
        );
      })}
    </g>
  );
}
