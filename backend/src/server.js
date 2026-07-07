import { app } from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => {
  console.log(`HireBridge API running on http://localhost:${env.PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${env.PORT} is already in use. Stop the existing backend server or run: npm run free-port`);
    process.exit(1);
  }

  throw error;
});
