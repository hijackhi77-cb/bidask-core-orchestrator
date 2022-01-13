import express from 'express';
import router from './routes.js';
import Logger from '@bidask/logger';
const logger = new Logger({ name: 'app.js' });
import { PORT } from './constants.js';

const app = express();
app.use(express.json());
app.get('/api', (req, res) => {
  res.json({
    message: 'Hello World'
  });
});
app.use(router);

app.listen(PORT, () => logger.info(`Server started on port ${PORT}!`));
