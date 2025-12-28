/**
 * Lists ViewModel - Implementação com Zustand
 *
 * Conecta a View com o Zustand Store, mantendo compatibilidade com a interface existente.
 */

import { useRouter } from "expo-router";
import type { ListCardProps } from "@/ui/components/Cards/ListCard/ListCard.types";

// TODO: Descomentar quando integrar com autenticação
// import { useEffect } from "react";
// import {
// 	useActiveLists,
// 	useListsActions,
// 	useListsLoading,
// 	useListsStore,
// } from "@/stores/lists.store";

/**
 * Hook do ViewModel para a tela de Listas
 *
 * TODO: Substituir dados mockados por dados reais quando userId estiver disponível
 * TODO: Integrar com autenticação para pegar userId do usuário logado
 */
export const useListsPage = () => {
	const router = useRouter();

	// ========================================================================
	// ZUSTAND STORE (comentado até ter autenticação)
	// ========================================================================

	// const lists = useActiveLists();
	// const loadingState = useListsLoading();
	// const actions = useListsActions();

	// useEffect(() => {
	// 	// TODO: Pegar userId da autenticação
	// 	// const { userId } = useAuth();
	// 	// actions.loadLists(userId);
	// }, []);

	// ========================================================================
	// DADOS MOCKADOS (TEMPORÁRIO)
	// ========================================================================

	// TODO: Remover quando integrar com Zustand store
	const data: ListCardProps[] = [
		{
			id: "1",
			itemsQuantity: 107,
			lastUsed: new Date(),
			lowestPrice: 684.21,
			title: "Lista de compras mensal",
		},
		{
			id: "2",
			itemsQuantity: 107,
			lastUsed: new Date(),
			lowestPrice: 684.21,
			title: "Lista de compras mensal",
		},
		{
			id: "3",
			itemsQuantity: 107,
			lastUsed: new Date(),
			lowestPrice: 684.21,
			title: "Lista de compras mensal",
		},
		{
			id: "4",
			itemsQuantity: 107,
			lastUsed: new Date(),
			lowestPrice: 684.21,
			title: "Lista de compras mensal",
		},
		{
			id: "5",
			itemsQuantity: 107,
			lastUsed: new Date(),
			lowestPrice: 684.21,
			title: "Lista de compras mensal",
		},
		{
			id: "6",
			itemsQuantity: 107,
			lastUsed: new Date(),
			lowestPrice: 684.21,
			title: "Lista de compras mensal",
		},
		{
			id: "7",
			itemsQuantity: 107,
			lastUsed: new Date(),
			lowestPrice: 684.21,
			title: "Lista de compras mensal",
		},
		{
			id: "8",
			itemsQuantity: 107,
			lastUsed: new Date(),
			lowestPrice: 684.21,
			title: "Lista de compras mensal",
		},
	];

	// ========================================================================
	// TRANSFORMAÇÃO DE DADOS
	// ========================================================================

	// Quando integrar com Zustand, transformar ListItem[] em ListCardProps[]
	// const data: ListCardProps[] = lists.map(list => ({
	//   id: list.id,
	//   title: list.name,
	//   itemsQuantity: list.productCount,
	//   lastUsed: new Date(list.updatedAt || list.createdAt),
	//   lowestPrice: 0, // TODO: Calcular menor preço dos produtos
	// }));

	// ========================================================================
	// ACTIONS
	// ========================================================================

	const onCreateList = () => {
		router.push("/lists/create");
	};

	const onPressListCard = (id: string) => {
		router.push(`/lists/${id}`);
	};

	// ========================================================================
	// COMPUTED VALUES
	// ========================================================================

	const hasContent = data?.length > 0;

	const quantityIndicatorText = hasContent
		? `${data?.length} lista${data?.length > 1 ? "s" : ""}`
		: "Sem listas no momento";

	// ========================================================================
	// RETURN
	// ========================================================================

	return {
		data,
		hasContent,
		indicatorText: quantityIndicatorText,
		onCreateList,
		onPressListCard,
	};
};

/**
 * PRÓXIMOS PASSOS PARA INTEGRAÇÃO COMPLETA:
 *
 * 1. Implementar autenticação e obter userId
 * 2. Descomentar código do Zustand store
 * 3. Remover dados mockados
 * 4. Implementar transformação ListItem → ListCardProps
 * 5. Implementar cálculo de menor preço (lowestPrice)
 * 6. Adicionar loading states na View
 * 7. Adicionar error handling
 */
