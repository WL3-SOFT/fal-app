/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: Necessário para mockar */
// biome-ignore lint/suspicious/noExplicitAny: Necessário para mockar
export const showToast = jest.fn((message: string, options?: any) => {
	return "mock-toast-id";
});

export const dismissToast = jest.fn((id: string) => {
	// Mock implementation
});

export const showToastPromise = jest.fn(
	<T>(
		promise: Promise<T>,
		messages: {
			loading: string;
			success: string | ((result: T) => string);
			error: string | ((error: Error) => string);
		},
		// biome-ignore lint/suspicious/noExplicitAny: Necessário para mockar
		options?: any,
	) => {
		// Mock implementation - resolve the promise silently
		promise.then(() => {}).catch(() => {});
	},
);
