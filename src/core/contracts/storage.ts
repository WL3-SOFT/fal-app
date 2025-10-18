/** biome-ignore-all lint/suspicious/noExplicitAny: O Generics pode ser any caso não seja passado tipo na declaração da função */
export interface Storage {
	get<T = any>(key: string): Promise<T | null>;
	set<T = any>(key: string, value: T): Promise<void>;
	remove(key: string): Promise<boolean>;
	exists(key: string): Promise<boolean>;
}
