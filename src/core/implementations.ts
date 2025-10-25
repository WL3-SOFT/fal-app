import type { HttpClient, Storage } from "./contracts";
import {
	NativeHttpClient,
	SecureStoreClient,
	SqliteStorageClient,
} from "./infra";

export const httpClient: HttpClient = new NativeHttpClient();
export const vault: Storage = new SecureStoreClient();
export const storage: Storage = new SqliteStorageClient();
