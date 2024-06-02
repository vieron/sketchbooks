export type FontAttributes = {
  fontName: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: string;
};

export function measureTextBounds(
  context: CanvasRenderingContext2D,
  {
    fontName,
    fontSize,
    fontWeight,
    textSample,
    letterSpacing,
  }: {
    textSample: string;
  } & FontAttributes
) {
  context.letterSpacing = letterSpacing;
  context.font = `${fontWeight} ${fontSize}px ${fontName}, sans-serif`;

  const measure = context.measureText(textSample);
  const width = measure.width;
  const height =
    Math.abs(measure.actualBoundingBoxAscent) +
    Math.abs(measure.actualBoundingBoxDescent);

  return {
    width,
    height,
  };
}

export function getFontSizeToFit({
  textSample,
  width,
  height,
  ...fontAttributes
}: {
  textSample: string;
  width: number;
  height: number;
} & Omit<FontAttributes, "fontSize">) {
  const context = document.createElement("canvas").getContext("2d")!;

  const textBounds = measureTextBounds(context, {
    textSample,
    ...fontAttributes,
    fontSize: 1,
  });

  const fontSize = Math.min(
    width / textBounds.width,
    height / textBounds.height
  );

  return fontSize;
}

type Options = {
  textSample: string;
  measureText?: string;
} & FontAttributes;

export function createTextImage({
  textSample,
  fontName,
  fontSize,
  fontWeight,
  letterSpacing,
}: Options): ImageData {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;

  canvas.width = 2000;
  canvas.height = 2000;

  // see https://modernfontstacks.com/
  context.font = `${fontWeight} ${fontSize}px ${fontName}, sans-serif`;
  context.letterSpacing = letterSpacing;

  context.fillStyle = "black";
  context.textAlign = "left";
  context.textBaseline = "top";

  context.fillText(textSample, 0, 0);

  const textBounds = measureTextBounds(context, {
    textSample,
    fontSize,
    fontName,
    fontWeight,
    letterSpacing,
  });

  // debug
  // document.body.appendChild(canvas);
  // canvas.style.zIndex = "9999";
  // canvas.style.position = "absolute";
  // canvas.style.top = "0";
  // canvas.style.top = "0";

  const imageData = context.getImageData(
    0,
    0,
    textBounds.width,
    textBounds.height
  );

  return imageData;
}
