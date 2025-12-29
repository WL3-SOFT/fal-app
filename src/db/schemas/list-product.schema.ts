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
 */
export const listProductsTable = sqliteTable("list_products", {
	id: text("id").primaryKey(),
	listId: text("listId").notNull(),
	productId: text("productId").notNull(),
	quantity: real("quantity").notNull(),
	isPurchased: integer("isPurchased", { mode: "boolean" })
		.notNull()
		.default(false),
	addedAt: integer("addedAt", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(strftime('%s', 'now') * 1000)`),
	purchasedAt: integer("purchasedAt", { mode: "timestamp_ms" }),
	updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
	removedAt: integer("removedAt", { mode: "timestamp_ms" }),
});
