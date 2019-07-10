import React from 'react';
import { storiesOf } from '@storybook/react';

import Heatmap from '../src/index';
import Dendrogram from '../src/Dendrogram';

const data: number[][] = [];
const xLabels: string[] = [];
const yLabels: string[] = [];
for (let row = 0; row < 5; row++) {
  const datum = [];
  yLabels.push(`Y label ${row}`);
  for (let column = -5; column <= 5; column++) {
    datum.push(Math.ceil(Math.random() * 10) - 5);
    if (row === 0) {
      xLabels.push(`X label ${column}`);
    }
  }
  data.push(datum);
}

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <div style={{ width: 800, height: 600 }}>
      <Heatmap data={data} xLabels={xLabels} yLabels={yLabels} />
    </div>
  ))
  .add('Dendrogram', () => (
    <div style={{ width: 800, height: 600 }}>
      <Dendrogram data={data} />
    </div>
  ));
