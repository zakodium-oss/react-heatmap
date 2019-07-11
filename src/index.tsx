import React, { memo, ReactElement } from 'react';
import * as d3 from 'd3';
import { agnes } from 'ml-hclust';
import { Matrix } from 'ml-matrix';

import { useChartDimensions, ChartDimensionsConfig } from './utils';
import Chart from './Chart';
import Map from './Map';
import { MapNumToNum, MapNumToStr } from './types';
import XAxis from './XAxis';
import YAxis from './YAxis';
import YDendrogram from './YDendrogram';

interface IHeatmapProps {
  data: number[][];
  yClustering?: boolean;
  yClusteringWidth?: number;
  xLabels?: string[];
  yLabels?: string[];
  dimensions?: ChartDimensionsConfig;
}

function Heatmap(props: IHeatmapProps): ReactElement {
  const { xLabels, yClustering, yClusteringWidth } = props;
  let { data, yLabels } = props;
  const [ref, dimensions] = useChartDimensions(
    props.dimensions,
    yClustering ? yClusteringWidth : 0,
  );

  const domain = getDomain(data);

  let hierarchy = null;
  if (yClustering) {
    const cluster = agnes(data, { method: 'ward' });
    hierarchy = d3.hierarchy(cluster);

    // @ts-ignore
    const order = cluster.index.map((leaf) => leaf.index).reverse();
    const dataCopy = new Matrix(data);
    if (yLabels) {
      yLabels = yLabels.slice();
    }
    for (let i = 0; i < order.length; i++) {
      if (order[i] !== i) {
        dataCopy.swapRows(i, order[i]);
        if (yLabels) {
          let label1 = yLabels[i];
          yLabels[i] = yLabels[order[i]];
          yLabels[order[i]] = label1;
        }
      }
    }
    data = dataCopy.to2DArray();
  }

  const xScale = d3
    .scaleLinear()
    .domain([0, data[0].length])
    .range([0, dimensions.boundedWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([0, data.length])
    .range([0, dimensions.boundedHeight]);

  const colorScalePos = d3
    .scaleSequential(d3.interpolateRdBu)
    .domain([domain[1], -domain[1]]);
  const colorScaleNeg = d3
    .scaleSequential(d3.interpolateRdBu)
    .domain([-domain[0], domain[0]]);

  const elementWidth = dimensions.boundedWidth - xScale(data[0].length - 1);
  const elementHeight = dimensions.boundedHeight - yScale(data.length - 1);

  const xAccessor: MapNumToNum = (i) => xScale(i);
  const yAccessor: MapNumToNum = (j) => yScale(j);
  const widthAccessor: MapNumToNum = () => elementWidth;
  const heightAccessor: MapNumToNum = () => elementHeight;
  const colorAccessor: MapNumToStr = (d) =>
    d > 0 ? colorScalePos(d) : colorScaleNeg(d);

  const xAxisAccessor: MapNumToNum = (i) => xScale(i) + elementWidth / 2;
  const yAxisAccessor: MapNumToNum = (i) => yScale(i) + elementHeight / 2;

  return (
    <div style={{ height: '100%' }} ref={ref}>
      <Chart dimensions={dimensions}>
        {hierarchy && <YDendrogram hierarchy={hierarchy} />}
        {xLabels && <XAxis labels={xLabels} xAccessor={xAxisAccessor} />}
        {yLabels && <YAxis labels={yLabels} yAccessor={yAxisAccessor} />}
        <Map
          data={data}
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
