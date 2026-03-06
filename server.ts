import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = "esl_coach.db";

let db: Database.Database;

try {
  db = new Database(DB_PATH);
  // Test the database connection
  db.prepare("SELECT 1").get();
} catch (err: any) {
  if (err.code === 'SQLITE_NOTADB') {
    console.error(`\n❌ DATABASE ERROR: The file "${DB_PATH}" is corrupted or not a valid SQLite database.`);
    console.error(`💡 FIX: Please delete the file "${DB_PATH}" in your project folder and run "npm run dev" again.\n`);
    process.exit(1);
  }
  throw err;
}

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS user_profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    level TEXT,
    goals TEXT,
    priority_skills TEXT,
    daily_commitment INTEGER,
    preferred_dialect TEXT
  );

  CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT,
    text TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY,
    name TEXT,
    score INTEGER,
    total INTEGER,
    level TEXT,
    date TEXT
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/profile", (req, res) => {
    const profile = db.prepare("SELECT * FROM user_profile LIMIT 1").get();
    if (profile) {
      res.json({
        ...profile,
        goals: JSON.parse(profile.goals as string),
        prioritySkills: JSON.parse(profile.priority_skills as string),
      });
    } else {
      res.status(404).json({ error: "Profile not found" });
    }
  });

  app.post("/api/profile", (req, res) => {
    const { name, level, goals, prioritySkills, dailyCommitment, preferredDialect } = req.body;
    db.prepare("DELETE FROM user_profile").run(); // Only one profile for now
    const info = db.prepare(`
      INSERT INTO user_profile (name, level, goals, priority_skills, daily_commitment, preferred_dialect)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, level, JSON.stringify(goals), JSON.stringify(prioritySkills), dailyCommitment, preferredDialect);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/chat", (req, res) => {
    const history = db.prepare("SELECT * FROM chat_history ORDER BY timestamp ASC").all();
    res.json(history);
  });

  app.post("/api/chat", (req, res) => {
    const { role, text } = req.body;
    db.prepare("INSERT INTO chat_history (role, text) VALUES (?, ?)").run(role, text);
    res.json({ success: true });
  });

  app.delete("/api/chat", (req, res) => {
    db.prepare("DELETE FROM chat_history").run();
    res.json({ success: true });
  });

  app.get("/api/certificates/:id", (req, res) => {
    const cert = db.prepare("SELECT * FROM certificates WHERE id = ?").get(req.params.id);
    if (cert) {
      res.json(cert);
    } else {
      res.status(404).json({ error: "Certificate not found" });
    }
  });

  app.post("/api/certificates", (req, res) => {
    const { id, name, score, total, level, date } = req.body;
    db.prepare(`
      INSERT INTO certificates (id, name, score, total, level, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name, score, total, level, date);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log("\n" + "=".repeat(40));
    console.log(`🚀 Mingalar ESL Coach is running!`);
    console.log(`🔗 Local:   http://localhost:${PORT}`);
    console.log(`🔗 Network: http://0.0.0.0:${PORT}`);
    console.log("=".repeat(40) + "\n");
    
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️  WARNING: GEMINI_API_KEY is not set in your environment.");
      console.warn("⚠️  Please create a .env file and add your API key to use the AI features.");
      console.warn("⚠️  Example: GEMINI_API_KEY=your_api_key_here\n");
    }
  });
}

startServer();
