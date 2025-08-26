import { Handler } from '@netlify/functions';
import { createServer } from '../../server/index';
import serverless from 'serverless-http';

// Create the Express server
const app = createServer();

// Convert Express app to serverless handler
const handler = serverless(app);

export { handler };
