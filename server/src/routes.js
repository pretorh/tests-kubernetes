import express from 'express';
import morgan from 'morgan';
import { hostname } from 'os';
import { logger } from './utils/logger.js';

export const app = express();
app.use(morgan('combined'));

function send(res, message) {
  res.send({ host: hostname(), message, date: new Date() });
}

app.get('/', (req, res) => {
  send(res, 'ok');
});

logger.debug('express app set up');
