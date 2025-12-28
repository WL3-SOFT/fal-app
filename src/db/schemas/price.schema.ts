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
 * Eventos relacionados:
 * - v1.price.created
 * - v1.price.updated
 * - v1.price.deleted
 */
export const pricesTable = sqliteTable("prices", {
	// Primary Key - UUID
	id: text("id").primaryKey(),

	// Foreign Key
	productId: text("productId").notNull(), // FK para products.id

	// Informações de preço
	value: real("value").notNull(), // Valor do preço

	// Informações do estabelecimento
	storeName: text("storeName").notNull(),
	// biome-ignore lint/nursery/noSecrets: False positive - this is a location field, not a secret
	storeLocation: text("storeLocation"),

	// Timestamps
	observedAt: integer("observedAt", { mode: "timestamp_ms" }).notNull(), // Quando o preço foi observado
	createdAt: integer("createdAt", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(strftime('%s', 'now') * 1000)`),
	updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
	deletedAt: integer("deletedAt", { mode: "timestamp_ms" }), // Soft delete
});
