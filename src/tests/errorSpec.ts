import supertest from 'supertest';
import { app } from '../app';

const request = supertest(app);

describe('error requests', () => {
  it('expects width=big query param to receive response 400', async (done) => {
    const response = await request.get('/dogs?breed=corgi&width=big');
    expect(response.status).toBe(400);
    done();
  });
  it('expects breed=yorkie query param to receive response 400', async (done) => {
    const response = await request.get('/dogs?breed=yorkie');
    expect(response.status).toBe(400);
    done();
  });
});
