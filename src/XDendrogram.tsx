import React from 'react';
import * as d3 from 'd3';
import { Cluster } from 'ml-hclust';

import { useContextDimensions } from './Chart';

interface IXDendrogramProps {
  hierarchy: d3.HierarchyNode<Cluster>;
  height: number;
}

export default function XDendrogram(props: IXDendrogramProps) {
  const dimensions = useContextDimensions();
  const cluster = d3
    .cluster<Cluster>()
    .size([dimensions.boundedWidth, props.height])
    .separation(() => 1)(props.hierarchy);

  const scaleY = d3
    .scaleLinear()
    .domain([cluster.data.height, 0])
    .range([0, props.height - 5]);

  const lines: JSX.Element[] = [];
  let key = 0;
  cluster.eachAfter((node) => {
    if (node.parent) {
      lines.push(
        <line
          key={key++}
          y1={scaleY(node.data.height)}
          y2={scaleY(node.parent.data.height)}
          x1={node.x}
          x2={node.x}
          stroke="black"
        />,
      );
    }
    if (node.children) {
      lines.push(
        <line
          key={key++}
          y1={scaleY(node.data.height)}
          y2={scaleY(node.data.height)}
          x1={node.children[0].x}
          x2={node.children[node.children.length - 1].x}
          stroke="black"
        />,
      );
    }
  });
  return <g transform={`translate(0, -${props.height})`}>{lines}</g>;
}
