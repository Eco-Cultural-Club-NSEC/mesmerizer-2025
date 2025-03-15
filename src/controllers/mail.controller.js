import logger from "../config/logger.js";
import { query as db } from "../db/db.js";
export const mailController = {
  // get mail templates
  getMailTemplates: async (req, res) => {
    try {
      const mailTemplates = await db("SELECT * FROM email_templates");
      logger.info("Fetched all mail templates");
      res.status(200).json({ templates: mailTemplates.rows });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Error fetching mail templates" });
    }
  },

  // create mail template
  createMailTemplate: async (req, res) => {
    try {
      const { id, name, subject, content } = req.body;
      const result = await db(
        "INSERT INTO email_templates (id, name, subject, content) VALUES ($1, $2, $3, $4) RETURNING *",
        [id, name, subject, content]
      );
      logger.info(`$Mail template - ${name} created`);
      res.status(200).json({
        message: `${name} created`,
        template: result.rows[0],
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Error creating mail template" });
    }
  },

  // save mail template
  updateMailTemplate: async (req, res) => {
    try {
      const { id, name, subject, content } = req.body;
      const result = await db(
        "UPDATE email_templates SET name = $2, subject = $3, content = $4 WHERE id = $1 RETURNING *",
        [id, name, subject, content]
      );
      logger.info("Mail template created/updated");
      res
        .status(200)
        .json({ message: `${name} updated`, template: result.rows[0] });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Error updating mail template" });
    }
  },
};
