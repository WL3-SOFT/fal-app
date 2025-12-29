import type { ListsRepositoryInterface } from "#core/interfaces/repositories/IListsRepository";

export class MarkProductAsPurchasedValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "MarkProductAsPurchasedValidationError";
	}
}

export class MarkProductAsPurchasedUseCase {
	constructor(private readonly listsRepository: ListsRepositoryInterface) {}

	async execute(listId: string, productId: string): Promise<void> {
		if (!listId || listId.trim().length === 0) {
			throw new MarkProductAsPurchasedValidationError(
				"ID da lista é obrigatório",
			);
		}

		if (!productId || productId.trim().length === 0) {
			throw new MarkProductAsPurchasedValidationError(
				"ID do produto é obrigatório",
			);
		}

		await this.listsRepository.markProductAsPurchased(listId, productId);
	}
}
