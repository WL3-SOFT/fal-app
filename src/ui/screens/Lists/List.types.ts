import type { ListWithProductCountDto } from "@/core/interfaces/repositories/IListsRepository";

export type ListsState = {
		lists: ListWithProductCountDto[] | null;
		loading: boolean;
		error: string | null;
		creating: boolean;
		deleting: boolean;
	};
