import React from 'react';
import { agnes } from 'ml-hclust';

interface IDendrogramProps {
  data: number[][];
}

export default function Dendrogram(props: IDendrogramProps) {
  const clustering = agnes(props.data);
  // const orderedR
  return <div>DENDROGRAM</div>;
}
