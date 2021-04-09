# @zakodium/react-heatmap
Display beautiful SVG heat maps.

<h3 align="center">

  <a href="https://www.zakodium.com">
    <img src="https://www.zakodium.com/brand/zakodium-logo-white.svg" width="50" alt="Zakodium logo" />
  </a>

  <p>
    Maintained by <a href="https://www.zakodium.com">Zakodium</a>
  </p>

  [![NPM version][npm-image]][npm-url]
  [![npm download][download-image]][download-url]

</h3>

## Installation

`$ npm i @zakodium/react-heatmap`

## Live examples

https://zakodium.github.io/react-heatmap

## Usage

```jsx
import { Heatmap } from '@zakodium/react-heatmap';

function App() {
  return (
    <Heatmap
      dimensions={{ height: 600 }} // Do not specify width and let it be responsive
      data={[[-20, -15, -10], [-5, 0, 5], [10, 15, 20]]}
      xLabels={['Column 1', 'Column 2', 'Column 3']}
    />
  );
}
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/@zakodium/react-heatmap.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@zakodium/react-heatmap
[download-image]: https://img.shields.io/npm/dm/@zakodium/react-heatmap.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/@zakodium/react-heatmap
