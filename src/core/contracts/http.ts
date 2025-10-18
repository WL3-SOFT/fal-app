/** biome-ignore-all lint/suspicious/noExplicitAny: O Generics pode ser any caso não tenha tipo definido */
export type ResponseDataType = "json" | "blob" | "arraybuffer" | "text";

export interface HttpParams<T = any> {
	url: string;
	body?: T;
	headers?: Record<string, any>;
	signal?: AbortSignal;
	responseDataType?: ResponseDataType;
}

export interface HttpResponse<T = any> {
	data: T;
	status: number;
	headers: Record<string, any>;
}

export interface HttpClient {
	get<T = any>(params: HttpParams): Promise<HttpResponse<T>>;
	post<T = any>(params: HttpParams): Promise<HttpResponse<T>>;
	put<T = any>(params: HttpParams): Promise<HttpResponse<T>>;
	delete<T = any>(params: HttpParams): Promise<HttpResponse<T>>;
}
