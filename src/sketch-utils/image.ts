import p5 from "p5";

export function createP5Image(p: p5, img: ImageData): p5.Image {
  const pImg = p.createImage(img.width, img.height);

  pImg.loadPixels();

  for (let i = 0; i < pImg.pixels.length; i++) {
    pImg.pixels[i] = img.data[i];
  }

  pImg.updatePixels();

  return pImg;
}
