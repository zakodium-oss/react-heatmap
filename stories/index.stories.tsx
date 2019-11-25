import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, number, select, text } from '@storybook/addon-knobs';
import { Matrix } from 'ml-matrix';
import * as d3 from 'd3';
import { AgglomerationMethod } from 'ml-hclust';
import { getNumbers, getClasses } from 'ml-dataset-iris';

import { Heatmap } from '../src/index';

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

const clusteringMethods: Record<string, AgglomerationMethod> = {
  'Single linkage': 'single',
  'Complete linkage': 'complete',
  'Unweighted average linkage (UPGMA)': 'average',
  'Weighted average linkage (WPGMA)': 'wpgma',
  'Centroid linkage (UPGMC)': 'centroid',
  Ward: 'ward',
  'Ward 2': 'ward2',
};

storiesOf('Heatmap', module)
  .add('Simple example', () => (
    <Heatmap
      dimensions={{ height: 600 }}
      data={[
        [-20, -15, -10],
        [-5, 0, 5],
        [10, 15, 20],
      ]}
      xLabels={['Column 1', 'Column 2', 'Column 3']}
    />
  ))
  .add('Iris dataset with all options', () => {
    const wantLegend = boolean('Show legend', true);
    const legendTitle = text('Legend title', 'Iris values (normalized)');
    const wantXLabels = boolean('Show X labels', true);
    const wantYLabels = boolean('Show Y labels', true);
    return (
      <div style={{ height: number('Height', 1800) }}>
        <Heatmap
          dimensions={{
            marginLeft: number('Left margin', 5),
            marginTop: number('Top margin', 5),
            marginBottom: number('Bottom margin', 100),
            marginRight: number('Right margin', 150),
          }}
          data={irisData}
          colorScale={customColorScale}
          legend={wantLegend}
          legendTitle={legendTitle}
          xClustering={boolean('X clustering', true)}
          xClusteringHeight={number('X clustering height', 150)}
          xClusteringMethod={select(
            'X clustering method',
            clusteringMethods,
            'complete',
          )}
          yClustering={boolean('Y clustering', true)}
          yClusteringWidth={number('Y clustering width', 150)}
          yClusteringMethod={select(
            'Y clustering method',
            clusteringMethods,
            'complete',
          )}
          xLabels={
            wantXLabels
              ? ['sepal length', 'sepal width', 'petal length', 'petal width']
              : undefined
          }
          yLabels={wantYLabels ? classes : undefined}
        />
      </div>
    );
  });
