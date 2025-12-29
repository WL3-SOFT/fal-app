import { randomUUID } from "expo-crypto";

/**
 * Gera um UUID v4 único
 *
 * @returns UUID v4 no formato: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
 *
 * @example
 * ```ts
 * const listId = generateUuid();
 * // => "550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
export function generateUuid(): string {
	return randomUUID();
}
