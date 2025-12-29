import type { ListsRepositoryInterface } from "#core/interfaces/repositories/IListsRepository";

export class IncrementListUsageValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "IncrementListUsageValidationError";
	}
}

export class IncrementListUsageUseCase {
	constructor(private readonly listsRepository: ListsRepositoryInterface) {}

	async execute(listId: string): Promise<void> {
		if (!listId || listId.trim().length === 0) {
			throw new IncrementListUsageValidationError("ID da lista é obrigatório");
		}

		await this.listsRepository.incrementUsage(listId);
	}
}
