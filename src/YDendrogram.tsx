import React from 'react';
import * as d3 from 'd3';
import { Cluster } from 'ml-hclust';

import { useContextDimensions } from './Chart';

interface IYDendrogramProps {
  hierarchy: d3.HierarchyNode<Cluster>;
  width: number;
}

export default function YDendrogram(props: IYDendrogramProps) {
  const dimensions = useContextDimensions();
  const cluster = d3
    .cluster<Cluster>()
    .size([dimensions.boundedHeight, props.width])
    .separation(() => 1)(props.hierarchy);

  const scaleX = d3
    .scaleLinear()
    .domain([cluster.data.height, 0])
    .range([0, props.width - 5]);

  const lines: JSX.Element[] = [];
  let key = 0;
  cluster.eachAfter((node) => {
    if (node.parent) {
      lines.push(
        <line
          key={key++}
          x1={scaleX(node.data.height)}
          x2={scaleX(node.parent.data.height)}
          y1={node.x}
          y2={node.x}
          stroke="black"
        />,
      );
    }
    if (node.children) {
      lines.push(
        <line
          key={key++}
          x1={scaleX(node.data.height)}
          x2={scaleX(node.data.height)}
          y1={node.children[0].x}
          y2={node.children[node.children.length - 1].x}
          stroke="black"
        />,
      );
    }
  });
  return <g transform={`translate(-${props.width}, 0)`}>{lines}</g>;
}
