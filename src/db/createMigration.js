import fs from "fs";
import path from "path";

// Get migration name from command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error(
    "❌ Please provide a migration name. Example: npm run migration:create -- --name my_migration"
  );
  process.exit(1);
}

// Extract the migration name
const nameIndex = args.indexOf("--name");
if (nameIndex === -1 || !args[nameIndex + 1]) {
  console.error("❌ Missing migration name. Use --name <migration_name>");
  process.exit(1);
}

const migrationName = args[nameIndex + 1];

// Define migrations directory
const migrationsDir = path.resolve("./src/db/migrations");
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

// Generate timestamped filename
const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
const fileName = `${timestamp}_${migrationName}.js`;
const filePath = path.join(migrationsDir, fileName);

// Define template content
const template = `
import { query as db } from "../db.js";

export default {
  name: "${fileName}",
  up: async () => {
    await db();
    // Write migration logic here
  },
  down: async () => {
    await db();
    // Write rollback logic here
  },
};
`;

// Create migration file
fs.writeFileSync(filePath, template);

console.log(`✅ Migration created: ${filePath}`);
