import { registrationReceivedMailTemplate } from "../../assets/mailTemplate.js";
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
      await db("BEGIN"); // Start a transaction
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
        "INSERT INTO participants (name, email, whatsapp_no, alt_phone, event, event_date, event_location, collage_name, amount_paid, transaction_id, transaction_screenshot) VALUES ($1, $2, $3, $4, $5, to_date($6, 'DD-MM-YYYY'), $7, $8, $9, $10, $11) RETURNING *",
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

      // // Send email asynchronously in the background: creating issues in deployed environment (vercel)
      // setImmediate(async () => {
      //   try {
      //     const template = registrationReceivedMailTemplate(result.rows[0]);
      //     await sendMail({
      //       to: email,
      //       subject: template.subject,
      //       content: template.content,
      //     });
      //     logger.info(`Registration email sent to ${email}`);
      //   } catch (emailError) {
      //     logger.error(
      //       `Failed to send registration email to ${email}: ${emailError.message}`
      //     );
      //   }
      // });

      // Send email before committing DB transaction
      try {
        const template = registrationReceivedMailTemplate(result.rows[0]);
        await sendMail({
          to: email,
          subject: template.subject,
          content: template.content,
        });
        logger.info(`Registration email sent to ${email}`);
      } catch (emailError) {
        logger.error(
          `Failed to send registration email to ${email}: ${emailError.message}`
        );
        await db("ROLLBACK"); // Rollback if email fails
        return res
          .status(500)
          .json({ message: "Failed to send email. Registration aborted." });
      }

      // Commit the transaction
      await db("COMMIT");

      // Log registration after successful response
      logger.info(`Participant - ${name} registered`);

      res.status(201).json({
        message: "Participant registered",
        participant: result.rows[0],
      });
    } catch (error) {
      await db("ROLLBACK");
      if (error.code === "23505") {
        const { constraint, detail } = error;
        const match = detail.match(/\(([^)]+)\)=\(([^)]+)\)/);

        if (match) {
          const [_, key, value] = match;

          if (key === "transaction_id") {
            return res.status(409).json({
              message: `Transaction ID - ${value} already exists`,
            });
          }

          if (key === "transaction_screenshot") {
            return res.status(409).json({
              message: `Transaction screenshot - ${value} already exists`,
            });
          }
        }
      }
      logger.error(error);
      res.status(500).json({
        message:
          "An unexpected error occurred during registration. Please try again later.",
      });
    }
  },
  // toggle approve status of a participant
  toggleApproveStatus: async (req, res) => {
    try {
      const { id, status } = req.query;

      if (!id || !status) {
        return res
          .status(400)
          .json({ message: "Missing required parameters: id or status" });
      }

      const participant = await getParticipantById(id);
      if (!participant) {
        logger.error("Participant not found");
        return res.status(404).json({ message: "Participant not found" });
      }

      const mailTemplateId = mapEmailTemplateIdToStatus(status);
      const template = await getMailTemplateById(mailTemplateId);
      if (!template) {
        logger.error("Mail template not found");
        return res.status(404).json({ message: "Mail template not found" });
      }

      const mailBody = constructMailBody({ participant, template });

      try {
        await db("BEGIN");

        const result = await db(
          "UPDATE participants SET status = $1 WHERE id = $2 RETURNING *",
          [status, id]
        );

        if (!result.rows[0]) {
          throw new Error("Failed to update participant status");
        }

        // Send email synchronously before committing transaction
        try {
          await sendMail({
            to: participant.email,
            subject: template.subject,
            content: mailBody,
          });

          logger.info(`Approval/rejection email sent to ${participant.email}`);
        } catch (emailError) {
          await db("ROLLBACK"); // Rollback DB update if email fails
          logger.error(`Failed to send mail: ${emailError.message}`);
          return res.status(500).json({
            message: "Failed to send email. Approval status update aborted.",
          });
        }

        await db("COMMIT");
        logger.info(`Participant - ${id} status updated to ${status}`);

        return res.status(200).json({
          message: `Participant - ${id} status updated to ${status}`,
          participant: result.rows[0],
        });
      } catch (error) {
        await db("ROLLBACK");
        logger.error(error.message);
        return res
          .status(500)
          .json({ message: "Error updating participant status" });
      }
    } catch (error) {
      logger.error(error.stack || error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
