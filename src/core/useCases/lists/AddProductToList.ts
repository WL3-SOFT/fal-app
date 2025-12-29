import type { ListsRepositoryInterface } from "#core/interfaces/repositories/IListsRepository";

export class AddProductToListValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AddProductToListValidationError";
	}
}

export class AddProductToListUseCase {
	constructor(private readonly listsRepository: ListsRepositoryInterface) {}

	async execute(
		listId: string,
		productId: string,
		quantity: number,
	): Promise<void> {
		if (!listId || listId.trim().length === 0) {
			throw new AddProductToListValidationError("ID da lista é obrigatório");
		}

		if (!productId || productId.trim().length === 0) {
			throw new AddProductToListValidationError("ID do produto é obrigatório");
		}

		if (quantity <= 0) {
			throw new AddProductToListValidationError(
				"Quantidade deve ser maior que zero",
			);
		}

		if (!Number.isInteger(quantity)) {
			throw new AddProductToListValidationError(
				"Quantidade deve ser um número inteiro",
			);
		}

		await this.listsRepository.addProduct(listId, productId, quantity);
	}
}
