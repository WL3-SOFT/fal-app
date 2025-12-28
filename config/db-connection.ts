import { drizzle, type ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import * as SqLite from "expo-sqlite";

export class DbConnection {
	private db!: ExpoSQLiteDatabase;

	connect() {
		const expo = SqLite.openDatabaseSync("fal.db");
		this.db = drizzle(expo);
	}

	getConnection() {
		if (!this.db) {
			throw new Error("Database not connected");
		}

		return this.db;
	}
}
