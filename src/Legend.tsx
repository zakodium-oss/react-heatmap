import * as d3 from 'd3';
import React, { ReactNode, Fragment } from 'react';

import { useContextDimensions } from './Chart';
import { MapNumToStr } from './types';

interface LegendProps {
  colorAccessor: MapNumToStr;
  title: string;
  domain: [number, number];
}

export default function Legend(props: LegendProps) {
  const dimensions = useContextDimensions();
  const gradient = useLinearGradient(props.colorAccessor);

  const scale = d3.scaleLinear().domain(props.domain).range([0, 250]).nice();
  const ticks = scale.ticks(5);

  return (
    <g
      transform={`translate(-${dimensions.additionalMarginLeft}, -${dimensions.additionalMarginTop})`}
    >
      <defs>{gradient}</defs>
      <rect x="0" y="0" width="250" height="20" fill="url(#legend-gradient)" />
      {ticks.map((tickValue, i) => {
        const x = scale(tickValue);
        return (
          <Fragment key={i}>
            <line x1={x} x2={x} y1="20" y2="25" stroke="black" />
            <text
              x={x}
              y="28"
              dominantBaseline="hanging"
              textAnchor="middle"
              fontSize="0.9em"
            >
              {tickValue}
            </text>
          </Fragment>
        );
      })}
      <text x="0" y="45" dominantBaseline="hanging" textAnchor="left">
        {props.title}
      </text>
    </g>
  );
}

function useLinearGradient(colorAccessor: MapNumToStr): ReactNode {
  const result = [];
  for (let i = 0; i <= 256; i++) {
    result.push();
    result.push({
      offset: `${(i / 256) * 100}%`,
      color: colorAccessor(i / 256),
    });
  }
  return (
    <linearGradient id="legend-gradient">
      {result.map((color, i) => (
        <stop key={i} offset={color.offset} stopColor={color.color} />
      ))}
    </linearGradient>
  );
}
