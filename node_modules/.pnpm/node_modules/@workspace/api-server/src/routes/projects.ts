import { Router } from "express";
import { db, projectsTable, insertProjectSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const projects = await db.select().from(projectsTable);
    return res.json(projects);
  } catch (err: any) {
    req.log.error(err);
    return res.status(500).json({ message: "Failed to fetch projects" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, id)).limit(1);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.json(project);
  } catch (err: any) {
    req.log.error(err);
    return res.status(500).json({ message: "Failed to fetch project" });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const validated = insertProjectSchema.parse(req.body);
    const [project] = await db.insert(projectsTable).values(validated).returning();
    return res.json(project);
  } catch (err: any) {
    req.log.error(err);
    return res.status(400).json({ message: err.message || "Failed to create project" });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const validated = insertProjectSchema.partial().parse(req.body);
    const [project] = await db.update(projectsTable)
      .set(validated)
      .where(eq(projectsTable.id, id))
      .returning();
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.json(project);
  } catch (err: any) {
    req.log.error(err);
    return res.status(400).json({ message: err.message || "Failed to update project" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const [project] = await db.delete(projectsTable)
      .where(eq(projectsTable.id, id))
      .returning();
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.json({ message: "Project deleted" });
  } catch (err: any) {
    req.log.error(err);
    return res.status(500).json({ message: "Failed to delete project" });
  }
});

export default router;
