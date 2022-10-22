import { createServer, Server as HttpServer } from 'http';

// User Defines Libs
import { connect, disconnect } from "./database";
import { logger } from "./src/config/logger";
import { config } from 'dotenv';
import { Server } from './src/server';


logger.info('Starting');
// Start up
(async function main() {
   try
   {
      // env Configurations
      logger.info('Grabbing environmental variables');
      config();

      logger.info('Starting up the server');
      connect();   
      
      // Init express server
      const app: Express.Application = new Server().app;
      const server: HttpServer = createServer(app);

      // Start express server
      server.listen(process.env.NODE_PORT);
      

      server.on('listening', () => {
         logger.info(`node server is listening on port http://localhost:${process.env.NODE_PORT} in ${process.env.NODE_ENV} mode`);
      });

      server.on('close', () => {
         disconnect();
         logger.info('node server closed');
      });
   }
   catch (err) 
   {
      logger.error(err.stack);
   }
})();

