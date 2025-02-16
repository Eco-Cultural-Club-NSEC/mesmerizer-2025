import logger from "../config/logger.js";
import { query as db } from "../db/db.js";

export const participantController = {
  // get all participants
  getParticipants: async (req, res) => {
    try {
      const participants = await db("SELECT * FROM participants");
      logger.info("Participants fetched");
      res.status(200).json({ participants: participants.rows });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  // register a participant
  registerParticipant: async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        event,
        payment_method,
        amount_paid,
        transaction_id,
        transaction_screenshot,
      } = req.body;
      const result = await db(
        "INSERT INTO participants (name, email, phone, event, payment_method, amount_paid, transaction_id, transaction_screenshot) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [
          name,
          email,
          phone,
          event,
          payment_method,
          amount_paid,
          transaction_id,
          transaction_screenshot,
        ]
      );
      logger.info(`Participant - ${name} registered`);
      res.status(201).json({ message: "Participant registered", participant: result.rows[0] });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  // toggle approve status of a participant
  toggleApproveStatus: async (req, res) => {
    try {
      const { id } = req.query;
      const { status } = req.query;
      const result = await db(
        "UPDATE participants SET status = $1 WHERE id = $2 RETURNING *",
        [status, id]
      );
      logger.info(`Participant - ${id} status updated to ${status}`);
      res.status(201).json({ message: "Participant status updated", participant: result.rows[0] });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
