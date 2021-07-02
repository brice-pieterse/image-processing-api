import express from 'express';
import path from 'path';
import sharp from 'sharp';
import libraryType from '../types/library';
import * as sharpUtils from '../utilities/sharp';
import Library from '../models/library';
import { sizeValidator, breedValidator } from '../utilities/validators';

const dogRoutes = express.Router();
const thumbsPath = path.resolve(__dirname, '../../assets/thumbs');
const fullPicsPath = path.resolve(__dirname, '../../assets/full');

let dog: string;
let library: libraryType | undefined;
let libraryQuery: string;
let width: string | undefined;
let height: string | undefined;

// validate width and height are numbers
dogRoutes.use((req, res, next) => {
  width = req.query.width ? (req.query.width as string) : undefined;
  height = req.query.height ? (req.query.height as string) : undefined;
  let validation = true;
  if (width && height) {
    validation = sizeValidator(width as string, height as string);
  } else if (width) {
    validation = sizeValidator(width as string);
  } else if (height) {
    validation = sizeValidator(height as string);
  }
  if (validation) {
    next();
  } else
    res.status(400).send({
      message: 'width and height parameters must be numbers'
    });
});

// validate breeds
dogRoutes.use((req, res, next) => {
  dog = req.query.breed as string;
  if (dog && breedValidator(dog as string)) {
    console.log('good dog');
    next();
  } else {
    console.log('bad dog');
    res.status(400).send({
      message: 'include a breed param of corgi, maltese, or lab'
    });
  }
});

// searches library cache for already made photos
dogRoutes.use(async (req, res, next) => {
  libraryQuery = `${width}x${height}`;
  library = (await Library.getLibrary()) as unknown as libraryType;

  if (
    library !== undefined &&
    library.dogPhotos[dog].includes(`${libraryQuery}.jpeg`)
  ) {
    res
      .header('Content-Type', 'image/jpg')
      .sendFile(path.resolve(thumbsPath, dog, `${libraryQuery}.jpeg`));
  } else {
    next();
  }
});

// else gets from full pics in fs and makes transforms
dogRoutes.use(async (req, res, next) => {
  if (library !== undefined && (height !== undefined || width !== undefined)) {
    const image = sharp(path.resolve(fullPicsPath, `${dog}.jpg`));

    const newImage = await sharpUtils.resize(
      image,
      width as string,
      height as string
    );

    sharpUtils
      .saveToCache(newImage, dog, libraryQuery)
      .then(async () => {
        await Library.addToLibrary(library as libraryType, dog, libraryQuery);
        return;
      })
      .then(() => {
        res
          .header('Content-Type', 'image/jpg')
          .sendFile(path.resolve(thumbsPath, dog, `${libraryQuery}.jpeg`));
      });
  } else next();
});

// width and height not defined, just serve the fullsized image
dogRoutes.use((req, res) => {
  res
    .header('Content-Type', 'image/jpg')
    .sendFile(path.resolve(fullPicsPath, `${dog}.jpg`));
});

export default dogRoutes;
