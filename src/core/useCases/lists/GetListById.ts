import type {
	ListDto,
	ListsRepositoryInterface,
} from "#core/interfaces/repositories/IListsRepository";
import { listEntityToDto } from "#core/mappers/list.mapper";

export class GetListByIdValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "GetListByIdValidationError";
	}
}

export class ListNotFoundError extends Error {
	constructor(listId: string) {
		super(`Lista com ID ${listId} não encontrada`);
		this.name = "ListNotFoundError";
	}
}

export class GetListByIdUseCase {
	constructor(private readonly listsRepository: ListsRepositoryInterface) {}

	async execute(listId: string): Promise<ListDto> {
		if (!listId || listId.trim().length === 0) {
			throw new GetListByIdValidationError("ID da lista é obrigatório");
		}

		const listEntity = await this.listsRepository.findById(listId);

		if (!listEntity) {
			throw new ListNotFoundError(listId);
		}

		return listEntityToDto(listEntity);
	}
}
