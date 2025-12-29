import type {
	ListProductWithDetails,
	ListsRepositoryInterface,
} from "#core/interfaces/repositories/IListsRepository";

export class GetListProductsValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "GetListProductsValidationError";
	}
}

export class GetListProductsUseCase {
	constructor(private readonly listsRepository: ListsRepositoryInterface) {}

	async execute(listId: string): Promise<ListProductWithDetails[]> {
		if (!listId || listId.trim().length === 0) {
			throw new GetListProductsValidationError("ID da lista é obrigatório");
		}

		const products = await this.listsRepository.getListProducts(listId);

		return products;
	}
}
