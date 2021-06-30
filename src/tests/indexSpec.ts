import supertest from 'supertest';
import { app } from '../app';

const request = supertest(app);

describe('dog requests', () => {
  it('gets a corgi without supplying width and height', async (done) => {
    const response = await request.get('/dogs?breed=corgi');
    expect(response.status).toBe(200);
    done();
  });

  it('gets a maltese', async (done) => {
    const response = await request.get('/dogs?breed=maltese');
    expect(response.status).toBe(200);
    done();
  });

  it('gets a lab', async (done) => {
    const response = await request.get('/dogs?breed=lab');
    expect(response.status).toBe(200);
    done();
  });

  it('gets a dog after supplying only width', async (done) => {
    const response = await request.get('/dogs?breed=corgi&width=500');
    expect(response.status).toBe(200);
    done();
  });

  it('gets a dog after supplying both width and height', async (done) => {
    const response = await request.get(
      '/dogs?breed=maltese&width=500&height=375'
    );
    expect(response.status).toBe(200);
    done();
  });
});
