import * as d3 from 'd3';
import { getNumbers, getClasses } from 'ml-dataset-iris';
import { AgglomerationMethod } from 'ml-hclust';
import { Matrix } from 'ml-matrix';
import React from 'react';

import { Heatmap } from '../src/index';

export default {
  title: 'Heatmap',
};

const irisNumbers = new Matrix(getNumbers()).center('column').scale('column');
const irisData = irisNumbers.to2DArray();
const classes: string[] = getClasses();

const minValue = irisNumbers.min();
const maxValue = irisNumbers.max();
const convertScale = d3.scaleLinear().range([minValue, maxValue]);
const colorScaleNeg = d3
  .scaleSequential(d3.interpolateRdBu)
  .domain([minValue, -minValue]);
const colorScalePos = d3
  .scaleSequential(d3.interpolateRdBu)
  .domain([-maxValue, maxValue]);
function customColorScale(value: number) {
  const converted = convertScale(value);
  return converted < 0 ? colorScaleNeg(converted) : colorScalePos(converted);
}

const clusteringMethods: Array<AgglomerationMethod> = [
  'single',
  'complete',
  'average',
  'wpgma',
  'centroid',
  'ward',
  'ward2',
];

export function Simple() {
  return (
    <Heatmap
      dimensions={{ height: 600 }}
      data={[
        [-20, -15, -10],
        [-5, 0, 5],
        [10, 15, 20],
      ]}
      xLabels={['Column 1', 'Column 2', 'Column 3']}
    />
  );
}

Simple.storyName = 'Simple example';

export function Iris(props: any) {
  return (
    <div style={{ height: props.height }}>
      <Heatmap
        dimensions={{
          marginLeft: props.marginLeft,
          marginTop: props.marginTop,
          marginBottom: props.marginBottom,
          marginRight: props.marginRight,
        }}
        data={irisData}
        colorScale={customColorScale}
        legend={props.legend}
        legendTitle={props.legendTitle}
        xClustering={props.xClustering}
        xClusteringHeight={props.xClusteringHeight}
        xClusteringMethod={props.xClusteringMethod}
        yClustering={props.yClustering}
        yClusteringWidth={props.yClusteringWidth}
        yClusteringMethod={props.yClusteringMethod}
        xLabels={
          props.showXLabels
            ? ['sepal length', 'sepal width', 'petal length', 'petal width']
            : undefined
        }
        yLabels={props.showYLabels ? classes : undefined}
      />
    </div>
  );
}

Iris.storyName = 'Iris dataset with all options';
Iris.args = {
  height: 1800,
  marginLeft: 5,
  marginTop: 5,
  marginRight: 100,
  marginBottom: 150,
  legend: true,
  legendTitle: 'Iris values (normalized)',
  showXLabels: true,
  showYLabels: true,
  xClustering: true,
  xClusteringHeight: 150,
  xClusteringMethod: 'complete',
  yClustering: true,
  yClusteringWidth: 150,
  yClusteringMethod: 'complete',
};
Iris.argTypes = {
  xClusteringMethod: {
    options: clusteringMethods,
    control: { type: 'select' },
  },
  yClusteringMethod: {
    options: clusteringMethods,
    control: { type: 'select' },
  },
};
