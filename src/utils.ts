import { useEffect, useMemo, useRef, useState, MutableRefObject } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

interface IChartMargins {
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
}

interface IChartWidthHeight {
  width: number;
  height: number;
}

interface IChartBounds {
  boundedHeight: number;
  boundedWidth: number;
}

export type ChartDimensionsConfig = Partial<IChartMargins> &
  Partial<IChartWidthHeight>;

export type ChartDimensions = IChartMargins & IChartWidthHeight & IChartBounds;

function combineChartDimensions(
  config: ChartDimensionsConfig,
  additionalMarginLeft: number,
): ChartDimensions {
  let parsedDimensions = {
    marginTop: 40,
    marginRight: 30,
    marginBottom: 40,
    marginLeft: 75,
    width: 0,
    height: 0,
    ...config,
  };

  parsedDimensions.marginLeft += additionalMarginLeft;

  return {
    ...parsedDimensions,
    boundedHeight: Math.max(
      (parsedDimensions.height || 0) -
        parsedDimensions.marginTop -
        parsedDimensions.marginBottom,
      0,
    ),
    boundedWidth: Math.max(
      (parsedDimensions.width || 0) -
        parsedDimensions.marginLeft -
        parsedDimensions.marginRight,
      0,
    ),
  };
}

export function useChartDimensions(
  dimensionsConfig: ChartDimensionsConfig = {},
  yClusteringWidth: number = 100,
): [MutableRefObject<any>, ChartDimensions] {
  const ref = useRef<Element>();
  const dimensions = useMemo(
    () => combineChartDimensions(dimensionsConfig, yClusteringWidth),
    [dimensionsConfig, yClusteringWidth],
  );

  const [width, changeWidth] = useState(0);
  const [height, changeHeight] = useState(0);

  useEffect(() => {
    if (dimensions.width && dimensions.height) return undefined;

    const element = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;

      const entry = entries[0];

      if (width !== entry.contentRect.width) {
        changeWidth(entry.contentRect.width);
      }
      if (height !== entry.contentRect.height) {
        changeHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(element as Element);

    return () => resizeObserver.unobserve(element as Element);
  }, [dimensions, height, width]);

  const newSettings = combineChartDimensions(
    {
      ...dimensions,
      width: dimensions.width || width,
      height: dimensions.height || height,
    },
    0,
  );

  return [ref, newSettings];
}
