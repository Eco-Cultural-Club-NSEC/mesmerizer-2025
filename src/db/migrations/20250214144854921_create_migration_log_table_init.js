import { query as db } from "../db.js";

export default {
  name: "20250214144854921_create_migration_log_table_init.js",
  up: async () => {
    await db(
      `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
    );
    console.log("✅ Migration Log Table Created");
  },
  down: async () => {
    await db(
      `
      DROP TABLE IF EXISTS migrations
    `
    );
    console.log("✅ Migration Log Table Dropped");
  },
};
