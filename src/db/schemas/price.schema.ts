import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Tabela de Histórico de Preços
 *
 * Preços observados de produtos em diferentes estabelecimentos.
 * Relacionamento 1:N com products.
 *
 * Casos de uso:
 * - Comparação de preços entre estabelecimentos
 * - Histórico temporal de preços
 * - Identificação do melhor preço
 * - Análise de tendências
 *
 */
export const pricesTable = sqliteTable("prices", {
	id: text("id").primaryKey(),
	productId: text("productId").notNull(),
	value: real("value").notNull(),
	storeName: text("storeName").notNull(),
	storeLocation: text("storeLocation"),
	observedAt: integer("observedAt", { mode: "timestamp_ms" }).notNull(),
	createdAt: integer("createdAt", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(strftime('%s', 'now') * 1000)`),
	updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
	deletedAt: integer("deletedAt", { mode: "timestamp_ms" }),
});
