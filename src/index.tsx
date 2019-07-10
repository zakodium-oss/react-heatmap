import React, { memo, ReactElement } from 'react';
import * as d3 from 'd3';

import { useChartDimensions, ChartDimensionsConfig } from './utils';
import Chart from './Chart';
import Map from './Map';
import { MapNumToNum, MapNumToStr } from './types';
import XAxis from './XAxis';
import YAxis from './YAxis';

interface IHeatmapProps {
  data: number[][];
  xLabels: string[];
  yLabels: string[];
  dimensions?: ChartDimensionsConfig;
}

function Heatmap(props: IHeatmapProps): ReactElement {
  const { data, xLabels, yLabels } = props;
  const [ref, dimensions] = useChartDimensions(props.dimensions || {});
  const domain = getDomain(props.data);

  const xScale = d3
    .scaleLinear()
    .domain([0, data[0].length])
    .range([0, dimensions.boundedWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([0, data.length])
    .range([0, dimensions.boundedHeight]);

  const colorScale = d3
    .scaleSequential(d3.interpolateRdBu)
    .domain([domain[0], domain[1]]);

  const elementWidth = dimensions.boundedWidth - xScale(data[0].length - 1);
  const elementHeight = dimensions.boundedHeight - yScale(data.length - 1);

  const xAccessor: MapNumToNum = (i) => xScale(i);
  const yAccessor: MapNumToNum = (j) => yScale(j);
  const widthAccessor: MapNumToNum = () => elementWidth;
  const heightAccessor: MapNumToNum = () => elementHeight;
  const colorAccessor: MapNumToStr = (d) => colorScale(d);

  const xAxisAccessor: MapNumToNum = (i) => xScale(i) + elementWidth / 2;
  const yAxisAccessor: MapNumToNum = (i) => yScale(i) + elementHeight / 2;

  return (
    <div style={{ height: '100%' }} ref={ref}>
      <Chart dimensions={dimensions}>
        <XAxis labels={xLabels} xAccessor={xAxisAccessor} />
        <YAxis labels={yLabels} yAccessor={yAxisAccessor} />
        <Map
          data={props.data}
          xAccessor={xAccessor}
          yAccessor={yAccessor}
          widthAccessor={widthAccessor}
          heightAccessor={heightAccessor}
          colorAccessor={colorAccessor}
        />
      </Chart>
    </div>
  );
}

function getDomain(data: number[][]): [number, number] {
  let globalMin = Infinity;
  let globalMax = -Infinity;
  for (const datum of data) {
    const [min, max] = d3.extent(datum);
    if (min === undefined || max === undefined) {
      throw new Error('cannot work without min or max');
    }
    if (min < globalMin) globalMin = min;
    if (max > globalMax) globalMax = max;
  }
  return [globalMin, globalMax];
}

export default memo(Heatmap);
