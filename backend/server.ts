import app from "./src/app.js";
import { config } from "./src/config/config.js";
import { connectToDatabase } from "./src/config/database.js";

const startServer = async () => {
  await connectToDatabase();
  app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
  });
};

startServer().catch((error: unknown) => {
  console.error("Failed to start server:", error);
  process.exitCode = 1;
});
