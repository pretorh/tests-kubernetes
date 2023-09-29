import express from 'express';
import morgan from 'morgan';
import { hostname } from 'os';
import { logger } from './utils/logger.js';

export const app = express();
app.use(morgan('combined'));
let responsesEnabled = true;

function send(res, message) {
  if (!responsesEnabled) {
    logger.warn('responsesEnabled is false, not returning anything');
    return;
  }
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

app.post('/crash', (req, res) => {
  const t = req.query.t || 2;
  const msec = +t * 1000;
  logger.info(`setting up a crash after ${msec}ms`);

  res.status(201);
  send(res, `crash setup (${msec} delay)`);

  setTimeout(() => {
    logger.warn('crashing on purpose');
    throw new Error('crashing after "/crash" route');
  }, msec);
});

app.post('/stop', (req, res) => {
  res.status(201);
  send(res, 'setup responsesEnabled=false, no more responses will be returned');
  responsesEnabled = false;
});

logger.debug('express app set up');
