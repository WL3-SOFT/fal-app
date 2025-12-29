import type {
	ListsRepositoryInterface,
	ListWithProductCountDto,
} from "#core/interfaces/repositories/IListsRepository";
import { listWithProductCountToDto } from "#core/mappers/list.mapper";

export class GetUserListsValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "GetUserListsValidationError";
	}
}

export class GetUserListsUseCase {
	constructor(private readonly listsRepository: ListsRepositoryInterface) {}

	async execute(userId: string): Promise<ListWithProductCountDto[]> {
		if (!userId || userId.trim().length === 0) {
			throw new GetUserListsValidationError("ID do usuário é obrigatório");
		}

		try {
			const listEntities = await this.listsRepository.findByUser(userId);

			return listEntities.map(listWithProductCountToDto);
		} catch (error) {
			console.log(error);
			throw new Error("Erro ao buscar listas");
		}
	}
}
