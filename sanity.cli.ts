import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./sanity/env";

/**
 * Команды `sanity` читают переменные из окружения.
 * Задайте их в `.env.local` и перед вызовом CLI экспортируйте в shell или используйте `npx dotenv -e .env.local -- sanity …`
 * (см. README).
 */
export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: "boxing-yugra",
});
