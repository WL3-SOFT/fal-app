import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
	CreateListDto,
	ListDto,
	ListProductWithDetails,
	ListWithProductCountDto,
	UpdateListDto,
} from "@/core/interfaces/repositories/IListsRepository";
import {
	AddProductToListUseCase,
	CreateListUseCase,
	DeleteListUseCase,
	GetListByIdUseCase,
	GetListProductsUseCase,
	GetUserListsUseCase,
	IncrementListUsageUseCase,
	MarkProductAsPurchasedUseCase,
	RemoveProductFromListUseCase,
	UpdateListUseCase,
	UpdateProductQuantityUseCase,
} from "@/core/useCases/lists";
import { ListsRepository } from "@/data/repositories";

type LoadingState = "idle" | "loading" | "refreshing" | "success" | "error";

interface ListsState {
	lists: ListWithProductCountDto[];
	currentList: ListDto | null;
	currentProducts: ListProductWithDetails[];
	loadingState: LoadingState;
	error: string | null;

	loadLists: (userId: string) => Promise<void>;
	loadList: (listId: string) => Promise<void>;
	loadListProducts: (listId: string) => Promise<void>;
	createList: (data: CreateListDto) => Promise<void>;
	updateList: (listId: string, data: UpdateListDto) => Promise<void>;
	deleteList: (listId: string) => Promise<void>;
	incrementUsage: (listId: string) => Promise<void>;
	addProduct: (
		listId: string,
		productId: string,
		quantity: number,
	) => Promise<void>;
	removeProduct: (listId: string, productId: string) => Promise<void>;
	updateQuantity: (
		listId: string,
		productId: string,
		quantity: number,
	) => Promise<void>;
	togglePurchased: (listId: string, productId: string) => Promise<void>;
	refresh: (userId: string) => Promise<void>;
	clearError: () => void;
}

const repository = new ListsRepository();

export const useListsStore = create<ListsState>()(
	immer((set) => ({
		lists: [] as ListWithProductCountDto[],
		currentList: null as ListDto | null,
		currentProducts: [] as ListProductWithDetails[],
		loadingState: "idle" as LoadingState,
		error: null as string | null,

		loadLists: async (userId: string) => {
			set((state) => {
				state.loadingState = "loading";
				state.error = null;
			});

			try {
				const useCase = new GetUserListsUseCase(repository);
				const result = await useCase.execute(userId);

				set((state) => {
					state.lists = result;
					state.loadingState = "success";
				});
			} catch (error) {
				set((state) => {
					state.error =
						error instanceof Error ? error.message : "Erro ao carregar listas";
					state.loadingState = "error";
				});
			}
		},

		loadList: async (listId: string) => {
			set((state) => {
				state.loadingState = "loading";
				state.error = null;
			});

			try {
				const useCase = new GetListByIdUseCase(repository);
				const result = await useCase.execute(listId);

				set((state) => {
					state.currentList = result;
					state.loadingState = "success";
				});
			} catch (error) {
				set((state) => {
					state.error =
						error instanceof Error ? error.message : "Erro ao carregar lista";
					state.loadingState = "error";
				});
			}
		},

		loadListProducts: async (listId: string) => {
			set((state) => {
				state.loadingState = "loading";
				state.error = null;
			});

			try {
				const useCase = new GetListProductsUseCase(repository);
				const result = await useCase.execute(listId);

				set((state) => {
					state.currentProducts = result;
					state.loadingState = "success";
				});
			} catch (error) {
				set((state) => {
					state.error =
						error instanceof Error
							? error.message
							: "Erro ao carregar produtos";
					state.loadingState = "error";
				});
			}
		},

		createList: async (data: CreateListDto) => {
			set((state) => {
				state.loadingState = "loading";
				state.error = null;
			});

			try {
				const useCase = new CreateListUseCase(repository);
				await useCase.execute(data);

				set((state) => {
					state.loadingState = "success";
				});
			} catch (error) {
				set((state) => {
					state.error =
						error instanceof Error ? error.message : "Erro ao criar lista";
					state.loadingState = "error";
				});
				throw error;
			}
		},

		updateList: async (listId: string, data: UpdateListDto) => {
			set((state) => {
				state.error = null;
			});

			try {
				const useCase = new UpdateListUseCase(repository);
				await useCase.execute(listId, data);
			} catch (error) {
				set((state) => {
					state.error =
						error instanceof Error ? error.message : "Erro ao atualizar lista";
				});
				throw error;
			}
		},

		deleteList: async (listId: string) => {
			set((state) => {
				state.error = null;
			});

			try {
				const useCase = new DeleteListUseCase(repository);
				await useCase.execute(listId);
			} catch (error) {
				set((state) => {
					state.error =
						error instanceof Error ? error.message : "Erro ao deletar lista";
				});
				throw error;
			}
		},

		incrementUsage: async (listId: string) => {
			try {
				const useCase = new IncrementListUsageUseCase(repository);
				await useCase.execute(listId);
			} catch (error) {
				set((state) => {
					state.error =
						error instanceof Error ? error.message : "Erro ao incrementar uso";
				});
				throw error;
			}
		},

		addProduct: async (listId: string, productId: string, quantity: number) => {
			try {
				const useCase = new AddProductToListUseCase(repository);
				await useCase.execute(listId, productId, quantity);
			} catch (error) {
				set((state) => {
					state.error =
						error instanceof Error
							? error.message
							: "Erro ao adicionar produto";
				});
				throw error;
			}
		},

		removeProduct: async (listId: string, productId: string) => {
			try {
				const useCase = new RemoveProductFromListUseCase(repository);
				await useCase.execute(listId, productId);
			} catch (error) {
				set((state) => {
					state.error =
						error instanceof Error ? error.message : "Erro ao remover produto";
				});
				throw error;
			}
		},

		updateQuantity: async (
			listId: string,
			productId: string,
			quantity: number,
		) => {
			try {
				const useCase = new UpdateProductQuantityUseCase(repository);
				await useCase.execute(listId, productId, quantity);
			} catch (error) {
				set((state) => {
					state.error =
						error instanceof Error
							? error.message
							: "Erro ao atualizar quantidade";
				});
				throw error;
			}
		},

		togglePurchased: async (listId: string, productId: string) => {
			try {
				const useCase = new MarkProductAsPurchasedUseCase(repository);
				await useCase.execute(listId, productId);
			} catch (error) {
				set((state) => {
					state.error =
						error instanceof Error ? error.message : "Erro ao marcar produto";
				});
				throw error;
			}
		},

		refresh: async (userId: string) => {
			set((state) => {
				state.loadingState = "refreshing";
				state.error = null;
			});

			try {
				const useCase = new GetUserListsUseCase(repository);
				const result = await useCase.execute(userId);

				set((state) => {
					state.lists = result;
					state.loadingState = "success";
				});
			} catch (error) {
				set((state) => {
					state.error =
						error instanceof Error ? error.message : "Erro ao atualizar listas";
					state.loadingState = "error";
				});
			}
		},

		clearError: () => {
			set((state) => {
				state.error = null;
			});
		},
	})),
);
