import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import tagsRouter from './routes/tags';
import locationsRouter from './routes/locations';
import prisma from './db';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/tags', tagsRouter);
app.use('/api/locations', locationsRouter);

async function main() {
  await prisma.$connect();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
