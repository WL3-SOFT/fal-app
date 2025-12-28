import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Tabela de Produtos (Catálogo Global)
 *
 * Catálogo global de produtos independentes das listas.
 * Um produto pode estar em múltiplas listas através de list_products.
 *
 * Unidades de medida:
 * - kg (Quilograma)
 * - g (Grama)
 * - l (Litro)
 * - ml (Mililitro)
 * - un (Unidade)
 * - pct (Pacote)
 * - cx (Caixa)
 *
 * Eventos relacionados:
 * - v1.product.created
 * - v1.product.updated
 * - v1.product.deleted
 */
export const productsTable = sqliteTable("products", {
	// Primary Key - UUID
	id: text("id").primaryKey(),

	// Informações do produto
	name: text("name").notNull(),
	unit: text("unit", {
		enum: ["kg", "g", "l", "ml", "un", "pct", "cx"],
	})
		.notNull()
		.default("un"),

	// Timestamps
	createdAt: integer("createdAt", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(strftime('%s', 'now') * 1000)`),
	updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
	deletedAt: integer("deletedAt", { mode: "timestamp_ms" }), // Soft delete
});
