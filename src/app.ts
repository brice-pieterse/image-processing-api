import express from 'express';
import apiRoutes from './routes/index';

const app = express();
const port = 3000;

app.use('/', apiRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
