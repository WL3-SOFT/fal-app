import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Tabela de Contas de Usuário
 *
 * Armazena informações de autenticação e configuração de contas.
 * Relacionamento 1:1 com users (owner).
 *
 * Eventos relacionados:
 * - v1.account.created
 * - v1.account.recovered
 * - v1.account.deleted
 * - v1.account.banned
 * - v1.account.unblocked
 */
export const accountsTable = sqliteTable("accounts", {
	// Primary Key - UUID
	id: text("id").primaryKey(),

	// Autenticação
	email: text("email").notNull().unique(),
	hash: text("hash").notNull(), // Hash da senha

	// Relacionamento com user
	owner: text("owner").notNull().unique(), // FK para users.id

	// Configuração da conta
	type: text("type", { enum: ["personal", "professional"] })
		.notNull()
		.default("personal"),
	systemRole: text("systemRole", { enum: ["admin", "user"] })
		.notNull()
		.default("user"),

	// Status da conta
	isActive: integer("isActive", { mode: "boolean" }).notNull().default(true),
	isBanned: integer("isBanned", { mode: "boolean" }).notNull().default(false),

	// Timestamps
	createdAt: integer("createdAt", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(strftime('%s', 'now') * 1000)`),
	updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
	deletedAt: integer("deletedAt", { mode: "timestamp_ms" }), // Soft delete
});
