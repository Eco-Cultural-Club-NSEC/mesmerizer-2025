import { query as db } from "../db.js";

export default {
  name: "20250214144950383_create_participants_table_init.js",
  up: async () => {
    await db(
    `
      CREATE TABLE IF NOT EXISTS participants (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        event TEXT CHECK (event IN ('event-1', 'event-2')) NOT NULL,
        payment_method TEXT CHECK (payment_method IN ('upi', 'offline')) NOT NULL,
        amount_paid INT NOT NULL,
        transaction_id TEXT,
        transaction_screenshot TEXT,
        status TEXT CHECK (status IN ('approved', 'pending', 'rejected')) DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW()
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
