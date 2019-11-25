import React, { memo } from 'react';

import { MapNumToNum, MapNumToStr } from './types';

interface IMapProps {
  data: number[][];
  colorAccessor: MapNumToStr;
  xAccessor: MapNumToNum;
  yAccessor: MapNumToNum;
  elementWidth: number;
  elementHeight: number;
}

function Map(props: IMapProps) {
  const {
    data,
    xAccessor,
    yAccessor,
    elementHeight,
    elementWidth,
    colorAccessor,
  } = props;
  const squares = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      squares.push(
        <rect
          key={`${i}-${j}`}
          x={xAccessor(j)}
          y={yAccessor(i)}
          width={elementWidth}
          height={elementHeight}
          fill={colorAccessor(data[i][j])}
        />,
      );
    }
  }
  return <g>{squares}</g>;
}

export default memo(Map);
