/** biome-ignore-all lint/suspicious/noExplicitAny: O Generics pode ser any caso não seja passado tipo na declaração da função */
import * as SecureStore from "expo-secure-store";
import type { Storage } from "@/core/interfaces/modules";

export class SecureStoreClient implements Storage {
	private isAvailable?: boolean;

	constructor() {
		SecureStore.isAvailableAsync()
			.then((isAvailable) => {
				this.isAvailable = isAvailable;
			})
			.catch(() => {
				this.isAvailable = false;
			});
	}

	async get<T = any>(key: string): Promise<T | null> {
		if (!this.isAvailable) {
			console.log("SecureStore is not available");
			return null;
		}
		try {
			const value = await SecureStore.getItemAsync(key);
			return value ? JSON.parse(value) : null;
		} catch (error) {
			console.log(`Error getting ${key}: ${error}`);
			return null;
		}
	}
	async set(key: string, value: any): Promise<void> {
		if (!this.isAvailable) {
			console.log("SecureStore is not available");
			return;
		}
		const stringifiedValue = JSON.stringify(value);
		return await SecureStore.setItemAsync(key, stringifiedValue);
	}
	async remove(key: string): Promise<boolean> {
		if (!this.isAvailable) {
			console.log("SecureStore is not available");
			return false;
		}
		try {
			await SecureStore.deleteItemAsync(key);
			return true;
		} catch (error) {
			console.log(`Error removing ${key}: ${error}`);
			return false;
		}
	}
	async exists(key: string): Promise<boolean> {
		if (!this.isAvailable) {
			console.log("SecureStore is not available");
			return false;
		}
		try {
			return (await SecureStore.getItemAsync(key)) !== null;
		} catch (error) {
			console.log(`Error checking if ${key} exists: ${error}`);
			return false;
		}
	}
}
