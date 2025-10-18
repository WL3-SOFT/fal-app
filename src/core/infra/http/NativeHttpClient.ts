/** biome-ignore-all lint/suspicious/noExplicitAny: O Generics pode ser any caso não seja passado tipo na declaração da função */
import type {
	HttpClient,
	HttpParams,
	HttpResponse,
	ResponseDataType,
} from "@/core/contracts";

export class NativeHttpClient implements HttpClient {
	private async getResponseBody(
		response: Response,
		responseDataType: ResponseDataType = "json",
	) {
		try {
			switch (responseDataType) {
				case "json":
					return await response.json();
				case "blob":
					return await response.blob();
				case "arraybuffer":
					return await response.arrayBuffer();
				case "text":
					return await response.text();
				default:
					return await response.json();
			}
		} catch {
			return null;
		}
	}

	private formatReturn<T = any>(response: Response, data: T) {
		return {
			data,
			...response,
		};
	}

	async get<T = any>(params: HttpParams): Promise<HttpResponse<T>> {
		const response = await fetch(params.url, {
			method: "GET",
			headers: params.headers,
		});
		const data = await this.getResponseBody(response);
		return this.formatReturn(response, data);
	}

	async post<T = any>(params: HttpParams): Promise<HttpResponse<T>> {
		const response = await fetch(params.url, {
			method: "POST",
			headers: params.headers,
			body: params.body,
		});
		const data = await this.getResponseBody(response);
		return this.formatReturn(response, data);
	}

	async put<T = any>(params: HttpParams): Promise<HttpResponse<T>> {
		const response = await fetch(params.url, {
			method: "PUT",
			headers: params.headers,
			body: params.body,
		});
		const data = await this.getResponseBody(response);
		return this.formatReturn(response, data);
	}

	async delete<T = any>(params: HttpParams): Promise<HttpResponse<T>> {
		const response = await fetch(params.url, {
			method: "DELETE",
			headers: params.headers,
		});
		const data = await this.getResponseBody(response);
		return this.formatReturn(response, data);
	}
}
