import { query as db } from "../db/db.js";
import logger from "../config/logger.js";

export const userController = {
  // get all users
  getUsers: async (req, res) => {
    try {
      const users = await db("SELECT * FROM users");
      logger.info("Fetched all users");
      res.status(200).json({ users: users.rows });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: "ID parameter is missing" });
      }
      const user = await db("SELECT * FROM users WHERE id = $1", [id]);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await db("DELETE FROM users WHERE id = $1", [id]);
      logger.info(`User ${id} deleted`);
      res.status(200).json({ message: `User ${id} deleted` });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
