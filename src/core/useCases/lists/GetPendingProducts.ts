import type {
	ListProductWithDetails,
	ListsRepositoryInterface,
} from "#core/interfaces/repositories/IListsRepository";

export class GetPendingProductsValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "GetPendingProductsValidationError";
	}
}

export class GetPendingProductsUseCase {
	constructor(private readonly listsRepository: ListsRepositoryInterface) {}

	async execute(listId: string): Promise<ListProductWithDetails[]> {
		if (!listId || listId.trim().length === 0) {
			throw new GetPendingProductsValidationError("ID da lista é obrigatório");
		}

		const products = await this.listsRepository.getPendingProducts(listId);

		return products;
	}
}
