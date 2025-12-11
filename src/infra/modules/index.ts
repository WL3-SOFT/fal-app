import type { HttpClient, Storage } from "@/core/interfaces/modules";
import { NativeHttpClient } from "./http";
import { SecureStoreClient, SqliteStorageClient } from "./storage";

export const httpClient: HttpClient = new NativeHttpClient();
export const vault: Storage = new SecureStoreClient();
export const storage: Storage = new SqliteStorageClient();
