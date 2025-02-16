import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { query as db } from "./db.js";
import logger from "../config/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getSortedFilesByCreationTime = async (dir) => {
  try {
    const files = await fs.readdir(dir);
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dir, file);
        const stats = await fs.stat(filePath);
        return { file, filePath, ctime: stats.ctime };
      })
    );

    return fileStats;
  } catch (error) {
    console.error(`Error reading directory: ${error.message}`);
    return [];
  }
};

const importMigrations = async (dir) => {
  try {
    const sortedFiles = await getSortedFilesByCreationTime(dir);
    const migrationModules = await Promise.all(
      sortedFiles.map(async ({ filePath }) => import(filePath))
    );

    return migrationModules; // Array of imported migration objects
  } catch (error) {
    console.error(`Error importing migrations: ${error.message}`);
    return [];
  }
};

// actions based on the command line arguments
(async () => {
  const migrationsDir = path.resolve(__dirname, "migrations");
  let migrations = await importMigrations(migrationsDir);
  migrations = migrations.map((module) => module.default);

  if (process.argv.includes("--rollback") && process.argv.includes("--all")) {
    rollbackMigrations(migrations);
  } else if (process.argv.includes("--rollback")) {
    rollbackLastMigration(migrations);
  } else {
    runMigrations(migrations);
  }
})();

// run all migrations
const runMigrations = async (migrations) => {
  console.log(migrations[0]);

  try {
    // Check if the migrations table exists
    const tableExists = await db(
      `
        SELECT EXISTS (
            SELECT 1
            FROM pg_tables
            WHERE schemaname = 'public'
            AND tablename = 'migrations'
        );
    `
    );

    // If the migrations table does not exist, run the first migration
    if (!tableExists.rows[0].exists) {
      logger.info(`🚀 Running Initial Migration: ${migrations[0].name}`);
      // Create the migrations table
      await migrations[0].up();
      // Save the initial migration to the log
      await db(
        `
        INSERT INTO migrations (name) VALUES ($1);
        `,
        [migrations[0].name]
      );
    }

    for (const migration of migrations) {
      const existingMigration = await db(
        `
                SELECT * FROM migrations WHERE name = $1;
            `,
        [migration.name]
      );

      if (!existingMigration.rowCount) {
        logger.info(`🚀 Running Migration: ${migration.name}`);
        await migration.up();
        // Save migration to log
        await db(
          `
                    INSERT INTO migrations (name) VALUES ($1);
                `,
          [migration.name]
        );
      } else {
        logger.info(
          `✅ Skipping Migration (Already Applied): ${migration.name}`
        );
      }
    }

    logger.info("✅ All migrations applied successfully");
  } catch (error) {
    logger.error(`❌ Error running migrations: ${error.message}`);
  } finally {
    process.exit(0);
  }
};

// rollbacl all migrations
const rollbackMigrations = async (migrations) => {
  try {
    for (let i = migrations.length - 1; i >= 0; i--) {
      const migration = migrations[i];
      const existingMigration = await db(
        `
                SELECT * FROM migrations WHERE name = $1;
            `,
        [migration.name]
      );

      if (existingMigration.rowCount) {
        logger.warn(`🔄 Rolling Back Migration: ${migration.name}`);
        await migration.down();
        // Remove migration from log
        await db(
          `
                    DELETE FROM migrations WHERE name = $1;
                `,
          [migration.name]
        );
      } else {
        logger.info(`⏩ Skipping Rollback (Not Applied): ${migration.name}`);
      }
    }

    logger.info("⏪ Rollback complete");
  } catch (error) {
    logger.error(`❌ Error rolling back migrations: ${error.message}`);
  } finally {
    process.exit(0);
  }
};

// rollback last migration
const rollbackLastMigration = (migrations) => {
  const migration = migrations[migrations.length - 1];
  rollbackMigrations([migration]);
};
