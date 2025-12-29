import type { ListsRepositoryInterface } from "#core/interfaces/repositories/IListsRepository";

export class RemoveProductFromListValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "RemoveProductFromListValidationError";
	}
}

export class RemoveProductFromListUseCase {
	constructor(private readonly listsRepository: ListsRepositoryInterface) {}

	async execute(listId: string, productId: string): Promise<void> {
		if (!listId || listId.trim().length === 0) {
			throw new RemoveProductFromListValidationError(
				"ID da lista é obrigatório",
			);
		}

		if (!productId || productId.trim().length === 0) {
			throw new RemoveProductFromListValidationError(
				"ID do produto é obrigatório",
			);
		}

		await this.listsRepository.removeProduct(listId, productId);
	}
}
