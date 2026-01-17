import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { schema } from "./schemas";

const DATABASE_NAME = "faca-lista.db";

const expoDb = openDatabaseSync(DATABASE_NAME, {
	enableChangeListener: true,
});

try {
	expoDb.getAllSync("PRAGMA journal_mode = WAL;");
} catch (error) {
	console.warn("WAL mode error:", error);
}

export const db = drizzle(expoDb, { schema });

export { expoDb };
