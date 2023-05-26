import { Server } from 'http';
import { logger } from './utils/logger.js';
import { app } from './routes.js';

logger.info(`starting server in process ${process.pid}`);

const server = new Server(app);

function shutdown() {
  logger.info('starting graceful shutdown');
  const timer = logger.startTimer();

  server.close(() => {
    logger.info('server stopped');

    timer.done({ message: 'graceful shutdown complete' });
    logger.info('bye');
    process.exit(0);
  });
}

if (process.env.VERSION) {
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
  logger.info('graceful shutdown set up');
}

server.listen(8080, () => {
  logger.info('server start on port 8080');
});
