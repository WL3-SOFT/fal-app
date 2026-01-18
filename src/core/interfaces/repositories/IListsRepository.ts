import type { List } from "../../entities";

export type ListDto = {
	id: string;
	name: string;
	description: string | null;
	usedTimes: number;
	isPublic: boolean;
	canBeShared: boolean;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date | null;
	deletedAt: Date | null;
	createdBy: string;
	updatedBy: string | null;
	deletedBy: string | null;
};

export type ListWithProductCountDto = ListDto & {
	productCount: number;
};

export type ListWithProductCount = List & {
	productCount: number;
};

export type ListProductWithDetails = {
	id: string;
	quantity: number;
	isPurchased: boolean;
	addedAt: Date;
	product: {
		id: string;
		name: string;
		unit: string;
	};
};

export type CreateListDto = {
	name: string;
	description: string;
	createdBy: string;
	isPublic?: boolean;
	canBeShared?: boolean;
};

export type UpdateListDto = Partial<
	Pick<List, "name" | "description" | "isActive">
>;

export interface ListsRepositoryInterface {
	/**
	 * Cria uma nova lista
	 *
	 * @param data - Dados da lista a ser criada
	 * @returns Promise com a lista criada (incluindo ID gerado)
	 */
	create(data: CreateListDto): Promise<List>;

	/**
	 * Busca listas ativas de um usuário
	 *
	 * Retorna apenas listas não deletadas, ordenadas por data de criação.
	 * Inclui contagem de produtos em cada lista.
	 *
	 * @param userId - ID do usuário proprietário
	 * @returns Promise com array de listas (pode ser vazio)
	 */
	findByUser(userId: string): Promise<ListWithProductCount[]>;

	/**
	 * Busca lista por ID
	 *
	 * @param listId - ID da lista
	 * @returns Promise com a lista ou null se não encontrada/deletada
	 */
	findById(listId: string): Promise<List | null>;

	/**
	 * Busca lista ativa por nome e usuário
	 *
	 * Usado para verificar se já existe uma lista com o mesmo nome para o usuário.
	 * Retorna apenas listas ativas (não deletadas).
	 *
	 * @param name - Nome da lista (case-sensitive)
	 * @param userId - ID do usuário proprietário
	 * @returns Promise com a lista ou null se não encontrada
	 */
	findByNameAndUserId(name: string, userId: string): Promise<List | null>;

	/**
	 * Atualiza uma lista
	 *
	 * @param listId - ID da lista a atualizar
	 * @param data - Dados parciais para atualização
	 * @returns Promise que resolve quando concluído
	 */
	update(listId: string, data: UpdateListDto): Promise<void>;

	/**
	 * Deleta uma lista (soft delete)
	 *
	 * Marca deletedAt com timestamp atual.
	 *
	 * @param listId - ID da lista a deletar
	 * @returns Promise que resolve quando concluído
	 */
	delete(listId: string): Promise<void>;

	/**
	 * Incrementa contador de reutilizações
	 *
	 * @param listId - ID da lista
	 * @returns Promise que resolve quando concluído
	 */
	incrementUsage(listId: string): Promise<void>;

	/**
	 * Adiciona produto à lista
	 *
	 * @param listId - ID da lista
	 * @param productId - ID do produto
	 * @param quantity - Quantidade do produto
	 * @returns Promise que resolve quando concluído
	 */
	addProduct(
		listId: string,
		productId: string,
		quantity: number,
	): Promise<void>;

	/**
	 * Remove produto da lista (soft delete)
	 *
	 * @param listId - ID da lista
	 * @param productId - ID do produto
	 * @returns Promise que resolve quando concluído
	 */
	removeProduct(listId: string, productId: string): Promise<void>;

	/**
	 * Atualiza quantidade de produto na lista
	 *
	 * @param listId - ID da lista
	 * @param productId - ID do produto
	 * @param quantity - Nova quantidade
	 * @returns Promise que resolve quando concluído
	 */
	updateProductQuantity(
		listId: string,
		productId: string,
		quantity: number,
	): Promise<void>;

	/**
	 * Marca produto como comprado
	 *
	 * @param listId - ID da lista
	 * @param productId - ID do produto
	 * @returns Promise que resolve quando concluído
	 */
	markProductAsPurchased(listId: string, productId: string): Promise<void>;

	/**
	 * Busca produtos de uma lista
	 *
	 * Retorna apenas produtos não removidos com informações completas.
	 *
	 * @param listId - ID da lista
	 * @returns Promise com array de produtos (pode ser vazio)
	 */
	getListProducts(listId: string): Promise<ListProductWithDetails[]>;

	/**
	 * Busca produtos não comprados de uma lista
	 *
	 * Útil para exibir itens pendentes na lista de compras.
	 *
	 * @param listId - ID da lista
	 * @returns Promise com array de produtos pendentes (pode ser vazio)
	 */
	getPendingProducts(listId: string): Promise<ListProductWithDetails[]>;
}
