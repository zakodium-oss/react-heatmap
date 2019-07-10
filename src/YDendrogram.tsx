import React from 'react';
import * as d3 from 'd3';
import { Cluster } from 'ml-hclust';

import { useContextDimensions } from './Chart';

interface IYDendrogramProps {
  hierarchy: d3.HierarchyNode<Cluster>;
}

export default function YDendrogram(props: IYDendrogramProps) {
  const dimensions = useContextDimensions();
  const cluster = d3
    .cluster()
    .size([dimensions.boundedHeight, dimensions.marginLeft])(props.hierarchy);

  // TODO: add a linear scale to make a phylogram.

  const lines: any[] = [];
  cluster.eachAfter((node) => {
    if (node.parent) {
      lines.push(
        <line
          x1={node.y}
          x2={node.parent.y}
          y1={node.x}
          y2={node.x}
          stroke="black"
        />,
      );
    }
    if (node.children) {
      lines.push(
        <line
          x1={node.y}
          x2={node.y}
          y1={node.children[0].x}
          y2={node.children[node.children.length - 1].x}
          stroke="black"
        />,
      );
    }
  });
  return <g transform={`translate(-${dimensions.marginLeft}, 0)`}>{lines}</g>;
}
