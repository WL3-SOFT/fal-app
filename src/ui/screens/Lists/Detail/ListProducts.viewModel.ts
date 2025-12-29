import { useCallback, useEffect, useState } from "react";
import type { ListProductWithDetails } from "@/core/interfaces/repositories/IListsRepository";
import {
	AddProductToListUseCase,
	GetListProductsUseCase,
	GetPendingProductsUseCase,
	MarkProductAsPurchasedUseCase,
	RemoveProductFromListUseCase,
	UpdateProductQuantityUseCase,
} from "@/core/useCases";
import { listsRepository } from "@/data/repositories";

type ProductsFilter = "all" | "pending" | "purchased";

type ListProductsState = {
	products: ListProductWithDetails[];
	loading: boolean;
	error: string | null;
	adding: boolean;
	removing: string | null;
	updating: string | null;
	marking: string | null;
	filter: ProductsFilter;
};

export const useListProductsViewModel = (listId: string) => {
	const [state, setState] = useState<ListProductsState>({
		products: [],
		loading: false,
		error: null,
		adding: false,
		removing: null,
		updating: null,
		marking: null,
		filter: "all",
	});

	const getListProductsUseCase = new GetListProductsUseCase(listsRepository);
	const getPendingProductsUseCase = new GetPendingProductsUseCase(
		listsRepository,
	);
	const addProductUseCase = new AddProductToListUseCase(listsRepository);
	const removeProductUseCase = new RemoveProductFromListUseCase(
		listsRepository,
	);
	const updateQuantityUseCase = new UpdateProductQuantityUseCase(
		listsRepository,
	);
	const markAsPurchasedUseCase = new MarkProductAsPurchasedUseCase(
		listsRepository,
	);

	const loadProducts = useCallback(async () => {
		setState((prev) => ({ ...prev, loading: true, error: null }));

		try {
			const products =
				state.filter === "pending"
					? await getPendingProductsUseCase.execute(listId)
					: await getListProductsUseCase.execute(listId);

			const filteredProducts =
				state.filter === "purchased"
					? products.filter((p) => p.isPurchased)
					: products;

			setState((prev) => ({
				...prev,
				products: filteredProducts,
				loading: false,
			}));
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Erro ao carregar produtos";
			setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
		}
	}, [listId, state.filter, getListProductsUseCase, getPendingProductsUseCase]);

	const addProduct = useCallback(
		async (productId: string, quantity: number) => {
			setState((prev) => ({ ...prev, adding: true, error: null }));

			try {
				await addProductUseCase.execute(listId, productId, quantity);

				await loadProducts();

				setState((prev) => ({ ...prev, adding: false }));

				return true;
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Erro ao adicionar produto";
				setState((prev) => ({ ...prev, error: errorMessage, adding: false }));
				return false;
			}
		},
		[listId, loadProducts, addProductUseCase],
	);

	const removeProduct = useCallback(
		async (productId: string) => {
			setState((prev) => ({ ...prev, removing: productId, error: null }));

			try {
				await removeProductUseCase.execute(listId, productId);

				await loadProducts();

				setState((prev) => ({ ...prev, removing: null }));

				return true;
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Erro ao remover produto";
				setState((prev) => ({ ...prev, error: errorMessage, removing: null }));
				return false;
			}
		},
		[listId, loadProducts, removeProductUseCase],
	);

	const updateQuantity = useCallback(
		async (productId: string, quantity: number) => {
			setState((prev) => ({ ...prev, updating: productId, error: null }));

			try {
				await updateQuantityUseCase.execute(listId, productId, quantity);

				await loadProducts();

				setState((prev) => ({ ...prev, updating: null }));

				return true;
			} catch (error) {
				const errorMessage =
					error instanceof Error
						? error.message
						: "Erro ao atualizar quantidade";
				setState((prev) => ({ ...prev, error: errorMessage, updating: null }));
				return false;
			}
		},
		[listId, loadProducts, updateQuantityUseCase],
	);

	const markAsPurchased = useCallback(
		async (productId: string) => {
			setState((prev) => ({ ...prev, marking: productId, error: null }));

			try {
				await markAsPurchasedUseCase.execute(listId, productId);

				await loadProducts();

				setState((prev) => ({ ...prev, marking: null }));

				return true;
			} catch (error) {
				const errorMessage =
					error instanceof Error
						? error.message
						: "Erro ao marcar produto como comprado";
				setState((prev) => ({ ...prev, error: errorMessage, marking: null }));
				return false;
			}
		},
		[listId, loadProducts, markAsPurchasedUseCase],
	);

	const setFilter = useCallback((filter: ProductsFilter) => {
		setState((prev) => ({ ...prev, filter }));
	}, []);

	const clearError = useCallback(() => {
		setState((prev) => ({ ...prev, error: null }));
	}, []);

	useEffect(() => {
		loadProducts();
	}, [loadProducts]);

	const totalProducts = state.products.length;
	const purchasedProducts = state.products.filter((p) => p.isPurchased).length;
	const pendingProducts = totalProducts - purchasedProducts;
	const progressPercentage =
		// biome-ignore lint/style/noMagicNumbers: Cálculo de porcentagem
		totalProducts > 0 ? (purchasedProducts / totalProducts) * 100 : 0;

	return {
		products: state.products,
		loading: state.loading,
		error: state.error,
		adding: state.adding,
		removing: state.removing,
		updating: state.updating,
		marking: state.marking,
		filter: state.filter,
		totalProducts,
		purchasedProducts,
		pendingProducts,
		progressPercentage,
		loadProducts,
		addProduct,
		removeProduct,
		updateQuantity,
		markAsPurchased,
		setFilter,
		clearError,
	};
};
