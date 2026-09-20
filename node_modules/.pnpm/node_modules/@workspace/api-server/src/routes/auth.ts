import { Router } from "express";
import bcrypt from "bcrypt";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Email, password and name are required" });
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const [user] = await db.insert(usersTable).values({
      email,
      passwordHash,
      name,
      role: "user",
    }).returning();

    req.session.userId = user.id;
    req.session.role = user.role as "admin" | "user";

    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  } catch (err: any) {
    req.log.error(err);
    return res.status(400).json({ message: err.message || "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.session.userId = user.id;
    req.session.role = user.role as "admin" | "user";

    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  } catch (err: any) {
    req.log.error(err);
    return res.status(500).json({ message: "Login failed" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      req.log.error(err);
      return res.status(500).json({ message: "Logout failed" });
    }
    return res.json({ message: "Logged out" });
  });
});

router.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId)).limit(1);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  } catch (err: any) {
    req.log.error(err);
    return res.status(500).json({ message: "Failed to fetch user" });
  }
});

export default router;
