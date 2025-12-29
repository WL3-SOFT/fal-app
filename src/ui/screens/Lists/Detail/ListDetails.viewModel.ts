import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import type { List } from "@/core/entities";
import type { UpdateListDto } from "@/core/interfaces/repositories/IListsRepository";
import {
	DeleteListUseCase,
	GetListByIdUseCase,
	IncrementListUsageUseCase,
	UpdateListUseCase,
} from "@/core/useCases";
import { listsRepository } from "@/data/repositories";

type ListDetailsState = {
	list: List | null;
	loading: boolean;
	error: string | null;
	updating: boolean;
	deleting: boolean;
};

export const useListDetailsViewModel = (listId: string) => {
	const router = useRouter();

	const [state, setState] = useState<ListDetailsState>({
		list: null,
		loading: false,
		error: null,
		updating: false,
		deleting: false,
	});

	const getListByIdUseCase = new GetListByIdUseCase(listsRepository);
	const updateListUseCase = new UpdateListUseCase(listsRepository);
	const deleteListUseCase = new DeleteListUseCase(listsRepository);
	const incrementUsageUseCase = new IncrementListUsageUseCase(listsRepository);

	const loadList = useCallback(async () => {
		setState((prev) => ({ ...prev, loading: true, error: null }));

		try {
			const list = await getListByIdUseCase.execute(listId);
			setState((prev) => ({ ...prev, list, loading: false }));
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Erro ao carregar lista";
			setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
		}
	}, [listId, getListByIdUseCase]);

	const updateList = useCallback(
		async (data: UpdateListDto) => {
			setState((prev) => ({ ...prev, updating: true, error: null }));

			try {
				await updateListUseCase.execute(listId, data);

				await loadList();

				setState((prev) => ({ ...prev, updating: false }));

				return true;
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Erro ao atualizar lista";
				setState((prev) => ({
					...prev,
					error: errorMessage,
					updating: false,
				}));
				return false;
			}
		},
		[listId, loadList, updateListUseCase],
	);

	const deleteList = useCallback(async () => {
		setState((prev) => ({ ...prev, deleting: true, error: null }));

		try {
			await deleteListUseCase.execute(listId);

			setState((prev) => ({ ...prev, deleting: false }));

			router.back();

			return true;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Erro ao deletar lista";
			setState((prev) => ({ ...prev, error: errorMessage, deleting: false }));
			return false;
		}
	}, [listId, router, deleteListUseCase]);

	const incrementUsage = useCallback(async () => {
		try {
			await incrementUsageUseCase.execute(listId);
			await loadList();
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Erro ao incrementar uso da lista";
			setState((prev) => ({ ...prev, error: errorMessage }));
		}
	}, [listId, loadList, incrementUsageUseCase]);

	const toggleActive = useCallback(async () => {
		if (!state.list) return false;

		return updateList({ isActive: !state.list.isActive });
	}, [state.list, updateList]);

	const clearError = useCallback(() => {
		setState((prev) => ({ ...prev, error: null }));
	}, []);

	useEffect(() => {
		loadList();
	}, [loadList]);

	return {
		list: state.list,
		loading: state.loading,
		error: state.error,
		updating: state.updating,
		deleting: state.deleting,
		loadList,
		updateList,
		deleteList,
		incrementUsage,
		toggleActive,
		clearError,
	};
};
