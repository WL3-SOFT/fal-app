import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_USER_ID } from "@/core/constraints";
import type { CreateListDto } from "@/core/interfaces/repositories/IListsRepository";
import {
	CreateListUseCase,
	DeleteListUseCase,
	GetUserListsUseCase,
} from "@/core/useCases";
import { listsRepository } from "@/data/repositories";
import type { ListsState } from "./List.types";

export const useListsViewModel = () => {
	const router = useRouter();

	const [state, setState] = useState<ListsState>({
		lists: [],
		loading: false,
		error: null,
		creating: false,
		deleting: false,
	});

	const getUserListsUseCase = useMemo(
		() => new GetUserListsUseCase(listsRepository),
		[],
	);
	const createListUseCase = useMemo(
		() => new CreateListUseCase(listsRepository),
		[],
	);
	const deleteListUseCase = useMemo(
		() => new DeleteListUseCase(listsRepository),
		[],
	);

	const loadLists = useCallback(
		async (userId: string = DEFAULT_USER_ID) => {
			setState((prev) => ({ ...prev, loading: true, error: null }));

			try {
				const lists = await getUserListsUseCase.execute(userId);
				setState((prev) => ({ ...prev, lists, loading: false }));
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Erro ao carregar listas";
				setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
			}
		},
		[getUserListsUseCase],
	);

	const createList = useCallback(
		async (data: Omit<CreateListDto, "createdBy">) => {
			setState((prev) => ({ ...prev, creating: true, error: null }));

			try {
				await createListUseCase.execute({
					...data,
					createdBy: DEFAULT_USER_ID,
				});

				await loadLists(DEFAULT_USER_ID);

				setState((prev) => ({ ...prev, creating: false }));
				console.log("chegou aqui - create");

				return true;
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Erro ao criar lista";
				setState((prev) => ({
					...prev,
					error: errorMessage,
					creating: false,
				}));
				return false;
			}
		},
		[loadLists, createListUseCase],
	);

	const deleteList = useCallback(
		async (listId: string) => {
			setState((prev) => ({ ...prev, deleting: true, error: null }));

			try {
				await deleteListUseCase.execute(listId);

				await loadLists(DEFAULT_USER_ID);

				setState((prev) => ({ ...prev, deleting: false }));

				return true;
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Erro ao deletar lista";
				setState((prev) => ({ ...prev, error: errorMessage, deleting: false }));
				return false;
			}
		},
		[loadLists, deleteListUseCase],
	);

	const navigateToCreate = useCallback(() => {
		router.push("/lists/create");
	}, [router]);

	const navigateToDetails = useCallback(
		(listId: string) => {
			router.push(`/lists/${listId}`);
		},
		[router],
	);

	const clearError = useCallback(() => {
		setState((prev) => ({ ...prev, error: null }));
	}, []);

	useEffect(() => {
		loadLists(DEFAULT_USER_ID);
	}, [loadLists]);

	const hasContent = Boolean(state?.lists && state.lists?.length > 0);
	const quantityText = hasContent
		? `${state?.lists?.length} lista${state?.lists && state?.lists?.length > 1 ? "s" : ""}`
		: "Sem listas no momento";

	return {
		lists: state.lists,
		loading: state.loading,
		error: state.error,
		creating: state.creating,
		deleting: state.deleting,
		hasContent,
		quantityText,
		loadLists,
		createList,
		deleteList,
		navigateToCreate,
		navigateToDetails,
		clearError,
	};
};
