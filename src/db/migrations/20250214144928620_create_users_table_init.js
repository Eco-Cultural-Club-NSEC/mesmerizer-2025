
import { query as db } from "../db.js";

export default {
  name: "20250214144928620_create_users_table_init.js",
  up: async () => {
    await db(
      `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
    );
  },
  down: async () => {
    await db(
      `
      DROP TABLE IF EXISTS users
    `
    );
  },
};
