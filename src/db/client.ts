/**
 * Drizzle Database Client
 *
 * Configuração e inicialização do Drizzle ORM com Expo SQLite.
 * Este cliente segue o padrão de Inversão de Dependência da Clean Architecture.
 */

import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { schema } from "./schemas";

/**
 * Nome do banco de dados SQLite
 * Armazenado localmente no dispositivo
 */
const DATABASE_NAME = "faca-lista.db";

/**
 * Abre a conexão com o banco SQLite
 * openDatabaseSync garante que o banco seja criado se não existir
 */
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

/**
 * Acesso direto ao SQLite (para queries raw se necessário)
 * Evite usar diretamente - prefira o Drizzle ORM
 */
export { expoDb };
