import { relations } from "drizzle-orm";
import { accountsTable } from "./account.schema";
import { listsTable } from "./list.schema";
import { listProductsTable } from "./list-product.schema";
import { pricesTable } from "./price.schema";
import { productsTable } from "./product.schema";

// ============================================================================
// RELACIONAMENTOS
// ============================================================================

/**
 * Relacionamento: accounts → lists
 * Uma conta pode criar múltiplas listas (1:N)
 */
export const accountsRelations = relations(accountsTable, ({ many }) => ({
	lists: many(listsTable),
}));

/**
 * Relacionamento: lists → accounts, list_products
 * Uma lista pertence a uma conta e tem múltiplos produtos (N:M via junction)
 */
export const listsRelations = relations(listsTable, ({ one, many }) => ({
	creator: one(accountsTable, {
		fields: [listsTable.createdBy],
		references: [accountsTable.id],
	}),
	listProducts: many(listProductsTable),
}));

/**
 * Relacionamento: products → list_products, prices
 * Um produto pode estar em múltiplas listas e ter múltiplos preços
 */
export const productsRelations = relations(productsTable, ({ many }) => ({
	listProducts: many(listProductsTable),
	prices: many(pricesTable),
}));

/**
 * Relacionamento: list_products (Junction Table N:M)
 * Liga lists ↔ products
 */
export const listProductsRelations = relations(
	listProductsTable,
	({ one }) => ({
		list: one(listsTable, {
			fields: [listProductsTable.listId],
			references: [listsTable.id],
		}),
		product: one(productsTable, {
			fields: [listProductsTable.productId],
			references: [productsTable.id],
		}),
	}),
);

/**
 * Relacionamento: prices → products
 * Um preço pertence a um produto (1:N)
 */
export const pricesRelations = relations(pricesTable, ({ one }) => ({
	product: one(productsTable, {
		fields: [pricesTable.productId],
		references: [productsTable.id],
	}),
}));

export {
	accountsTable,
	listsTable,
	listProductsTable,
	pricesTable,
	productsTable,
};

export const schema = {
	// Tables
	accountsTable,
	listsTable,
	productsTable,
	listProductsTable,
	pricesTable,

	// Relations
	accountsRelations,
	listsRelations,
	productsRelations,
	listProductsRelations,
	pricesRelations,
};
