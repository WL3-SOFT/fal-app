import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Tabela de Produtos nas Listas (N:M Junction Table)
 *
 * Implementa a relação Muitos-para-Muitos entre listas e produtos.
 * Um produto pode estar em múltiplas listas com quantidades diferentes.
 * Cada lista pode ter o mesmo produto apenas uma vez (UNIQUE constraint).
 *
 * Relacionamentos:
 * - listId → lists.id (FK)
 * - productId → products.id (FK)
 *
 * Eventos relacionados:
 * - v1.list.product.added
 * - v1.list.product.removed
 * - v1.list.product.updated
 * - v1.list.product.marked.as.purchased
 */
export const listProductsTable = sqliteTable("list_products", {
	// Primary Key - UUID
	id: text("id").primaryKey(),

	// Foreign Keys
	listId: text("listId").notNull(), // FK para lists.id
	productId: text("productId").notNull(), // FK para products.id

	// Informações específicas da lista
	quantity: real("quantity").notNull(), // Quantidade do produto nesta lista
	isPurchased: integer("isPurchased", { mode: "boolean" })
		.notNull()
		.default(false),

	// Timestamps
	addedAt: integer("addedAt", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(strftime('%s', 'now') * 1000)`), // Quando foi adicionado
	purchasedAt: integer("purchasedAt", { mode: "timestamp_ms" }), // Quando foi marcado como comprado
	updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
	removedAt: integer("removedAt", { mode: "timestamp_ms" }), // Soft delete
});
