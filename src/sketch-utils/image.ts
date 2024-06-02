import p5 from "p5";

export function createP5Image(img: ImageData): p5.Image {
  const pImg = createImage(img.width, img.height);

  pImg.loadPixels();

  for (let i = 0; i < pImg.pixels.length; i++) {
    pImg.pixels[i] = img.data[i];
  }

  pImg.updatePixels();

  return pImg;
}
