import express from 'express';
import morgan from 'morgan';
import { logger } from './utils/logger.js';

export const app = express();
app.use(morgan('combined'));

app.use('/', (req, res) => {
  res.send('ok');
});

logger.debug('express app set up');
