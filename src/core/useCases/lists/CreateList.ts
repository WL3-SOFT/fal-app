import {
	MAXIMUM_LIST_NAME_LENGTH,
	MINIMUM_LIST_NAME_LENGTH,
} from "#core/constraints";
import type {
	CreateListDto,
	ListDto,
	ListsRepositoryInterface,
} from "#core/interfaces/repositories/IListsRepository";
import { listEntityToDto } from "#core/mappers/list.mapper";

export class CreateListValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "CreateListValidationError";
	}
}

export class CreateListUseCase {
	constructor(private readonly listsRepository: ListsRepositoryInterface) {}

	async execute(data: CreateListDto): Promise<ListDto> {
		if (!data.name || data.name.trim().length === 0) {
			throw new CreateListValidationError("Nome da lista é obrigatório");
		}

		if (data.name.trim().length < MINIMUM_LIST_NAME_LENGTH) {
			throw new CreateListValidationError(
				`Nome da lista deve ter ao menos ${MINIMUM_LIST_NAME_LENGTH} caracteres`,
			);
		}

		if (data.name.length > MAXIMUM_LIST_NAME_LENGTH) {
			throw new CreateListValidationError(
				`Nome da lista deve ter no máximo ${MAXIMUM_LIST_NAME_LENGTH} caracteres`,
			);
		}

		// if (!data.description || data.description.trim().length === 0) {
		// 	throw new CreateListValidationError("Descrição da lista é obrigatória");
		// }

		// if (data.description.trim().length < MINIMUM_LIST_DESCRIPTION_LENGTH) {
		// 	throw new CreateListValidationError(
		// 		`Descrição da lista deve ter ao menos ${MINIMUM_LIST_DESCRIPTION_LENGTH} caracteres`,
		// 	);
		// }

		// if (data.description.length > MAXIMUM_LIST_DESCRIPTION_LENGTH) {
		// 	throw new CreateListValidationError(
		// 		`Descrição da lista deve ter no máximo ${MAXIMUM_LIST_DESCRIPTION_LENGTH} caracteres`,
		// 	);
		// }

		if (!data.createdBy || data.createdBy.trim().length === 0) {
			throw new CreateListValidationError("Usuário criador é obrigatório");
		}

		const existingList = await this.listsRepository.findByNameAndUserId(
			data.name.trim(),
			data.createdBy,
		);

		if (existingList) {
			throw new CreateListValidationError(
				"Você já possui uma lista com este nome",
			);
		}

		const listEntity = await this.listsRepository.create({
			name: data.name.trim(),
			description: data.description.trim(),
			createdBy: data.createdBy,
			isPublic: data.isPublic ?? false,
			canBeShared: data.canBeShared ?? false,
		});

		return listEntityToDto(listEntity);
	}
}
