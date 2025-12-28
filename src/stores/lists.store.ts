/**
 * Lists Store - Zustand
 *
 * Gerenciamento de estado global para listas de compras.
 * Integra o Repository com React através do Zustand.
 *
 * Padrões implementados:
 * - Immer para updates imutáveis
 * - Async actions com estados de loading
 * - Optimistic updates
 * - Type-safe com TypeScript
 * - Separação de concerns (store conhece repository)
 */

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { listsRepository } from "@/db/repositories/lists.repository";

// ============================================================================
// TYPES
// ============================================================================

/**
 * Lista com contagem de produtos
 */
export interface ListItem {
	id: string;
	name: string;
	description: string;
	usedTimes: number;
	isActive: boolean;
	isPublic: boolean;
	canBeShared: boolean;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date | null;
	deletedAt: Date | null;
	productCount: number;
}

/**
 * Produto na lista com detalhes
 */
export interface ListProduct {
	id: string;
	quantity: number;
	isPurchased: boolean;
	addedAt: Date;
	product: {
		id: string;
		name: string;
		unit: string;
	};
}

/**
 * Estados de loading
 */
type LoadingState = "idle" | "loading" | "refreshing" | "error";

/**
 * Estado do store
 */
interface ListsState {
	// Data
	lists: ListItem[];
	currentList: ListItem | null;
	currentProducts: ListProduct[];

	// UI State
	loadingState: LoadingState;
	error: string | null;

	// Computed
	activeLists: () => ListItem[];
	publicLists: () => ListItem[];
	pendingProducts: () => ListProduct[];
	purchasedProducts: () => ListProduct[];
}

/**
 * Ações do store
 */
interface ListsActions {
	// Lists CRUD
	loadLists: (userId: string) => Promise<void>;
	createList: (data: {
		name: string;
		description: string;
		createdBy: string;
	}) => Promise<ListItem>;
	updateList: (
		id: string,
		data: Partial<Pick<ListItem, "name" | "description">>,
	) => Promise<void>;
	deleteList: (id: string) => Promise<void>;
	incrementUsage: (id: string) => Promise<void>;

	// List Products
	loadListProducts: (listId: string) => Promise<void>;
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

	// UI Actions
	setCurrentList: (list: ListItem | null) => void;
	refresh: (userId: string) => Promise<void>;
	clearError: () => void;
	reset: () => void;
}

/**
 * Store completo (state + actions)
 */
type ListsStore = ListsState & ListsActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: ListsState = {
	lists: [],
	currentList: null,
	currentProducts: [],
	loadingState: "idle",
	error: null,

	// Computed values
	activeLists: () => [],
	publicLists: () => [],
	pendingProducts: () => [],
	purchasedProducts: () => [],
};

// ============================================================================
// STORE
// ============================================================================

/**
 * Zustand Store para gerenciamento de listas
 *
 * @example
 * ```tsx
 * // Em um componente
 * const { lists, loadLists, createList } = useListsStore();
 *
 * useEffect(() => {
 *   loadLists(userId);
 * }, [userId]);
 *
 * return (
 *   <FlatList
 *     data={lists}
 *     renderItem={({ item }) => <ListCard list={item} />}
 *   />
 * );
 * ```
 */
