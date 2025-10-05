import { seedDatabase } from "../db/seedRunner.js";

seedDatabase().catch((error) => {
  console.error({ error }, "Failed to seed database");
  process.exit(1);
});
