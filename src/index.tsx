import React, { memo, ReactElement, useMemo } from 'react';
import * as d3 from 'd3';
import { agnes, AgglomerationMethod, Cluster } from 'ml-hclust';
import { Matrix } from 'ml-matrix';

import { useChartDimensions, ChartDimensionsConfig } from './utils';
import Chart from './Chart';
import Map from './Map';
import { MapNumToNum } from './types';
import XAxis from './XAxis';
import YAxis from './YAxis';
import YDendrogram from './YDendrogram';
import Legend from './Legend';

export interface IHeatmapProps {
  data: number[][];
  dimensions?: ChartDimensionsConfig;
  colorScale?: (value: number) => string;
  showLegend?: boolean;
  legendTitle?: string;
  yClustering?: boolean;
  yClusteringWidth?: number;
  yClusteringMethod?: AgglomerationMethod;
  xLabels?: string[];
  yLabels?: string[];
}

const legendOffset = 130;

export const Heatmap = memo(function Heatmap(
  props: IHeatmapProps,
): ReactElement {
  const {
    xLabels,
    yClustering = false,
    yClusteringWidth = 175,
    yClusteringMethod = 'complete',
    colorScale = d3.interpolateYlOrRd,
    showLegend = false,
  } = props;
  const [ref, dimensions] = useChartDimensions(
    props.dimensions,
    yClustering ? yClusteringWidth : 0,
    showLegend ? legendOffset : 0,
  );

  const domain = useDomain(props.data);

  const [hierarchy, yLabels, data] = useYClustering(
    yClustering,
    yClusteringMethod,
    props.yLabels,
    props.data,
  );

  const xScale = d3
    .scaleLinear()
    .domain([0, data[0].length])
    .range([0, dimensions.boundedWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([0, data.length])
    .range([0, dimensions.boundedHeight]);

  const colorAccessor = d3.scaleSequential(colorScale).domain(domain);

  const elementWidth = dimensions.boundedWidth - xScale(data[0].length - 1);
  const elementHeight = dimensions.boundedHeight - yScale(data.length - 1);

  const xAxisAccessor: MapNumToNum = (i) => xScale(i) + elementWidth / 2;
  const yAxisAccessor: MapNumToNum = (i) => yScale(i) + elementHeight / 2;

  return (
    <div style={{ height: '100%' }} ref={ref}>
      <Chart dimensions={dimensions}>
        {xLabels && <XAxis labels={xLabels} xAccessor={xAxisAccessor} />}
        {yLabels && <YAxis labels={yLabels} yAccessor={yAxisAccessor} />}
        {showLegend && (
          <Legend
            offset={legendOffset}
            colorAccessor={colorScale}
            title={props.legendTitle || ''}
            domain={domain}
          />
        )}
        <Map
          data={data}
          xAccessor={xScale}
          yAccessor={yScale}
          elementWidth={elementWidth}
          elementHeight={elementHeight}
          colorAccessor={colorAccessor}
        />
        {hierarchy && (
          <YDendrogram hierarchy={hierarchy} width={yClusteringWidth} />
        )}
      </Chart>
    </div>
  );
});

function useDomain(data: number[][]): [number, number] {
  return useMemo(() => {
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
  }, [data]);
}

function useYClustering(
  yClustering: boolean,
  yClusteringMethod: AgglomerationMethod,
  yLabels: string[] | undefined,
  data: number[][],
): [d3.HierarchyNode<Cluster> | null, string[] | undefined, number[][]] {
  return useMemo(() => {
    if (!yClustering) {
      return [null, yLabels, data];
    }
    const cluster = agnes(data, {
      method: yClusteringMethod,
    });
    const d3Hierarchy = d3.hierarchy(cluster);

    const dataCopy = new Matrix(data);
    let yLabelsCopy;
    if (yLabels) {
      yLabelsCopy = yLabels.slice();
    }

    const order = cluster.indices();
    for (let i = 0; i < order.length; i++) {
      if (order[i] !== i) {
        dataCopy.setRow(i, data[order[i]]);
        if (yLabelsCopy && yLabels) {
          yLabelsCopy[i] = yLabels[order[i]];
        }
      }
    }

    return [d3Hierarchy, yLabelsCopy, dataCopy.to2DArray()];
  }, [yClustering, yClusteringMethod, yLabels, data]);
}
