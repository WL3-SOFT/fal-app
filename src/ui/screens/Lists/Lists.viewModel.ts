import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { DEFAULT_USER_ID } from "@/core/constraints";
import { useListsStore } from "@/ui/stores/Lists.store";

export const useListsViewModel = () => {
	const router = useRouter();

	const lists = useListsStore((state) => state.lists);
	const loadingState = useListsStore((state) => state.loadingState);
	const error = useListsStore((state) => state.error);

	const loadLists = useListsStore((state) => state.loadLists);
	const createListAction = useListsStore((state) => state.createList);
	const deleteListAction = useListsStore((state) => state.deleteList);
	const refreshAction = useListsStore((state) => state.refresh);

	const activeLists = useMemo(
		() => lists.filter((list) => list.isActive),
		[lists],
	);

	useFocusEffect(
		useCallback(() => {
			loadLists(DEFAULT_USER_ID);
		}, [loadLists]),
	);

	const navigateToCreate = useCallback(() => {
		router.navigate("/lists/create");
	}, [router]);

	const navigateToDetails = useCallback(
		(listId: string) => {
			router.push(`/lists/${listId}`);
		},
		[router],
	);

	const isLoading = loadingState === "loading";
	const isRefreshing = loadingState === "refreshing";
	const hasContent = activeLists.length > 0;
	const quantityText = hasContent
		? `${activeLists.length} lista${activeLists.length > 1 ? "s" : ""}`
		: "Sem listas no momento";

	const createList = useCallback(
		async (data: { name: string; description: string }) => {
			try {
				await createListAction({ ...data, createdBy: DEFAULT_USER_ID });
				await loadLists(DEFAULT_USER_ID);
				return true;
			} catch {
				return false;
			}
		},
		[createListAction, loadLists],
	);

	const deleteList = useCallback(
		async (listId: string) => {
			try {
				await deleteListAction(listId);
				await loadLists(DEFAULT_USER_ID);
				return true;
			} catch {
				return false;
			}
		},
		[deleteListAction, loadLists],
	);

	const refresh = useCallback(() => {
		refreshAction(DEFAULT_USER_ID);
	}, [refreshAction]);

	return {
		lists: activeLists,
		loading: isLoading,
		refreshing: isRefreshing,
		hasContent,
		quantityText,
		error,
		createList,
		deleteList,
		navigateToCreate,
		navigateToDetails,
		refresh,
	};
};
