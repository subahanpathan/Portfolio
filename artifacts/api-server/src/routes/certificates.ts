import { Router } from "express";
import { db, certificatesTable, insertCertificateSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const certificates = await db.select().from(certificatesTable);
    return res.json(certificates);
  } catch (err: any) {
    req.log.error(err);
    return res.status(500).json({ message: "Failed to fetch certificates" });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const validated = insertCertificateSchema.parse(req.body);
    const [certificate] = await db.insert(certificatesTable).values(validated).returning();
    return res.json(certificate);
  } catch (err: any) {
    req.log.error(err);
    return res.status(400).json({ message: err.message || "Failed to create certificate" });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const validated = insertCertificateSchema.partial().parse(req.body);
    const [certificate] = await db.update(certificatesTable)
      .set(validated)
      .where(eq(certificatesTable.id, id))
      .returning();
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    return res.json(certificate);
  } catch (err: any) {
    req.log.error(err);
    return res.status(400).json({ message: err.message || "Failed to update certificate" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const [certificate] = await db.delete(certificatesTable)
      .where(eq(certificatesTable.id, id))
      .returning();
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    return res.json({ message: "Certificate deleted" });
  } catch (err: any) {
    req.log.error(err);
    return res.status(500).json({ message: "Failed to delete certificate" });
  }
});

export default router;
