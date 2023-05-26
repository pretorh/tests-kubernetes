import { Server } from 'http';
import { logger } from './utils/logger.js';
import { app } from './routes.js';

logger.info(`starting server in process ${process.pid}`);
const delays = {
  startup: process.env.STARTUP_DELAY || 5000,
  shutdown: process.env.SHUTDOWN_DELAY || 5000,
}

const server = new Server(app);

async function shutdown() {
  logger.info('starting graceful shutdown');
  const timer = logger.startTimer();

  logger.info(`wait ${delays.shutdown}ms before stoppin server (SHUTDOWN_DELAY)`);
  await new Promise((resolve) => setTimeout(resolve, delays.shutdown));

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

function start() {
  server.listen(8080, () => {
    logger.info('server start on port 8080');
  });
}

logger.info(`wait ${delays.startup}ms before starting server (STARTUP_DELAY)`);
setTimeout(start, delays.startup);
