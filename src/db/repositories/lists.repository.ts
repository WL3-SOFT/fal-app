/**
 * Lists Repository - Implementação Drizzle ORM
 *
 * Gerencia operações CRUD de listas seguindo Clean Architecture.
 * Implementa soft delete e queries otimizadas.
 *
 * Padrões implementados:
 * - Soft Delete (deletedAt IS NULL)
 * - Event Sourcing (eventos implícitos via Drizzle)
 * - Type Safety (TypeScript strict mode)
 * - Dependency Inversion (retorna tipos do domínio, não do DB)
 */

import { and, count, desc, eq, isNull, sql } from "drizzle-orm";
import { db } from "../client";
import { listProductsTable, listsTable, productsTable } from "../schemas";
import { markAsDeleted, markAsUpdated } from "../utils/soft-delete";
import { generateUuid } from "../utils/uuid";

// ============================================================================
// TYPES
// ============================================================================

/**
 * Tipo inferido da tabela lists (para INSERTs)
 */
type NewList = typeof listsTable.$inferInsert;

/**
 * Tipo inferido da tabela lists (para SELECTs)
 */
type List = typeof listsTable.$inferSelect;

/**
 * Lista com contagem de produtos
 */
type ListWithProductCount = List & {
	productCount: number;
};

/**
 * Produto na lista com informações completas
 */
type ListProductWithDetails = {
	id: string;
	quantity: number;
	isPurchased: boolean;
	addedAt: Date;
	product: {
		id: string;
		name: string;
		unit: string;
	};
};

// ============================================================================
// REPOSITORY
// ============================================================================

export class ListsRepository {
	/**
	 * Cria uma nova lista
	 *
	 * Gera UUID automaticamente e define valores padrão.
	 * Evento implícito: v1.list.created
	 */
	async create(data: {
		name: string;
		description: string;
		createdBy: string;
		isPublic?: boolean;
		canBeShared?: boolean;
	}): Promise<List> {
		const newList: NewList = {
			id: generateUuid(),
			name: data.name,
			description: data.description,
			createdBy: data.createdBy,
			isPublic: data.isPublic ?? false,
			canBeShared: data.canBeShared ?? false,
			usedTimes: 0,
			isActive: true,
		};

		await db.insert(listsTable).values(newList);

		return newList as List;
	}

	/**
	 * Busca listas ativas de um usuário
	 *
	 * Retorna apenas listas não deletadas, ordenadas por data de criação.
	 * Inclui contagem de produtos em cada lista.
	 */
	async findByUser(userId: string): Promise<ListWithProductCount[]> {
		const result = await db
			.select({
				id: listsTable.id,
				name: listsTable.name,
				description: listsTable.description,
				usedTimes: listsTable.usedTimes,
				isActive: listsTable.isActive,
				isPublic: listsTable.isPublic,
				canBeShared: listsTable.canBeShared,
				createdBy: listsTable.createdBy,
				createdAt: listsTable.createdAt,
				updatedAt: listsTable.updatedAt,
				deletedAt: listsTable.deletedAt,
				productCount: count(listProductsTable.id),
			})
			.from(listsTable)
			.leftJoin(
				listProductsTable,
				and(
					eq(listsTable.id, listProductsTable.listId),
					isNull(listProductsTable.removedAt),
				),
			)
			.where(
				and(
					eq(listsTable.createdBy, userId),
					eq(listsTable.isActive, true),
					isNull(listsTable.deletedAt),
				),
			)
			.groupBy(listsTable.id)
			.orderBy(desc(listsTable.createdAt));

		return result as ListWithProductCount[];
	}

	/**
	 * Busca lista por ID
	 *
	 * Retorna null se a lista não existir ou estiver deletada.
	 */
	async findById(listId: string): Promise<List | null> {
		const result = await db.query.listsTable.findFirst({
			where: and(eq(listsTable.id, listId), isNull(listsTable.deletedAt)),
		});

		return result ?? null;
	}

	/**
	 * Atualiza uma lista
	 *
	 * Evento implícito: v1.list.updated
	 */
	async update(
		listId: string,
		data: Partial<Pick<List, "name" | "description" | "isActive">>,
	): Promise<void> {
		await db
			.update(listsTable)
			.set({
				...data,
				updatedAt: markAsUpdated(),
			})
			.where(eq(listsTable.id, listId));
	}

