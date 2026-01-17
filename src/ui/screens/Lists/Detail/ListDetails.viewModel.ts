import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import type { UpdateListDto } from "@/core/interfaces/repositories/IListsRepository";
import { useListsStore } from "@/ui/stores/Lists.store";

type LocalState = {
	updating: boolean;
	deleting: boolean;
};

export const useListDetailsViewModel = (listId: string) => {
	const router = useRouter();

	const [state, setState] = useState<LocalState>({
		updating: false,
		deleting: false,
	});

	const list = useListsStore((state) => state.currentList);
	const loadingState = useListsStore((state) => state.loadingState);
	const error = useListsStore((state) => state.error);

	const loadList = useListsStore((state) => state.loadList);
	const updateListAction = useListsStore((state) => state.updateList);
	const deleteListAction = useListsStore((state) => state.deleteList);
	const incrementUsageAction = useListsStore((state) => state.incrementUsage);
	const clearErrorAction = useListsStore((state) => state.clearError);

	useEffect(() => {
		loadList(listId);
	}, [listId, loadList]);

	const updateList = useCallback(
		async (data: UpdateListDto) => {
			setState((prev) => ({ ...prev, updating: true }));

			try {
				await updateListAction(listId, data);
				await loadList(listId);

				setState((prev) => ({ ...prev, updating: false }));

				return true;
			} catch {
				setState((prev) => ({ ...prev, updating: false }));
				return false;
			}
		},
		[listId, updateListAction, loadList],
	);

	const deleteList = useCallback(async () => {
		setState((prev) => ({ ...prev, deleting: true }));

		try {
			await deleteListAction(listId);
			setState((prev) => ({ ...prev, deleting: false }));

			router.back();

			return true;
		} catch {
			setState((prev) => ({ ...prev, deleting: false }));
			return false;
		}
	}, [listId, router, deleteListAction]);

	const incrementUsage = useCallback(async () => {
		try {
			await incrementUsageAction(listId);
			await loadList(listId);
		} catch {}
	}, [listId, incrementUsageAction, loadList]);

	const toggleActive = useCallback(async () => {
		if (!list) return false;

		return updateList({ isActive: !list.isActive });
	}, [list, updateList]);

	const clearError = useCallback(() => {
		clearErrorAction();
	}, [clearErrorAction]);

	const loading = loadingState === "loading";

	return {
		list,
		loading,
		error,
		updating: state.updating,
		deleting: state.deleting,
		updateList,
		deleteList,
		incrementUsage,
		toggleActive,
		clearError,
	};
};
