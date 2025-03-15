import { query as db } from "../db.js";

export default {
  name: "20250314092445295_create_email_template_init.js",
  up: async () => {
    await db(
      `CREATE TABLE IF NOT EXISTS email_templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        subject TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ
      )`
    );
  },
  down: async () => {
    await db(`DROP TABLE IF EXISTS email_templates`);
  },
};
