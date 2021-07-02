import sharp from 'sharp';
import path from 'path';

// resizes a sharp instance and returns a new sharp instance
async function resize(
  image: sharp.Sharp,
  width: string,
  height: string
): Promise<sharp.Sharp> {
  const meta = await image.metadata();
  const newWidth = parseInt(width) ? parseInt(width) : meta.width;
  const newHeight = parseInt(height) ? parseInt(height) : meta.height;

  console.log(newWidth, newHeight);

  return image.resize(newWidth, newHeight, { fit: sharp.fit.cover });
}

// saves a sharp instance to thumbs cache
function saveToCache(
  img: sharp.Sharp,
  folder: string,
  fileName: string
): Promise<sharp.OutputInfo> {
  return img
    .toFormat('jpeg')
    .toFile(
      path.resolve(__dirname, `../../assets/thumbs/${folder}/${fileName}.jpeg`)
    );
}

export { resize, saveToCache };
