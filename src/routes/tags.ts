import { Router, Request, Response } from "express";
import { TagStatus } from "@prisma/client";
import prisma from "../db";

const router = Router();

// GET /api/tags
router.get("/", async (_req: Request, res: Response) => {
  const tags = await prisma.tag.findMany({
    include: { location: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(tags);
});

// GET /api/tags/:id
router.get("/:id", async (req: Request, res: Response) => {
  const tag = await prisma.tag.findUnique({
    where: { id: req.params.id },
    include: { location: true, scans: { orderBy: { scannedAt: "desc" }, take: 10 } },
  });
  if (!tag) {
    res.status(404).json({ error: "Tag not found" });
    return;
  }
  res.json(tag);
});

// POST /api/tags
router.post("/", async (req: Request, res: Response) => {
  const { label, status, locationId, lastScanned } = req.body as {
    label?: string;
    status?: TagStatus;
    locationId?: string;
    lastScanned?: string;
  };

  if (!label) {
    res.status(400).json({ error: "label is required" });
    return;
  }

  const tag = await prisma.tag.create({
    data: {
      label,
      status: status ?? TagStatus.ACTIVE,
      locationId: locationId ?? null,
      lastScanned: lastScanned ? new Date(lastScanned) : null,
    },
    include: { location: true },
  });

  res.status(201).json(tag);
});

// PUT /api/tags/:id
router.put("/:id", async (req: Request, res: Response) => {
  const existing = await prisma.tag.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ error: "Tag not found" });
    return;
  }

  const { label, status, locationId, lastScanned } = req.body as {
    label?: string;
    status?: TagStatus;
    locationId?: string | null;
    lastScanned?: string | null;
  };

  const tag = await prisma.tag.update({
    where: { id: req.params.id },
    data: {
      ...(label !== undefined && { label }),
      ...(status !== undefined && { status }),
      ...(locationId !== undefined && { locationId }),
      ...(lastScanned !== undefined && {
        lastScanned: lastScanned ? new Date(lastScanned) : null,
      }),
    },
    include: { location: true },
  });

  res.json(tag);
});

// DELETE /api/tags/:id
router.delete("/:id", async (req: Request, res: Response) => {
  const existing = await prisma.tag.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ error: "Tag not found" });
    return;
  }

  await prisma.tag.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// POST /api/tags/:id/scan
router.post("/:id/scan", async (req: Request, res: Response) => {
  const tag = await prisma.tag.findUnique({
    where: { id: req.params.id },
  });
  if (!tag) {
    res.status(404).json({ error: "Tag not found" });
    return;
  }

  const now = new Date();

  const scan = await prisma.scan.create({
    data: {
      tagId: tag.id,
      locationId: tag.locationId ?? null,
      scannedAt: now,
    },
  });

  await prisma.tag.update({
    where: { id: tag.id },
    data: { lastScanned: now },
  });

  res.status(201).json(scan);
});


export default router;
