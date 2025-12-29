import { isNull, type SQLWrapper } from "drizzle-orm";

/**
 * Condição padrão para filtrar registros não deletados
 *
 * Usar em todas as queries que não devem retornar registros deletados.
 *
 * @example
 * ```ts
 * const lists = await db.query.listsTable.findMany({
 *   where: onlyActive(listsTable.deletedAt)
 * });
 * ```
 */
export const onlyActive = <T>(
	deletedAtField: T extends SQLWrapper ? T : never,
) => isNull(deletedAtField);

/**
 * Marca um registro como deletado (soft delete)
 *
 * @returns Date object (Drizzle converte para timestamp_ms automaticamente)
 *
 * @example
 * ```ts
 * await db.update(listsTable)
 *   .set({ deletedAt: markAsDeleted() })
 *   .where(eq(listsTable.id, listId));
 * ```
 */
export const markAsDeleted = () => new Date();

/**
 * Marca um registro como atualizado
 *
 * @returns Date object (Drizzle converte para timestamp_ms automaticamente)
 */
export const markAsUpdated = () => new Date();
