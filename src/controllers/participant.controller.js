import logger from "../config/logger.js";
import { query as db } from "../db/db.js";
import {
  constructMailBody,
  getMailTemplateById,
  getParticipantById,
  mapEmailTemplateIdToStatus,
  sendMail,
} from "../utils.js";

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
  deleteParticipant: async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: "ID parameter is missing" });
      }
      const participant = await db("SELECT * FROM participants WHERE id = $1", [
        id,
      ]);
      if (!participant) {
        return res.status(404).json({ message: "Participant not found" });
      }
      await db("DELETE FROM participants WHERE id = $1", [id]);
      logger.info(`Participant ${id} deleted`);
      res.status(200).json({ message: `Participant ${id} deleted` });
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
        whatsapp_no,
        alt_phone,
        event,
        event_date,
        event_location,
        collage_name,
        amount_paid,
        transaction_id,
        transaction_screenshot,
      } = req.body;
      const result = await db(
        "INSERT INTO participants (name, email, whatsapp_no, alt_phone, event, event_date, event_location, collage_name, amount_paid, transaction_id, transaction_screenshot) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        [
          name,
          email,
          whatsapp_no,
          alt_phone,
          event,
          event_date,
          event_location,
          collage_name,
          amount_paid,
          transaction_id,
          transaction_screenshot,
        ]
      );
      logger.info(`Participant - ${name[0]} registered`);
      res.status(201).json({
        message: "Participant registered",
        participant: result.rows[0],
      });
    } catch (error) {
      if (error.code === "23505") {
        if (error.constraint === "participants_transaction_id_key") {
          return res.status(409).json({
            message: `Transaction ID - ${transaction_id} already exists`,
          });
        }
        if (error.constraint === "participants_transaction_screenshot_key") {
          return res.status(409).json({
            message: `Transaction screenshot - ${transaction_screenshot} already exists`,
          });
        }
      }
      logger.error(error);
      res.status(500).json({ message: "An unexpected error occurred during registration. Please try again later." });
    }
  },
  // toggle approve status of a participant
  toggleApproveStatus: async (req, res) => {
    try {
      const { id } = req.query;
      const { status } = req.query;
      // get participant
      const participant = await getParticipantById(id);

      if (!participant) {
        logger.error("Participant not found");
        return res.status(404).json({ message: "Participant not found" });
      }
      // get corrospnding mail template approval/rejection
      const mailTemplateId = mapEmailTemplateIdToStatus(status);
      const template = await getMailTemplateById(mailTemplateId);

      if (!template) {
        logger.error("Mail template not found");
        return res.status(404).json({ message: "Mail template not found" });
      }

      // construct mail body by replacing placeholders
      const mailBody = constructMailBody({ participant, template });

      const mailOptions = {
        to: participant.email,
        subject: template.subject,
        content: mailBody,
      };
      // send mail
      const info = await sendMail(mailOptions);

      if (!info) {
        logger.error("Error sending mail");
        return res.status(500).json({ message: "Error sending mail" });
      }

      // update status to approved / rejected
      const result = await db(
        "UPDATE participants SET status = $1 WHERE id = $2 RETURNING *",
        [status, id]
      );
      logger.info(`Participant - ${id} status updated to ${status}`);
      res.status(200).json({
        message: `Participant - ${id} status updated to ${status}`,
        participant: result.rows[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
