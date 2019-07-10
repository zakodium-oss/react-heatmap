import React from 'react';
import { storiesOf } from '@storybook/react';

import Heatmap from '../src/index';

const data: number[][] = [];
const xLabels: string[] = [];
const yLabels: string[] = [];
for (let i = 0; i < 10; i++) {
  const datum = [];
  xLabels.push(`X label ${i}`);
  for (let j = -5; j <= 5; j++) {
    datum.push(j + i);
    if (i === 0) {
      yLabels.push(`Y label ${j}`);
    }
  }
  data.push(datum);
}

storiesOf('Welcome', module).add('to Storybook', () => (
  <div style={{ width: 800, height: 600 }}>
    <Heatmap data={data} xLabels={xLabels} yLabels={yLabels} />
  </div>
));
