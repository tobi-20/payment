import express, { Request, Response } from 'express';
import './db';
import router from './routes/route';
import { errorMiddleware } from './middleware/middleware';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/api', router);
app.get('/', (_req: Request, res: Response) => {
  res.send('Backend running');
});

app.listen(PORT, () => {
  console.log('Server running on port 3000');
});

app.use(errorMiddleware);

export default app;
