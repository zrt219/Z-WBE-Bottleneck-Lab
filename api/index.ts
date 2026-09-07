import express from 'express';
import cors from 'cors';
import { apiRouter } from '../backend/src/routes';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

app.use('/api', apiRouter);
app.use('/', apiRouter);

export default function handler(req: any, res: any) {
  return app(req, res);
}
