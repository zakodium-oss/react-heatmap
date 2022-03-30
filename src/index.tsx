import * as d3 from 'd3';
import { agnes, AgglomerationMethod, Cluster } from 'ml-hclust';
import { Matrix } from 'ml-matrix';
import React, { memo, ReactElement, useMemo } from 'react';

import Chart from './Chart';
import Legend from './Legend';
import Map from './Map';
import XAxis from './XAxis';
import XDendrogram from './XDendrogram';
import YAxis from './YAxis';
import YDendrogram from './YDendrogram';
import { MapNumToNum } from './types';
import { useChartDimensions, ChartDimensionsConfig } from './utils';

export interface IHeatmapProps {
  data: number[][];
  dimensions?: ChartDimensionsConfig;
  colorScale?: (value: number) => string;
  legend?: boolean;
  legendTitle?: string;
  xClustering?: boolean;
  xClusteringHeight?: number;
  xClusteringMethod?: AgglomerationMethod;
  yClustering?: boolean;
  yClusteringWidth?: number;
  yClusteringMethod?: AgglomerationMethod;
  xLabels?: string[];
  yLabels?: string[];
}

const legendOffset = 80;

export const Heatmap = memo(function Heatmap(
  props: IHeatmapProps,
): ReactElement {
  const {
    xClustering = false,
    xClusteringHeight = 150,
    xClusteringMethod = 'complete',
    yClustering = false,
    yClusteringWidth = 150,
    yClusteringMethod = 'complete',
    colorScale = d3.interpolateYlOrRd,
    legend = false,
  } = props;

  let additionalMarginTop = 0;
  if (legend) {
    additionalMarginTop += legendOffset;
  }
  if (xClustering) {
    additionalMarginTop += xClusteringHeight;
  }

  let additionalMarginLeft = 0;
  if (yClustering) {
    additionalMarginLeft += yClusteringWidth;
  }

  const [ref, dimensions] = useChartDimensions(
    props.dimensions,
    additionalMarginLeft,
    additionalMarginTop,
  );

  const domain = useDomain(props.data);

  const [xHierarchy, xLabels, dataAfterX] = useXClustering(
    xClustering,
    xClusteringMethod,
    props.xLabels,
    props.data,
  );

  const [yHierarchy, yLabels, data] = useYClustering(
    yClustering,
    yClusteringMethod,
    props.yLabels,
    dataAfterX,
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
        {legend && (
          <Legend
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
        {xHierarchy && (
          <XDendrogram hierarchy={xHierarchy} height={xClusteringHeight} />
        )}
        {yHierarchy && (
          <YDendrogram hierarchy={yHierarchy} width={yClusteringWidth} />
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

function useXClustering(
  xClustering: boolean,
  xClusteringMethod: AgglomerationMethod,
  xLabels: string[] | undefined,
  data: number[][],
): [d3.HierarchyNode<Cluster> | null, string[] | undefined, number[][]] {
  return useMemo(() => {
    if (!xClustering) {
      return [null, xLabels, data];
    }

    const transpose = new Matrix(data).transpose().to2DArray();

    const cluster = agnes(transpose, {
      method: xClusteringMethod,
    });
    const d3Hierarchy = d3.hierarchy(cluster);

    const dataCopy = new Matrix(data);
    let yLabelsCopy;
    if (xLabels) {
      yLabelsCopy = xLabels.slice();
    }

    const order = cluster.indices();
    for (let i = 0; i < order.length; i++) {
      if (order[i] !== i) {
        dataCopy.setColumn(i, transpose[order[i]]);
        if (yLabelsCopy && xLabels) {
          yLabelsCopy[i] = xLabels[order[i]];
        }
      }
    }

    return [d3Hierarchy, yLabelsCopy, dataCopy.to2DArray()];
  }, [xClustering, xClusteringMethod, xLabels, data]);
}
