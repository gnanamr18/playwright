import "dotenv/config";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { findHardcodedUser } from "./users.js";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Please log in first" });
  }

  try {
    const token = header.slice("Bearer ".length);
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Session expired. Please log in again." });
  }
}

function toPublicUser(user) {
  return {
    id: user.id,
    username: user.username,
    age: user.age,
    address: user.address,
    mobileNumber: user.mobileNumber,
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const valid = findHardcodedUser(username, password);
  if (!valid) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Ensure a DB profile row exists for this username
  const user = await prisma.user.upsert({
    where: { username },
    update: {},
    create: { username },
  });

  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ token, user: toPublicUser(user) });
});

app.get("/api/me", authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user: toPublicUser(user) });
});

app.put("/api/profile", authMiddleware, async (req, res) => {
  const { age, address, mobileNumber } = req.body;

  if (age !== undefined && age !== null && age !== "") {
    const parsedAge = Number(age);
    if (!Number.isInteger(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      return res.status(400).json({ error: "Age must be a whole number between 1 and 120" });
    }
  }

  if (mobileNumber && !/^\d{10}$/.test(String(mobileNumber))) {
    return res.status(400).json({ error: "Mobile number must be exactly 10 digits" });
  }

  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data: {
      age: age === "" || age === null || age === undefined ? null : Number(age),
      address: address?.trim() || null,
      mobileNumber: mobileNumber?.trim() || null,
    },
  });

  res.json({ user: toPublicUser(user), message: "Profile saved" });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
