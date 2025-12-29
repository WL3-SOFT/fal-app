import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Tabela de Contas de Usuário
 *
 * Armazena informações de autenticação e configuração de contas.
 * Relacionamento 1:1 com users (owner).
 *
 */
export const accountsTable = sqliteTable("accounts", {
	id: text("id").primaryKey(),
	email: text("email").notNull().unique(),
	hash: text("hash").notNull(),
	owner: text("owner").notNull().unique(),
	type: text("type", { enum: ["personal", "professional"] })
		.notNull()
		.default("personal"),
	systemRole: text("systemRole", { enum: ["admin", "user"] })
		.notNull()
		.default("user"),
	isActive: integer("isActive", { mode: "boolean" }).notNull().default(true),
	isBanned: integer("isBanned", { mode: "boolean" }).notNull().default(false),
	createdAt: integer("createdAt", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(strftime('%s', 'now') * 1000)`),
	updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
	deletedAt: integer("deletedAt", { mode: "timestamp_ms" }),
});
