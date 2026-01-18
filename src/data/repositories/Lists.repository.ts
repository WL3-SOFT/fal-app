import { and, count, desc, eq, isNull, sql } from "drizzle-orm";
import { List } from "#core/entities";
import type {
	CreateListDto,
	ListProductWithDetails,
	ListsRepositoryInterface,
	ListWithProductCount,
	UpdateListDto,
} from "#core/interfaces/repositories/IListsRepository";
import { db } from "#db/client";
import { listProductsTable, listsTable, productsTable } from "#db/schemas";
import { markAsDeleted, markAsUpdated } from "#db/utils/soft-delete";
import { generateUuid } from "#db/utils/uuid";

type NewList = typeof listsTable.$inferInsert;

export class ListsRepository implements ListsRepositoryInterface {
	async create(data: CreateListDto): Promise<List> {
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

		// Return a proper List entity instance, not a plain object
		return new List(newList);
	}

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

	async findById(listId: string): Promise<List | null> {
		const result = await db.query.listsTable.findFirst({
			where: and(eq(listsTable.id, listId), isNull(listsTable.deletedAt)),
		});

		if (!result) {
			return null;
		}

		// Return a proper List entity instance
		return new List(result);
	}

	async findByNameAndUserId(
		name: string,
		userId: string,
	): Promise<List | null> {
		const result = await db.query.listsTable.findFirst({
			where: and(
				eq(listsTable.name, name),
				eq(listsTable.createdBy, userId),
				eq(listsTable.isActive, true),
				isNull(listsTable.deletedAt),
			),
		});

		if (!result) {
			return null;
		}

		// Return a proper List entity instance
		return new List(result);
	}

	async update(listId: string, data: UpdateListDto): Promise<void> {
		await db
			.update(listsTable)
			.set({
				...data,
				updatedAt: markAsUpdated(),
			})
			.where(eq(listsTable.id, listId));
	}

	async delete(listId: string): Promise<void> {
		await db
			.update(listsTable)
			.set({
				deletedAt: markAsDeleted(),
				updatedAt: markAsUpdated(),
			})
			.where(eq(listsTable.id, listId));
	}

	async incrementUsage(listId: string): Promise<void> {
		await db
			.update(listsTable)
			.set({
				usedTimes: sql`${listsTable.usedTimes} + 1`,
				updatedAt: markAsUpdated(),
			})
			.where(eq(listsTable.id, listId));
	}

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

export const listsRepository = new ListsRepository();
