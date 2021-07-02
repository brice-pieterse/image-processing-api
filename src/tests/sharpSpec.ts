import * as sharpUtils from '../utilities/sharp';
import path from 'path';
import sharp from 'sharp';

describe('image processing tests', () => {
  it('expects a resized image to have width 500', async () => {
    const image = sharp(path.resolve(__dirname, '../../assets/full/corgi.jpg'));
    const resizedImage = await sharpUtils.resize(image, '500', '600');
    resizedImage.toBuffer((err, data, info) => {
      expect(info.width).toEqual(500);
    });
  });
});
