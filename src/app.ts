import express from 'express';
import dogRoutes from './routes/dogRoutes';

export const app = express();
const port = 3000;

app.use('/dogs', dogRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
