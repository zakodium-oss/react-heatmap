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

storiesOf('Welcome', module).add('to Storybook', () => (
  <div style={{ width: 600, height: 1200 }}>
    <Heatmap
      dimensions={{
        marginLeft: 300,
      }}
      data={irisData}
      xLabels={['sepal length', 'sepal width', 'petal length', 'petal width']}
      yLabels={classes}
    />
  </div>
));
