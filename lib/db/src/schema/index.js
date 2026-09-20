import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { z } from "zod";
// users table
export const usersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    role: text("role", { enum: ["admin", "user"] }).notNull().default("user"),
    createdAt: timestamp("created_at").defaultNow(),
});
export const insertUserSchema = z.object({
    email: z.string().email(),
    passwordHash: z.string().min(1),
    name: z.string().min(1),
    role: z.enum(["admin", "user"]).optional(),
});
// projects table
export const projectsTable = pgTable("projects", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    shortDesc: text("short_desc").notNull(),
    fullDesc: text("full_desc").notNull(),
    tech: text("tech").array().notNull(),
    category: text("category").notNull(),
    featured: boolean("featured").default(false),
    githubUrl: text("github_url"),
    liveUrl: text("live_url"),
    imageUrl: text("image_url"),
    challenges: text("challenges"),
    outcomes: text("outcomes"),
    createdAt: timestamp("created_at").defaultNow(),
});
export const insertProjectSchema = z.object({
    title: z.string().min(1),
    shortDesc: z.string().min(1),
    fullDesc: z.string().min(1),
    tech: z.array(z.string()),
    category: z.string().min(1),
    featured: z.boolean().optional(),
    githubUrl: z.string().nullable().optional(),
    liveUrl: z.string().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
    challenges: z.string().nullable().optional(),
    outcomes: z.string().nullable().optional(),
});
// certificates table
export const certificatesTable = pgTable("certificates", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    issuer: text("issuer").notNull(),
    date: text("date").notNull(),
    credentialUrl: text("credential_url"),
    category: text("category").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
});
export const insertCertificateSchema = z.object({
    title: z.string().min(1),
    issuer: z.string().min(1),
    date: z.string().min(1),
    category: z.string().min(1),
    credentialUrl: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
});
