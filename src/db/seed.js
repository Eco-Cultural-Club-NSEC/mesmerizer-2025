import logger from "../config/logger.js";
import { query as db } from "./db.js";
const seedParticipants = async () => {
  try {
    logger.info("Seeding participants...");
    await db(`
        INSERT INTO participants (name, email, whatsapp_no, alt_phone, event, event_date, event_location, collage_name, amount_paid, status)
        VALUES
          ('{"Soham Das"}', 'sohamdas.nest@gmail.com', '1234567890', '0987654321', 'Event 1', '2024-03-01', 'Location 1', 'Collage 1', 1000, 'pending'),
          ('{"Jane Doe"}', 'jane@example.com', '0123456789', '0123456789', 'Event 2', '2024-03-15', 'Location 2', 'Collage 2', 2000, 'approved'),
          ('{"Bob Doe", "Alice Doe", "John Doe"}', 'bob@example.com', '1111111111', '1111111111', 'Event 3', '2024-04-01', 'Location 3', 'Collage 3', 3000, 'rejected')
      `);
    logger.info("Participants seeded successfully");
  } catch (error) {
    logger.error(error);
  }
};

seedParticipants();