	/**
	 * Deleta uma lista (soft delete)
	 *
	 * Marca deletedAt com timestamp atual.
	 * Evento implícito: v1.list.deleted
	 */
	async delete(listId: string): Promise<void> {
		await db
			.update(listsTable)
			.set({
				deletedAt: markAsDeleted(),
				updatedAt: markAsUpdated(),
			})
			.where(eq(listsTable.id, listId));
	}

	/**
	 * Incrementa contador de reutilizações
	 *
	 * Evento implícito: v1.list.used
	 */
	async incrementUsage(listId: string): Promise<void> {
		await db
			.update(listsTable)
			.set({
				usedTimes: sql`${listsTable.usedTimes} + 1`,
				updatedAt: markAsUpdated(),
			})
			.where(eq(listsTable.id, listId));
	}

	/**
	 * Adiciona produto à lista
	 *
	 * Evento implícito: v1.list.product.added
	 */
	async addProduct(
		listId: string,
		productId: string,
		quantity: number,
	): Promise<void> {
		await db.insert(listProductsTable).values({
			id: generateUuid(),
			listId,
			productId,
			quantity,
			isPurchased: false,
		});
	}

	/**
	 * Remove produto da lista (soft delete)
	 *
	 * Evento implícito: v1.list.product.removed
	 */
	async removeProduct(listId: string, productId: string): Promise<void> {
		await db
			.update(listProductsTable)
			.set({
				removedAt: markAsDeleted(),
				updatedAt: markAsUpdated(),
			})
			.where(
				and(
					eq(listProductsTable.listId, listId),
					eq(listProductsTable.productId, productId),
				),
			);
	}

	/**
	 * Atualiza quantidade de produto na lista
	 *
	 * Evento implícito: v1.list.product.updated
	 */
	async updateProductQuantity(
		listId: string,
		productId: string,
		quantity: number,
	): Promise<void> {
		await db
			.update(listProductsTable)
			.set({
				quantity,
				updatedAt: markAsUpdated(),
			})
			.where(
				and(
					eq(listProductsTable.listId, listId),
					eq(listProductsTable.productId, productId),
				),
			);
	}

	/**
	 * Marca produto como comprado
	 *
	 * Evento implícito: v1.list.product.marked.as.purchased
	 */
	async markProductAsPurchased(
		listId: string,
		productId: string,
	): Promise<void> {
		await db
			.update(listProductsTable)
			.set({
				isPurchased: true,
				purchasedAt: new Date(),
				updatedAt: markAsUpdated(),
			})
			.where(
				and(
					eq(listProductsTable.listId, listId),
					eq(listProductsTable.productId, productId),
				),
			);
	}

	/**
	 * Busca produtos de uma lista
	 *
	 * Retorna apenas produtos não removidos com informações completas.
	 */
	async getListProducts(listId: string): Promise<ListProductWithDetails[]> {
		const result = await db
			.select({
				id: listProductsTable.id,
				quantity: listProductsTable.quantity,
				isPurchased: listProductsTable.isPurchased,
				addedAt: listProductsTable.addedAt,
				product: {
					id: productsTable.id,
					name: productsTable.name,
					unit: productsTable.unit,
				},
			})
			.from(listProductsTable)
			.innerJoin(
				productsTable,
				eq(listProductsTable.productId, productsTable.id),
			)
			.where(
				and(
					eq(listProductsTable.listId, listId),
					isNull(listProductsTable.removedAt),
					isNull(productsTable.deletedAt),
				),
			)
			.orderBy(desc(listProductsTable.addedAt));

		return result as ListProductWithDetails[];
	}

	/**
	 * Busca produtos não comprados de uma lista
	 *
	 * Útil para exibir itens pendentes na lista de compras.
	 */
	async getPendingProducts(listId: string): Promise<ListProductWithDetails[]> {
		const result = await db
			.select({
				id: listProductsTable.id,
				quantity: listProductsTable.quantity,
				isPurchased: listProductsTable.isPurchased,
				addedAt: listProductsTable.addedAt,
				product: {
					id: productsTable.id,
					name: productsTable.name,
					unit: productsTable.unit,
				},
			})
			.from(listProductsTable)
			.innerJoin(
				productsTable,
				eq(listProductsTable.productId, productsTable.id),
			)
			.where(
				and(
					eq(listProductsTable.listId, listId),
					eq(listProductsTable.isPurchased, false),
					isNull(listProductsTable.removedAt),
					isNull(productsTable.deletedAt),
				),
			)
			.orderBy(desc(listProductsTable.addedAt));

		return result as ListProductWithDetails[];
	}
}

/**
 * Instância singleton do repository
 *
 * Usar esta instância ao invés de criar novas.
 */
export const listsRepository = new ListsRepository();