export const useListsStore = create<ListsStore>()(
	immer((set, get) => ({
		...initialState,

		// ====================================================================
		// COMPUTED VALUES
		// ====================================================================

		activeLists: () => get().lists.filter((list) => list.isActive),

		publicLists: () => get().lists.filter((list) => list.isPublic),

		pendingProducts: () => get().currentProducts.filter((p) => !p.isPurchased),

		purchasedProducts: () => get().currentProducts.filter((p) => p.isPurchased),

		// ====================================================================
		// LISTS CRUD
		// ====================================================================

		/**
		 * Carrega listas do usuário
		 */
		loadLists: async (userId: string) => {
			set({ loadingState: "loading", error: null });

			try {
				const lists = await listsRepository.findByUser(userId);
				set({ lists, loadingState: "idle" });
			} catch (error) {
				console.error("Error loading lists:", error);
				set({
					error: "Não foi possível carregar suas listas. Tente novamente.",
					loadingState: "error",
				});
			}
		},

		/**
		 * Cria uma nova lista
		 */
		createList: async (data) => {
			set({ loadingState: "loading", error: null });

			try {
				const newList = await listsRepository.create(data);

				// Adiciona otimisticamente na UI
				set((state) => {
					state.lists.unshift({ ...newList, productCount: 0 });
					state.loadingState = "idle";
				});

				return { ...newList, productCount: 0 };
			} catch (error) {
				console.error("Error creating list:", error);
				set({
					error: "Não foi possível criar a lista. Tente novamente.",
					loadingState: "error",
				});
				throw error;
			}
		},

		/**
		 * Atualiza uma lista
		 */
		updateList: async (id, data) => {
			// Optimistic update
			const previousLists = get().lists;

			set((state) => {
				const list = state.lists.find((l) => l.id === id);
				if (list) {
					Object.assign(list, data);
				}
			});

			try {
				await listsRepository.update(id, data);
			} catch (error) {
				console.error("Error updating list:", error);

				// Reverte em caso de erro
				set({ lists: previousLists });
				set({
					error: "Não foi possível atualizar a lista. Tente novamente.",
				});
				throw error;
			}
		},

		/**
		 * Deleta uma lista (soft delete)
		 */
		deleteList: async (id) => {
			// Optimistic update
			const previousLists = get().lists;

			set((state) => {
				state.lists = state.lists.filter((l) => l.id !== id);
			});

			try {
				await listsRepository.delete(id);
			} catch (error) {
				console.error("Error deleting list:", error);

				// Reverte em caso de erro
				set({ lists: previousLists });
				set({
					error: "Não foi possível deletar a lista. Tente novamente.",
				});
				throw error;
			}
		},

		/**
		 * Incrementa contador de uso da lista
		 */
		incrementUsage: async (id) => {
			// Optimistic update
			set((state) => {
				const list = state.lists.find((l) => l.id === id);
				if (list) {
					list.usedTimes++;
				}
			});

			try {
				await listsRepository.incrementUsage(id);
			} catch (error) {
				console.error("Error incrementing usage:", error);
				// Não reverte - não é crítico
			}
		},

		// ====================================================================
		// LIST PRODUCTS
		// ====================================================================

		/**
		 * Carrega produtos de uma lista
		 */
		loadListProducts: async (listId: string) => {
			set({ loadingState: "loading", error: null });

			try {
				const products = await listsRepository.getListProducts(listId);
				set({ currentProducts: products, loadingState: "idle" });
			} catch (error) {
				console.error("Error loading products:", error);
				set({
					error: "Não foi possível carregar os produtos. Tente novamente.",
					loadingState: "error",
				});
			}
		},

		/**
		 * Adiciona produto à lista
		 */
		addProduct: async (listId, productId, quantity) => {
			try {
				await listsRepository.addProduct(listId, productId, quantity);

				// Recarrega produtos
				await get().loadListProducts(listId);

				// Atualiza contagem na lista
				set((state) => {
					const list = state.lists.find((l) => l.id === listId);
					if (list) {
						list.productCount++;
					}
				});
			} catch (error) {
				console.error("Error adding product:", error);
				set({
					error: "Não foi possível adicionar o produto. Tente novamente.",
				});
				throw error;
			}
		},

		/**
		 * Remove produto da lista
		 */
		removeProduct: async (listId, productId) => {
			// Optimistic update
			const previousProducts = get().currentProducts;

			set((state) => {
				state.currentProducts = state.currentProducts.filter(
					(p) => p.product.id !== productId,
				);
			});

			try {
				await listsRepository.removeProduct(listId, productId);

				// Atualiza contagem
				set((state) => {
					const list = state.lists.find((l) => l.id === listId);
					if (list) {
						list.productCount--;
					}
				});
			} catch (error) {
				console.error("Error removing product:", error);

				// Reverte
				set({ currentProducts: previousProducts });
				set({
					error: "Não foi possível remover o produto. Tente novamente.",
				});
				throw error;
			}
		},

		/**
		 * Atualiza quantidade de produto
		 */
		updateQuantity: async (listId, productId, quantity) => {
			// Optimistic update
			set((state) => {
				const product = state.currentProducts.find(
					(p) => p.product.id === productId,
				);
				if (product) {
					product.quantity = quantity;
				}
			});

			try {
				await listsRepository.updateProductQuantity(
					listId,
					productId,
					quantity,
				);
			} catch (error) {
				console.error("Error updating quantity:", error);
				set({
					error: "Não foi possível atualizar a quantidade. Tente novamente.",
				});
				throw error;
			}
		},

		/**
		 * Marca/desmarca produto como comprado
		 */
		togglePurchased: async (listId, productId) => {
			// Optimistic update
			set((state) => {
				const product = state.currentProducts.find(
					(p) => p.product.id === productId,
				);
				if (product) {
					product.isPurchased = !product.isPurchased;
				}
			});

			try {
				await listsRepository.markProductAsPurchased(listId, productId);
			} catch (error) {
				console.error("Error toggling purchased:", error);
				set({
					error: "Não foi possível atualizar o status. Tente novamente.",
				});
				throw error;
			}
		},

		// ====================================================================
		// UI ACTIONS
		// ====================================================================

		/**
		 * Define lista atual (para tela de detalhes)
		 */
		setCurrentList: (list) => {
			set({ currentList: list });
		},

		/**
		 * Atualiza listas (pull-to-refresh)
		 */
		refresh: async (userId) => {
			set({ loadingState: "refreshing", error: null });

			try {
				const lists = await listsRepository.findByUser(userId);
				set({ lists, loadingState: "idle" });
			} catch (error) {
				console.error("Error refreshing lists:", error);
				set({
					error: "Não foi possível atualizar. Tente novamente.",
					loadingState: "error",
				});
			}
		},

		/**
		 * Limpa erro
		 */
		clearError: () => {
			set({ error: null });
		},

		/**
		 * Reseta o store (logout)
		 */
		reset: () => {
			set(initialState);
		},
	})),
);

// ============================================================================
// SELECTORS (Hooks otimizados)
// ============================================================================

/**
 * Hook otimizado para pegar apenas as listas
 * Evita re-renders desnecessários
 */
export const useLists = () => useListsStore((state) => state.lists);

/**
 * Hook otimizado para pegar apenas listas ativas
 */
export const useActiveLists = () =>
	useListsStore((state) => state.activeLists());

/**
 * Hook otimizado para estado de loading
 */
export const useListsLoading = () =>
	useListsStore((state) => state.loadingState);

/**
 * Hook otimizado para produtos da lista atual
 */
export const useCurrentProducts = () =>
	useListsStore((state) => state.currentProducts);

/**
 * Hook otimizado para produtos pendentes
 */
export const usePendingProducts = () =>
	useListsStore((state) => state.pendingProducts());

/**
 * Hook otimizado para ações
 */
export const useListsActions = () =>
	useListsStore((state) => ({
		loadLists: state.loadLists,
		createList: state.createList,
		updateList: state.updateList,
		deleteList: state.deleteList,
		addProduct: state.addProduct,
		removeProduct: state.removeProduct,
		updateQuantity: state.updateQuantity,
		togglePurchased: state.togglePurchased,
		refresh: state.refresh,
	}));
