// biome-ignore lint/correctness/noUndeclaredDependencies: Arquivo de configuração
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "sqlite",
	driver: "expo",
	schema: "./src/db/schemas/*.schema.ts",
	out: "./drizzle",
});
