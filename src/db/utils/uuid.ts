import { randomUUID } from "expo-crypto";

export function generateUuid(): string {
	return randomUUID();
}
