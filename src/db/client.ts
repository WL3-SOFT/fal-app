import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { schema } from "./schemas";

const DATABASE_NAME = "faca-lista.db";

const expoDb = openDatabaseSync(DATABASE_NAME);

/**
 * Cliente Drizzle ORM
 *
 * Fornece acesso type-safe ao banco de dados com:
 * - Queries tipadas
 * - Relacionamentos automáticos
 * - Migrations gerenciadas
 * - Soft delete pattern
 *
 * @example
 * ```ts
 * import { db } from '@/db/client';
 *
 * // Query com soft delete automático
 * const activeLists = await db.query.listsTable.findMany({
 *   where: (lists, { isNull }) => isNull(lists.deletedAt)
 * });
 * ```
 */
export const db = drizzle(expoDb, { schema });

export { expoDb };
