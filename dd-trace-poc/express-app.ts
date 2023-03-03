import * as compression from 'compression';
import * as dotenv from 'dotenv';
import * as express from 'express';
import helmet from 'helmet';
import * as serverless from 'serverless-http';

import { integrateRoutes } from './routes';

const app = express();

app.use(helmet());
app.use(compression());
dotenv.config();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const router = express.Router({ mergeParams: true });
app.use('/api', router);
integrateRoutes(router);

console.log('DEBUG -->', { date: new Date() });
console.log('DEBUG --> DEPLOYED IN LAMBDA');

let datadogTracingPoc;
if (process.env['LAMBDA_TASK_ROOT']) {
  // Running in AWS Lambda, use serverless-http
  datadogTracingPoc = serverless(app);
} else {
  // Running locally, use app.listen

  const PORT = 8419;

  if (process.argv.includes('--listen')) {
    datadogTracingPoc = app.listen(PORT, () => {
      console.log(`Listening at http://localhost:${PORT}/`);
    });
  }
}

export { datadogTracingPoc };
