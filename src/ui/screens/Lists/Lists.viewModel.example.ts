/**
 * Lists ViewModel - Exemplo de Implementação
 *
 * Este arquivo demonstra como usar o ListsRepository na camada de apresentação
 * seguindo o padrão MVVM.
 *
 * IMPORTANTE: Este é um EXEMPLO educacional.
 * O arquivo real deve ser criado em: src/ui/screens/Lists/Lists.viewModel.ts
 *
 * Arquitetura:
 * View (TSX) → ViewModel (Hook) → Repository → Database
 */

import { useCallback, useEffect, useState } from "react";
import { listsRepository } from "@/db/repositories/lists.repository";

// ============================================================================
// TYPES
// ============================================================================

/**
 * Lista com contagem de produtos (tipo do domínio)
 */
type ListWithProducts = {
	id: string;
	name: string;
	description: string;
	usedTimes: number;
	productCount: number;
	createdAt: string;
};

/**
 * Estados possíveis do ViewModel
 */
type ViewState = "idle" | "loading" | "refreshing" | "error";

/**
 * Retorno do hook useListsViewModel
 */
interface ListsViewModelReturn {
	// Estado
	lists: ListWithProducts[];
	state: ViewState;
	error: string | null;

	// Ações
	refresh: () => Promise<void>;
	deleteList: (listId: string) => Promise<void>;
	createList: (name: string, description: string) => Promise<void>;
}

// ============================================================================
// VIEW MODEL
// ============================================================================

/**
 * ViewModel para a tela de Listas
 *
 * Gerencia o estado e lógica de negócio da tela.
 * A View apenas renderiza e delega ações para o ViewModel.
 *
 * @param userId - ID do usuário logado
 * @returns Estado e ações da tela
 *
 * @example
 * ```tsx
 * // Lists.view.tsx
 * export const ListsView = () => {
 *   const { userId } = useAuth();
 *   const { lists, state, refresh, deleteList } = useListsViewModel(userId);
 *
 *   if (state === 'loading') return <Loading />;
 *
 *   return (
 *     <FlatList
 *       data={lists}
 *       onRefresh={refresh}
 *       refreshing={state === 'refreshing'}
 *       renderItem={({ item }) => (
 *         <ListCard
 *           list={item}
 *           onDelete={() => deleteList(item.id)}
 *         />
 *       )}
 *     />
 *   );
 * };
 * ```
 */
export function useListsViewModel(userId: string): ListsViewModelReturn {
	// ========================================================================
	// STATE
	// ========================================================================

	const [lists, setLists] = useState<ListWithProducts[]>([]);
	const [state, setState] = useState<ViewState>("idle");
	const [error, setError] = useState<string | null>(null);

	// ========================================================================
	// ACTIONS
	// ========================================================================

	/**
	 * Carrega listas do usuário
	 *
	 * Chamado automaticamente no mount e pode ser chamado manualmente
	 * para refresh.
	 */
	const loadLists = useCallback(async () => {
		try {
			setState("loading");
			setError(null);

			const result = await listsRepository.findByUser(userId);

			setLists(result);
			setState("idle");
		} catch (err) {
			console.error("Erro ao carregar listas:", err);
			setError("Não foi possível carregar suas listas. Tente novamente.");
			setState("error");
		}
	}, [userId]);

	/**
	 * Atualiza a lista (pull-to-refresh)
	 */
	const refresh = useCallback(async () => {
		try {
			setState("refreshing");
			setError(null);

			const result = await listsRepository.findByUser(userId);

			setLists(result);
			setState("idle");
		} catch (err) {
			console.error("Erro ao atualizar listas:", err);
			setError("Não foi possível atualizar suas listas.");
			setState("error");
		}
	}, [userId]);

	/**
	 * Deleta uma lista (soft delete)
	 *
	 * Remove a lista da UI otimisticamente e reverte em caso de erro.
	 */
	const deleteList = useCallback(
		async (listId: string) => {
			// Optimistic Update: remove imediatamente da UI
			const previousLists = lists;
			setLists((prev) => prev.filter((list) => list.id !== listId));

			try {
				await listsRepository.delete(listId);
			} catch (err) {
				console.error("Erro ao deletar lista:", err);

				// Reverte em caso de erro
				setLists(previousLists);
				setError("Não foi possível deletar a lista. Tente novamente.");
			}
		},
		[lists],
	);

	/**
	 * Cria uma nova lista
	 *
	 * Adiciona otimisticamente na UI e atualiza após sucesso.
	 */
	const createList = useCallback(
		async (name: string, description: string) => {
			try {
				setState("loading");
				setError(null);

				const newList = await listsRepository.create({
					name,
					description,
					createdBy: userId,
				});

				// Adiciona a nova lista no início
				setLists((prev) => [{ ...newList, productCount: 0 }, ...prev]);
				setState("idle");
			} catch (err) {
				console.error("Erro ao criar lista:", err);
				setError("Não foi possível criar a lista. Tente novamente.");
				setState("error");
			}
		},
		[userId],
	);

	// ========================================================================
	// EFFECTS
	// ========================================================================

	/**
	 * Carrega listas ao montar o componente
	 */
	useEffect(() => {
		loadLists();
	}, [loadLists]);

	// ========================================================================
	// RETURN
	// ========================================================================

	return {
		// Estado
		lists,
		state,
		error,

		// Ações
		refresh,
		deleteList,
		createList,
	};
}

/**
 * NOTAS DE IMPLEMENTAÇÃO:
 *
 * 1. **Optimistic Updates**
 *    - deleteList remove imediatamente da UI
 *    - Reverte se houver erro no repository
 *
 * 2. **Estados de Loading**
 *    - 'loading': Carregamento inicial
 *    - 'refreshing': Pull-to-refresh
 *    - 'idle': Estado normal
 *    - 'error': Erro ocorreu
 *
 * 3. **Error Handling**
 *    - Todos os erros são capturados
 *    - Mensagens amigáveis para o usuário
 *    - Logs detalhados no console (dev)
 *
 * 4. **Separação de Responsabilidades**
 *    - ViewModel: Lógica e estado
 *    - Repository: Acesso aos dados
 *    - View: Apenas UI
 *
 * 5. **Type Safety**
 *    - Tipos inferidos do Drizzle
 *    - TypeScript strict mode
 *    - Nenhum 'any' permitido
 */
