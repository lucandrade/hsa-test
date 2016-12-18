import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import config from './config/app';
import datasource from './config/datasource';
import authorization from './config/auth';

const app = express();
app.config = config;
app.datasource = datasource(app);
const auth = authorization(app);

app.use(auth.initialize());
app.use(bodyParser.json());
app.use(helmet());

app.set('port', app.config.port);

export default app;
