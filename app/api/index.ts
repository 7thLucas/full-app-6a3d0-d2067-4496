// Import global routes
import routes from "./routes";
import { initializeModels } from "./models";
// Initialize HSK models
import "~/hsk/api/hsk-word.model";
import "~/hsk/api/user-progress.model";

// Initialize models
await initializeModels();

// Run HSK seed (idempotent)
import { seedHskWords } from "~/hsk/api/hsk.seed";
await seedHskWords().catch(() => {});

export default routes;
