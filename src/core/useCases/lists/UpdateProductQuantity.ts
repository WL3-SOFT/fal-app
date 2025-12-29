import type { ListsRepositoryInterface } from "#core/interfaces/repositories/IListsRepository";

export class UpdateProductQuantityValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UpdateProductQuantityValidationError";
	}
}

export class UpdateProductQuantityUseCase {
	constructor(private readonly listsRepository: ListsRepositoryInterface) {}

	async execute(
		listId: string,
		productId: string,
		quantity: number,
	): Promise<void> {
		if (!listId || listId.trim().length === 0) {
			throw new UpdateProductQuantityValidationError(
				"ID da lista é obrigatório",
			);
		}

		if (!productId || productId.trim().length === 0) {
			throw new UpdateProductQuantityValidationError(
				"ID do produto é obrigatório",
			);
		}

		if (quantity <= 0) {
			throw new UpdateProductQuantityValidationError(
				"Quantidade deve ser maior que zero",
			);
		}

		if (!Number.isInteger(quantity)) {
			throw new UpdateProductQuantityValidationError(
				"Quantidade deve ser um número inteiro",
			);
		}

		await this.listsRepository.updateProductQuantity(
			listId,
			productId,
			quantity,
		);
	}
}
