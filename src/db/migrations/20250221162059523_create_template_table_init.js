
import { query as db } from "../db.js";

export default {
  name: "20250221162059523_create_template_table_init.js",
  up: async () => {
    await db({});
    // Write migration logic here
  },
  down: async () => {
    await db();
    // Write rollback logic here
  },
};
