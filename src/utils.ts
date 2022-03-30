import { useEffect, useMemo, useRef, useState, MutableRefObject } from 'react';

interface IChartUserDimensions {
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  width: number;
  height: number;
}

interface IChartInternalDimensions {
  boundedHeight: number;
  boundedWidth: number;
  additionalMarginLeft: number;
  additionalMarginTop: number;
}

export type ChartDimensionsConfig = Partial<IChartUserDimensions>;

export type ChartDimensions = IChartUserDimensions & IChartInternalDimensions;

function combineChartDimensions(
  config: ChartDimensionsConfig,
  additionalMarginLeft: number,
  additionalMarginTop: number,
): ChartDimensions {
  let parsedDimensions = {
    marginTop: 5,
    marginRight: 5,
    marginBottom: 5,
    marginLeft: 5,
    width: 0,
    height: 0,
    additionalMarginLeft,
    additionalMarginTop,
    ...config,
  };

  parsedDimensions.marginLeft += additionalMarginLeft;
  parsedDimensions.marginTop += additionalMarginTop;

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
  dimensionsConfig: ChartDimensionsConfig | undefined,
  additionalMarginLeft: number,
  additionalMarginTop: number,
): [MutableRefObject<any>, ChartDimensions] {
  const ref = useRef<Element>();
  const dimensions = useMemo(
    () =>
      combineChartDimensions(
        dimensionsConfig || {},
        additionalMarginLeft,
        additionalMarginTop,
      ),
    [dimensionsConfig, additionalMarginLeft, additionalMarginTop],
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
    0,
  );

  return [ref, newSettings];
}
