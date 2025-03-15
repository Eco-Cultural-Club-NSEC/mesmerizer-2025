import { query as db } from "../db.js";

export default {
  name: "20250214144950383_create_participants_table_init.js",
  up: async () => {
    await db(
      `
      CREATE TABLE IF NOT EXISTS participants (
        id SERIAL PRIMARY KEY,
        name TEXT[] NOT NULL,
        email TEXT NOT NULL,
        whatsapp_no TEXT NOT NULL,
        alt_phone TEXT NOT NULL,
        event TEXT NOT NULL,
        event_date DATE NOT NULL,
        event_location TEXT NOT NULL,
        collage_name TEXT NOT NULL,
        amount_paid INT NOT NULL,
        transaction_id TEXT,
        transaction_screenshot TEXT,
        status TEXT NOT NULL CHECK (status IN ('approved', 'pending', 'rejected')) DEFAULT 'pending',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `
    );
  },
  down: async () => {
    await db(
      `
      DROP TABLE IF EXISTS participants
    `
    );
  },
};
