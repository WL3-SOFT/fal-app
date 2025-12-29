import type { ListsRepositoryInterface } from "#core/interfaces/repositories/IListsRepository";

export class DeleteListValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "DeleteListValidationError";
	}
}

export class DeleteListUseCase {
	constructor(private readonly listsRepository: ListsRepositoryInterface) {}

	async execute(listId: string): Promise<void> {
		if (!listId || listId.trim().length === 0) {
			throw new DeleteListValidationError("ID da lista é obrigatório");
		}

		await this.listsRepository.delete(listId);
	}
}
