import express from "express";
import { connect } from "./database";
import { logger } from "./config/logger";
import { config } from 'dotenv';
config();

const app = express();
const port = process.env.NODE_PORT;

logger.info('Starting up the server');
connect();

app.listen(port, () => {
	// Connect db
	logger.info(`Server started on http://localhost:${port}`);
});