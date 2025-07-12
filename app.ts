import express, { Express } from 'express';
import { registerApiRoutes } from './components';
import { registerMiddleware } from './middleware';

// Create a server
const app: Express = express();

registerMiddleware(app);
registerApiRoutes(app, '/api/v1');

export default app; 