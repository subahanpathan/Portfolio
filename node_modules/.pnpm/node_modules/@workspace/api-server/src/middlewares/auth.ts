import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.session.role !== "admin") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  next();
}
