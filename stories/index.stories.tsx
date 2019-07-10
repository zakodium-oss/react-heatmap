import React from 'react';
import { storiesOf } from '@storybook/react';
import { Matrix } from 'ml-matrix';
// @ts-ignore
import { getNumbers, getClasses } from 'ml-dataset-iris';

import Heatmap from '../src/index';

const irisData = new Matrix(getNumbers())
  // .transpose()
  .center('column')
  .scale('column')
  .to2DArray();
const classes: string[] = getClasses();

storiesOf('Heatmap', module).add('With labels and y clustering', () => (
  <div style={{ width: 800, height: 1500 }}>
    <Heatmap
      dimensions={{ marginBottom: 100 }}
      data={irisData}
      yClustering
      yClusteringWidth={300}
      xLabels={['sepal length', 'sepal width', 'petal length', 'petal width']}
      yLabels={classes}
    />
  </div>
));
