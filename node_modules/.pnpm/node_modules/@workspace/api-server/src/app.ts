import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import router from "./routes";
import { logger } from "./lib/logger";
import { pool } from "@workspace/db";

const PostgresStore = connectPgSimple(session);
const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

const domains = process.env.REPLIT_DOMAINS ? process.env.REPLIT_DOMAINS.split(",") : [];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || domains.some(domain => origin.endsWith(domain)) || origin.includes("localhost") || origin.includes("127.0.0.1")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new PostgresStore({
      pool,
      tableName: "session",
      createTableIfMissing: false,
    }),
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

declare module "express-session" {
  interface SessionData {
    userId: number;
    role: "admin" | "user";
  }
}

app.use("/api", router);

export default app;
