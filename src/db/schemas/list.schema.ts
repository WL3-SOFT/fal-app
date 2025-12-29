import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Tabela de Listas de Compras
 *
 * Armazena listas criadas pelos usuários.
 * Implementa soft delete (deletedAt) conforme Event Sourcing pattern.
 *
 * Relacionamentos:
 * - createdBy → accounts.id (FK)
 * - 1:N com list_products (produtos da lista)
 */
export const listsTable = sqliteTable("lists", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	usedTimes: integer("usedTimes").notNull().default(0),
	isActive: integer("isActive", { mode: "boolean" }).notNull().default(true),
	isPublic: integer("isPublic", { mode: "boolean" }).notNull().default(false),
	canBeShared: integer("canBeShared", { mode: "boolean" })
		.notNull()
		.default(false),
	createdBy: text("createdBy").notNull(),
	createdAt: integer("createdAt", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(strftime('%s', 'now') * 1000)`),
	updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
	deletedAt: integer("deletedAt", { mode: "timestamp_ms" }),
});
