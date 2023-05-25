import express from 'express';
import morgan from 'morgan';
import { hostname } from 'os';
import { logger } from './utils/logger.js';

export const app = express();
app.use(morgan('combined'));

function send(res, message) {
  res.send({ host: hostname(), message, date: new Date(), version: process.env.VERSION });
}

app.get('/', (req, res) => {
  send(res, 'ok');
});

app.get('/slow', (req, res) => {
  const t = req.query.t || 30;
  const msec = +t * 1000;
  logger.info(`starting slow request ${msec}msec`);
  setTimeout(() => {
    send(res, `slow (${msec} delay)`);
  }, msec);
});

logger.debug('express app set up');
