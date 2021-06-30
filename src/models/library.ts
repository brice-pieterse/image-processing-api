import libraryType from '../types/library';
import path from 'path';
import { promises as fsPromises } from 'fs';

const libraryPath = path.resolve(__dirname, '../../assets/library.json');

const Library = {
  async getLibrary(): Promise<libraryType> {
    let library: libraryType | undefined;
    try {
      library = JSON.parse(await fsPromises.readFile(libraryPath, 'utf-8'));
    } catch (err) {
      console.log(err);
    }
    console.log(libraryPath);
    return library as libraryType;
  },

  async addToLibrary(
    library: libraryType,
    dog: string,
    item: string
  ): Promise<void> {
    library.dogPhotos[dog].push(item);
    await fsPromises.writeFile(libraryPath, JSON.stringify(library));
  }
};

export default Library;
