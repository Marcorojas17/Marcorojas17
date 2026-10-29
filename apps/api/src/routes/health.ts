import { FastifyPluginAsync } from 'fastify';

export const healthRoute: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get('/', async (request, reply) => {
    return { status: 'ok', service: 'SYCRO API', timestamp: new Date().toISOString() };
  });
};
