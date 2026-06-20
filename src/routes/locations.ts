import { Router, Request, Response } from 'express';
import prisma from '../db';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const locations = await prisma.location.findMany({ orderBy: { name: 'asc' } });
  res.json(locations);
});

// Find-or-create by name so the frontend can create locations inline
router.post('/', async (req: Request, res: Response) => {
  const { name } = req.body as { name?: string };
  if (!name?.trim()) {
    res.status(400).json({ error: 'name is required' });
    return;
  }
  const existing = await prisma.location.findUnique({ where: { name: name.trim() } });
  if (existing) {
    res.json(existing);
    return;
  }
  const location = await prisma.location.create({ data: { name: name.trim() } });
  res.status(201).json(location);
});

export default router;
