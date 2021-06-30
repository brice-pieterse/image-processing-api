import express from 'express';
import path from 'path';
import sharp from 'sharp';
import libraryType from '../types/library';

import Library from '../models/library';

const dogRoutes = express.Router();
const thumbsPath = path.resolve(__dirname, '../../assets/thumbs');
const fullPicsPath = path.resolve(__dirname, '../../assets/full');

dogRoutes.use(async (req, res) => {
  const dog = req.query.breed as string;
  const width = req.query.width ? req.query.width : undefined;
  const height = req.query.height ? req.query.height : undefined;
  const libraryQuery = `${width}x${height}`;

  const library: libraryType | undefined =
    (await Library.getLibrary()) as unknown as libraryType;

  // searches library cache for already made photos
  if (
    library !== undefined &&
    library.dogPhotos[dog].includes(`${libraryQuery}.jpeg`)
  ) {
    res
      .header('Content-Type', 'image/jpg')
      .sendFile(path.resolve(thumbsPath, dog, `${libraryQuery}.jpeg`));
  }

  // else gets from full pics in fs and makes transforms
  else if (
    library !== undefined &&
    (height !== undefined || width !== undefined)
  ) {
    const image = sharp(path.resolve(fullPicsPath, `${dog}.jpg`));

    image.metadata().then((meta) => {
      const h = height !== undefined ? parseInt(height as string) : meta.height;

      const w = width !== undefined ? parseInt(width as string) : meta.width;

      let sharpInstance: sharp.Sharp;

      if (width && height) {
        sharpInstance = image.resize({
          width: w,
          height: h,
          fit: sharp.fit.cover
        });
      } else if (width) {
        sharpInstance = image.resize({
          width: w,
          fit: sharp.fit.cover
        });
      } else {
        sharpInstance = image.resize({
          height: h,
          fit: sharp.fit.cover
        });
      }

      sharpInstance
        .toFormat('jpeg')
        // saves the newly created file to thumbs cache
        .toFile(
          path.resolve(
            __dirname,
            `../../assets/thumbs/${dog}/${libraryQuery}.jpeg`
          )
        )
        // documents the newly created thumb in library
        .then(async () => {
          await Library.addToLibrary(library, dog, libraryQuery);
          return;
        })
        .then(() => {
          res
            .header('Content-Type', 'image/jpg')
            .sendFile(path.resolve(thumbsPath, dog, `${libraryQuery}.jpeg`));
        });
    });
  }

  // width and height not defined, just serve the fullsized image
  else {
    res
      .header('Content-Type', 'image/jpg')
      .sendFile(path.resolve(fullPicsPath, `${dog}.jpg`));
  }
});

export default dogRoutes;
