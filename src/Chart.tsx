import React, { createContext, useContext, FunctionComponent } from 'react';

import { ChartDimensions } from './utils';

const ChartContext = createContext<ChartDimensions | null>(null);
export const useContextDimensions = () => {
  const dimensions = useContext(ChartContext);
  if (dimensions === null) {
    throw new Error('useContextDimensions must be used inside a Chart');
  }
  return dimensions;
};

export interface IChartProps {
  dimensions: ChartDimensions;
}

const Chart: FunctionComponent<IChartProps> = ({ dimensions, children }) => (
  <ChartContext.Provider value={dimensions}>
    <svg
      style={{ overflow: 'visible' }}
      width={dimensions.width}
      height={dimensions.height}
    >
      <g
        transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}
      >
        {children}
      </g>
    </svg>
  </ChartContext.Provider>
);

export default Chart;
