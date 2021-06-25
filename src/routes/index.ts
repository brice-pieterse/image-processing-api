import express from 'express';
import { promises as fsPromises } from 'fs';
import path from 'path';
import sharp from 'sharp';
import libraryType from '../types/library';

const apiRoutes = express.Router();
const libraryPath = path.resolve(__dirname, '../../assets/library.json');
const thumbsPath = path.resolve(__dirname, '../../assets/thumbs');
const fullPicsPath = path.resolve(__dirname, '../../assets/full');

apiRoutes.use('/dogs', async (req, res) => {
  const dog = req.query.breed as string;
  const width = req.query.width;
  const height = req.query.height;
  const libraryQuery = `${width}x${height}`;

  let library: libraryType | undefined;

  // check in library.json if image and corresponding width/height exists
  try {
    library = JSON.parse(await fsPromises.readFile(libraryPath, 'utf-8'));
  } catch (err) {
    console.log(err);
  }

  console.log(dog)
  console.log(library)
  // search library for already made photos
  if (library !== undefined && library.dogPhotos[dog].includes(`${libraryQuery}.jpeg`)) {
    console.log('already generated, getting from thumbs');
    res.sendFile(path.resolve(thumbsPath, dog, `${libraryQuery}.jpeg`));
  }
  // else get from full pics in fs and make transforms
  else if (
    library !== undefined &&
    height !== undefined &&
    width !== undefined
  ) {
    console.log('generating a new thumb');

    sharp(path.resolve(fullPicsPath, `${dog}.jpg`))
      .resize({
        width: parseInt(width as string),
        height: parseInt(height as string),
        fit: sharp.fit.cover
      })
      .toFormat('jpeg')
      // save to new file in thumbs and adds to library.json for future queries
      .toFile(
        path.resolve(
          __dirname,
          `../../assets/thumbs/${dog}/${libraryQuery}.jpeg`
        )
      )
      .then(async () => {
        (library as libraryType).dogPhotos[dog].push(`${libraryQuery}.jpeg`);
        console.log('new library', library);
        await fsPromises.writeFile(libraryPath, JSON.stringify(library));
        return;
      })
      .then(() => {
        console.log('saved new thumb, now sending file');
        res.sendFile(path.resolve(thumbsPath, dog, `${libraryQuery}.jpeg`));
      });
  } else {
    // width and height not defined, just serve the fullsized image
    res.sendFile(path.resolve(fullPicsPath, `${dog}.jpg`));
  }
});

export default apiRoutes;
