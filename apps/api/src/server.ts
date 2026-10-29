import fastify from 'fastify';
import { healthRoute } from './routes/health.js';

const server = fastify({ logger: true });

// Registrar rutas
server.register(healthRoute, { prefix: '/health' });

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 SYCRO API corriendo en http://localhost:3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
