import type { IHttpClient, IStorage } from "./contracts";
import {
	AsyncStorageClient,
	NativeHttpClient,
	SecureStoreClient,
} from "./infra";

export const httpClient: IHttpClient = new NativeHttpClient();
export const vault: IStorage = new SecureStoreClient();
export const storage: IStorage = new AsyncStorageClient();
